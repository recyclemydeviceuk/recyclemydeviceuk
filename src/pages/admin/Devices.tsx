import React, { useState } from 'react';
import { Smartphone, Search, Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface Device {
  id: number;
  name: string;
  brand: string;
  basePrice: string;
  maxPrice: string;
  status: 'active' | 'inactive';
  totalOrders: number;
}

const Devices: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock device data
  const devices: Device[] = [
    { id: 1, name: 'iPhone 16 Pro Max', brand: 'Apple', basePrice: '£750', maxPrice: '£850', status: 'active', totalOrders: 45 },
    { id: 2, name: 'iPhone 16 Pro', brand: 'Apple', basePrice: '£650', maxPrice: '£750', status: 'active', totalOrders: 38 },
    { id: 3, name: 'iPhone 16 Plus', brand: 'Apple', basePrice: '£580', maxPrice: '£650', status: 'active', totalOrders: 32 },
    { id: 4, name: 'iPhone 16', brand: 'Apple', basePrice: '£450', maxPrice: '£580', status: 'active', totalOrders: 28 },
    { id: 5, name: 'iPhone 15 Pro Max', brand: 'Apple', basePrice: '£620', maxPrice: '£720', status: 'active', totalOrders: 52 },
    { id: 6, name: 'iPhone 15 Pro', brand: 'Apple', basePrice: '£520', maxPrice: '£620', status: 'active', totalOrders: 48 },
    { id: 7, name: 'iPhone 15 Plus', brand: 'Apple', basePrice: '£450', maxPrice: '£520', status: 'active', totalOrders: 41 },
    { id: 8, name: 'iPhone 15', brand: 'Apple', basePrice: '£380', maxPrice: '£450', status: 'active', totalOrders: 35 },
    { id: 9, name: 'iPhone 14 Pro Max', brand: 'Apple', basePrice: '£500', maxPrice: '£580', status: 'active', totalOrders: 67 },
    { id: 10, name: 'iPhone 14 Pro', brand: 'Apple', basePrice: '£420', maxPrice: '£500', status: 'active', totalOrders: 59 },
    { id: 11, name: 'iPhone 14 Plus', brand: 'Apple', basePrice: '£380', maxPrice: '£420', status: 'active', totalOrders: 44 },
    { id: 12, name: 'iPhone 14', brand: 'Apple', basePrice: '£320', maxPrice: '£380', status: 'active', totalOrders: 38 },
    { id: 13, name: 'iPhone 13 Pro Max', brand: 'Apple', basePrice: '£400', maxPrice: '£450', status: 'active', totalOrders: 71 },
    { id: 14, name: 'iPhone 13 Pro', brand: 'Apple', basePrice: '£350', maxPrice: '£400', status: 'active', totalOrders: 65 },
    { id: 15, name: 'iPhone 13 Mini', brand: 'Apple', basePrice: '£250', maxPrice: '£280', status: 'active', totalOrders: 42 },
    { id: 16, name: 'iPhone 13', brand: 'Apple', basePrice: '£280', maxPrice: '£320', status: 'active', totalOrders: 58 },
    { id: 17, name: 'Galaxy S24 Ultra', brand: 'Samsung', basePrice: '£680', maxPrice: '£780', status: 'active', totalOrders: 34 },
    { id: 18, name: 'Galaxy S24+', brand: 'Samsung', basePrice: '£520', maxPrice: '£600', status: 'active', totalOrders: 29 },
    { id: 19, name: 'Galaxy S24', brand: 'Samsung', basePrice: '£420', maxPrice: '£480', status: 'active', totalOrders: 31 },
    { id: 20, name: 'Galaxy S23 Ultra', brand: 'Samsung', basePrice: '£550', maxPrice: '£620', status: 'active', totalOrders: 47 },
    { id: 21, name: 'Galaxy S23+', brand: 'Samsung', basePrice: '£420', maxPrice: '£480', status: 'active', totalOrders: 39 },
    { id: 22, name: 'Galaxy S23', brand: 'Samsung', basePrice: '£350', maxPrice: '£400', status: 'active', totalOrders: 44 },
    { id: 23, name: 'Galaxy S22 Ultra', brand: 'Samsung', basePrice: '£420', maxPrice: '£480', status: 'active', totalOrders: 53 },
    { id: 24, name: 'Galaxy S22+', brand: 'Samsung', basePrice: '£330', maxPrice: '£380', status: 'active', totalOrders: 41 },
    { id: 25, name: 'Galaxy S22', brand: 'Samsung', basePrice: '£280', maxPrice: '£320', status: 'active', totalOrders: 38 },
  ];

  const brands = ['All', 'Apple', 'Samsung'];
  const statuses = ['All', 'active', 'inactive'];

  const filteredDevices = devices
    .filter(device => selectedBrand === 'All' || device.brand === selectedBrand)
    .filter(device => selectedStatus === 'All' || device.status === selectedStatus)
    .filter(device => 
      device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Devices</h1>
                <p className="text-sm text-gray-600 mt-1">Manage all devices and products</p>
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
                    <p className="text-sm text-gray-600 mb-1">Total Devices</p>
                    <p className="text-3xl font-bold text-gray-800">{devices.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Recyclers</p>
                    <p className="text-3xl font-bold text-gray-800">5</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-[#1b981b] p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {devices.reduce((sum, d) => sum + d.totalOrders, 0)}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <div className="text-white font-bold text-lg">#</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters Section */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by device name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Brand Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                  >
                    {brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                >
                  <option value="All">All Status</option>
                  {statuses.slice(1).map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>

                {/* Add Device Button */}
                <button
                  onClick={() => navigate('/panel/devices/add')}
                  className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add Device</span>
                </button>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredDevices.length}</span> of <span className="font-semibold text-gray-900">{devices.length}</span> devices
              </p>
            </div>

            {/* Devices List View */}
            <div className="space-y-3">
              {filteredDevices.map((device) => (
                <div
                  key={device.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    {/* Device Info */}
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Phone Image */}
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                        <img 
                          src="https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png" 
                          alt={device.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      {/* Name and Brand */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{device.name}</h3>
                        <p className="text-sm text-gray-600">{device.brand}</p>
                      </div>

                      {/* Price Range */}
                      <div className="text-center px-6 border-l-2 border-r-2 border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Price Range</p>
                        <p className="text-sm font-bold text-[#1b981b]">
                          {device.basePrice} - {device.maxPrice}
                        </p>
                      </div>

                      {/* Total Orders */}
                      <div className="text-center px-6 border-r-2 border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Orders</p>
                        <p className="text-sm font-bold text-gray-900">{device.totalOrders}</p>
                      </div>

                      {/* Status */}
                      <div className="text-center px-6">
                        <p className="text-xs text-gray-500 mb-1">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            device.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => navigate(`/panel/devices/edit/${device.id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredDevices.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Devices;
