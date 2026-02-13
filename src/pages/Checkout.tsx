import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trash2, Check } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phone, buyer, price } = location.state || {};

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const orderNumber = 'RM' + Math.floor(1000 + Math.random() * 9000);
    navigate('/order-confirmation', {
      state: {
        orderNumber,
        phone,
        buyer,
        price,
        email: formData.email,
        orderNotes: formData.orderNotes,
        customerName: `${formData.firstName} ${formData.lastName}`,
        customerPhone: formData.phoneNumber,
        shippingAddress: `${formData.streetAddress}, ${formData.city}, ${formData.postcode}`,
      },
    });
  };

  const handleRemoveDevice = () => {
    navigate('/sell-your-phone');
  };

  if (!phone || !buyer || !price) {
    navigate('/sell-your-phone');
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
            {/* Your Devices */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your Devices (1)
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center p-2">
                    <img 
                      src="https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png" 
                      alt="Phone"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">iPhone 11 Pro</h3>
                    <p className="text-sm text-gray-600">{phone}</p>
                    <p className="text-sm text-primary">Selling to: {buyer.name}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-primary">£{price}</span>
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
                  className="w-full bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary-dark transition-colors shadow-md mt-6"
                >
                  Complete Order
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
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-10 bg-gray-800 rounded"></div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">iPhone 11 Pro</p>
                    <p className="text-sm text-gray-600">{phone.split(' - ')[1]} • {phone.split(' - ')[2]}</p>
                  </div>
                </div>

                {/* Buyer Badge */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{buyer.logo}</span>
                    <span className="font-bold text-gray-900">{buyer.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">Secure online payment</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-b py-4 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Device Value</span>
                  <span className="font-semibold text-gray-900">£{price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Postage</span>
                  <span className="font-semibold text-primary">FREE</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-gray-900">You'll Receive</span>
                <span className="text-3xl font-bold text-primary">£{price}</span>
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
