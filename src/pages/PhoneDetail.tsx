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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/sell-your-phone" className="hover:text-[#1b981b] transition-colors">All Devices</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{device.name}</span>
        </div>

        <div className="grid lg:grid-cols-[340px,1fr] gap-8">
          {/* Left Sidebar - Device Config */}
          <div className="space-y-5">
            {/* Device Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
              {/* Image area with gradient bg */}
              <div className="bg-gradient-to-b from-gray-50 to-white px-8 pt-8 pb-4 flex items-center justify-center">
                <img 
                  src={device.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'}
                  alt={device.name}
                  className="w-40 h-40 object-contain drop-shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                  }}
                />
              </div>
              <div className="px-6 pb-6">
                <h1 className="text-xl font-bold text-gray-900 mb-1 text-center">{device.name}</h1>
                <p className="text-sm text-gray-400 text-center mb-5">{device.brand?.name}</p>

                {/* Capacity Selection */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Storage Capacity
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {device.storageOptions.map((storage) => (
                      <button
                        key={storage}
                        onClick={() => setSelectedStorage(storage)}
                        className={`py-2 px-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
                          selectedStorage === storage
                            ? 'bg-[#1b981b] text-white shadow-md shadow-green-200'
                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {storage}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Network Selection */}
                <div className="mb-5">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Network
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => { setIsNetworkOpen(!isNetworkOpen); setIsConditionOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white font-medium text-sm transition-all duration-200 ${
                        isNetworkOpen ? 'border-[#1b981b] ring-4 ring-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">{selectedNetwork}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isNetworkOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isNetworkOpen && device.networkOptions && (
                      <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
                        {device.networkOptions.map((network) => (
                          <button
                            key={network}
                            onClick={() => { setSelectedNetwork(network); setIsNetworkOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                              selectedNetwork === network
                                ? 'bg-[#1b981b] text-white'
                                : 'text-gray-700 hover:bg-gray-50'
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
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                    Condition
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => { setIsConditionOpen(!isConditionOpen); setIsNetworkOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 bg-white font-medium text-sm transition-all duration-200 ${
                        isConditionOpen ? 'border-[#1b981b] ring-4 ring-green-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-gray-900">{selectedCondition}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isConditionOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isConditionOpen && (
                      <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden">
                        {device.conditionOptions.map((condition) => (
                          <button
                            key={condition}
                            onClick={() => { setSelectedCondition(condition); setIsConditionOpen(false); }}
                            className={`w-full px-4 py-3 text-left text-sm font-medium transition-colors ${
                              selectedCondition === condition
                                ? 'bg-[#1b981b] text-white'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {condition}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-br from-[#1b981b]/5 to-green-50 rounded-3xl border border-green-100 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-[#1b981b] rounded-full flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 text-white" />
                </span>
                Why Choose Us
              </h3>
              <div className="space-y-2.5">
                {['Secure checkout with SSL encryption', 'Free postage with tracked delivery', 'Fast payment within 24 hours'].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded-full bg-[#1b981b]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-[#1b981b]" />
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Recycler Offers */}
          <div>
            {/* Header row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-sm text-gray-500">
                  <span className="text-lg font-bold text-gray-900">{offers.length}</span> offers found
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-white rounded-xl px-3 py-2 border border-gray-100 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#1b981b] animate-pulse"></span>
                Prices updated live
              </div>
            </div>

            <div className="space-y-4">
              {offers.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📱</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-700 mb-1">No offers available</p>
                  <p className="text-sm text-gray-400">Try adjusting your storage, network, or condition</p>
                </div>
              ) : (
                offers.map((offer: Offer, index: number) => (
                  <div
                    key={offer.recycler.id}
                    className={`bg-white rounded-3xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden ${
                      index === 0 ? 'border-[#1b981b]/30 shadow-md shadow-green-50' : 'border-gray-100 shadow-sm'
                    }`}
                  >
                    {/* Top badge */}
                    {index === 0 && (
                      <div className="bg-gradient-to-r from-[#1b981b] to-emerald-500 text-white px-4 py-2 text-xs font-bold flex items-center gap-2">
                        <Star className="w-3.5 h-3.5 fill-white" />
                        Top Recommended Deal
                      </div>
                    )}

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        {/* Left - Recycler Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            {/* Logo */}
                            <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {offer.recycler.logo ? (
                                <img
                                  src={offer.recycler.logo}
                                  alt={offer.recycler.name}
                                  className="w-full h-full object-contain p-1.5"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                    (e.currentTarget.nextSibling as HTMLElement)?.style.setProperty('display', 'flex');
                                  }}
                                />
                              ) : null}
                              <div className={`w-full h-full bg-gradient-to-br from-[#1b981b] to-emerald-600 items-center justify-center text-white font-bold text-sm rounded-2xl ${offer.recycler.logo ? 'hidden' : 'flex'}`}>
                                {offer.recycler.name.split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                            </div>

                            <div className="min-w-0">
                              <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{offer.recycler.name}</h3>
                              {offer.recycler.rating && offer.recycler.reviewCount && offer.recycler.reviewCount > 0 ? (
                                <div className="flex items-center gap-1.5">
                                  <div className="flex items-center gap-0.5">
                                    {[1,2,3,4,5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`w-3 h-3 ${
                                          star <= Math.round(offer.recycler.rating || 0)
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-200 fill-gray-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs font-semibold text-gray-600">{offer.recycler.rating}</span>
                                  <span className="text-xs text-gray-400">({offer.recycler.reviewCount} reviews)</span>
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400">Verified Recycler</span>
                              )}
                            </div>
                          </div>

                          {/* USPs */}
                          {offer.recycler.usps && offer.recycler.usps.length > 0 && (
                            <div className="space-y-1.5">
                              {offer.recycler.usps.slice(0, 3).map((usp: string, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded-full bg-[#1b981b]/10 flex items-center justify-center flex-shrink-0">
                                    <Check className="w-2.5 h-2.5 text-[#1b981b]" />
                                  </div>
                                  <span className="text-sm text-gray-600">{usp}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right - Price & Button */}
                        <div className="flex flex-col items-end gap-3 flex-shrink-0">
                          <div className="text-right">
                            <div className="text-3xl font-black text-gray-900 leading-none">
                              £{Math.round(offer.price)}
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">Instant quote</p>
                          </div>
                          <button
                            onClick={() => handleSellNow(offer)}
                            className="bg-[#1b981b] hover:bg-[#158515] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 hover:shadow-md hover:shadow-green-200 active:scale-95 whitespace-nowrap"
                          >
                            Sell Now →
                          </button>
                        </div>
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
