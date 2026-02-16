import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Filter, Download, Mail, Calendar, Users, CheckCircle, XCircle, Trash2, Loader2, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface NewsletterSubscription {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  createdAt: string;
  unsubscribedAt?: string;
}

interface NewsletterStats {
  totalSubscribers: number;
  activeSubscribers: number;
  unsubscribedCount: number;
  recentSubscriptions: number;
}

const NewsletterSubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>([]);
  const [stats, setStats] = useState<NewsletterStats>({
    totalSubscribers: 0,
    activeSubscribers: 0,
    unsubscribedCount: 0,
    recentSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminToken');
    navigate('/panel/login');
  };

  // Fetch newsletter subscriptions
  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response: any = await adminAPI.newsletters.getAll(params);
      
      if (response.success) {
        setSubscriptions(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
      } else {
        setError('Failed to fetch subscriptions');
      }
    } catch (err: any) {
      console.error('Error fetching subscriptions:', err);
      setError(err.message || 'Failed to load newsletter subscriptions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response: any = await adminAPI.newsletters.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSubscriptions();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!loading) {
        fetchSubscriptions();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, statusFilter]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSelectAll = () => {
    if (selectedSubscriptions.length === subscriptions.length) {
      setSelectedSubscriptions([]);
    } else {
      setSelectedSubscriptions(subscriptions.map(sub => sub._id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedSubscriptions.includes(id)) {
      setSelectedSubscriptions(selectedSubscriptions.filter(subId => subId !== id));
    } else {
      setSelectedSubscriptions([...selectedSubscriptions, id]);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'active' | 'unsubscribed') => {
    try {
      setActionLoading(true);
      await adminAPI.newsletters.updateStatus(id, status);
      
      // Update local state
      setSubscriptions(subscriptions.map(sub => 
        sub._id === id ? { ...sub, status, unsubscribedAt: status === 'unsubscribed' ? new Date().toISOString() : undefined } : sub
      ));
      
      // Refresh stats
      await fetchStats();
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this subscription?')) return;
    
    try {
      setActionLoading(true);
      await adminAPI.newsletters.delete(id);
      
      // Update local state
      setSubscriptions(subscriptions.filter(sub => sub._id !== id));
      setSelectedSubscriptions(selectedSubscriptions.filter(subId => subId !== id));
      
      // Refresh stats
      await fetchStats();
      alert('Subscription deleted successfully');
    } catch (err: any) {
      console.error('Error deleting subscription:', err);
      alert(err.message || 'Failed to delete subscription');
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSubscriptions.length === 0) {
      alert('Please select subscriptions to delete');
      return;
    }
    
    if (!confirm(`Are you sure you want to delete ${selectedSubscriptions.length} subscription(s)?`)) return;
    
    try {
      setActionLoading(true);
      await adminAPI.newsletters.bulkDelete(selectedSubscriptions);
      
      // Update local state
      setSubscriptions(subscriptions.filter(sub => !selectedSubscriptions.includes(sub._id)));
      setSelectedSubscriptions([]);
      
      // Refresh stats
      await fetchStats();
      alert('Subscriptions deleted successfully');
    } catch (err: any) {
      console.error('Error deleting subscriptions:', err);
      alert(err.message || 'Failed to delete subscriptions');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setActionLoading(true);
      const params = statusFilter !== 'all' ? { status: statusFilter } : {};
      const blob: any = await adminAPI.newsletters.export(params);
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `newsletter-subscriptions-${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      console.error('Error exporting:', err);
      alert(err.message || 'Failed to export subscriptions');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredSubscriptions = subscriptions;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Newsletter Subscriptions</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Manage your newsletter subscribers</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-[#1b981b] p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Subscribers</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.totalSubscribers}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1b981b] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-green-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Active</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.activeSubscribers}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-blue-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Recent (30d)</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.recentSubscriptions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-red-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Unsubscribed</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{stats.unsubscribedCount}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Filter & Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="unsubscribed">Unsubscribed</option>
                    </select>
                  </div>

                  <button
                    onClick={handleExport}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap text-sm sm:text-base font-semibold"
                  >
                    <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Export CSV</span>
                  </button>

                  {selectedSubscriptions.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      disabled={actionLoading}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg sm:rounded-xl transition-all duration-200 whitespace-nowrap text-sm sm:text-base font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Delete ({selectedSubscriptions.length})</span>
                      <span className="sm:hidden">{selectedSubscriptions.length}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredSubscriptions.length}</span> of <span className="font-semibold text-gray-900">{stats.totalSubscribers}</span> subscriptions
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#1b981b] mx-auto mb-4 animate-spin" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Loading subscriptions...</h3>
                <p className="text-sm sm:text-base text-gray-600">Please wait while we fetch the data</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-red-200 p-8 sm:p-12 text-center">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Failed to load subscriptions</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchSubscriptions()}
                  className="px-6 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Subscriptions Table */}
            {!loading && !error && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr>
                        <th className="p-3 sm:p-4 text-left">
                          <input
                            type="checkbox"
                            checked={selectedSubscriptions.length === subscriptions.length && subscriptions.length > 0}
                            onChange={handleSelectAll}
                            className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#1b981b] focus:ring-[#1b981b] cursor-pointer"
                          />
                        </th>
                        <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Email</th>
                        <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Status</th>
                        <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700 hidden md:table-cell">Subscribed</th>
                        <th className="p-3 sm:p-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredSubscriptions.map((subscription) => (
                        <tr key={subscription._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-3 sm:p-4">
                            <input
                              type="checkbox"
                              checked={selectedSubscriptions.includes(subscription._id)}
                              onChange={() => handleSelectOne(subscription._id)}
                              className="w-4 h-4 sm:w-5 sm:h-5 rounded border-gray-300 text-[#1b981b] focus:ring-[#1b981b] cursor-pointer"
                            />
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-gray-900 font-medium truncate max-w-[150px] sm:max-w-none">{subscription.email}</span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <span className={`inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                              subscription.status === 'active' 
                                ? 'bg-green-100 text-green-700 border border-green-300' 
                                : 'bg-red-100 text-red-700 border border-red-300'
                            }`}>
                              {subscription.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-3 sm:p-4 hidden md:table-cell">
                            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-600">
                              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              <span>{formatDate(subscription.createdAt)}</span>
                            </div>
                          </td>
                          <td className="p-3 sm:p-4">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              {subscription.status === 'active' ? (
                                <button
                                  onClick={() => handleUpdateStatus(subscription._id, 'unsubscribed')}
                                  disabled={actionLoading}
                                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Unsubscribe"
                                >
                                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUpdateStatus(subscription._id, 'active')}
                                  disabled={actionLoading}
                                  className="p-1.5 sm:p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                  title="Reactivate"
                                >
                                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(subscription._id)}
                                disabled={actionLoading}
                                className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredSubscriptions.length === 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-8 sm:p-12 text-center">
                <Mail className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">No subscriptions found</h3>
                <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredSubscriptions.length > 0 && pagination.pages > 1 && (
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

export default NewsletterSubscriptions;
