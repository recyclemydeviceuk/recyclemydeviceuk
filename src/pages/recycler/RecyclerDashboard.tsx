import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recyclerAuthService } from '../../services/recyclerAuth';
import { recyclerAPI } from '../../services/api';
import { 
  LogOut, 
  Smartphone, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign,
  Package,
  Clock,
  ArrowUpRight,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BarChart3,
  Settings,
  Search,
  Check
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

const RecyclerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const userData = recyclerAuthService.getUserData();
  const recyclerEmail = userData.email;

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsResponse, ordersResponse] = await Promise.all([
        recyclerAPI.dashboard.getStats(),
        recyclerAPI.dashboard.getRecentOrders(4)
      ]);
      
      // axios interceptor returns response.data directly
      if (statsResponse?.data) {
        const data = statsResponse.data;
        setStats({
          totalDevicesPurchased: data.orders?.total || 0,
          totalSpent: data.revenue?.total || 0,
          averagePrice: data.orders?.total > 0 ? (data.revenue?.total / data.orders?.total) : 0,
          activeOrders: (data.orders?.pending || 0) + (data.orders?.processing || 0),
          completedOrders: data.orders?.completed || 0,
          pendingPayments: data.revenue?.pending || 0,
          monthlyGrowth: data.orders?.recent || 0
        });
      }
      
      if (ordersResponse?.data) {
        setRecentOrders(ordersResponse.data);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      // Call backend to invalidate session
      await recyclerAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Navigate to login
      navigate('/recycler/login');
    }
  };

  const [stats, setStats] = useState({
    totalDevicesPurchased: 0,
    totalSpent: 0,
    averagePrice: 0,
    activeOrders: 0,
    completedOrders: 0,
    pendingPayments: 0,
    monthlyGrowth: 0
  });

  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white flex items-center justify-center">
                    <Check className="w-4 h-4 text-white font-bold" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Dashboard</h1>
                  <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                    Welcome back, <span className="font-semibold text-gray-800">{recyclerEmail?.split('@')[0] || 'Partner'}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="font-semibold text-sm">Logging out...</span>
                    </>
                  ) : (
                    <>
                      <LogOut className="w-4 h-4" />
                      <span className="font-semibold text-sm">Logout</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-semibold">Loading dashboard data...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-bold text-red-900">Error Loading Dashboard</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={fetchDashboardData}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && (
            <>
            {/* Performance Overview Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1b981b] via-[#1a8f1a] to-[#157a15] rounded-3xl p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your Performance This Month</h2>
                    <p className="text-green-100 text-sm">You're doing great! Keep up the excellent work.</p>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                    <TrendingUp className="w-5 h-5 text-white" />
                    <span className="text-xl font-bold text-white">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Key Metrics</h2>
                <button className="text-sm text-[#1b981b] hover:text-[#157a15] font-semibold flex items-center gap-1 transition-colors">
                  View Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Devices */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-purple-200 hover:border-purple-300 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Smartphone className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                        <ArrowUpRight className="w-3 h-3 text-purple-600" />
                        <span className="text-xs font-bold text-purple-600">+{stats.monthlyGrowth}%</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Devices</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent mb-1">{stats.totalDevicesPurchased}</p>
                    <p className="text-xs text-gray-500">Purchased this month</p>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-green-200 hover:border-green-300 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-green-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg">
                        <DollarSign className="w-7 h-7 text-white" />
                      </div>
                      <div className="px-3 py-1.5 bg-green-50 rounded-lg border border-green-200">
                        <span className="text-xs font-bold text-green-600">Active</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Spent</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent mb-1">£{Math.round(stats.totalSpent).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Avg: £{Math.round(stats.averagePrice)} per device</p>
                  </div>
                </div>

                {/* Active Orders */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-blue-200 hover:border-blue-300 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <ShoppingBag className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600">{stats.completedOrders}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Active Orders</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-1">{stats.activeOrders}</p>
                    <p className="text-xs text-gray-500">{stats.completedOrders} completed orders</p>
                  </div>
                </div>

                {/* Pending Payments */}
                <div className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-orange-200 hover:border-orange-300 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-500/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-200">
                        <AlertCircle className="w-3 h-3 text-orange-600" />
                        <span className="text-xs font-bold text-orange-600">Pending</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Pending Payments</p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent mb-1">£{Math.round(stats.pendingPayments).toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Awaiting processing</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
                <button className="text-sm text-gray-500 hover:text-gray-700 font-semibold flex items-center gap-1 transition-colors">
                  Customize <Settings className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button 
                  onClick={() => navigate('/recycler/devices-accepted')}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:from-purple-400/20 transition-all"></div>
                  <div className="relative z-10 p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">View Devices</h3>
                    <p className="text-sm text-gray-600 mb-4">Browse all purchased devices</p>
                    <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/recycler/orders')}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:from-blue-400/20 transition-all"></div>
                  <div className="relative z-10 p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <ShoppingBag className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">View Orders</h3>
                    <p className="text-sm text-gray-600 mb-4">Manage customer orders</p>
                    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                      <span>View All</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/recycler/profile')}
                  className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300 text-left transform hover:-translate-y-1"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/10 to-transparent rounded-full -mr-16 -mt-16 blur-2xl group-hover:from-green-400/20 transition-all"></div>
                  <div className="relative z-10 p-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                      <Users className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">Manage Profile</h3>
                    <p className="text-sm text-gray-600 mb-4">Update company details</p>
                    <div className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                      <span>Configure</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                <button 
                  onClick={() => navigate('/recycler/orders')}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 hover:from-[#1b981b]/20 hover:to-[#157a15]/20 text-[#1b981b] rounded-xl font-semibold text-sm border border-[#1b981b]/30 transition-all shadow-sm hover:shadow-md"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Device</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {recentOrders.map((order, index) => (
                        <tr 
                          key={order._id || order.id} 
                          className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent transition-all duration-200 cursor-pointer group"
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingBag className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-mono font-bold text-gray-800">{order.orderNumber || order.id}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center p-1">
                                <img 
                                  src={
                                    order.deviceId?.image || 
                                    order.deviceId?.imageUrl ||
                                    "https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png"
                                  }
                                  alt={order.deviceId?.name || order.deviceName || 'Device'}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png";
                                  }}
                                />
                              </div>
                              <span className="text-sm font-semibold text-gray-800">{order.deviceId?.name || order.deviceName || 'Device'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-purple-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">{order.customerName || order.customer?.name || 'Customer'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className="text-base font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent">£{order.amount || 0}</span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 ${getStatusBadge(order.status)}`}>
                              {order.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                              {order.status === 'pending' && <Clock className="w-3 h-3" />}
                              {order.status === 'processing' && <Package className="w-3 h-3" />}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-gray-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-700">
                                {new Date(order.createdAt || order.date).toLocaleDateString('en-GB', { 
                                  day: 'numeric', 
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerDashboard;
