import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Filter, Eye, LogOut, Download, Mail, Phone, MapPin } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

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
}

const CustomerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('totalOrders');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock customers data based on checkout information
  const customers: Customer[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+44 7700 900123',
      address: '123 High Street',
      city: 'London',
      postcode: 'SW1A 1AA',
      totalOrders: 5,
      totalEarned: 3250,
      lastOrderDate: '2026-02-10',
      joinedDate: '2025-12-15',
      orderFrequency: 'Weekly'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+44 7700 900124',
      address: '456 Park Lane',
      city: 'Manchester',
      postcode: 'M1 1AA',
      totalOrders: 3,
      totalEarned: 1890,
      lastOrderDate: '2026-02-11',
      joinedDate: '2026-01-05',
      orderFrequency: 'Monthly'
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'michael.b@email.com',
      phone: '+44 7700 900125',
      address: '789 Queen Road',
      city: 'Birmingham',
      postcode: 'B1 1AA',
      totalOrders: 8,
      totalEarned: 4560,
      lastOrderDate: '2026-02-09',
      joinedDate: '2025-11-20',
      orderFrequency: 'Weekly'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.w@email.com',
      phone: '+44 7700 900126',
      address: '321 King Street',
      city: 'Leeds',
      postcode: 'LS1 1AA',
      totalOrders: 2,
      totalEarned: 1360,
      lastOrderDate: '2026-02-08',
      joinedDate: '2026-01-20',
      orderFrequency: 'Occasionally'
    },
    {
      id: '5',
      name: 'David Taylor',
      email: 'david.t@email.com',
      phone: '+44 7700 900127',
      address: '654 George Street',
      city: 'Glasgow',
      postcode: 'G1 1AA',
      totalOrders: 1,
      totalEarned: 280,
      lastOrderDate: '2026-02-07',
      joinedDate: '2026-02-07',
      orderFrequency: 'First Time'
    },
    {
      id: '6',
      name: 'Sophie Anderson',
      email: 'sophie.a@email.com',
      phone: '+44 7700 900128',
      address: '987 Victoria Road',
      city: 'Edinburgh',
      postcode: 'EH1 1AA',
      totalOrders: 4,
      totalEarned: 2840,
      lastOrderDate: '2026-02-06',
      joinedDate: '2025-12-01',
      orderFrequency: 'Bi-weekly'
    },
    {
      id: '7',
      name: 'James Miller',
      email: 'james.m@email.com',
      phone: '+44 7700 900129',
      address: '159 Albert Street',
      city: 'Liverpool',
      postcode: 'L1 1AA',
      totalOrders: 6,
      totalEarned: 3920,
      lastOrderDate: '2026-02-05',
      joinedDate: '2025-10-15',
      orderFrequency: 'Weekly'
    },
  ];

  const filteredCustomers = customers
    .filter(customer =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.city.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'totalOrders':
          return b.totalOrders - a.totalOrders;
        case 'totalEarned':
          return b.totalEarned - a.totalEarned;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const totalCustomers = customers.length;
  const totalPayout = customers.reduce((sum, c) => sum + c.totalEarned, 0);
  const averageOrderValue = totalPayout / customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const repeatCustomers = customers.filter(c => c.totalOrders > 1).length;

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
                    <p className="text-3xl font-bold text-gray-800">£{totalPayout.toLocaleString()}</p>
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
                <button className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap">
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
                          <span className="font-bold text-[#1b981b]">£{customer.totalEarned.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Order: </span>
                          <span className="font-semibold text-gray-900">{customer.lastOrderDate}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Member Since: </span>
                          <span className="font-semibold text-gray-900">{customer.joinedDate}</span>
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
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerManagement;
