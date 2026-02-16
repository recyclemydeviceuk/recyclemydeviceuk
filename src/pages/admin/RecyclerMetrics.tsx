import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  TrendingUp, 
  Users, 
  Smartphone, 
  DollarSign, 
  Package, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Building2,
  Eye,
  Star,
  Activity,
  Award,
  ChevronRight,
  Filter,
  X,
  Mail,
  Phone,
  MapPin,
  Upload,
  CheckCircle2,
  FileText
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface RecyclerMetric {
  id: string;
  companyName: string;
  contactPerson: string;
  status: 'active' | 'inactive';
  totalCustomers: number;
  totalDevicesPurchased: number;
  totalSpent: number;
  averageDevicePrice: number;
  lastPurchaseDate: string;
  growthRate: number;
  topBrands: string[];
  rating: number;
  reviewCount: number;
  businessStatus: string;
  businessActive: boolean;
  logo?: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  sellingPoints: string[];
}

const RecyclerMetrics: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedRecycler, setSelectedRecycler] = useState<RecyclerMetric | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState<'disable' | 'enable'>('disable');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [recyclerMetrics, setRecyclerMetrics] = useState<RecyclerMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({ totalRevenue: 0, totalOrders: 0, totalCustomers: 0, averageRating: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadRecyclerMetrics();
  }, [searchQuery, statusFilter, pagination.page]);

  const loadRecyclerMetrics = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (statusFilter !== 'all') params.status = statusFilter;
      
      const response: any = await adminAPI.metrics.getRecyclers(params);
      setRecyclerMetrics(response.data.metrics || []);
      setOverview(response.data.overview || { totalRevenue: 0, totalOrders: 0, totalCustomers: 0, averageRating: 0 });
      
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      }
    } catch (error) {
      console.error('Error loading recycler metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('sessionToken');
    navigate('/panel/login');
  };

  const handleStatusChange = async () => {
    if (!selectedRecycler || !reason.trim()) {
      alert('Please provide a reason for this action');
      return;
    }

    try {
      setSubmitting(true);
      
      const response: any = actionType === 'disable'
        ? await adminAPI.recyclers.suspend(selectedRecycler.id, reason)
        : await adminAPI.recyclers.activate(selectedRecycler.id, reason);

      if (response?.success) {
        alert(`Partner ${actionType === 'disable' ? 'disabled' : 'enabled'} successfully! Email sent to ${selectedRecycler.email}`);
        setShowReasonModal(false);
        setShowModal(false);
        setReason('');
        loadRecyclerMetrics();
      }
    } catch (error: any) {
      console.error('Status change error:', error);
      alert(error.response?.data?.message || `Failed to ${actionType} partner`);
    } finally {
      setSubmitting(false);
    }
  };

  // All data now comes from backend API via adminAPI.metrics.getRecyclers()

  // Brand colors for visual variety
  const brandColors: Record<string, string> = {
    'Apple': 'bg-gray-900 text-white',
    'Samsung': 'bg-blue-600 text-white',
    'Google': 'bg-green-500 text-white',
    'Microsoft': 'bg-blue-500 text-white',
    'HP': 'bg-blue-700 text-white',
    'OnePlus': 'bg-red-500 text-white',
    'Huawei': 'bg-red-600 text-white',
    'Dell': 'bg-blue-800 text-white',
    'Lenovo': 'bg-red-700 text-white',
    'Xiaomi': 'bg-orange-500 text-white'
  };

  const filteredMetrics = recyclerMetrics;

  // Use backend overview stats
  const totalCustomers = overview.totalCustomers || 0;
  const totalDevices = overview.totalOrders || 0;
  const totalRevenue = overview.totalRevenue || 0;
  const averagePrice = totalDevices > 0 ? totalRevenue / totalDevices : 0;
  const activeRecyclers = recyclerMetrics.filter(m => m.status === 'active').length;
  const avgRating = overview.averageRating || 0;

  // Find top performer
  const topPerformer = recyclerMetrics.length > 0 
    ? recyclerMetrics.reduce((prev, current) => prev.totalSpent > current.totalSpent ? prev : current)
    : { companyName: 'N/A', totalSpent: 0 };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-lg">
                    <Activity className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">Recycler Metrics & Analytics</h1>
                </div>
                <p className="text-sm text-gray-500 ml-13 pl-1">Track partner performance and device purchase statistics</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <p className="text-xs text-gray-500">Top Performer</p>
                  <p className="text-sm font-semibold text-[#1b981b]">{topPerformer.companyName}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && (
          <>
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Aggregate Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
              {/* Active Partners */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-[#1b981b] to-[#0d8a0d] rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-green-100 font-medium mb-1">Active Partners</p>
                  <p className="text-3xl font-bold text-white">{activeRecyclers}</p>
                </div>
              </div>

              {/* Total Customers */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-blue-100 font-medium mb-1">Total Customers</p>
                  <p className="text-3xl font-bold text-white">{totalCustomers}</p>
                </div>
              </div>

              {/* Devices Purchased */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <Smartphone className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-purple-100 font-medium mb-1">Devices</p>
                  <p className="text-3xl font-bold text-white">{totalDevices}</p>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-orange-100 font-medium mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-white">£{Math.floor(totalRevenue).toLocaleString()}</p>
                </div>
              </div>

              {/* Avg Price */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-pink-100 font-medium mb-1">Avg Price</p>
                  <p className="text-3xl font-bold text-white">£{Math.floor(averagePrice)}</p>
                </div>
              </div>

              {/* Avg Rating */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xs text-yellow-100 font-medium mb-1">Avg Rating</p>
                  <p className="text-3xl font-bold text-white">{avgRating.toFixed(1)}</p>
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200/50 p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by company name or contact person..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm"
                  />
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
                      className="pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="px-4 py-3 bg-gradient-to-r from-[#1b981b]/10 to-[#1b981b]/5 rounded-xl border border-[#1b981b]/20">
                    <p className="text-xs text-gray-500">Showing</p>
                    <p className="text-sm font-bold text-[#1b981b]">{filteredMetrics.length} of {recyclerMetrics.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recycler Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredMetrics.map((metric) => (
                <div
                  key={metric.id}
                  className="group bg-white rounded-3xl border-2 border-gray-100 hover:border-[#1b981b]/50 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-sm">
                            <Building2 className="w-6 h-6 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-800">{metric.companyName}</h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                metric.status === 'active' 
                                  ? 'bg-green-100 text-green-700 border border-green-200' 
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}>
                                {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">{metric.contactPerson}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${
                        metric.growthRate >= 0 
                          ? 'bg-green-50 text-green-700 border border-green-100' 
                          : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {metric.growthRate >= 0 ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4" />
                        )}
                        <span className="text-sm font-bold">{Math.abs(metric.growthRate)}%</span>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      <div className="bg-blue-50/80 rounded-2xl p-3 border border-blue-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Users className="w-3.5 h-3.5 text-blue-600" />
                          <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">Customers</p>
                        </div>
                        <p className="text-xl font-bold text-gray-800">{metric.totalCustomers}</p>
                      </div>

                      <div className="bg-purple-50/80 rounded-2xl p-3 border border-purple-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Smartphone className="w-3.5 h-3.5 text-purple-600" />
                          <p className="text-[10px] font-semibold text-purple-600 uppercase tracking-wide">Devices</p>
                        </div>
                        <p className="text-xl font-bold text-gray-800">{metric.totalDevicesPurchased}</p>
                      </div>

                      <div className="bg-green-50/80 rounded-2xl p-3 border border-green-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <DollarSign className="w-3.5 h-3.5 text-green-600" />
                          <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wide">Spent</p>
                        </div>
                        <p className="text-xl font-bold text-gray-800">£{Math.floor(metric.totalSpent).toLocaleString()}</p>
                      </div>

                      <div className="bg-orange-50/80 rounded-2xl p-3 border border-orange-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Award className="w-3.5 h-3.5 text-orange-600" />
                          <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wide">Rating</p>
                        </div>
                        <div className="flex items-center gap-1">
                          {metric.rating > 0 ? (
                            <>
                              <p className="text-xl font-bold text-gray-800">{metric.rating.toFixed(1)}</p>
                              <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                              <p className="text-[10px] text-gray-500">({metric.reviewCount})</p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">No reviews</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Brands */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Brands:</p>
                      <div className="flex flex-wrap gap-2">
                        {metric.topBrands.map((brand, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                              brandColors[brand] || 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {brand}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Last: {new Date(metric.lastPurchaseDate).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short'
                        })}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedRecycler(metric);
                          setShowModal(true);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0d6a0d] text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredMetrics.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No recyclers found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>

        {/* Business Details Modal */}
        {showModal && selectedRecycler && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-[#1b981b] to-[#157a15] px-8 py-6 rounded-t-3xl flex items-center justify-between z-10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedRecycler.companyName}</h2>
                    <p className="text-sm text-green-100">Business Information</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-8 space-y-6">
                {/* Business Status & Admin Controls */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600" />
                      Business Status
                    </h3>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${selectedRecycler.businessActive ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-red-100 text-red-700 border-2 border-red-300'}`}>
                      {selectedRecycler.businessActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-gray-700 font-semibold">{selectedRecycler.businessStatus}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {selectedRecycler.businessActive ? 'Their business is visible and accepting orders from customers' : 'Business is temporarily paused and not accepting new orders'}
                  </p>

                  {/* Admin Control Section */}
                  <div className="mt-6 pt-6 border-t-2 border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-1">Admin Control - Partner Account Status</p>
                        <p className="text-xs text-gray-600">Control partner's ability to login and access the system</p>
                      </div>
                      <button
                        onClick={() => {
                          setActionType(selectedRecycler.businessActive ? 'disable' : 'enable');
                          setReason('');
                          setShowReasonModal(true);
                        }}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                          selectedRecycler.businessActive
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-green-500 hover:bg-green-600 text-white'
                        }`}
                      >
                        {selectedRecycler.businessActive ? 'Disable Partner' : 'Enable Partner'}
                      </button>
                    </div>
                    
                    {/* Warning Message */}
                    <div className={`p-4 rounded-xl border-2 ${
                      selectedRecycler.businessActive 
                        ? 'bg-yellow-50 border-yellow-300' 
                        : 'bg-red-50 border-red-300'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selectedRecycler.businessActive 
                            ? 'bg-yellow-400' 
                            : 'bg-red-400'
                        }`}>
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div>
                          <p className={`text-sm font-bold mb-1 ${
                            selectedRecycler.businessActive 
                              ? 'text-yellow-800' 
                              : 'text-red-800'
                          }`}>
                            {selectedRecycler.businessActive 
                              ? 'Warning: Disabling this partner' 
                              : 'Partner Account Disabled'}
                          </p>
                          <p className={`text-xs ${
                            selectedRecycler.businessActive 
                              ? 'text-yellow-700' 
                              : 'text-red-700'
                          }`}>
                            {selectedRecycler.businessActive 
                              ? 'Disabling will immediately prevent them from logging in. They cannot access orders, devices, or any system features. Use this action if the partner violates policies or requires suspension.'
                              : 'This partner cannot login or access the system. Orders and business operations are paused. Enable the account to restore access.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Logo Section */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Upload className="w-5 h-5 text-gray-600" />
                    Company Logo
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Building2 className="w-12 h-12 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Upload Logo</p>
                      <p className="text-xs text-gray-400 mt-1">Recommended: 200x200px, PNG or JPG</p>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-2 block">Company Name</label>
                      <input
                        type="text"
                        value={selectedRecycler.companyName}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-2 block flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={selectedRecycler.email}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-2 block flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={selectedRecycler.phone}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-600 mb-2 block flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Business Address
                      </label>
                      <input
                        type="text"
                        value={selectedRecycler.address}
                        readOnly
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Company Description */}
                <div className="bg-white rounded-2xl p-6 border-2 border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Company Description</h3>
                  <textarea
                    value={selectedRecycler.description}
                    readOnly
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">{selectedRecycler.description.length} characters</p>
                </div>

                {/* Unique Selling Points */}
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Unique Selling Points</h3>
                  <p className="text-sm text-gray-600 mb-4">What makes your business stand out? (3 key points)</p>
                  <div className="space-y-3">
                    {selectedRecycler.sellingPoints.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                          <span className="text-white font-bold text-sm">{index + 1}</span>
                        </div>
                        <input
                          type="text"
                          value={point}
                          readOnly
                          className="flex-1 px-4 py-3 bg-white border-2 border-amber-200 rounded-xl text-gray-800 font-semibold"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Performance Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <p className="text-2xl font-bold text-gray-800">{selectedRecycler.rating}</p>
                        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Customers</p>
                      <p className="text-2xl font-bold text-gray-800">{selectedRecycler.totalCustomers}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Devices</p>
                      <p className="text-2xl font-bold text-gray-800">{selectedRecycler.totalDevicesPurchased}</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                      <p className="text-xs text-gray-600 mb-1">Growth</p>
                      <p className={`text-2xl font-bold ${selectedRecycler.growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {selectedRecycler.growthRate > 0 ? '+' : ''}{selectedRecycler.growthRate}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-12 py-4 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0d6a0d] text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && recyclerMetrics.length > 0 && pagination.pages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              totalItems={pagination.total}
              itemsPerPage={pagination.limit}
              onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
            />
          </div>
        )}
        </>
        )}
      </main>

      {/* Reason Input Modal */}
      {showReasonModal && selectedRecycler && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full animate-in slide-in-from-bottom-4 duration-300">
            {/* Modal Header */}
            <div className={`px-8 py-6 rounded-t-3xl ${actionType === 'disable' ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-green-600'}`}>
              <h2 className="text-2xl font-bold text-white">
                {actionType === 'disable' ? 'Disable Partner Account' : 'Enable Partner Account'}
              </h2>
              <p className="text-sm text-white/90 mt-1">
                {actionType === 'disable' 
                  ? 'This will prevent the partner from logging in'
                  : 'This will allow the partner to access the system again'}
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  <strong>Partner:</strong> {selectedRecycler.companyName}
                </p>
                <p className="text-gray-700 mb-4">
                  <strong>Email:</strong> {selectedRecycler.email}
                </p>
                <p className="text-sm text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
                  ⚠️ An email will be sent to the partner with your reason
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={actionType === 'disable' 
                    ? 'e.g., Policy violation, suspicious activity, requested by partner...'
                    : 'e.g., Issue resolved, verification complete, appeal approved...'}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500 mt-1">{reason.length}/500 characters</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowReasonModal(false);
                    setReason('');
                  }}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-xl transition-all"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusChange}
                  disabled={!reason.trim() || submitting}
                  className={`flex-1 px-6 py-3 font-bold rounded-xl transition-all ${
                    actionType === 'disable'
                      ? 'bg-red-500 hover:bg-red-600 text-white disabled:bg-red-300'
                      : 'bg-green-500 hover:bg-green-600 text-white disabled:bg-green-300'
                  } disabled:cursor-not-allowed`}
                >
                  {submitting ? 'Processing...' : actionType === 'disable' ? 'Disable Partner' : 'Enable Partner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default RecyclerMetrics;
