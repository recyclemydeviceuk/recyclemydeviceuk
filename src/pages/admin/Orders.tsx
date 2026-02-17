import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Search, Download, Eye, Trash2, LogOut } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deviceId?: {
    _id: string;
    name: string;
  };
  recyclerId?: {
    _id: string;
    companyName: string;
    email?: string;
  };
  deviceCondition: string;
  storage?: string;
  amount: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  counterOffer?: {
    _id: string;
    status: string;
    amendedPrice: number;
    originalPrice: number;
    createdAt: string;
  };
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    revenue: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch statuses on mount
  useEffect(() => {
    fetchStatuses();
  }, []);

  // Fetch orders when filters or page change
  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter, debouncedSearch, pagination.page]);

  const fetchStatuses = async () => {
    try {
      const [orderStatusRes, paymentStatusRes]: any[] = await Promise.all([
        adminAPI.utilities.getOrderStatuses(),
        adminAPI.utilities.getPaymentStatuses()
      ]);

      if (orderStatusRes.success) {
        setOrderStatuses(orderStatusRes.data);
      }
      if (paymentStatusRes.success) {
        setPaymentStatuses(paymentStatusRes.data);
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
      // Set default statuses as fallback
      setOrderStatuses([
        { name: 'pending', label: 'Pending' },
        { name: 'confirmed', label: 'Confirmed' },
        { name: 'collected', label: 'Collected' },
        { name: 'completed', label: 'Completed' },
        { name: 'cancelled', label: 'Cancelled' }
      ]);
      setPaymentStatuses([
        { name: 'pending', label: 'Pending' },
        { name: 'paid', label: 'Paid' },
        { name: 'failed', label: 'Failed' }
      ]);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const response: any = await adminAPI.orders.getAll(params);
      
      if (response.success) {
        setOrders(response.data);
        
        // Use backend stats (total revenue from all completed+paid orders)
        if (response.stats) {
          setStats({
            total: response.stats.totalOrders,
            pending: response.stats.pendingOrders,
            revenue: response.stats.totalRevenue
          });
        }
        
        // Update pagination
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response: any = await adminAPI.orders.exportOrders();
      if (response.success) {
        // Convert to CSV and download
        const csvContent = convertToCSV(response.data);
        downloadCSV(csvContent, `orders-${new Date().toISOString().split('T')[0]}.csv`);
      }
    } catch (error) {
      console.error('Error exporting orders:', error);
      alert('Failed to export orders');
    }
  };

  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    try {
      await adminAPI.orders.delete(id);
      fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order._id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleBulkUpdate = async () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order');
      return;
    }
    if (!bulkStatus) {
      alert('Please select a status');
      return;
    }
    if (!confirm(`Update ${selectedOrders.length} orders to "${bulkStatus}"?`)) return;

    setIsBulkUpdating(true);
    try {
      const response: any = await adminAPI.orders.bulkUpdate(selectedOrders, bulkStatus);
      if (response.success) {
        alert(`${response.modifiedCount} orders updated successfully`);
        setSelectedOrders([]);
        setBulkStatus('');
        fetchOrders();
      }
    } catch (error: any) {
      console.error('Bulk update error:', error);
      alert(error.response?.data?.message || 'Failed to update orders');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminToken');
    navigate('/panel/login');
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      collected: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPaymentColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-700',
      paid: 'bg-green-100 text-green-700',
      failed: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getCounterOfferColor = (status: string) => {
    const colors: any = {
      pending: 'bg-amber-100 text-amber-700 border-amber-300',
      accepted: 'bg-green-100 text-green-700 border-green-300',
      declined: 'bg-red-100 text-red-700 border-red-300',
      expired: 'bg-gray-100 text-gray-700 border-gray-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getCounterOfferLabel = (status: string) => {
    const labels: any = {
      pending: '⏳ Waiting',
      accepted: '✓ Accepted',
      declined: '✗ Declined',
      expired: 'Expired',
    };
    return labels[status] || status;
  };

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
                <p className="text-sm text-gray-600 mt-1">Manage orders and transactions</p>
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
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-[#1b981b]" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Pending Orders</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Package className="w-7 h-7 text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">£{Math.floor(stats.revenue).toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#1b981b]">£</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bulk Actions Toolbar */}
          {selectedOrders.length > 0 && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-6 shadow-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{selectedOrders.length}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'} selected</p>
                    <p className="text-xs text-gray-600">Choose an action below</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-medium"
                  >
                    <option value="">Select Status</option>
                    {orderStatuses.map((status) => (
                      <option key={status.name} value={status.name}>
                        {status.label || status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleBulkUpdate}
                    disabled={!bulkStatus || isBulkUpdating}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm whitespace-nowrap"
                  >
                    {isBulkUpdating ? 'Updating...' : 'Update Status'}
                  </button>
                  <button
                    onClick={() => setSelectedOrders([])}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order number, customer name, email, or device..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent bg-white min-w-[160px]"
              >
                <option value="all">All Status</option>
                {orderStatuses.map((status) => (
                  <option key={status.name} value={status.name}>
                    {status.label || status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                  </option>
                ))}
              </select>

              {/* Payment Filter */}
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent bg-white min-w-[180px]"
              >
                <option value="all">Payment Status</option>
                {paymentStatuses.map((status) => (
                  <option key={status.name} value={status.name}>
                    {status.label || status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                  </option>
                ))}
              </select>

              {/* Export Button */}
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b-2 border-gray-200">
              <p className="text-sm text-gray-600">Showing <span className="font-semibold text-gray-900">{orders.length}</span> of <span className="font-semibold text-gray-900">{stats.total}</span> orders</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No orders found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left">
                        <input
                          type="checkbox"
                          checked={selectedOrders.length === orders.length && orders.length > 0}
                          onChange={handleSelectAll}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Device</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Recycler</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Offer Price</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Counter Offer</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y-2 divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedOrders.includes(order._id)}
                            onChange={() => handleSelectOrder(order._id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-[#1b981b]">{order.orderNumber}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">{order.customerName}</div>
                            <div className="text-gray-500">{order.customerEmail}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="font-semibold text-gray-900">{order.deviceId?.name || 'N/A'}</div>
                            <div className="text-gray-500">{order.deviceCondition} {order.storage && `| ${order.storage}`}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900">{order.recyclerId?.companyName || 'Not Assigned'}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-bold text-[#1b981b]">£{Math.floor(order.amount)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentColor(order.paymentStatus)}`}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {order.counterOffer ? (
                            <div className="flex flex-col gap-1">
                              <span className={`px-3 py-1 rounded-lg text-xs font-semibold border-2 ${getCounterOfferColor(order.counterOffer.status)}`}>
                                {getCounterOfferLabel(order.counterOffer.status)}
                              </span>
                              <span className="text-xs text-gray-500">
                                £{order.counterOffer.amendedPrice.toFixed(2)}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/panel/orders/${order._id}`)}
                              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </button>
                            <button
                              onClick={() => handleDelete(order._id)}
                              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && orders.length > 0 && pagination.pages > 1 && (
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
        </main>
      </div>
    </div>
  );
};

export default Orders;
