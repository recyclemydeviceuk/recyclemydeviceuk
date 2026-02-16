import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Filter, Eye, Trash2, LogOut, Download, Package } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  device: string;
  condition: string;
  offerPrice: number;
  recycler: string;
  status: 'pending' | 'confirmed' | 'collected' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  address: string;
}

const OrdersList: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('All');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock orders data
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2026-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@email.com',
      customerPhone: '+44 7700 900123',
      device: 'iPhone 15 Pro Max',
      condition: 'Excellent',
      offerPrice: 750,
      recycler: 'GreenTech Recyclers',
      status: 'confirmed',
      paymentStatus: 'paid',
      createdAt: '2026-02-10',
      address: '123 High Street, London, UK'
    },
    {
      id: '2',
      orderNumber: 'ORD-2026-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+44 7700 900124',
      device: 'Samsung Galaxy S24 Ultra',
      condition: 'Good',
      offerPrice: 620,
      recycler: 'EcoMobile Solutions',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: '2026-02-11',
      address: '456 Park Lane, Manchester, UK'
    },
    {
      id: '3',
      orderNumber: 'ORD-2026-003',
      customerName: 'Michael Brown',
      customerEmail: 'michael.b@email.com',
      customerPhone: '+44 7700 900125',
      device: 'iPhone 14 Pro',
      condition: 'Fair',
      offerPrice: 420,
      recycler: 'TechRecycle UK',
      status: 'collected',
      paymentStatus: 'paid',
      createdAt: '2026-02-09',
      address: '789 Queen Road, Birmingham, UK'
    },
    {
      id: '4',
      orderNumber: 'ORD-2026-004',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.w@email.com',
      customerPhone: '+44 7700 900126',
      device: 'iPhone 16 Pro',
      condition: 'Excellent',
      offerPrice: 680,
      recycler: 'Mobile Refresh',
      status: 'completed',
      paymentStatus: 'paid',
      createdAt: '2026-02-08',
      address: '321 King Street, Leeds, UK'
    },
    {
      id: '5',
      orderNumber: 'ORD-2026-005',
      customerName: 'David Taylor',
      customerEmail: 'david.t@email.com',
      customerPhone: '+44 7700 900127',
      device: 'Galaxy S23',
      condition: 'Poor',
      offerPrice: 280,
      recycler: 'CircularTech',
      status: 'cancelled',
      paymentStatus: 'failed',
      createdAt: '2026-02-07',
      address: '654 George Street, Glasgow, UK'
    },
  ];

  const statuses = ['All', 'pending', 'confirmed', 'collected', 'completed', 'cancelled'];
  const paymentStatuses = ['All', 'pending', 'paid', 'failed'];

  const filteredOrders = orders
    .filter(order => selectedStatus === 'All' || order.status === selectedStatus)
    .filter(order => selectedPaymentStatus === 'All' || order.paymentStatus === selectedPaymentStatus)
    .filter(order =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.device.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-700 border-blue-300',
      collected: 'bg-purple-100 text-purple-700 border-purple-300',
      completed: 'bg-green-100 text-green-700 border-green-300',
      cancelled: 'bg-red-100 text-red-700 border-red-300',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'paid')
    .reduce((sum, o) => sum + o.offerPrice, 0);

  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
                <p className="text-sm text-gray-600 mt-1">Manage all orders and transactions</p>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-gray-800">£{Math.floor(totalRevenue).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <div className="text-white font-bold text-lg">£</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order number, customer name, email, or device..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status === 'All' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Status Filter */}
                <select
                  value={selectedPaymentStatus}
                  onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                >
                  {paymentStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'Payment Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Export Button */}
                <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap">
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of <span className="font-semibold text-gray-900">{orders.length}</span> orders
              </p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Order Info */}
                    <div className="flex-1 space-y-3">
                      {/* Order Number and Status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{order.orderNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </span>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-gray-500">Customer</p>
                          <p className="font-semibold text-gray-900">{order.customerName}</p>
                          <p className="text-gray-600">{order.customerEmail}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Device</p>
                          <p className="font-semibold text-gray-900">{order.device}</p>
                          <p className="text-gray-600">Condition: {order.condition}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Recycler</p>
                          <p className="font-semibold text-gray-900">{order.recycler}</p>
                          <p className="text-gray-600">{order.createdAt}</p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center gap-6 lg:border-l-2 lg:pl-6 border-gray-200">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Offer Price</p>
                        <p className="text-2xl font-bold text-[#1b981b]">£{Math.round(order.offerPrice)}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(`/panel/orders/${order.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrdersList;
