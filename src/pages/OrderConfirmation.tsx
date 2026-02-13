import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Mail, Printer, Star } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, phone, buyer, price, email } = location.state || {};

  if (!orderNumber) {
    navigate('/sell-your-phone');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-2">
            Order Number: <span className="font-bold text-primary">{orderNumber}</span>
          </p>
          <p className="text-gray-600">
            Thank you for choosing Recycle My Device. Your order has been submitted successfully.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Your Order Details
          </h2>
          
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center p-2">
              <img 
                src="https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png" 
                alt="Phone"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">iPhone 11 Pro</h3>
              <p className="text-sm text-gray-600">{phone}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Sold to</p>
            <div className="flex items-center space-x-2">
              <span className="text-xl">{buyer.logo}</span>
              <span className="font-bold text-gray-900">{buyer.name}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">You'll Receive</span>
              <span className="text-3xl font-bold text-primary">£{price}</span>
            </div>
          </div>
        </div>

        {/* Confirmation Email */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <div className="flex items-start space-x-3">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Confirmation Email Sent</h3>
              <p className="text-sm text-gray-600 mb-2">
                Sent to <span className="font-semibold text-blue-600">{email}</span>
              </p>
              <p className="text-sm text-gray-600">
                Check your inbox for order details and your free shipping label.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <button className="flex items-center justify-center space-x-2 bg-white border-2 border-primary text-primary px-6 py-4 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            <Mail className="w-5 h-5" />
            <span>View Your Email</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            <Printer className="w-5 h-5" />
            <span>Print Shipping Label</span>
          </button>
        </div>

        {/* What Happens Next */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Pack your device securely and attach the shipping label
                </h3>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Drop off at any Royal Mail or collect point
                </h3>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Once received and inspected, payment will be sent within <span className="font-bold text-primary">1-3 days</span>
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Recycler Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border-2 border-yellow-200 p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white fill-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Rate Your Experience</h3>
                <p className="text-sm text-gray-600">Help others by reviewing {buyer.name}</p>
              </div>
            </div>
            <Link
              to="/review-recycler"
              state={{ recyclerName: buyer.name, orderNumber }}
              className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Star className="w-5 h-5" />
              Rate Now
            </Link>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/sell-your-phone"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
          >
            Sell Another Device →
          </Link>
          <button className="inline-block bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Track Your Order
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
