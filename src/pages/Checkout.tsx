import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Check, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { orderAPI } from '../services/api';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItem, removeFromCart, clearCart } = useCart();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    streetAddress: '',
    city: '',
    postcode: '',
    orderNotes: '',
    accountHolderName: '',
    sortCode: '',
    accountNumber: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cartItem) return;
    
    setSubmitting(true);
    setError(null);

    try {
      // Prepare order data
      const orderData = {
        deviceId: cartItem.deviceId,
        recyclerId: cartItem.recyclerId,
        deviceCondition: cartItem.condition.toLowerCase(),
        storage: cartItem.storage,
        amount: cartItem.price,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerEmail: formData.email,
        customerPhone: formData.phoneNumber,
        address: formData.streetAddress,
        city: formData.city,
        postcode: formData.postcode,
        deviceNotes: formData.orderNotes,
      };

      // Submit order to backend
      const response = await orderAPI.createOrder(orderData);
      
      console.log('Order API Response:', response);

      if (response.success) {
        // Set flag to prevent useEffect from redirecting
        setOrderCompleted(true);
        
        const navigationState = {
          orderNumber: response.data.orderNumber,
          orderId: response.data.orderId,
          deviceName: cartItem.deviceName,
          deviceImage: cartItem.deviceImage,
          recyclerName: cartItem.recyclerName,
          price: cartItem.price,
          email: formData.email,
          customerName: `${formData.firstName} ${formData.lastName}`,
          storage: cartItem.storage,
          condition: cartItem.condition,
          customerPhone: formData.phoneNumber,
          shippingAddress: `${formData.streetAddress}, ${formData.city}, ${formData.postcode}`,
        };
        
        console.log('Navigating to order confirmation with state:', navigationState);
        
        // Navigate to order confirmation with backend data
        navigate('/order-confirmation', {
          state: navigationState,
          replace: true, // Replace history entry to prevent back button issues
        });
        
        // Clear cart after navigation
        setTimeout(() => clearCart(), 100);
      } else {
        console.error('Order creation failed:', response);
        setError(response.message || 'Failed to create order');
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      setError(err.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveDevice = () => {
    removeFromCart();
    navigate('/sell-your-phone');
  };

  // Redirect if cart is empty (but not if order was just completed)
  useEffect(() => {
    if (!cartItem && !orderCompleted) {
      navigate('/sell-your-phone');
    }
  }, [cartItem, navigate, orderCompleted]);

  if (!cartItem) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          
            {/* Your Devices */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Devices (1)
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center p-2">
                    <img 
                      src={cartItem.deviceImage || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'} 
                      alt={cartItem.deviceName}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{cartItem.deviceName}</h3>
                    <p className="text-sm text-gray-600">{cartItem.storage} • {cartItem.condition}</p>
                    <p className="text-sm text-gray-600 mt-1">Selling to: {cartItem.recyclerName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-primary">£{Math.round(cartItem.price)}</span>
                  <button
                    onClick={handleRemoveDevice}
                    className="text-red-500 hover:text-red-700 flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="text-sm">Remove</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Your Details */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Details
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Collection Address */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Collection Address
                  </h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="streetAddress"
                        value={formData.streetAddress}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Postcode
                        </label>
                        <input
                          type="text"
                          name="postcode"
                          value={formData.postcode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Notes */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Order Notes
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Add any special instructions or notes about your device (optional)
                  </p>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      name="orderNotes"
                      value={formData.orderNotes}
                      onChange={handleChange}
                      rows={4}
                      placeholder="e.g., Please handle with care, minor scratches on the back..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    />
                  </div>
                </div>

                {/* Bank Details */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Bank Details
                  </h3>
                  <p className="text-sm text-primary mb-4">
                    We'll send your payment directly to your UK bank account.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        placeholder="Name as shown on your bank account"
                        required
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Sort Code
                        </label>
                        <input
                          type="text"
                          name="sortCode"
                          value={formData.sortCode}
                          onChange={handleChange}
                          placeholder="00-00-00"
                          required
                          maxLength={8}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          name="accountNumber"
                          value={formData.accountNumber}
                          onChange={handleChange}
                          placeholder="8-digit account number"
                          required
                          maxLength={8}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#1b981b] text-white py-4 rounded-lg font-semibold hover:bg-[#158515] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    'Complete Order'
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Device Info */}
              <div className="mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {cartItem.recyclerLogo && (
                      <div className="w-8 h-8 bg-white rounded flex items-center justify-center overflow-hidden">
                        <img src={cartItem.recyclerLogo} alt={cartItem.recyclerName} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="font-bold text-gray-900">{cartItem.recyclerName}</span>
                  </div>
                  <p className="text-xs text-gray-600">Secure online payment</p>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{cartItem.deviceName}</p>
                  <p className="text-sm text-gray-600">{cartItem.storage} • {cartItem.condition}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-b py-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Device Value</span>
                  <span className="font-semibold text-gray-900">£{Math.round(cartItem.price)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Postage</span>
                  <span className="font-semibold text-primary">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">You'll Receive</span>
                <span className="text-3xl font-bold text-primary">£{Number(cartItem.price).toFixed(2)}</span>
              </div>

              {/* Benefits */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Free postage included</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Payment within 24 hours</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Data securely wiped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
