import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  LogOut,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Headphones
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

const RecyclerSupport: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuth');
    localStorage.removeItem('recyclerEmail');
    navigate('/recycler/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                      <HelpCircle className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Help & Support</h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                      We're here to help you
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            {/* Welcome Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-3xl shadow-2xl p-8 mb-8">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                    <Headphones className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Need Assistance?</h2>
                    <p className="text-white/80 text-sm mt-1">Our support team is ready to help you</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Phone Support */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-xl border-2 border-blue-200 p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Phone Support</h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-blue-600">0330 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">Mon-Fri: 9am - 6pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Email Support */}
              <div className="relative overflow-hidden bg-gradient-to-br from-white to-purple-50 rounded-3xl shadow-xl border-2 border-purple-200 p-8">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
                    <Mail className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Us</h3>
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-purple-600 break-all">support@recyclemydevice.co.uk</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <MessageCircle className="w-5 h-5 text-gray-500" />
                      <p className="text-sm font-semibold text-gray-700">We reply within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="relative overflow-hidden bg-gradient-to-br from-white to-green-50 rounded-3xl shadow-xl border-2 border-green-200 p-8">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#1b981b]/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Business Hours</h3>
                    <p className="text-sm text-gray-600 mt-1">When we're available to assist you</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Weekdays</p>
                        <p className="text-xl font-bold text-gray-800">Monday - Friday</p>
                      </div>
                      <div className="text-right">
                        <div className="px-4 py-2 bg-gradient-to-r from-[#1b981b] to-[#157a15] rounded-xl">
                          <p className="text-lg font-bold text-white">9am - 6pm</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-green-200 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Weekend</p>
                        <p className="text-xl font-bold text-gray-800">Saturday</p>
                      </div>
                      <div className="text-right">
                        <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                          <p className="text-lg font-bold text-white">10am - 4pm</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-100 border-2 border-green-300 rounded-2xl">
                  <p className="text-sm font-semibold text-green-800 text-center">
                    Closed on Sundays and Bank Holidays
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerSupport;
