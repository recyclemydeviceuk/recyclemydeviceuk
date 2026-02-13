import React, { useState } from 'react';
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

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock recycler metrics data
  const recyclerMetrics: RecyclerMetric[] = [
    {
      id: '1',
      companyName: 'PhoneReborn Industries',
      contactPerson: 'Jessica Lee',
      status: 'active',
      totalCustomers: 145,
      totalDevicesPurchased: 287,
      totalSpent: 42580,
      averageDevicePrice: 148.36,
      lastPurchaseDate: '2026-02-10',
      growthRate: 15.5,
      rating: 4.8,
      topBrands: ['Apple', 'Samsung', 'Google'],
      businessStatus: 'Currently accepting new orders',
      businessActive: true,
      email: 'contact@phonereborn.com',
      phone: '+44 20 7946 0123',
      address: '128 Tech Park, London, W1T 2AB, United Kingdom',
      description: 'Premier electronics recycling partner with 10+ years of experience in sustainable device management and refurbishment services.',
      sellingPoints: [
        'ISO Certified Recycling Process',
        'Free Collection Nationwide',
        '24-Hour Payment Guarantee'
      ]
    },
    {
      id: '2',
      companyName: 'EcoTech Recyclers Ltd',
      contactPerson: 'Robert Johnson',
      status: 'active',
      totalCustomers: 98,
      totalDevicesPurchased: 176,
      totalSpent: 28940,
      averageDevicePrice: 164.43,
      lastPurchaseDate: '2026-02-09',
      growthRate: 8.2,
      rating: 4.6,
      topBrands: ['Apple', 'Microsoft', 'HP'],
      businessStatus: 'Currently accepting new orders',
      businessActive: true,
      email: 'contact@ecotech-recyclers.com',
      phone: '+44 20 7946 0958',
      address: '45 Green Street, London, E1 7LB, United Kingdom',
      description: 'Leading sustainable electronics recycling partner committed to environmental responsibility and data security. We specialize in responsible device refurbishment and recycling.',
      sellingPoints: [
        'Certified Data Destruction & Security',
        'Same-Day Device Collection Service',
        'Competitive Pricing & Fast Payments'
      ]
    },
    {
      id: '3',
      companyName: 'GreenTech Solutions',
      contactPerson: 'Sarah Martinez',
      status: 'active',
      totalCustomers: 124,
      totalDevicesPurchased: 215,
      totalSpent: 35670,
      averageDevicePrice: 165.91,
      lastPurchaseDate: '2026-02-11',
      growthRate: 22.3,
      rating: 4.9,
      topBrands: ['Samsung', 'Google', 'OnePlus'],
      businessStatus: 'Currently accepting new orders',
      businessActive: true,
      email: 'hello@greentech-solutions.co.uk',
      phone: '+44 20 7946 0755',
      address: '89 Innovation Way, Birmingham, B3 2JH, United Kingdom',
      description: 'Award-winning electronics recycling company specializing in sustainable practices and community engagement programs.',
      sellingPoints: [
        'Carbon-Neutral Operations',
        'Community Recycling Programs',
        'Premium Device Valuations'
      ]
    },
    {
      id: '4',
      companyName: 'CircularTech Partners',
      contactPerson: 'Michael Chen',
      status: 'active',
      totalCustomers: 89,
      totalDevicesPurchased: 142,
      totalSpent: 23180,
      averageDevicePrice: 163.24,
      lastPurchaseDate: '2026-02-08',
      growthRate: 5.7,
      rating: 4.5,
      topBrands: ['Apple', 'Samsung', 'Huawei'],
      businessStatus: 'Currently accepting new orders',
      businessActive: true,
      email: 'info@circulartech.com',
      phone: '+44 161 850 4321',
      address: '56 Circular Economy Blvd, Manchester, M2 5DB, United Kingdom',
      description: 'Innovative circular economy specialists focused on device lifecycle management and sustainable technology solutions.',
      sellingPoints: [
        'Extended Warranty Options',
        'Corporate Recycling Programs',
        'Transparent Pricing Model'
      ]
    },
    {
      id: '5',
      companyName: 'Renewal Electronics',
      contactPerson: 'Emma Wilson',
      status: 'active',
      totalCustomers: 67,
      totalDevicesPurchased: 98,
      totalSpent: 16240,
      averageDevicePrice: 165.71,
      lastPurchaseDate: '2026-02-07',
      growthRate: -3.4,
      rating: 4.3,
      topBrands: ['Apple', 'Dell', 'Lenovo'],
      businessStatus: 'Currently accepting new orders',
      businessActive: true,
      email: 'contact@renewal-electronics.co.uk',
      phone: '+44 113 496 0234',
      address: '22 Renewal Street, Leeds, LS1 4AP, United Kingdom',
      description: 'Trusted electronics partner with focus on computer and laptop recycling. Family-owned business serving customers since 2015.',
      sellingPoints: [
        'Laptop Recycling Specialists',
        'Free Postal Service',
        'Same-Week Payments'
      ]
    },
    {
      id: '6',
      companyName: 'Urban Recycle Hub',
      contactPerson: 'David Thompson',
      status: 'inactive',
      totalCustomers: 45,
      totalDevicesPurchased: 72,
      totalSpent: 9860,
      averageDevicePrice: 136.94,
      lastPurchaseDate: '2026-01-15',
      growthRate: -12.5,
      rating: 3.9,
      topBrands: ['Samsung', 'Huawei', 'Xiaomi'],
      businessStatus: 'Temporarily not accepting orders',
      businessActive: false,
      email: 'support@urbanrecyclehub.com',
      phone: '+44 20 7946 0666',
      address: '78 Urban Plaza, Bristol, BS1 5NF, United Kingdom',
      description: 'Urban-focused recycling service currently undergoing facility upgrades. Will resume operations shortly.',
      sellingPoints: [
        'Local Community Focus',
        'Budget-Friendly Options',
        'Flexible Collection Times'
      ]
    },
  ];

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

  const filteredMetrics = recyclerMetrics.filter(metric => {
    const matchesSearch = 
      metric.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      metric.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || metric.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate aggregate stats
  const totalCustomers = recyclerMetrics.reduce((sum, m) => sum + m.totalCustomers, 0);
  const totalDevices = recyclerMetrics.reduce((sum, m) => sum + m.totalDevicesPurchased, 0);
  const totalRevenue = recyclerMetrics.reduce((sum, m) => sum + m.totalSpent, 0);
  const averagePrice = totalRevenue / totalDevices;
  const activeRecyclers = recyclerMetrics.filter(m => m.status === 'active').length;

  const avgRating = recyclerMetrics.reduce((sum, m) => sum + m.rating, 0) / recyclerMetrics.length;

  // Find top performer
  const topPerformer = recyclerMetrics.reduce((prev, current) => 
    prev.totalSpent > current.totalSpent ? prev : current
  );

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
                  <p className="text-3xl font-bold text-white">£{totalRevenue.toLocaleString()}</p>
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
                  <p className="text-3xl font-bold text-white">£{averagePrice.toFixed(0)}</p>
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
                        <p className="text-xl font-bold text-gray-800">£{(metric.totalSpent / 1000).toFixed(0)}k</p>
                      </div>

                      <div className="bg-orange-50/80 rounded-2xl p-3 border border-orange-100">
                        <div className="flex items-center gap-1.5 mb-1">
                          <Award className="w-3.5 h-3.5 text-orange-600" />
                          <p className="text-[10px] font-semibold text-orange-600 uppercase tracking-wide">Rating</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <p className="text-xl font-bold text-gray-800">{metric.rating}</p>
                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
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
        </main>

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
                          // TODO: Add confirmation dialog and API call
                          alert(selectedRecycler.businessActive 
                            ? `Are you sure you want to DISABLE ${selectedRecycler.companyName}? They will not be able to login.`
                            : `Enable ${selectedRecycler.companyName}? They will be able to login again.`
                          );
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
      </div>
    </div>
  );
};

export default RecyclerMetrics;
