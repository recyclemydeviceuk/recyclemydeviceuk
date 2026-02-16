import React, { useState, useEffect } from 'react';
import { Smartphone, Search, Plus, Edit2, Trash2, Filter, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface Device {
  _id: string;
  name: string;
  brand: {
    _id: string;
    name: string;
  };
  category: string;
  image: string;
  status: 'active' | 'inactive' | 'discontinued';
  storageOptions: string[];
  conditionOptions: string[];
  createdAt: string;
  updatedAt: string;
}

interface Stats {
  totalDevices: number;
  totalRecyclers: number;
  totalOrders: number;
}

const Devices: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [devices, setDevices] = useState<Device[]>([]);
  const [stats, setStats] = useState<Stats>({ totalDevices: 0, totalRecyclers: 0, totalOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminToken');
    navigate('/panel/login');
  };

  // Fetch devices from backend
  const fetchDevices = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (selectedBrand !== 'All') params.brand = selectedBrand;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (searchQuery) params.search = searchQuery;
      
      console.log('🔄 Fetching devices with params:', params);
      const response: any = await adminAPI.devices.getAll(params);
      console.log('📱 Devices API Response:', response);
      
      const devicesList = response.data || response.devices || [];
      console.log('📋 Devices list:', devicesList);
      console.log('✅ Total devices found:', devicesList.length);
      
      setDevices(Array.isArray(devicesList) ? devicesList : []);
      
      // Update pagination info
      if (response.pagination) {
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          pages: response.pagination.pages,
        });
      }
    } catch (err: any) {
      console.error('❌ Error fetching devices:', err);
      console.error('Error details:', err.response?.data || err.message);
      setError(err.message || 'Failed to load devices');
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      console.log('🔄 Fetching dashboard stats...');
      const response: any = await adminAPI.dashboard.getStats();
      console.log('📊 Stats API Response:', response);
      
      const overview = response.data?.overview || response.overview || {};
      console.log('📈 Overview data:', overview);
      
      const statsData = {
        totalDevices: overview.totalDevices || 0,
        totalRecyclers: overview.totalRecyclers || 0,
        totalOrders: overview.totalOrders || 0,
      };
      console.log('✅ Setting stats:', statsData);
      setStats(statsData);
    } catch (err: any) {
      console.error('❌ Error fetching stats:', err);
      console.error('Error details:', err.response?.data || err.message);
    }
  };

  // Delete device
  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      setDeleting(id);
      await adminAPI.devices.delete(id);
      setDevices(devices.filter(d => d._id !== id));
      setStats(prev => ({ ...prev, totalDevices: prev.totalDevices - 1 }));
    } catch (err: any) {
      console.error('Error deleting device:', err);
      alert(err.message || 'Failed to delete device');
    } finally {
      setDeleting(null);
    }
  };

  // Fetch data on mount and when filters or page change
  useEffect(() => {
    fetchDevices();
  }, [selectedBrand, selectedStatus, searchQuery, pagination.page]);

  useEffect(() => {
    fetchStats();
  }, []);

  const statuses = ['All', 'active', 'inactive', 'discontinued'];

  // Get unique brands from devices
  const uniqueBrands = ['All', ...Array.from(new Set(devices.map(d => d.brand?.name).filter(Boolean)))];

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
                    <p className="text-3xl font-bold text-gray-800">{stats.totalDevices}</p>
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
                    <p className="text-3xl font-bold text-gray-800">{stats.totalRecyclers}</p>
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
                    <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
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
                    {uniqueBrands.map(brand => (
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
                Showing <span className="font-semibold text-gray-900">{devices.length}</span> devices
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 text-[#1b981b] mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading devices...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-red-800 font-semibold">Error loading devices</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                </div>
                <button
                  onClick={fetchDevices}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Devices List View */}
            {!loading && !error && (
              <div className="space-y-3">
                {devices.map((device) => (
                <div
                  key={device._id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex items-center justify-between">
                    {/* Device Info */}
                    <div className="flex items-center space-x-6 flex-1">
                      {/* Phone Image */}
                      <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 p-2">
                        {device.image ? (
                          <img 
                            src={device.image} 
                            alt={device.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://storage.googleapis.com/atomjuice-product-images/apple/iphone-16-pro/default.png';
                            }}
                          />
                        ) : (
                          <Smartphone className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Name and Brand */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{device.name}</h3>
                        <p className="text-sm text-gray-600">{device.brand?.name || 'Unknown'}</p>
                      </div>

                      {/* Storage Options */}
                      <div className="text-center px-6 border-l-2 border-r-2 border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Storage Options</p>
                        <p className="text-sm font-bold text-gray-900">
                          {device.storageOptions?.length || 0}
                        </p>
                      </div>

                      {/* Category */}
                      <div className="text-center px-6 border-r-2 border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">Category</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">{device.category}</p>
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
                        onClick={() => navigate(`/panel/devices/edit/${device._id}`)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit device"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(device._id, device.name)}
                        disabled={deleting === device._id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
                        title="Delete device"
                      >
                        {deleting === device._id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Trash2 className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && devices.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Smartphone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No devices found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && devices.length > 0 && pagination.pages > 1 && (
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
        </main>
      </div>
    </div>
  );
};

export default Devices;
