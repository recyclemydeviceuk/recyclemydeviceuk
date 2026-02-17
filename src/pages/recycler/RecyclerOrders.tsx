import React, { useState, useEffect } from 'react';
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
import CounterOfferModal from '../../components/recycler/CounterOfferModal';
import { recyclerAPI } from '../../services/api';
import recyclerAuthService from '../../services/recyclerAuth';

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
  status: string; // Dynamic from backend
  paymentStatus: string; // Dynamic from backend
  orderDate: string;
  deliveryDate?: string;
  shippingAddress: string;
  orderNotes?: string;
  expanded: boolean;
  counterOffer?: {
    _id: string;
    status: string;
    amendedPrice: number;
    originalPrice: number;
    reason: string;
    createdAt: string;
    respondedAt?: string;
  };
}

const RecyclerOrders: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [orders, setOrders] = useState<Order[]>([]);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [counterOfferModal, setCounterOfferModal] = useState<{
    isOpen: boolean;
    order: any | null;
  }>({
    isOpen: false,
    order: null,
  });
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    fetchStatuses();
    fetchOrders();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, paymentFilter, currentPage]);

  const fetchStatuses = async () => {
    try {
      const [orderStatusRes, paymentStatusRes] = await Promise.all([
        recyclerAPI.orders.getOrderStatuses(),
        recyclerAPI.orders.getPaymentStatuses(),
      ]);

      if (orderStatusRes?.data) {
        setOrderStatuses(orderStatusRes.data);
      }

      if (paymentStatusRes?.data) {
        setPaymentStatuses(paymentStatusRes.data);
      }
    } catch (error: any) {
      console.error('Error fetching statuses:', error);
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: any = {
        page: currentPage,
        limit: 10
      };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;
      
      const response = await recyclerAPI.orders.getAll(params);
      
      if (response?.data) {
        const ordersData = Array.isArray(response.data) ? response.data : response.data.orders || [];
        
        // Transform backend data to match frontend interface
        const transformedOrders = ordersData.map((order: any) => ({
          id: order._id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          devices: order.deviceDetails || [{
            name: order.deviceName || 'N/A',
            storage: order.storage || 'N/A',
            condition: order.deviceCondition || 'N/A',
            price: order.amount || 0
          }],
          totalAmount: order.amount || 0,
          status: order.status,
          paymentStatus: order.paymentStatus,
          orderDate: order.createdAt,
          deliveryDate: order.deliveryDate,
          shippingAddress: order.shippingAddress || `${order.address || ''}, ${order.city || ''}, ${order.postcode || ''}`.trim().replace(/^,\s*/, '').replace(/,\s*$/, '') || 'N/A',
          orderNotes: order.orderNotes || order.deviceNotes || '',
          expanded: false,
          counterOffer: order.counterOffer
        }));
        setOrders(transformedOrders);
        
        // Set pagination data
        const total = (response as any).pagination?.total || (response as any).total || transformedOrders.length;
        setTotalOrders(total);
        setTotalPages(Math.ceil(total / 10));
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      setError(error.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
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
      const response: any = await recyclerAPI.orders.bulkUpdate(selectedOrders, bulkStatus);
      if (response.success) {
        setSuccessMessage(`${response.modifiedCount} orders updated successfully`);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
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

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try {
      await recyclerAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/recycler/login');
    }
  };

  const handleToggleExpand = (orderId: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, expanded: !order.expanded } : order
    ));
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await recyclerAPI.orders.updateStatus(orderId, newStatus);
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      const statusName = newStatus ? newStatus.charAt(0).toUpperCase() + newStatus.slice(1) : 'Unknown';
      setSuccessMessage(`Order status updated to ${statusName}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      setSuccessMessage(`Failed to update order status: ${error.message}`);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    }
  };


  const handleDownloadInvoice = (order: Order) => {
    // Create invoice HTML
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #1b981b; padding-bottom: 20px; }
          .header h1 { color: #1b981b; margin: 0; font-size: 32px; }
          .header p { margin: 5px 0; color: #666; }
          .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: bold; color: #1b981b; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
          .info-row { margin: 5px 0; }
          .info-label { font-weight: 600; display: inline-block; width: 120px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #1b981b; color: white; padding: 12px; text-align: left; }
          td { padding: 10px; border-bottom: 1px solid #ddd; }
          .total-row { font-weight: bold; font-size: 18px; background: #f0f0f0; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; color: #666; font-size: 12px; }
          .status-badge { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
          .status-paid { background: #d4edda; color: #155724; }
          .status-pending { background: #fff3cd; color: #856404; }
          .status-completed { background: #d4edda; color: #155724; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>RECYCLE MY DEVICE</h1>
          <p>Device Recycling & Purchase</p>
          <p>www.recyclemydevice.co.uk | support@recyclemydevice.co.uk</p>
        </div>

        <div class="invoice-details">
          <div>
            <div class="section-title">Invoice Details</div>
            <div class="info-row"><span class="info-label">Invoice No:</span> ${order.orderNumber}</div>
            <div class="info-row"><span class="info-label">Date:</span> ${new Date(order.orderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div class="info-row"><span class="info-label">Status:</span> <span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></div>
            <div class="info-row"><span class="info-label">Payment:</span> <span class="status-badge status-${order.paymentStatus}">${order.paymentStatus.toUpperCase()}</span></div>
          </div>
          <div>
            <div class="section-title">Customer Information</div>
            <div class="info-row"><strong>${order.customerName}</strong></div>
            <div class="info-row">${order.customerEmail}</div>
            <div class="info-row">${order.customerPhone}</div>
            <div class="info-row" style="margin-top: 10px;">
              <strong>Shipping Address:</strong><br>
              ${order.shippingAddress}
            </div>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Device</th>
                <th>Condition</th>
                <th>Storage</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${order.devices.map(device => `
                <tr>
                  <td>${device.name}</td>
                  <td>${device.condition}</td>
                  <td>${device.storage}</td>
                  <td style="text-align: right;">£${device.price.toLocaleString()}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td colspan="3" style="text-align: right; padding-right: 20px;">Total Amount:</td>
                <td style="text-align: right;">£${(order.totalAmount || 0).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        ${order.orderNotes ? `
        <div class="section">
          <div class="section-title">Notes</div>
          <p style="background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #1b981b;">${order.orderNotes}</p>
        </div>
        ` : ''}

        <div class="footer">
          <p><strong>Thank you for choosing Recycle My Device!</strong></p>
          <p>For any queries, please contact us at support@recyclemydevice.co.uk or call 0800 123 4567</p>
          <p style="margin-top: 10px; font-size: 11px;">This is a computer-generated invoice. No signature required.</p>
        </div>
      </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
    setSuccessMessage('Invoice downloaded successfully!');
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const getStatusColor = (statusCode: string) => {
    const colors: Record<string, { button: string; active: string; icon: any }> = {
      pending: {
        button: 'bg-white hover:bg-yellow-50 text-yellow-700 border-2 border-yellow-200 hover:border-yellow-300',
        active: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-2 border-yellow-300 cursor-not-allowed',
        icon: <Clock className="w-4 h-4" />
      },
      processing: {
        button: 'bg-white hover:bg-blue-50 text-blue-700 border-2 border-blue-200 hover:border-blue-300',
        active: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-2 border-blue-300 cursor-not-allowed',
        icon: <Truck className="w-4 h-4" />
      },
      completed: {
        button: 'bg-white hover:bg-green-50 text-green-700 border-2 border-green-200 hover:border-green-300',
        active: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300 cursor-not-allowed',
        icon: <CheckCircle2 className="w-4 h-4" />
      },
      cancelled: {
        button: 'bg-white hover:bg-red-50 text-red-700 border-2 border-red-200 hover:border-red-300',
        active: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300 cursor-not-allowed',
        icon: <XCircle className="w-4 h-4" />
      }
    };
    return colors[statusCode] || colors.pending;
  };


  const getCounterOfferBadge = (status: string) => {
    const styles: any = {
      pending: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300',
      accepted: 'bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300',
      declined: 'bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300',
      expired: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-300',
    };
    return styles[status] || styles.pending;
  };

  const getCounterOfferLabel = (status: string) => {
    const labels: any = {
      pending: '⏳ Awaiting Customer Response',
      accepted: '✓ Customer Accepted',
      declined: '✗ Customer Declined',
      expired: '⌛ Offer Expired',
    };
    return labels[status] || status;
  };

  const getStatusBadge = (status: string, order?: Order) => {
    if (!status) return null;
    
    // Special handling for counter_offer_pending - show the actual counter offer status
    if (status === 'counter_offer_pending' && order?.counterOffer) {
      const counterOfferStatus = order.counterOffer.status;
      const coStyles = {
        pending: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200',
        accepted: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
        declined: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200',
        expired: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border-gray-200'
      };
      const coLabels = {
        pending: 'Counter Offer Pending',
        accepted: 'Counter Offer Accepted',
        declined: 'Counter Offer Declined',
        expired: 'Counter Offer Expired'
      };
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${coStyles[counterOfferStatus as keyof typeof coStyles] || coStyles.pending}`}>
          <Clock className="w-3 h-3" />
          {coLabels[counterOfferStatus as keyof typeof coLabels] || 'Counter Offer'}
        </span>
      );
    }
    
    const styles = {
      pending: 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200',
      processing: 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200',
      completed: 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200',
      cancelled: 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200',
      counter_offer_pending: 'bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 border-amber-200'
    };
    
    const icons = {
      pending: <Clock className="w-3 h-3" />,
      processing: <Truck className="w-3 h-3" />,
      completed: <CheckCircle2 className="w-3 h-3" />,
      cancelled: <XCircle className="w-3 h-3" />,
      counter_offer_pending: <Clock className="w-3 h-3" />
    };

    const labels = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled',
      counter_offer_pending: 'Counter Offer Pending'
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {icons[status as keyof typeof icons] || <Package className="w-3 h-3" />}
        {labels[status as keyof typeof labels] || status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (paymentStatus: string) => {
    if (!paymentStatus) return null;
    
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
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border-2 ${styles[paymentStatus as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {icons[paymentStatus as keyof typeof icons] || <CreditCard className="w-3 h-3" />}
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
            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-semibold">Loading orders...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-bold text-red-900">Error Loading Orders</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Success Alert */}
            {!isLoading && !error && showSuccessAlert && (
              <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-bold">{successMessage}</p>
                </div>
              </div>
            )}
            {/* Stats Cards */}
            {!isLoading && !error && (
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
            )}

            {/* Bulk Actions Toolbar */}
            {!isLoading && !error && selectedOrders.length > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-300 rounded-3xl p-5 mb-6 shadow-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{selectedOrders.length}</span>
                    </div>
                    <div>
                      <p className="text-base font-bold text-gray-900">{selectedOrders.length} {selectedOrders.length === 1 ? 'order' : 'orders'} selected</p>
                      <p className="text-xs text-gray-600">Choose a status to update all selected orders</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <select
                      value={bulkStatus}
                      onChange={(e) => setBulkStatus(e.target.value)}
                      className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm font-semibold shadow-md"
                    >
                      <option value="">Select Status</option>
                      {orderStatuses.map((status) => (
                        <option key={status._id} value={status.name}>
                          {status.label || status.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleBulkUpdate}
                      disabled={!bulkStatus || isBulkUpdating}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl text-sm whitespace-nowrap"
                    >
                      {isBulkUpdating ? 'Updating...' : 'Update Status'}
                    </button>
                    <button
                      onClick={() => setSelectedOrders([])}
                      className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-bold transition-all shadow-md text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Search and Filters */}
            {!isLoading && !error && (
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
                    {orderStatuses.map((status) => (
                      <option key={status._id} value={status.name}>
                        {status.label || status.name}
                      </option>
                    ))}
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
                    {paymentStatuses.map((status) => (
                      <option key={status._id} value={status.name}>
                        {status.label || status.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            )}

            {/* Select All Checkbox */}
            {!isLoading && !error && filteredOrders.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-4 mb-4 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-sm font-bold text-gray-700">
                    Select All Orders ({filteredOrders.length})
                  </span>
                  {selectedOrders.length > 0 && (
                    <span className="ml-auto text-sm font-semibold text-blue-600">
                      {selectedOrders.length} selected
                    </span>
                  )}
                </label>
              </div>
            )}

            {/* Orders List */}
            {!isLoading && !error && (
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
                        <div className="flex items-start gap-4 flex-1">
                          {/* Checkbox */}
                          <div className="mt-1">
                            <input
                              type="checkbox"
                              checked={selectedOrders.includes(order.id)}
                              onChange={() => handleSelectOrder(order.id)}
                              className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded-lg focus:ring-blue-500 cursor-pointer"
                            />
                          </div>
                          
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
                                  £{(order.totalAmount || 0).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(order.status, order)}
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

                            {/* Counter Offer Status */}
                            {order.counterOffer?.status && order.counterOffer.status !== 'none' && (
                              <div className={`rounded-2xl p-5 border-2 shadow-lg ${getCounterOfferBadge(order.counterOffer.status)}`}>
                                <h4 className="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2">
                                  <span className="text-xl font-bold">£</span>
                                  Counter Offer Status
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">Status:</span>
                                    <span className="text-lg font-bold">{getCounterOfferLabel(order.counterOffer.status)}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">Original Price:</span>
                                    <span className="text-sm font-bold">£{order.counterOffer.originalPrice.toFixed(2)}</span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold">Counter Offer Price:</span>
                                    <span className="text-lg font-bold">£{order.counterOffer.amendedPrice.toFixed(2)}</span>
                                  </div>
                                  <div className="pt-2 border-t border-current/20">
                                    <p className="text-xs opacity-80">
                                      Created: {new Date(order.counterOffer.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </p>
                                    {order.counterOffer.respondedAt && (
                                      <p className="text-xs opacity-80">
                                        Response: {new Date(order.counterOffer.respondedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="space-y-3">
                              <button 
                                onClick={() => setCounterOfferModal({
                                  isOpen: true,
                                  order: {
                                    id: order.id,
                                    orderNumber: order.orderNumber,
                                    customerName: order.customerName,
                                    deviceName: order.devices[0]?.name,
                                    amount: order.totalAmount,
                                  }
                                })}
                                disabled={order.status === 'counter_offer_pending' || order.status === 'completed' || order.status === 'cancelled'}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span className="text-lg font-bold">£</span>
                                Counter Offer
                              </button>
                              <button 
                                onClick={() => handleDownloadInvoice(order)}
                                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                              >
                                <Download className="w-4 h-4" />
                                Download Invoice
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Order Status Management */}
                        <div className="mt-6">
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide flex items-center gap-2">
                              <Truck className="w-5 h-5 text-blue-600" />
                              Manage Order Status
                            </h4>
                            <div className="space-y-2">
                              {orderStatuses.map((status) => {
                                const colorConfig = getStatusColor(status.name);
                                const isActive = order.status === status.name;
                                return (
                                  <button
                                    key={status._id}
                                    onClick={() => handleUpdateOrderStatus(order.id, status.name)}
                                    disabled={isActive}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold text-sm transition-all hover:shadow-md transform hover:-translate-y-0.5 ${
                                      isActive ? colorConfig.active : colorConfig.button
                                    }`}
                                  >
                                    <span className="flex items-center gap-2">
                                      {colorConfig.icon}
                                      {status.label || status.name}
                                    </span>
                                    {isActive && <span className="flex items-center gap-1 text-xs"><Check className="w-3 h-3" /> Current</span>}
                                  </button>
                                );
                              })}
                            </div>
                            <div className="mt-4 p-3 bg-white/60 rounded-xl border border-blue-200">
                              <p className="text-xs text-gray-600 leading-relaxed">
                                <strong>Note:</strong> Payment status is automatically set to "Paid" when order is "Completed", otherwise it's "Pending".
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
            )}

            {/* Pagination Controls */}
            {!isLoading && !error && filteredOrders.length > 0 && totalPages > 1 && (
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-6 shadow-lg mt-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Showing <span className="font-bold text-gray-900">{((currentPage - 1) * 10) + 1}</span> to{' '}
                    <span className="font-bold text-gray-900">{Math.min(currentPage * 10, totalOrders)}</span> of{' '}
                    <span className="font-bold text-gray-900">{totalOrders}</span> orders
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = idx + 1;
                        } else if (currentPage <= 3) {
                          pageNum = idx + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + idx;
                        } else {
                          pageNum = currentPage - 2 + idx;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                              currentPage === pageNum
                                ? 'bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white shadow-lg'
                                : 'border-2 border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Counter Offer Modal */}
      {counterOfferModal.order && (
        <CounterOfferModal
          isOpen={counterOfferModal.isOpen}
          onClose={() => setCounterOfferModal({ isOpen: false, order: null })}
          order={counterOfferModal.order}
          onSuccess={() => {
            fetchOrders();
            setCounterOfferModal({ isOpen: false, order: null });
          }}
        />
      )}
    </div>
  );
};

export default RecyclerOrders;
