import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, Star, Clock, CreditCard, Lock, Package, ArrowLeft, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Buyer {
  id: number;
  name: string;
  logo: string;
  price: number;
  rating: number;
  reviews: number;
  paymentTime: string;
  bankTransfer: boolean;
  isBestPrice?: boolean;
}

export default function PhoneDetail() {
  const navigate = useNavigate();
  
  const [selectedStorage, setSelectedStorage] = useState('64GB');
  const [selectedCondition, setSelectedCondition] = useState('Good');
  const [isConditionOpen, setIsConditionOpen] = useState(false);

  const storageOptions = ['64GB', '256GB', '512GB'];
  const conditionOptions = [
    { name: 'Like New', description: 'Perfect, no signs of use' },
    { name: 'Good', description: 'Minor scratches, fully working' },
    { name: 'Fair', description: 'Visible wear but functional' },
    { name: 'Poor', description: 'Heavy wear or minor damage' },
    { name: 'Faulty', description: 'Broken screen, battery issues, etc.' },
  ];

  const buyers: Buyer[] = [
    {
      id: 1,
      name: 'Sell Your Fone',
      logo: '🔴',
      price: 196,
      rating: 4.8,
      reviews: 5420,
      paymentTime: 'Same day',
      bankTransfer: true,
      isBestPrice: true,
    },
    {
      id: 2,
      name: 'Cash My Mobile',
      logo: '🔵',
      price: 191,
      rating: 4.6,
      reviews: 2340,
      paymentTime: '1-2 days',
      bankTransfer: true,
    },
  ];

  const handleSellNow = (buyer: Buyer) => {
    navigate('/checkout', { 
      state: { 
        phone: `iPhone 11 Pro - ${selectedStorage} - ${selectedCondition}`,
        buyer: buyer,
        price: buyer.price 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/sell-your-phone" className="hover:text-primary">Sell</Link>
          <span>/</span>
          <span className="text-gray-900">iPhone 11 Pro</span>
        </div>

        {/* Back Button */}
        <Link 
          to="/sell-your-phone"
          className="inline-flex items-center space-x-2 text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all phones</span>
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Phone Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-24">
              {/* Phone Image */}
              <div className="w-32 h-32 bg-gray-100 rounded-xl mx-auto mb-6 flex items-center justify-center p-4">
                <img 
                  src="https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png" 
                  alt="iPhone 11 Pro"
                  className="w-full h-full object-contain"
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
                iPhone 11 Pro
              </h1>

              {/* Storage Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Storage
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {storageOptions.map((storage) => (
                    <button
                      key={storage}
                      onClick={() => setSelectedStorage(storage)}
                      className={`py-2 px-3 rounded-lg border-2 font-semibold text-sm transition-all ${
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
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Condition
                </label>
                <div className="relative">
                  <button
                    onClick={() => setIsConditionOpen(!isConditionOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  >
                    <span className="font-medium text-gray-900">{selectedCondition}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isConditionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isConditionOpen && (
                    <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                      {conditionOptions.map((condition) => (
                        <button
                          key={condition.name}
                          onClick={() => {
                            setSelectedCondition(condition.name);
                            setIsConditionOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            selectedCondition === condition.name ? 'bg-red-500 text-white hover:bg-red-600' : 'text-gray-900'
                          }`}
                        >
                          <span className="font-medium">{condition.name}</span>
                          {selectedCondition === condition.name && <Check className="w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {conditionOptions.find(c => c.name === selectedCondition)?.description}
                </p>
              </div>
            </div>
          </div>

          {/* Right - Compare Offers */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Compare Offers</h2>
              <span className="text-sm text-gray-600">{buyers.length} buyers available</span>
            </div>

            <div className="space-y-4">
              {buyers.map((buyer) => (
                <div
                  key={buyer.id}
                  className={`bg-white rounded-xl border-2 p-6 hover:shadow-lg transition-all relative ${
                    buyer.isBestPrice ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  {buyer.isBestPrice && (
                    <div className="absolute -top-3 right-6">
                      <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold shadow-md">
                        BEST PRICE
                      </span>
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-4">
                    {/* Left - Buyer Info */}
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                        {buyer.logo}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {buyer.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="font-semibold">{buyer.rating}</span>
                            <span>({buyer.reviews.toLocaleString()} reviews)</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span>{buyer.paymentTime}</span>
                          </div>
                          {buyer.bankTransfer && (
                            <div className="flex items-center space-x-1">
                              <CreditCard className="w-4 h-4 text-gray-400" />
                              <span>Bank Transfer</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right - Price & Action */}
                    <div className="flex flex-col items-end space-y-3">
                      <div className="text-right">
                        {buyer.isBestPrice && (
                          <div className="text-xs text-gray-500 mb-1">Price offered</div>
                        )}
                        <div className="text-3xl font-bold text-primary">
                          £{buyer.price}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellNow(buyer)}
                        className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md whitespace-nowrap"
                      >
                        Sell Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Lock className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Secure checkout</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <Package className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Free postage</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                <CreditCard className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-900">Fast payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
