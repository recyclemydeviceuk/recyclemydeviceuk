import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Phone {
  id: number;
  name: string;
  price: string;
  image: string;
  brand: string;
}

export default function SellYourPhone() {
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const phones: Phone[] = [
    { id: 1, name: 'iPhone 11', price: '£180', image: '', brand: 'Apple' },
    { id: 2, name: 'iPhone 11 Pro', price: '£240', image: '', brand: 'Apple' },
    { id: 3, name: 'iPhone 11 Pro Max', price: '£290', image: '', brand: 'Apple' },
    { id: 4, name: 'iPhone 12', price: '£250', image: '', brand: 'Apple' },
    { id: 5, name: 'iPhone 12 Mini', price: '£200', image: '', brand: 'Apple' },
    { id: 6, name: 'iPhone 12 Pro', price: '£300', image: '', brand: 'Apple' },
    { id: 7, name: 'iPhone 12 Pro Max', price: '£350', image: '', brand: 'Apple' },
    { id: 8, name: 'iPhone 13', price: '£320', image: '', brand: 'Apple' },
    { id: 9, name: 'iPhone 13 Mini', price: '£280', image: '', brand: 'Apple' },
    { id: 10, name: 'iPhone 13 Pro', price: '£400', image: '', brand: 'Apple' },
    { id: 11, name: 'iPhone 13 Pro Max', price: '£450', image: '', brand: 'Apple' },
    { id: 12, name: 'iPhone 14', price: '£380', image: '', brand: 'Apple' },
    { id: 13, name: 'iPhone 14 Plus', price: '£420', image: '', brand: 'Apple' },
    { id: 14, name: 'iPhone 14 Pro', price: '£500', image: '', brand: 'Apple' },
    { id: 15, name: 'iPhone 14 Pro Max', price: '£580', image: '', brand: 'Apple' },
    { id: 16, name: 'iPhone 15', price: '£450', image: '', brand: 'Apple' },
    { id: 17, name: 'iPhone 15 Plus', price: '£520', image: '', brand: 'Apple' },
    { id: 18, name: 'iPhone 15 Pro', price: '£620', image: '', brand: 'Apple' },
    { id: 19, name: 'iPhone 15 Pro Max', price: '£720', image: '', brand: 'Apple' },
    { id: 20, name: 'iPhone 16', price: '£580', image: '', brand: 'Apple' },
    { id: 21, name: 'iPhone 16 Plus', price: '£650', image: '', brand: 'Apple' },
    { id: 22, name: 'iPhone 16 Pro', price: '£750', image: '', brand: 'Apple' },
    { id: 23, name: 'iPhone 16 Pro Max', price: '£850', image: '', brand: 'Apple' },
    { id: 24, name: 'Galaxy S21', price: '£260', image: '', brand: 'Samsung' },
    { id: 25, name: 'Galaxy S21+', price: '£300', image: '', brand: 'Samsung' },
    { id: 26, name: 'Galaxy S21 Ultra', price: '£380', image: '', brand: 'Samsung' },
    { id: 27, name: 'Galaxy S22', price: '£320', image: '', brand: 'Samsung' },
    { id: 28, name: 'Galaxy S22+', price: '£380', image: '', brand: 'Samsung' },
    { id: 29, name: 'Galaxy S22 Ultra', price: '£480', image: '', brand: 'Samsung' },
    { id: 30, name: 'Galaxy S23', price: '£400', image: '', brand: 'Samsung' },
    { id: 31, name: 'Galaxy S23+', price: '£480', image: '', brand: 'Samsung' },
    { id: 32, name: 'Galaxy S23 Ultra', price: '£620', image: '', brand: 'Samsung' },
    { id: 33, name: 'Galaxy S24', price: '£480', image: '', brand: 'Samsung' },
    { id: 34, name: 'Galaxy S24+', price: '£600', image: '', brand: 'Samsung' },
    { id: 35, name: 'Galaxy S24 Ultra', price: '£780', image: '', brand: 'Samsung' },
  ];

  const brands = ['All', 'Apple', 'Samsung'];

  const filteredPhones = phones
    .filter(phone => selectedBrand === 'All' || phone.brand === selectedBrand)
    .filter(phone => phone.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-primary transition-colors">Home</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">Sell Your Phone</span>
        </div>

        {/* Page Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Sell Your Phone</h1>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search phones..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>

          {/* Filter Tabs and Sort */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Brand Filters */}
            <div className="flex flex-wrap gap-2">
              {brands.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 ${
                    selectedBrand === brand
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort:</span>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[160px] text-sm font-medium text-gray-700 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer transition-all"
                >
                  <span>
                    {sortBy === 'name' && 'Name'}
                    {sortBy === 'price-high' && 'Price: High'}
                    {sortBy === 'price-low' && 'Price: Low'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500 ml-2" />
                </button>
                
                {isSortOpen && (
                  <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-10">
                    <button
                      onClick={() => {
                        setSortBy('name');
                        setIsSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>Name</span>
                      {sortBy === 'name' && <Check className="w-4 h-4 text-primary" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('price-high');
                        setIsSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>Price: High</span>
                      {sortBy === 'price-high' && <Check className="w-4 h-4 text-primary" />}
                    </button>
                    <button
                      onClick={() => {
                        setSortBy('price-low');
                        setIsSortOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <span>Price: Low</span>
                      {sortBy === 'price-low' && <Check className="w-4 h-4 text-primary" />}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <p className="text-sm text-gray-600 mb-6">
          Showing {filteredPhones.length} phones
        </p>

        {/* Phone Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-12">
          {filteredPhones.map((phone) => (
            <Link
              key={phone.id}
              to={`/phone/${phone.id}`}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-xl hover:border-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer group block"
            >
              {/* Phone Image */}
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png" 
                  alt={phone.name}
                  className="w-full h-full object-contain p-2"
                />
              </div>

              {/* Phone Name */}
              <h3 className="text-sm font-bold text-gray-900 mb-1 text-center line-clamp-2 group-hover:text-primary transition-colors">
                {phone.name}
              </h3>

              {/* Price */}
              <p className="text-xs text-primary font-semibold text-center">
                up to {phone.price}
              </p>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
