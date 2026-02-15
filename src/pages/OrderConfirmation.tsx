import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, Mail, Loader2, AlertCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { orderAPI } from '../services/api';

interface OrderResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);
  
  const { orderNumber, email } = location.state || {};

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderNumber || !email) {
        console.warn('No order number or email found, redirecting to sell-your-phone');
        navigate('/sell-your-phone');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch order details from backend
        const response = await orderAPI.verifyOrder(orderNumber, email) as unknown as OrderResponse;
        
        if (response.success) {
          setOrderData(response.data);
        } else {
          setError(response.message || 'Failed to fetch order details');
        }
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderNumber, email, navigate]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error || !orderData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
            <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
            <Link
              to="/sell-your-phone"
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Extract data from backend response
  const device = orderData.deviceId;
  const recycler = orderData.recyclerId;

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
            Order Number: <span className="font-bold text-primary">{orderData.orderNumber}</span>
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
                src={device?.image || 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png'} 
                alt={device?.name || 'Device'}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{device?.name || 'Device'}</h3>
              <p className="text-sm text-gray-600">{orderData.storage} • {orderData.deviceCondition}</p>
              <p className="text-sm text-gray-600 mt-1">Selling to: {recycler?.companyName || recycler?.name}</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-600 mb-1">Sold to</p>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-gray-900">{recycler?.companyName || recycler?.name}</span>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">You'll Receive</span>
              <span className="text-3xl font-bold text-primary">£{orderData.amount}</span>
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
                Sent to <span className="font-semibold text-blue-600">{orderData.customerEmail}</span>
              </p>
              <p className="text-sm text-gray-600">
                Check your inbox for order details and your free shipping label.
              </p>
            </div>
          </div>
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

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/sell-your-phone"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
          >
            Explore More
          </Link>
          <Link
            to="/faqs"
            className="inline-block bg-white border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            FAQs
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
