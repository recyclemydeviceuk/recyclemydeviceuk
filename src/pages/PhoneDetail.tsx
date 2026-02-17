import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ChevronDown, Star, Clock, CreditCard, Lock, Package, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { deviceAPI, pricingAPI, customerAPI } from '../services/api';

interface Device {
  _id: string;
  name: string;
  brand: {
    name: string;
  };
  image: string;
  category: string;
  storageOptions: string[];
  conditionOptions: string[];
}

interface Offer {
  recycler: {
    id: string;
    name: string;
    email: string;
    phone: string;
    logo: string;
    usps: string[];
    rating?: number;
    reviewCount?: number;
  };
  price: number;
  storage: string;
  condition: string;
}

export default function PhoneDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { cartItem, addToCart } = useCart();
  
  const [device, setDevice] = useState<Device | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('Good');
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [expandedNames, setExpandedNames] = useState<Set<string>>(new Set());
  
  // Infinite scroll states
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const toggleNameExpansion = (recyclerId: string) => {
    setExpandedNames(prev => {
      const newSet = new Set(prev);
      if (newSet.has(recyclerId)) {
        newSet.delete(recyclerId);
      } else {
        newSet.add(recyclerId);
      }
      return newSet;
    });
  };

  // Load more offers function
  const loadMoreOffers = useCallback(() => {
    if (isLoadingMore || displayedCount >= offers.length) return;
    
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 6, offers.length));
      setIsLoadingMore(false);
    }, 500); // Small delay for smooth UX
  }, [isLoadingMore, displayedCount, offers.length]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreOffers();
        }
      },
      { threshold: 0.1 }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreOffers]);

  // Observe load more trigger
  useEffect(() => {
    const currentObserver = observerRef.current;
    const currentRef = loadMoreRef.current;

    if (currentObserver && currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentObserver && currentRef) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [offers.length, displayedCount]);

  // Select first offer when offers change
  useEffect(() => {
    if (offers.length > 0) {
      setSelectedOffer(offers[0]);
    }
  }, [offers]);

  // Fetch device and pricing data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);

        // Fetch device details
        const deviceResponse: any = await deviceAPI.getDeviceById(id);
        if (deviceResponse?.success) {
          setDevice(deviceResponse.data);
          // Set default storage to first option
          if (deviceResponse.data.storageOptions.length > 0) {
            setSelectedStorage(deviceResponse.data.storageOptions[0]);
          }
        }
      } catch (err: any) {
        console.error('Error fetching device:', err);
        setError(err.response?.data?.message || 'Failed to load device');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Fetch pricing when storage or condition changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!id || !selectedStorage || !selectedCondition) return;

      try {
        // Reset displayed count when filters change
        setDisplayedCount(6);
        
        const pricingResponse: any = await pricingAPI.getDevicePrices(
          id,
          selectedStorage,
          selectedCondition
        );
        
        if (pricingResponse?.success) {
          const fetchedOffers = pricingResponse.data.offers || [];
          
          // Filter out partners with no valid price set (0, null, undefined)
          const validOffers = fetchedOffers.filter((offer: Offer) => 
            offer.price && offer.price > 0
          );
          
          // Fetch reviews for each recycler
          const ratingsPromises = validOffers.map(async (offer: Offer) => {
            try {
              console.log(`Fetching reviews for recycler: ${offer.recycler.name} (ID: ${offer.recycler.id})`);
              const reviewResponse: any = await customerAPI.reviews.getByRecycler(offer.recycler.id);
              console.log(`Review response for ${offer.recycler.name}:`, reviewResponse);
              
              if (reviewResponse?.success && reviewResponse.data) {
                const reviews = reviewResponse.data.reviews || [];
                console.log(`Found ${reviews.length} total reviews, checking for approved...`);
                const approvedReviews = reviews.filter((r: any) => r.status === 'approved');
                console.log(`Found ${approvedReviews.length} approved reviews`);
                
                if (approvedReviews.length > 0) {
                  const totalRating = approvedReviews.reduce((sum: number, r: any) => sum + r.rating, 0);
                  const avgRating = totalRating / approvedReviews.length;
                  return {
                    recyclerId: offer.recycler.id,
                    rating: Math.round(avgRating * 10) / 10,
                    count: approvedReviews.length
                  };
                }
              }
              return null;
            } catch (err) {
              console.error(`Error fetching reviews for ${offer.recycler.name}:`, err);
              return null;
            }
          });

          const ratingsResults = await Promise.all(ratingsPromises);
          const ratingsMap: Record<string, { rating: number; count: number }> = {};
          
          ratingsResults.forEach((result) => {
            if (result) {
              ratingsMap[result.recyclerId] = { rating: result.rating, count: result.count };
            }
          });

          console.log('Ratings Map:', ratingsMap);
          
          // Add rating data to offers
          const offersWithRatings = validOffers.map((offer: Offer) => ({
            ...offer,
            recycler: {
              ...offer.recycler,
              rating: ratingsMap[offer.recycler.id]?.rating,
              reviewCount: ratingsMap[offer.recycler.id]?.count
            }
          }));
          
          console.log('Offers with ratings:', offersWithRatings);
          
          setOffers(offersWithRatings);
        }
      } catch (err: any) {
        console.error('Error fetching pricing:', err);
        setOffers([]);
      }
    };

    fetchPricing();
  }, [id, selectedStorage, selectedCondition]);

  const conditionDescriptions: Record<string, string> = {
    Excellent: 'Perfect, no signs of use',
    Good: 'Minor scratches, fully working',
    Fair: 'Visible wear but functional',
    Poor: 'Heavy wear or minor damage',
  };

  const handleSellNow = (offer: Offer) => {
    // Check if cart already has an item
    if (cartItem) {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 5000);
      return;
    }

    if (!device) return;

    // Add to cart
    addToCart({
      deviceId: device._id,
      deviceName: device.name,
      deviceImage: device.image,
      recyclerId: offer.recycler.id,
      recyclerName: offer.recycler.name,
      recyclerLogo: offer.recycler.logo || '',
      recyclerCity: '',
      price: offer.price,
      storage: selectedStorage,
      condition: selectedCondition,
    });

    // Navigate to checkout
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-12 sm:py-20">
          <Loader2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary animate-spin" />
          <span className="ml-2 sm:ml-3 text-gray-600 text-sm sm:text-lg">Loading device details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">Device Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{error || 'The device you are looking for does not exist.'}</p>
          <Link to="/sell-your-phone" className="text-sm sm:text-base text-primary hover:underline font-semibold">
            ← Back to all devices
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Alert for cart limit */}
      {showAlert && (
        <div className="fixed top-20 left-4 right-4 sm:left-auto sm:right-4 z-50 animate-slide-in">
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg shadow-lg p-3 sm:p-4 max-w-md">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1">Cart Limit Reached</h3>
                <p className="text-xs sm:text-sm text-gray-700">
                  You already have a device in your cart. Please complete your current order or remove the existing item before adding a new one.
                </p>
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-2 text-xs sm:text-sm font-semibold text-primary hover:text-primary-dark underline">
                  Go to Checkout →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 overflow-x-auto">
          <Link to="/" className="hover:text-primary whitespace-nowrap">Home</Link>
          <span>/</span>
          <Link to="/sell-your-phone" className="hover:text-primary whitespace-nowrap">Sell</Link>
          <span>/</span>
          <span className="text-gray-900 truncate">{device.name}</span>
        </div>

        {/* Back Button */}
        <Link 
          to="/sell-your-phone"
          className="inline-flex items-center space-x-2 text-sm sm:text-base text-primary hover:underline mb-4 sm:mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Back to all phones</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left - Phone Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8 lg:sticky lg:top-24">
              {/* Phone Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl mx-auto mb-4 sm:mb-6 flex items-center justify-center p-3 sm:p-4">
                <img 
                  src={device.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'}
                  alt={device.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                  }}
                />
              </div>

              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 text-center mb-6 sm:mb-8">
                {device.name}
              </h1>

              {/* Storage Selection */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Storage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {device.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`py-2 px-2 sm:px-3 rounded-lg border-2 font-semibold text-xs sm:text-sm transition-all ${
                        selectedStorage === storage
                          ? 'bg-primary text-white border-primary'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-primary'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Condition Selection */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                  Condition
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsConditionOpen(!isConditionOpen)}
                    className="w-full flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <span className="font-medium text-sm sm:text-base text-gray-900">{selectedCondition}</span>
                    <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform ${isConditionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isConditionOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      {device.conditionOptions.map((condition) => (
                        <button
                          key={condition}
                          onClick={() => {
                            setSelectedCondition(condition);
                            setIsConditionOpen(false);
                          }}
                          className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-colors flex items-center justify-between ${
                            selectedCondition === condition 
                              ? 'bg-[#1b981b] text-white hover:bg-[#158515]' 
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          <span className="font-medium text-sm sm:text-base">{condition}</span>
                          {selectedCondition === condition && <Check className="w-4 h-4 sm:w-5 sm:h-5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[10px] sm:text-xs text-gray-500">
                  {conditionDescriptions[selectedCondition] || 'Select a condition'}
                </p>
              </div>

              {/* Why Choose Us - Moved to left sidebar */}
              <div className="mt-6 sm:mt-8 bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">Why Choose Us</h3>
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1b981b] rounded-full flex-shrink-0"></div>
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b981b] flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Secure checkout with SSL encryption</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1b981b] rounded-full flex-shrink-0"></div>
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b981b] flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Free postage with tracked delivery</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#1b981b] rounded-full flex-shrink-0"></div>
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-[#1b981b] flex-shrink-0" />
                    <p className="text-xs sm:text-sm font-medium text-gray-700">Fast payment within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Compare Offers */}
          <div className="lg:col-span-2">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Compare Offers</h2>
              <span className="text-xs sm:text-sm text-gray-600 font-medium">{offers.length} {offers.length === 1 ? 'offer' : 'offers'} available</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
              {offers.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 sm:p-16 text-center lg:col-span-2">
                  <p className="text-base sm:text-lg text-gray-600 font-medium">No offers available for the selected configuration</p>
                  <p className="text-sm sm:text-base text-gray-500 mt-2">Try selecting a different storage or condition</p>
                </div>
              ) : (
                offers.slice(0, displayedCount).map((offer: Offer, index: number) => (
                <div
                  key={offer.recycler.id}
                  onClick={() => setSelectedOffer(offer)}
                  className={`bg-white rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 lg:p-5 hover:shadow-lg transition-all relative cursor-pointer ${
                    selectedOffer?.recycler.id === offer.recycler.id ? 'border-[#1b981b] shadow-md' : 'border-gray-200'
                  }`}
                >
                  {index === 0 && (
                    <div className="absolute -top-2 right-2 sm:right-3">
                      <span className="bg-gradient-to-r from-[#1b981b] to-[#158515] text-white px-2 sm:px-2.5 lg:px-3 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold shadow-md">
                        BEST PRICE
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-start justify-between gap-2.5 sm:gap-3 lg:gap-4">
                    {/* Left - Recycler Info */}
                    <div className="flex items-start space-x-2 sm:space-x-3 flex-1 w-full sm:w-auto">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {offer.recycler.logo ? (
                          <img 
                            src={offer.recycler.logo} 
                            alt={offer.recycler.name} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">${offer.recycler.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()}</div>`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                            {offer.recycler.name.split(' ').map((word: string) => word[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs sm:text-sm lg:text-base font-bold text-gray-900 mb-0.5 sm:mb-1">
                          {/* Mobile: Show full name always */}
                          <span className="sm:hidden">
                            {offer.recycler.name}
                          </span>
                          {/* Desktop: Show truncated with expand option */}
                          <span className="hidden sm:inline">
                            {offer.recycler.name.length > 12 ? (
                              <span className="flex items-center gap-1">
                                <span className={expandedNames.has(offer.recycler.id) ? '' : 'truncate'}>
                                  {expandedNames.has(offer.recycler.id) 
                                    ? offer.recycler.name 
                                    : `${offer.recycler.name.substring(0, 12)}...`}
                                </span>
                                <span 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleNameExpansion(offer.recycler.id);
                                  }}
                                  className="text-[9px] text-primary cursor-pointer hover:underline whitespace-nowrap flex-shrink-0"
                                >
                                  {expandedNames.has(offer.recycler.id) ? 'less' : 'more'}
                                </span>
                              </span>
                            ) : (
                              offer.recycler.name
                            )}
                          </span>
                        </h3>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[9px] sm:text-[10px] text-gray-600">
                          {offer.recycler.rating !== undefined && offer.recycler.reviewCount !== undefined && offer.recycler.reviewCount > 0 && (
                            <div className="flex items-center space-x-0.5">
                              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400 fill-yellow-400" />
                              <span className="font-semibold">{offer.recycler.rating}</span>
                              <span className="text-gray-400">({offer.recycler.reviewCount})</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-0.5">
                            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                            <span>1-2 days</span>
                          </div>
                          <div className="hidden sm:flex items-center space-x-0.5">
                            <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-400" />
                            <span>Bank Transfer</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right - Price & Action */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start w-full sm:w-auto gap-2 sm:gap-3">
                      <div className="text-left sm:text-right">
                        {index === 0 && (
                          <div className="text-[9px] sm:text-[10px] text-gray-500 mb-0 sm:mb-0.5 font-medium">Best Price</div>
                        )}
                        <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#1b981b]">
                          £{Math.round(offer.price)}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellNow(offer)}
                        className="bg-gradient-to-r from-[#1b981b] to-[#158515] text-white px-4 sm:px-5 lg:px-7 py-1.5 sm:py-2 lg:py-2.5 rounded-lg text-[11px] sm:text-xs lg:text-sm font-bold hover:shadow-lg transition-all shadow-md whitespace-nowrap"
                      >
                        Sell Now
                      </button>
                    </div>
                  </div>

                  {/* USPs vertical layout - One per row */}
                  {offer.recycler.usps && offer.recycler.usps.length > 0 && (
                    <div className="flex flex-col gap-1.5 sm:gap-2 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-100">
                      {offer.recycler.usps.map((usp: string, uspIndex: number) => (
                        <div key={uspIndex} className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 border border-green-100">
                          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 bg-gradient-to-br from-[#1b981b] to-[#158515] rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 text-white stroke-[2.5]" />
                          </div>
                          <p className="text-[9px] sm:text-[10px] lg:text-xs font-semibold text-gray-900">{usp}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
              )}
            </div>

            {/* Load More Trigger & Loading Indicator */}
            {offers.length > 0 && displayedCount < offers.length && (
              <div ref={loadMoreRef} className="mt-8 text-center">
                {isLoadingMore && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-6 h-6 text-[#1b981b] animate-spin" />
                    <span className="ml-2 text-sm text-gray-600">Loading more offers...</span>
                  </div>
                )}
              </div>
            )}

            {/* All Loaded Message */}
            {offers.length > 6 && displayedCount >= offers.length && (
              <div className="mt-8 text-center py-4">
                <p className="text-sm text-gray-500 font-medium">You've seen all {offers.length} offers</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
