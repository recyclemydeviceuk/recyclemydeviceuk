import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  LogOut,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  XCircle,
  Package,
  Truck,
  CreditCard,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  Download,
  TrendingUp,
  AlertCircle,
  Phone,
  Check
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

interface OrderDevice {
  name: string;
  storage: string;
  condition: string;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  devices: OrderDevice[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'pending' | 'failed';
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  orderNotes?: string;
  expanded: boolean;
}

const RecyclerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerName: 'John Smith',
      customerEmail: 'john.smith@example.com',
      customerPhone: '+44 7700 900123',
      devices: [
        { name: 'iPhone 15 Pro Max', storage: '256GB', condition: 'Like New', price: 850 },
        { name: 'iPhone 14 Pro', storage: '128GB', condition: 'Good', price: 650 }
      ],
      totalAmount: 1500,
      status: 'completed',
      paymentStatus: 'paid',
      orderDate: '2024-02-10',
      deliveryDate: '2024-02-12',
      shippingAddress: '123 High Street, London, SW1A 1AA',
      orderNotes: 'Please handle with care - device has minor scratches on back',
      expanded: false
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      customerPhone: '+44 7700 900456',
      devices: [
        { name: 'Galaxy S24 Ultra', storage: '512GB', condition: 'Like New', price: 920 }
      ],
      totalAmount: 920,
      status: 'processing',
      paymentStatus: 'paid',
      orderDate: '2024-02-11',
      shippingAddress: '456 Oxford Road, Manchester, M1 2AB',
      orderNotes: 'Original box and all accessories included',
      expanded: false
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerName: 'Michael Brown',
      customerEmail: 'mbrown@example.com',
      customerPhone: '+44 7700 900789',
      devices: [
        { name: 'Pixel 8 Pro', storage: '256GB', condition: 'Good', price: 550 }
      ],
      totalAmount: 550,
      status: 'pending',
      paymentStatus: 'pending',
      orderDate: '2024-02-12',
      shippingAddress: '789 King Street, Edinburgh, EH1 3YJ',
      orderNotes: '',
      expanded: false
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      customerName: 'Emma Wilson',
      customerEmail: 'emma.wilson@example.com',
      customerPhone: '+44 7700 900321',
      devices: [
        { name: 'iPhone 15 Pro', storage: '512GB', condition: 'Like New', price: 780 },
        { name: 'OnePlus 12', storage: '256GB', condition: 'Fair', price: 420 }
      ],
      totalAmount: 1200,
      status: 'completed',
      paymentStatus: 'paid',
      orderDate: '2024-02-09',
      deliveryDate: '2024-02-11',
      shippingAddress: '321 Queen Street, Birmingham, B1 2ND',
      expanded: false
    },
    {
      id: '5',
      orderNumber: 'ORD-2024-005',
      customerName: 'James Taylor',
      customerEmail: 'jtaylor@example.com',
      customerPhone: '+44 7700 900654',
      devices: [
        { name: 'Galaxy S23 Ultra', storage: '256GB', condition: 'Good', price: 680 }
      ],
      totalAmount: 680,
      status: 'cancelled',
      paymentStatus: 'failed',
      orderDate: '2024-02-08',
      shippingAddress: '654 Prince Street, Leeds, LS1 4HY',
      expanded: false
    }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuth');
    localStorage.removeItem('recyclerEmail');
    navigate('/recycler/login');
  };

  const handleToggleExpand = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, expanded: !order.expanded } : order
    ));
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: 'pending' | 'processing' | 'completed' | 'cancelled') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    setSuccessMessage(`Order status updated to ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleUpdatePaymentStatus = (orderId: string, newPaymentStatus: 'paid' | 'pending' | 'failed') => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, paymentStatus: newPaymentStatus } : order
    ));
    setSuccessMessage(`Payment status updated to ${newPaymentStatus.charAt(0).toUpperCase() + newPaymentStatus.slice(1)}`);
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      cancelled: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200'
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      processing: <Truck className="w-3 h-3" />,
      completed: <CheckCircle2 className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    const styles = {
      paid: 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200',
      pending: 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200',
      failed: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200'
    };

    const icons = {
      paid: <CheckCircle2 className="w-3 h-3" />,
      pending: <AlertCircle className="w-3 h-3" />,
      failed: <XCircle className="w-3 h-3" />
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${styles[paymentStatus as keyof typeof styles]}`}>
        {icons[paymentStatus as keyof typeof icons]}
        {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
      </span>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalRevenue: orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0)
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
                      <ShoppingBag className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Orders</h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                      Manage all your device purchase orders
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
          <div className="max-w-7xl mx-auto">
            {/* Success Alert */}
            {showSuccessAlert && (
              <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-bold">{successMessage}</p>
                </div>
              </div>
            )}
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Orders</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">{stats.total}</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-md">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Pending</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-500 bg-clip-text text-transparent">{stats.pending}</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                      <Truck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Processing</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">{stats.processing}</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1b981b]/20 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Completed</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent">{stats.completed}</p>
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-[#1b981b]/5 to-[#157a15]/5 rounded-2xl shadow-lg border-2 border-[#1b981b]/30 p-5">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#1b981b]/30 to-transparent rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-md">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent">£{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-gradient-to-r from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#1b981b]/10 to-[#157a15]/10 rounded-xl flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#1b981b]" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by order number, customer name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm hover:shadow-md"
                  />
                </div>
                <div className="relative w-full lg:w-48">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                    <Filter className="w-4 h-4 text-blue-600" />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full pl-16 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-semibold appearance-none cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="relative w-full lg:w-48">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="w-full pl-16 pr-10 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-semibold appearance-none cursor-pointer shadow-sm hover:shadow-md"
                  >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-5">
              {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
                </div>
              ) : (
                filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 rounded-3xl border-2 border-gray-200 transition-all duration-300 hover:shadow-2xl hover:border-gray-300"
                  >
                    {/* Order Header */}
                    <div className="relative z-10 p-6">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-lg">
                              <ShoppingBag className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{order.orderNumber}</h3>
                              <p className="text-sm text-gray-500 flex items-center gap-2">
                                <Calendar className="w-3 h-3" />
                                {new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-start gap-2">
                              <User className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Customer</p>
                                <p className="text-sm font-bold text-gray-800">{order.customerName}</p>
                                <p className="text-xs text-gray-500">{order.customerEmail}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <Package className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Devices</p>
                                <p className="text-sm font-bold text-gray-800">{order.devices.length} Device{order.devices.length > 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <CreditCard className="w-4 h-4 text-gray-400 mt-0.5" />
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Total Amount</p>
                                <p className="text-lg font-bold bg-gradient-to-r from-[#1b981b] to-[#157a15] bg-clip-text text-transparent">
                                  £{order.totalAmount.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status)}
                            {getPaymentBadge(order.paymentStatus)}
                          </div>
                          <button
                            onClick={() => handleToggleExpand(order.id)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#1b981b]/10 to-[#157a15]/10 hover:from-[#1b981b]/20 hover:to-[#157a15]/20 text-[#1b981b] rounded-xl font-bold transition-all text-sm border border-[#1b981b]/30 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          >
                            <Eye className="w-4 h-4" />
                            <span>{order.expanded ? 'Hide' : 'View'} Details</span>
                            {order.expanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Order Details (Expanded) */}
                    {order.expanded && (
                      <div className="relative z-10 px-6 pb-6 border-t-2 border-gray-200 pt-6 bg-gradient-to-b from-gray-50/50 to-white animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Devices List */}
                          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-md">
                            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                              <div className="w-2 h-2 bg-[#1b981b] rounded-full"></div>
                              Devices Ordered
                            </h4>
                            <div className="space-y-3">
                              {order.devices.map((device, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                  <div className="flex-1">
                                    <p className="font-bold text-gray-800">{device.name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {device.storage} • {device.condition}
                                    </p>
                                  </div>
                                  <p className="text-lg font-bold text-[#1b981b]">£{device.price.toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Shipping & Contact Info */}
                          <div className="space-y-4">
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-md">
                              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                Contact Information
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <User className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-400">@</span>
                                  <span className="text-gray-700">{order.customerEmail}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <Phone className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-700">{order.customerPhone}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-md">
                              <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                Shipping Address
                              </h4>
                              <p className="text-sm text-gray-700 leading-relaxed">{order.shippingAddress}</p>
                              {order.deliveryDate && (
                                <div className="mt-3 pt-3 border-t border-gray-200">
                                  <p className="text-xs text-gray-500">Delivered on</p>
                                  <p className="text-sm font-bold text-[#1b981b]">
                                    {new Date(order.deliveryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Order Notes */}
                            {order.orderNotes && (
                              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200 shadow-md">
                                <h4 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide flex items-center gap-2">
                                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                                  Order Notes
                                </h4>
                                <p className="text-sm text-gray-700 leading-relaxed italic">"{order.orderNotes}"</p>
                              </div>
                            )}

                            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                              <Download className="w-4 h-4" />
                              Download Invoice
                            </button>
                          </div>
                        </div>

                        {/* Order & Payment Status Management */}
                        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Order Status Management */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                              <Truck className="w-5 h-5 text-blue-600" />
                              Manage Order Status
                            </h4>
                            <div className="space-y-2">
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                                disabled={order.status === 'pending'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.status === 'pending'
                                    ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:border-yellow-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Pending
                                </span>
                                {order.status === 'pending' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'processing')}
                                disabled={order.status === 'processing'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.status === 'processing'
                                    ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <Truck className="w-4 h-4" />
                                  Processing
                                </span>
                                {order.status === 'processing' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                                disabled={order.status === 'completed'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.status === 'completed'
                                    ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-green-50 text-green-700 border-2 border-green-200 hover:border-green-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Completed
                                </span>
                                {order.status === 'completed' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                disabled={order.status === 'cancelled'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.status === 'cancelled'
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Cancelled
                                </span>
                                {order.status === 'cancelled' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                            </div>
                          </div>

                          {/* Payment Status Management */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-purple-600" />
                              Manage Payment Status
                            </h4>
                            <div className="space-y-2">
                              <button
                                onClick={() => handleUpdatePaymentStatus(order.id, 'paid')}
                                disabled={order.paymentStatus === 'paid'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.paymentStatus === 'paid'
                                    ? 'bg-gradient-to-r from-green-100 to-emerald-200 text-green-800 border-2 border-green-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-green-50 text-green-700 border-2 border-green-200 hover:border-green-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Paid
                                </span>
                                {order.paymentStatus === 'paid' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                              <button
                                onClick={() => handleUpdatePaymentStatus(order.id, 'pending')}
                                disabled={order.paymentStatus === 'pending'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.paymentStatus === 'pending'
                                    ? 'bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-2 border-orange-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-orange-50 text-orange-700 border-2 border-orange-200 hover:border-orange-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  Pending
                                </span>
                                {order.paymentStatus === 'pending' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                              <button
                                onClick={() => handleUpdatePaymentStatus(order.id, 'failed')}
                                disabled={order.paymentStatus === 'failed'}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                                  order.paymentStatus === 'failed'
                                    ? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300 cursor-not-allowed'
                                    : 'bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300 hover:shadow-md transform hover:-translate-y-0.5'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <XCircle className="w-4 h-4" />
                                  Failed
                                </span>
                                {order.paymentStatus === 'failed' && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                              </button>
                            </div>
                            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-purple-200">
                              <p className="text-xs text-gray-600 leading-relaxed">
                                <strong>Note:</strong> Payment status changes are reflected immediately and can affect revenue calculations.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerOrders;
