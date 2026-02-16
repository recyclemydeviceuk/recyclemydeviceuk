import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Eye, LogOut, Download, Mail, Phone, MapPin } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface Customer {
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
  devices: string[];
}

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('totalOrders');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalCustomers: 0, totalPayout: 0, averageOrderValue: 0, repeatCustomers: 0 });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    loadCustomers();
  }, [searchQuery, sortBy, pagination.page]);

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (searchQuery) params.search = searchQuery;
      if (sortBy) params.sortBy = sortBy;
      
      const response: any = await adminAPI.customers.getAll(params);
      setCustomers(response.data.customers || []);
      setStats(response.data.stats || { totalCustomers: 0, totalPayout: 0, averageOrderValue: 0, repeatCustomers: 0 });
      
      // Update pagination info
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      }
    } catch (error) {
      console.error('Error loading customers:', error);
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

  const handleExportCSV = () => {
    // Prepare CSV data
    const headers = ['Name', 'Email', 'Phone', 'City', 'Postcode', 'Total Orders', 'Total Earned', 'Last Order Date', 'Member Since', 'Order Frequency'];
    const csvData = filteredCustomers.map(customer => [
      customer.name,
      customer.email,
      customer.phone,
      customer.city,
      customer.postcode,
      customer.totalOrders,
      `£${Math.round(customer.totalEarned)}`,
      customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB') : 'N/A',
      customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString('en-GB') : 'N/A',
      customer.orderFrequency,
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredCustomers = customers;

  // Use backend stats
  const totalCustomers = stats.totalCustomers || 0;
  const totalPayout = stats.totalPayout || 0;
  const averageOrderValue = stats.averageOrderValue || 0;
  const repeatCustomers = stats.repeatCustomers || 0;

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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                <p className="text-sm text-gray-600 mt-1">Track sellers and their device recycling transactions</p>
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
          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && (
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Customers</p>
                    <p className="text-3xl font-bold text-gray-800">{totalCustomers}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Repeat Customers</p>
                    <p className="text-3xl font-bold text-gray-800">{repeatCustomers}</p>
                    <p className="text-xs text-gray-500 mt-1">{((repeatCustomers / totalCustomers) * 100).toFixed(0)}% retention</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
                    <p className="text-3xl font-bold text-gray-800">£{Math.round(totalPayout).toLocaleString()}</p>
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
                    <p className="text-3xl font-bold text-gray-800">£{Math.round(averageOrderValue)}</p>
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
                    placeholder="Search by name, email, phone, or city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Sort Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                  >
                    <option value="totalOrders">Most Sales</option>
                    <option value="totalEarned">Highest Earned</option>
                    <option value="name">Name (A-Z)</option>
                  </select>
                </div>

                {/* Export Button */}
                <button 
                  onClick={handleExportCSV}
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap"
                >
                  <Download className="w-5 h-5" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCustomers.length}</span> of <span className="font-semibold text-gray-900">{totalCustomers}</span> customers
              </p>
            </div>

            {/* Customers List */}
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Customer Info */}
                    <div className="flex-1 space-y-3">
                      {/* Name and Frequency */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{customer.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getFrequencyColor(customer.orderFrequency)}`}>
                          {customer.orderFrequency}
                        </span>
                      </div>

                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.phone}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.city}, {customer.postcode}</span>
                        </div>
                      </div>

                      {/* Devices */}
                      {customer.devices && customer.devices.length > 0 && (
                        <div className="flex flex-wrap gap-2 text-xs">
                          <span className="text-gray-500 font-semibold">Devices:</span>
                          {customer.devices.slice(0, 3).map((device, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                              {device}
                            </span>
                          ))}
                          {customer.devices.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md font-medium">
                              +{customer.devices.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Address */}
                      <div className="text-sm text-gray-600">
                        <span className="font-semibold">Address: </span>
                        {customer.address}, {customer.city}, {customer.postcode}
                      </div>

                      {/* Order Stats */}
                      <div className="flex items-center gap-6 text-sm">
                        <div>
                          <span className="text-gray-500">Orders: </span>
                          <span className="font-bold text-gray-900">{customer.totalOrders}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Earned: </span>
                          <span className="font-bold text-[#1b981b]">£{Math.round(customer.totalEarned).toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Order: </span>
                          <span className="font-semibold text-gray-900">
                            {customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            }) : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Member Since: </span>
                          <span className="font-semibold text-gray-900">
                            {customer.joinedDate ? new Date(customer.joinedDate).toLocaleDateString('en-GB', { 
                              year: 'numeric', 
                              month: '2-digit', 
                              day: '2-digit' 
                            }) : 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center gap-2 lg:border-l-2 lg:pl-6 border-gray-200">
                      <button
                        onClick={() => navigate(`/panel/customers/${customer.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
                      >
                        <Eye className="w-5 h-5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No customers found</h3>
                <p className="text-gray-600">Try adjusting your search query</p>
              </div>
            )}

            {/* Pagination */}
            {filteredCustomers.length > 0 && pagination.pages > 1 && (
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
          </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CustomerManagement;
