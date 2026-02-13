import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Smartphone, ShoppingBag, Users, Recycle, FileText, MessageSquare, TrendingUp, Package } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const adminEmail = localStorage.getItem('adminEmail') || 'admin@example.com';

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-sm text-gray-600 mt-1">Welcome back, {adminEmail}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => navigate('/panel/devices')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">156</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Total Devices</h3>
                <p className="text-sm text-blue-100">Listed devices</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => navigate('/panel/orders')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">342</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Total Orders</h3>
                <p className="text-sm text-green-100">Completed sales</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => navigate('/panel/customers')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">128</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Customers</h3>
                <p className="text-sm text-purple-100">Device sellers</p>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200 cursor-pointer" onClick={() => navigate('/panel/recyclers')}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Recycle className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl font-bold text-white">24</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Recyclers</h3>
                <p className="text-sm text-orange-100">Active partners</p>
              </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-[#1b981b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-800">£42,580</p>
                  </div>
                  <div className="w-10 h-10 bg-[#1b981b]/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#1b981b]" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-[#1b981b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Contact Forms</p>
                    <p className="text-2xl font-bold text-gray-800">8 New</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md hover:shadow-lg hover:border-[#1b981b] transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                    <p className="text-2xl font-bold text-gray-800">3</p>
                  </div>
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Device Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Add, edit, and manage device listings and pricing
                </p>
                <button 
                  onClick={() => navigate('/panel/devices')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  Manage Devices
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Order Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Track orders, payments, and customer transactions
                </p>
                <button 
                  onClick={() => navigate('/panel/orders')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  View Orders
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                  <Recycle className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Recycler Applications</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Review and approve new recycler partnerships
                </p>
                <button 
                  onClick={() => navigate('/panel/recyclers')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  Review Applications
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Customer Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View customer profiles and order history
                </p>
                <button 
                  onClick={() => navigate('/panel/customers')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  View Customers
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Content Management</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Manage blog posts, FAQs, and website content
                </p>
                <button 
                  onClick={() => navigate('/panel/content')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  Manage Content
                </button>
              </div>

              <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-md hover:shadow-xl hover:border-[#1b981b] transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Contact Forms</h3>
                <p className="text-gray-600 text-sm mb-4">
                  View and respond to customer inquiries
                </p>
                <button 
                  onClick={() => navigate('/panel/contact-submissions')}
                  className="px-5 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold text-sm transform hover:scale-105 transition-all duration-200 w-full"
                >
                  View Submissions
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
