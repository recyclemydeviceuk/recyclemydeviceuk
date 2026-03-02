import { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { ChevronDown, Star, Check, Loader2 } from 'lucide-react';
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
  networkOptions: string[];
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
  const [selectedNetwork, setSelectedNetwork] = useState('Unlocked');
  const [isConditionOpen, setIsConditionOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);

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
          // Set default network to first option or Unlocked
          if (deviceResponse.data.networkOptions && deviceResponse.data.networkOptions.length > 0) {
            setSelectedNetwork(deviceResponse.data.networkOptions[0]);
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

  // Fetch pricing when storage, condition, or network changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!id || !selectedStorage || !selectedCondition || !selectedNetwork) return;

      try {
        
        const pricingResponse: any = await pricingAPI.getDevicePrices(
          id,
          selectedStorage,
          selectedCondition,
          selectedNetwork
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
  }, [id, selectedStorage, selectedCondition, selectedNetwork]);

  const conditionDescriptions: Record<string, string> = {
    Excellent: 'Perfect, no signs of use',
    Good: 'Minor scratches, fully working',
    Fair: 'Visible wear but functional',
    Poor: 'Heavy wear or minor damage',
  };

  const handleSellNow = (offer: Offer) => {
    if (!device) return;

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
      network: selectedNetwork,
    });

    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-[#1b981b] animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !device) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Device Not Found</h2>
          <Link to="/sell-your-phone" className="text-[#1b981b] hover:underline font-semibold">
            ← Back to all devices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid lg:grid-cols-[360px,1fr] gap-6">
          {/* Left Sidebar - Device Config */}
          <div>
            <div className="bg-white border border-gray-200 p-6">
              {/* Phone Image */}
              <div className="bg-gray-50 rounded p-4 mb-6 flex items-center justify-center">
                <img 
                  src={device.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'}
                  alt={device.name}
                  className="w-32 h-32 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                  }}
                />
              </div>

              <h1 className="text-xl font-bold text-gray-900 mb-6">
                {device.name}
              </h1>

              {/* Capacity Selection */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Capacity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {device.storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`py-2 px-3 border font-medium text-sm transition-all ${
                        selectedStorage === storage
                          ? 'bg-[#1b981b] text-white border-[#1b981b]'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-[#1b981b]'
                      }`}
                    >
                      {storage}
                    </button>
                  ))}
                </div>
              </div>

              {/* Network Selection */}
              <div className="mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Network
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsNetworkOpen(!isNetworkOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 hover:border-[#1b981b] focus:outline-none transition-all"
                  >
                    <span className="font-medium text-gray-900">{selectedNetwork}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isNetworkOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isNetworkOpen && device.networkOptions && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 shadow-lg z-10">
                      {device.networkOptions.map((network) => (
                        <button
                          key={network}
                          onClick={() => {
                            setSelectedNetwork(network);
                            setIsNetworkOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left transition-colors ${
                            selectedNetwork === network 
                              ? 'bg-[#1b981b] text-white' 
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {network}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Condition Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Condition
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsConditionOpen(!isConditionOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-300 hover:border-[#1b981b] focus:outline-none transition-all"
                  >
                    <span className="font-medium text-gray-900">{selectedCondition}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isConditionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isConditionOpen && (
                    <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 shadow-lg z-10">
                      {device.conditionOptions.map((condition) => (
                        <button
                          key={condition}
                          onClick={() => {
                            setSelectedCondition(condition);
                            setIsConditionOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left transition-colors ${
                            selectedCondition === condition 
                              ? 'bg-[#1b981b] text-white' 
                              : 'text-gray-900 hover:bg-gray-50'
                          }`}
                        >
                          {condition}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Why Choose Us */}
              <div className="bg-gray-50 border border-gray-200 p-4 rounded">
                <h3 className="text-base font-bold text-gray-900 mb-3">Why Choose Us</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#1b981b] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">Secure checkout with SSL encryption</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#1b981b] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">Free postage with tracked delivery</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#1b981b] flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-700">Fast payment within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Recycler Offers */}
          <div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold text-gray-900">{offers.length > 0 ? `10 of ${offers.length}` : '0'}</span> devices
              </p>
            </div>

            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="bg-white border border-gray-200 p-12 text-center">
                  <p className="text-lg text-gray-600 font-medium">No offers available</p>
                  <p className="text-sm text-gray-500 mt-2">Try different filters</p>
                </div>
              ) : (
                offers.map((offer: Offer, index: number) => (
                <div
                  key={offer.recycler.id}
                  className="bg-white border border-gray-200 p-4 relative hover:shadow-md transition-shadow"
                >
                  {index === 0 && (
                    <div className="absolute -top-2 left-4 bg-black text-white px-3 py-1 text-xs font-bold">
                      Top Recommended Deal
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    {/* Left - Recycler Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          {offer.recycler.logo ? (
                            <img 
                              src={offer.recycler.logo} 
                              alt={offer.recycler.name} 
                              className="w-full h-full object-contain p-1"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                (e.currentTarget.nextSibling as HTMLElement)?.style.setProperty('display', 'flex');
                              }}
                            />
                          ) : null}
                          <div className={`w-full h-full bg-gradient-to-br from-gray-500 to-gray-700 items-center justify-center text-white font-bold text-sm ${offer.recycler.logo ? 'hidden' : 'flex'}`}>
                            {offer.recycler.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 mb-1">{offer.recycler.name}</h3>
                          {offer.recycler.rating && offer.recycler.reviewCount && offer.recycler.reviewCount > 0 && (
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map((star) => (
                                  <Star 
                                    key={star}
                                    className={`w-3 h-3 ${
                                      star <= Math.round(offer.recycler.rating || 0)
                                        ? 'text-green-500 fill-green-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-gray-600">
                                {offer.recycler.reviewCount} Reviews
                              </span>
                              <span className="text-xs text-gray-400">@ Trustpilot</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* USPs */}
                      {offer.recycler.usps && offer.recycler.usps.length > 0 && (
                        <div className="space-y-1">
                          {offer.recycler.usps.slice(0, 3).map((usp: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#1b981b]" />
                              <span className="text-sm text-gray-700">{usp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right - Price & Button */}
                    <div className="text-right">
                      <div className="text-4xl font-bold text-gray-900 mb-4">
                        £{Math.round(offer.price)}
                      </div>
                      <button
                        onClick={() => handleSellNow(offer)}
                        className="bg-red-600 text-white px-6 py-2.5 font-bold hover:bg-red-700 transition-colors w-full"
                      >
                        Sell Now
                      </button>
                    </div>
                  </div>
                </div>
              ))
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
