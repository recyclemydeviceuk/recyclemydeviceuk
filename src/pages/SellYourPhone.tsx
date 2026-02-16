import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { deviceAPI, brandAPI } from '../services/api';

interface Phone {
  _id: string;
  name: string;
  brand: {
    _id: string;
    name: string;
  };
  image: string;
  category: string;
  storageOptions: string[];
}

export default function SellYourPhone() {
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [brands, setBrands] = useState<string[]>(['All']);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalDevices, setTotalDevices] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  
  const DEVICES_PER_PAGE = 18; // 3 rows × 6 devices

  // Set search query and brand from URL parameters on mount
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlBrand = searchParams.get('brand');
    
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
    
    if (urlBrand) {
      setSelectedBrand(urlBrand);
    }
  }, [searchParams]);

  // Fetch initial devices, brands, and categories on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch brands
        const brandsResponse: any = await brandAPI.getAllBrands();
        if (brandsResponse.success) {
          const brandNames = brandsResponse.data.map((b: any) => b.name);
          setBrands(['All', ...brandNames]);
        }

        // Fetch categories from utilities
        try {
          const categoriesResponse: any = await deviceAPI.getCategories();
          if (categoriesResponse.success && categoriesResponse.data) {
            // Backend returns array of strings directly
            setCategories(['All', ...categoriesResponse.data]);
          }
        } catch (err) {
          console.error('Error fetching categories:', err);
          // Set default categories as fallback
          setCategories(['All', 'Smartphone', 'Tablet', 'Laptop', 'Smartwatch', 'Console']);
        }

        // Fetch first page of devices
        const devicesResponse: any = await deviceAPI.getAllDevices({
          page: 1,
          limit: DEVICES_PER_PAGE,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sortBy,
        });

        if (devicesResponse.success) {
          setPhones(devicesResponse.data);
          setTotalDevices(devicesResponse.pagination?.total || 0);
          setHasMore(devicesResponse.data.length === DEVICES_PER_PAGE);
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Reset and fetch devices when filters change
  useEffect(() => {
    const fetchFilteredDevices = async () => {
      if (loading) return; // Skip if initial load is still happening
      
      try {
        setLoading(true);
        setError(null);
        setPage(1);

        const devicesResponse = await deviceAPI.getAllDevices({
          page: 1,
          limit: DEVICES_PER_PAGE,
          brand: selectedBrand !== 'All' ? selectedBrand : undefined,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          sortBy,
        });

        if (devicesResponse.success) {
          setPhones(devicesResponse.data);
          setTotalDevices(devicesResponse.pagination?.total || 0);
          setHasMore(devicesResponse.data.length === DEVICES_PER_PAGE);
        }
      } catch (err: any) {
        console.error('Error fetching devices:', err);
        setError(err.response?.data?.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    // Debounce for search query
    const timeoutId = setTimeout(() => {
      fetchFilteredDevices();
    }, searchQuery ? 500 : 0);

    return () => clearTimeout(timeoutId);
  }, [selectedBrand, selectedCategory, searchQuery, sortBy]);

  // Load more devices
  const loadMoreDevices = async () => {
    if (loadingMore || !hasMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const devicesResponse: any = await deviceAPI.getAllDevices({
        page: nextPage,
        limit: DEVICES_PER_PAGE,
        brand: selectedBrand !== 'All' ? selectedBrand : undefined,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        search: searchQuery || undefined,
        sortBy,
      });

      if (devicesResponse.success) {
        setPhones(prev => [...prev, ...devicesResponse.data]);
        setPage(nextPage);
        setHasMore(devicesResponse.data.length === DEVICES_PER_PAGE);
      }
    } catch (err: any) {
      console.error('Error loading more devices:', err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
          loadMoreDevices();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, loadingMore, page, selectedBrand, searchQuery, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  // No client-side filtering - backend handles it
  const displayedPhones = phones;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Sell Your Phone</span>
        </div>

        {/* Page Title */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">Sell Your Phone</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
          {/* Search Bar */}
          <div className="relative mb-4 sm:mb-6">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Tabs and Sort */}
          <div className="flex flex-col gap-4">
            {/* Brand Filters - Horizontal Scroll on Mobile */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Filter by Brand:</label>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-4 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                        selectedBrand === brand
                          ? 'bg-[#1b981b] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Category Filters - Horizontal Scroll on Mobile */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Filter by Category:</label>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="flex gap-2 min-w-max sm:min-w-0 sm:flex-wrap">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 sm:px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-[#1b981b] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 self-start">
              <span className="text-xs sm:text-sm text-gray-600">Sort:</span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-3 sm:px-4 py-2 min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm font-medium text-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-all"
                >
                  <span>
                    {sortBy === 'name' && 'Name (A-Z)'}
                    {sortBy === 'name-desc' && 'Name (Z-A)'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500 ml-2" />
                </button>
                
                {isSortOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] sm:min-w-[160px] z-10">
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setIsSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>Name (A-Z)</span>
                      {sortBy === 'name' && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('name-desc');
                        setIsSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>Name (Z-A)</span>
                      {sortBy === 'name-desc' && <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-8 sm:py-12">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-primary animate-spin" />
            <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-600">Loading devices...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-red-600">{error}</p>
          </div>
        )}

        {/* Results Count */}
        {!loading && !error && (
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            Showing {phones.length} {totalDevices > 0 ? `of ${totalDevices}` : ''} phones
          </p>
        )}

        {/* Phone Grid */}
        {!loading && !error && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {displayedPhones.length > 0 ? (
                displayedPhones.map((phone) => (
                <Link
                  key={phone._id}
                  to={`/phone/${phone._id}`}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer group block"
                >
                  {/* Phone Image */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 sm:mb-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <img 
                      src={phone.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'}
                      alt={phone.name}
                      className="w-full h-full object-contain p-1.5 sm:p-2"
                      onError={(e) => {
                        e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                      }}
                    />
                  </div>

                  {/* Phone Name */}
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1 text-center line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] flex items-center justify-center group-hover:text-primary transition-colors">
                    {phone.name}
                  </h3>

                  {/* Storage Options */}
                  <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-1">
                    {phone.storageOptions?.join(', ')}
                  </p>

                  {/* Price Placeholder */}
                  <p className="text-[10px] sm:text-xs text-primary font-semibold text-center">
                    Get Quote
                  </p>
                </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <p className="text-sm sm:text-base text-gray-600">No devices found matching your criteria</p>
                </div>
              )}
            </div>

            {/* Loading More Indicator */}
            {loadingMore && (
              <div className="flex items-center justify-center py-6 sm:py-8">
                <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary animate-spin" />
                <span className="ml-2 text-xs sm:text-sm text-gray-600">Loading more devices...</span>
              </div>
            )}

            {/* Infinite Scroll Trigger */}
            <div ref={observerTarget} className="h-10" />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
