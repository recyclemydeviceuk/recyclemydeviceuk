import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  Star, 
  Eye, 
  EyeOff,
  Filter,
  Calendar,
  User,
  Building2,
  MessageSquare,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface Review {
  _id: string;
  recyclerId: {
    _id: string;
    companyName: string;
  };
  orderId: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
  };
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

const AdminReviews: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    totalReviews: 0,
    approvedReviews: 0,
    pendingReviews: 0,
    rejectedReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadReviews();
    loadStats();
  }, [filterStatus, searchQuery, pagination.page]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit,
      };
      if (filterStatus !== 'all') params.status = filterStatus;
      if (searchQuery) params.search = searchQuery;
      
      const response: any = await adminAPI.reviews.getAll(params);
      setReviews(response.data || []);
      
      if (response.pagination) {
        setPagination(prev => ({
          ...prev,
          total: response.pagination.total,
          pages: response.pagination.pages,
        }));
      }
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response: any = await adminAPI.reviews.getStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.reviews.approve(id);
      showSuccess('Review approved successfully!');
      loadReviews();
      loadStats();
    } catch (error: any) {
      console.error('Error approving review:', error);
      showError(error.message || 'Failed to approve review');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.reviews.reject(id);
      showSuccess('Review rejected successfully!');
      loadReviews();
      loadStats();
    } catch (error: any) {
      console.error('Error rejecting review:', error);
      showError(error.message || 'Failed to reject review');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    
    try {
      await adminAPI.reviews.delete(id);
      showSuccess('Review deleted successfully!');
      loadReviews();
      loadStats();
    } catch (error: any) {
      console.error('Error deleting review:', error);
      showError(error.message || 'Failed to delete review');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('sessionToken');
    navigate('/panel/login');
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchQuery === '' ||
      review.recyclerId?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.orderId?.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.orderId?.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || 
      (filterRating === '5' && review.rating === 5) ||
      (filterRating === '4+' && review.rating >= 4) ||
      (filterRating === '3+' && review.rating >= 3) ||
      (filterRating === 'below3' && review.rating < 3);

    return matchesSearch && matchesRating;
  });

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
                </div>
                <p className="text-sm text-gray-500 ml-13 pl-1">Manage and moderate partner reviews</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Success Message */}
            {successMessage && (
              <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-4 flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-green-800 font-semibold">{successMessage}</p>
              </div>
            )}
            
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 rounded-2xl p-4 flex items-center gap-3">
                <XCircle className="w-6 h-6 text-red-600" />
                <p className="text-red-800 font-semibold">{errorMessage}</p>
              </div>
            )}
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-blue-100 font-medium mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-white">{stats.totalReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-green-100 font-medium mb-1">Approved</p>
                <p className="text-3xl font-bold text-white">{stats.approvedReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-yellow-100 font-medium mb-1">Pending</p>
                <p className="text-3xl font-bold text-white">{stats.pendingReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                <p className="text-xs text-purple-100 font-medium mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-white">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by recycler, customer, or order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer appearance-none"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4+">4+ Stars</option>
                      <option value="3+">3+ Stars</option>
                      <option value="below3">Below 3</option>
                    </select>
                  </div>
                  <div className="relative">
                    <div className="flex items-center gap-2">
                      <Filter className="w-5 h-5 text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer"
                      >
                        <option value="all">All Status</option>
                        <option value="approved">Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1b981b]"></div>
              </div>
            ) : (
              <>
                {/* Reviews List */}
                <div className="space-y-4">
                  {filteredReviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#1b981b]/50 transition-all shadow-md overflow-hidden"
                    >
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-bold text-gray-800">{review.recyclerId?.companyName || 'N/A'}</h3>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1">
                                  <User className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-600">{review.orderId?.customerName || 'N/A'}</span>
                                </div>
                                <span className="text-gray-300">•</span>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 ${
                              review.status === 'approved' ? 'bg-green-100 text-green-700 border-green-300' :
                              review.status === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' :
                              'bg-red-100 text-red-700 border-red-300'
                            }`}>
                              {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-5 h-5 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                            {review.rating.toFixed(1)}
                          </span>
                        </div>

                        {/* Review Text */}
                        <p className="text-gray-700 leading-relaxed mb-4 italic">"{review.comment}"</p>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-semibold">Order:</span>
                            <span className="text-[#1b981b] font-bold">{review.orderId?.orderNumber || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {review.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(review._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-sm transition-all"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(review._id)}
                                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(review._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold text-sm transition-all"
                            >
                              <EyeOff className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredReviews.length === 0 && (
                  <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews found</h3>
                    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                  </div>
                )}

                {/* Pagination */}
                {!loading && filteredReviews.length > 0 && pagination.pages > 1 && (
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
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReviews;
