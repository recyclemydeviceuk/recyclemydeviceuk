import { Search, Zap, Loader2 } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { deviceAPI, pricingAPI } from '../services/api';

interface Device {
  _id: string;
  name: string;
  brand: {
    _id: string;
    name: string;
  };
  image: string;
  storageOptions?: string[];
}

interface PricingOffer {
  recycler: {
    id: string;
    name: string;
    logo: string;
    city: string;
  };
  price: number;
}

export default function Hero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Device[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [featuredDevice, setFeaturedDevice] = useState<Device | null>(null);
  const [featuredPrices, setFeaturedPrices] = useState<PricingOffer[]>([]);
  const [searchPlaceholder, setSearchPlaceholder] = useState('Search e.g. iPhone 14, Samsung S23...');
  const sectionRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const section = sectionRef.current;
    if (section) {
      section.addEventListener('mousemove', handleMouseMove);
      return () => section.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Real-time search effect
  useEffect(() => {
    const searchDevices = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowResults(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await deviceAPI.getAllDevices({ search: searchQuery });
        if (response.success && response.data) {
          setSearchResults(response.data.slice(0, 5)); // Limit to 5 results
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchDevices, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    // Just ensure dropdown is visible if there's a query
    if (searchQuery.trim().length >= 2) {
      setShowResults(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDeviceClick = (deviceId: string) => {
    navigate(`/phone/${deviceId}`);
    setShowResults(false);
    setSearchQuery('');
  };

  // Fetch sample devices for dynamic placeholder
  useEffect(() => {
    const fetchSampleDevices = async () => {
      try {
        const response = await deviceAPI.getAllDevices();
        if (response.success && response.data && response.data.length > 0) {
          // Get devices from different brands
          const uniqueBrands = new Map<string, Device>();
          response.data.forEach((device: Device) => {
            if (!uniqueBrands.has(device.brand.name) && uniqueBrands.size < 2) {
              uniqueBrands.set(device.brand.name, device);
            }
          });
          
          // Create placeholder text from sample devices
          const sampleDevices = Array.from(uniqueBrands.values());
          if (sampleDevices.length > 0) {
            const placeholderText = `Search e.g. ${sampleDevices.map(d => d.name).join(', ')}...`;
            setSearchPlaceholder(placeholderText);
          }
        }
      } catch (error) {
        console.error('Error fetching sample devices:', error);
      }
    };

    fetchSampleDevices();
  }, []);

  // Fetch featured device and pricing on mount
  useEffect(() => {
    const fetchFeaturedDevice = async () => {
      try {
        // Get the first/latest device from database (no search filter)
        const devicesResponse = await deviceAPI.getAllDevices();
        if (devicesResponse.success && devicesResponse.data && devicesResponse.data.length > 0) {
          // Pick the first device (most recent)
          const device = devicesResponse.data[0];
          setFeaturedDevice(device);

          // Fetch pricing for the device with first storage option and 'Good' condition
          const storage = device.storageOptions?.[0] || '256GB';
          const pricingResponse = await pricingAPI.getDevicePrices(device._id, storage, 'Good');
          
          if (pricingResponse.data?.offers && pricingResponse.data.offers.length > 0) {
            // Sort by price descending and get top 2 offers
            const sortedOffers = pricingResponse.data.offers.sort((a: PricingOffer, b: PricingOffer) => b.price - a.price);
            setFeaturedPrices(sortedOffers.slice(0, 2));
          }
        }
      } catch (error) {
        console.error('Error fetching featured device:', error);
        // Set empty state so it doesn't show loading forever
        setFeaturedPrices([]);
      }
    };

    fetchFeaturedDevice();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-primary py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 relative overflow-visible"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute w-96 h-96 bg-white rounded-full blur-3xl transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x - 192}px`,
            top: `${mousePosition.y - 192}px`,
          }}
        />
      </div>
      
      {/* Digital Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 5 + mousePosition.x / 10) % 100}%`,
              top: `${(i * 7 + mousePosition.y / 10) % 100}%`,
              opacity: 0.3,
              animationDelay: `${i * 0.1}s`,
              transition: 'all 0.3s ease-out',
            }}
          />
        ))}
      </div>
      <div className="max-w-7xl mx-auto relative z-10 overflow-visible">
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center overflow-visible">
          {/* Left Content */}
          <div className="text-white overflow-visible">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
              Get the Best Price for Your Old Phone
            </h1>
            <p className="text-base sm:text-lg mb-4 sm:mb-6 md:mb-8 text-white/90">
              Compare prices from trusted recyclers and get paid instantly. Free postage, fast payment, eco-friendly recycling.
            </p>

            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
              <div className="bg-white rounded-full p-1 sm:p-1.5 flex items-center shadow-lg mb-3 sm:mb-4">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
                  className="flex-1 px-3 sm:px-4 md:px-6 py-2 sm:py-3 outline-none text-sm sm:text-base text-gray-700 bg-transparent placeholder:text-gray-500 placeholder:text-sm sm:placeholder:text-base"
                />
                <button 
                  onClick={handleSearch}
                  className="bg-primary text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold hover:bg-primary-dark transition-colors flex items-center space-x-1 sm:space-x-2 whitespace-nowrap"
                >
                  {isSearching ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                  <span className="hidden sm:inline">Search</span>
                </button>
              </div>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 w-full max-w-full lg:w-[600px] bg-white rounded-xl shadow-2xl mt-2 overflow-hidden z-[9999] border border-gray-200">
                  <div className="p-2">
                    <p className="text-xs text-gray-500 px-3 py-2 font-semibold uppercase tracking-wide">
                      Search Results
                    </p>
                    {searchResults.map((device) => (
                      <button
                        key={device._id}
                        onClick={() => handleDeviceClick(device._id)}
                        className="w-full flex items-center space-x-3 px-3 py-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                      >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <img 
                            src={device.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'}
                            alt={device.name}
                            className="w-10 h-10 object-contain"
                            onError={(e) => {
                              e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{device.name}</p>
                          <p className="text-sm text-gray-500">{device.brand.name}</p>
                        </div>
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results Message */}
              {showResults && searchResults.length === 0 && !isSearching && searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 w-full max-w-full lg:w-[600px] bg-white rounded-xl shadow-2xl mt-2 p-4 z-[9999] border border-gray-200">
                  <p className="text-gray-600 text-center">No devices found for "{searchQuery}"</p>
                  <p className="text-sm text-gray-500 text-center mt-1">Try a different search term</p>
                </div>
              )}
            </div>

            <div className="text-xs sm:text-sm text-white/80">
              or <Link to="/sell-your-phone" className="underline hover:text-white transition-colors">browse all phones</Link>
            </div>
          </div>

          {/* Right - Price Comparison Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-5 max-w-sm mx-auto lg:mx-0 w-full">
            {/* Fast Payment Badge */}
            <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 mb-2 sm:mb-3 bg-white border border-primary rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 w-fit ml-auto">
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary fill-primary" />
              <span className="text-[10px] sm:text-xs font-semibold text-gray-800">Fast Payment</span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-primary mb-1.5 sm:mb-2 text-center">
              COMPARE & GET TOP PRICE
            </h3>

            <div className="mb-2 sm:mb-3 text-center">
              <p className="text-[10px] sm:text-xs text-gray-600">
                {featuredDevice ? `${featuredDevice.name} ${featuredDevice.storageOptions?.[0] || ''}` : 'iPhone 16 Pro Max 256GB'}
              </p>
            </div>

            {/* Price Comparison */}
            <div className="space-y-2 sm:space-y-2.5 mb-2 sm:mb-3">
              {featuredPrices.length > 0 ? (
                <>
                  {/* Best Price Offer */}
                  <div className="relative flex items-center justify-between p-2.5 sm:p-3 border-2 border-primary rounded-xl bg-white">
                    <div className="absolute -top-2 sm:-top-2.5 right-1.5 sm:right-2 bg-primary text-white text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full">
                      BEST PRICE
                    </div>
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      {featuredPrices[0].recycler.logo ? (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={featuredPrices[0].recycler.logo} alt={featuredPrices[0].recycler.name} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="text-red-500 font-bold text-sm sm:text-base">🏢</div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-[11px] sm:text-xs text-gray-900 truncate">{featuredPrices[0].recycler.name}</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-500">Same day payment</p>
                      </div>
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-primary flex-shrink-0">£{Math.round(featuredPrices[0].price)}</div>
                  </div>

                  {/* Second Best Offer */}
                  {featuredPrices.length > 1 && (
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        {featuredPrices[1].recycler.logo ? (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img src={featuredPrices[1].recycler.logo} alt={featuredPrices[1].recycler.name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 text-[9px] sm:text-[10px] font-bold">
                              {featuredPrices[1].recycler.name.substring(0, 2).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-[11px] sm:text-xs text-gray-900 truncate">{featuredPrices[1].recycler.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-gray-500">1-2 day payment</p>
                        </div>
                      </div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 flex-shrink-0">£{Math.round(featuredPrices[1].price)}</div>
                    </div>
                  )}
                </>
              ) : (
                // Fallback when no pricing data
                <div className="text-center py-3 sm:py-4">
                  <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 animate-spin mx-auto" />
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1.5 sm:mt-2">Loading prices...</p>
                </div>
              )}
            </div>

            {/* Savings */}
            {featuredPrices.length > 1 && (
              <div className="bg-pink-50 rounded-lg p-2 sm:p-2.5 mb-2 sm:mb-3">
                <p className="text-[10px] sm:text-xs font-semibold text-primary text-center">
                  Save £{(featuredPrices[0].price - featuredPrices[1].price).toFixed(0)} by comparing sellers!
                </p>
              </div>
            )}

            {/* CTA Button */}
            <button 
              onClick={() => featuredDevice && navigate(`/phone/${featuredDevice._id}`)}
              className="w-full bg-primary text-white py-2 sm:py-2.5 rounded-xl text-sm sm:text-base font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
              disabled={!featuredDevice}
            >
              Compare Prices Now →
            </button>

            {/* Free Postage Badge */}
            <div className="flex items-center justify-center mt-2 sm:mt-3 space-x-1 sm:space-x-1.5">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span className="text-[10px] sm:text-xs text-gray-600 font-medium">Free Postage</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
