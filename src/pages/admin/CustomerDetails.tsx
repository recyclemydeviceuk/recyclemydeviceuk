import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Package, TrendingUp } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';

interface CustomerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postcode: string;
  totalOrders: number;
  totalEarned: number;
  lastOrderDate: string;
  joinedDate: string;
  orderFrequency: string;
  orders: Order[];
}

interface Order {
  id: string;
  orderNumber: string;
  device: string;
  amount: number;
  status: string;
  recycler: string;
  createdAt: string;
}

const CustomerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);

  useEffect(() => {
    loadCustomerData();
  }, [id]);

  const loadCustomerData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      const response: any = await adminAPI.customers.getById(id);
      const data = response.data;
      
      // Determine order frequency
      let orderFrequency = 'First Time';
      const totalOrders = data.stats.totalOrders;
      if (totalOrders > 8) orderFrequency = 'Weekly';
      else if (totalOrders > 5) orderFrequency = 'Bi-weekly';
      else if (totalOrders > 2) orderFrequency = 'Monthly';
      else if (totalOrders > 1) orderFrequency = 'Occasionally';
      
      setCustomerData({
        id: data.customer.id,
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        address: data.customer.address,
        city: data.customer.city,
        postcode: data.customer.postcode,
        totalOrders: data.stats.totalOrders,
        totalEarned: data.stats.totalEarned,
        lastOrderDate: data.orders[0]?.createdAt || '',
        joinedDate: data.customer.joinedDate,
        orderFrequency,
        orders: data.orders || [],
      });
    } catch (error) {
      console.error('Error loading customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      confirmed: 'bg-blue-100 text-blue-700',
      collected: 'bg-purple-100 text-purple-700',
      completed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Weekly':
        return 'bg-green-100 text-green-700';
      case 'Bi-weekly':
        return 'bg-blue-100 text-blue-700';
      case 'Monthly':
        return 'bg-purple-100 text-purple-700';
      case 'Occasionally':
        return 'bg-yellow-100 text-yellow-700';
      case 'First Time':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading customer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Customer not found</p>
          </div>
        </div>
      </div>
    );
  }

  const averageOrderValue = customerData.totalEarned / customerData.totalOrders;

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
                  onClick={() => navigate('/panel/customers')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
                  <p className="text-sm text-gray-600 mt-1">{customerData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">{customerData.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earned</p>
                    <p className="text-3xl font-bold text-gray-800">£{Math.round(customerData.totalEarned).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <div className="text-white font-bold text-lg">£</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                    <p className="text-3xl font-bold text-gray-800">£{averageOrderValue.toFixed(0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Frequency</p>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getFrequencyColor(customerData.orderFrequency)}`}>
                      {customerData.orderFrequency}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Personal Information</h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900 font-semibold">{customerData.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900">{customerData.email}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900">{customerData.phone}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900">
                      {customerData.joinedDate ? new Date(customerData.joinedDate).toLocaleDateString('en-GB', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Address</label>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <p className="text-gray-900">{customerData.address}, {customerData.city}, {customerData.postcode}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-white">Order History</h2>
                  </div>
                  <span className="text-white/90 text-sm">{customerData.orders.length} orders</span>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {customerData.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-[#1b981b] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-gray-900">{order.orderNumber}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">Device: </span>
                            <span className="font-semibold text-gray-900">{order.device}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Recycler: </span>
                            <span className="font-semibold text-gray-900">{order.recycler}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Date: </span>
                            <span className="font-semibold text-gray-900">
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-[#1b981b]">£{order.amount?.toLocaleString() || 0}</p>
                        <button
                          onClick={() => navigate(`/panel/orders/${order.id}`)}
                          className="text-sm text-blue-600 hover:text-blue-700 font-semibold mt-1"
                        >
                          View Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDetails;
