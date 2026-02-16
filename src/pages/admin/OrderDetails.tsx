import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Package, MapPin, Phone, Mail, Calendar, Edit2, Save, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';

interface OrderDetails {
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
  notes: string;
}

const OrderDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [orderData, setOrderData] = useState<OrderDetails | null>(null);
  const [editData, setEditData] = useState<OrderDetails | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [paymentStatuses, setPaymentStatuses] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      if (!id) return;
      
      try {
        // Fetch statuses and order data in parallel
        const [orderRes, orderStatusRes, paymentStatusRes]: any[] = await Promise.all([
          adminAPI.orders.getById(id),
          adminAPI.utilities.getOrderStatuses(),
          adminAPI.utilities.getPaymentStatuses()
        ]);

        // Set statuses
        if (orderStatusRes.success) {
          setOrderStatuses(orderStatusRes.data);
        }
        if (paymentStatusRes.success) {
          setPaymentStatuses(paymentStatusRes.data);
        }
        
        // Set order data
        if (orderRes.success) {
          const order = orderRes.data;
          const formattedOrder: OrderDetails = {
            id: order._id,
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            device: order.deviceId?.name || 'N/A',
            condition: order.deviceCondition,
            offerPrice: order.amount,
            recycler: order.recyclerId?.companyName || 'Not Assigned',
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: new Date(order.createdAt).toISOString().split('T')[0],
            address: `${order.address || ''}, ${order.city || ''}, ${order.postcode || ''}`.trim(),
            notes: order.notes || ''
          };

          setOrderData(formattedOrder);
          setEditData(formattedOrder);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        alert('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditData(orderData);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editData || !id) return;
    
    try {
      // Update order status
      await adminAPI.orders.updateStatus(id, editData.status, editData.notes);
      
      // Update payment status
      await adminAPI.orders.updatePaymentStatus(id, editData.paymentStatus);
      
      setOrderData(editData);
      setIsEditing(false);
      alert('Order updated successfully!');
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to update order');
    }
  };

  const handleInputChange = (field: keyof OrderDetails, value: any) => {
    setEditData(prev => prev ? { ...prev, [field]: value } : null);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData || !editData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/panel/orders')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                  <p className="text-sm text-gray-600 mt-1">{orderData.orderNumber}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Order</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl transition-all duration-200 font-semibold hover:bg-gray-50"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Status */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">Order Status</h2>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <select
                      value={editData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] bg-white cursor-pointer"
                    >
                      {orderStatuses.map((status) => (
                        <option key={status.name} value={status.name}>
                          {status.label || status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(orderData.status)}`}>
                      {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Status */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                  <h2 className="text-lg font-bold text-white">Payment Status</h2>
                </div>
                <div className="p-6">
                  {isEditing ? (
                    <select
                      value={editData.paymentStatus}
                      onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] bg-white cursor-pointer"
                    >
                      {paymentStatuses.map((status) => (
                        <option key={status.name} value={status.name}>
                          {status.label || status.name.charAt(0).toUpperCase() + status.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getPaymentStatusColor(orderData.paymentStatus)}`}>
                      {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Customer Information</h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.customerName}
                      onChange={(e) => handleInputChange('customerName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <User className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-900">{orderData.customerName}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.customerEmail}
                      onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-900">{orderData.customerEmail}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.customerPhone}
                      onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]"
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <p className="text-gray-900">{orderData.customerPhone}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Order Date</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900">{orderData.createdAt}</p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                  {isEditing ? (
                    <textarea
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] resize-none"
                    />
                  ) : (
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                      <p className="text-gray-900">{orderData.address}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Device Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Device Information</h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Device</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.device}
                      onChange={(e) => handleInputChange('device', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]"
                    />
                  ) : (
                    <p className="text-gray-900 font-semibold">{orderData.device}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Condition</label>
                  {isEditing ? (
                    <select
                      value={editData.condition}
                      onChange={(e) => handleInputChange('condition', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] bg-white cursor-pointer"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                      <option value="Broken">Broken</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-semibold">{orderData.condition}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Recycler</label>
                  {isEditing ? (
                    <select
                      value={editData.recycler}
                      onChange={(e) => handleInputChange('recycler', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] bg-white cursor-pointer"
                    >
                      <option value="GreenTech Recyclers">GreenTech Recyclers</option>
                      <option value="EcoMobile Solutions">EcoMobile Solutions</option>
                      <option value="TechRecycle UK">TechRecycle UK</option>
                      <option value="Mobile Refresh">Mobile Refresh</option>
                      <option value="CircularTech">CircularTech</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 font-semibold">{orderData.recycler}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Offer Price</label>
                  {isEditing ? (
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">£</span>
                      <input
                        type="number"
                        value={editData.offerPrice}
                        onChange={(e) => handleInputChange('offerPrice', parseFloat(e.target.value))}
                        className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]"
                      />
                    </div>
                  ) : (
                    <p className="text-2xl font-bold text-[#1b981b]">£{Math.round(orderData.offerPrice)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h2 className="text-lg font-bold text-white">Order Notes</h2>
                </div>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <textarea
                    value={editData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={4}
                    placeholder="Add special instructions or notes about this order..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] resize-none bg-gray-50"
                  />
                ) : orderData.notes ? (
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-200">
                    <p className="text-gray-800 leading-relaxed italic">"{orderData.notes}"</p>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No notes added for this order</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
