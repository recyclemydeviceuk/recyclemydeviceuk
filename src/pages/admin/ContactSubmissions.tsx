import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Filter, Eye, Mail, Calendar, MessageSquare, CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

interface ContactSubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  category?: string;
  status: 'new' | 'in_progress' | 'resolved' | 'closed';
  isRead?: boolean;
  readAt?: string;
  response?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStats {
  totalContacts: number;
  unreadContacts: number;
  pendingContacts: number;
  repliedContacts: number;
}

const ContactSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [replySending, setReplySending] = useState(false);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [stats, setStats] = useState<ContactStats>({
    totalContacts: 0,
    unreadContacts: 0,
    pendingContacts: 0,
    repliedContacts: 0,
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

  // Fetch contact submissions
  const fetchSubmissions = async () => {
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
      
      const response: any = await adminAPI.contacts.getAll(params);
      
      if (response.success) {
        setSubmissions(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
      } else {
        setError('Failed to fetch submissions');
      }
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to load contact submissions');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response: any = await adminAPI.contacts.getStats();
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching stats:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchSubmissions();
    fetchStats();
  }, []);

  // Refetch when filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (!loading) {
        fetchSubmissions();
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, statusFilter]);


  const filteredSubmissions = submissions;

  const totalSubmissions = stats.totalContacts;
  const newSubmissions = stats.unreadContacts;
  const pendingSubmissions = stats.pendingContacts;
  const respondedSubmissions = stats.repliedContacts;

  const getStatusColor = (status: string, isRead?: boolean) => {
    if (!isRead) {
      return 'bg-blue-100 text-blue-700 border-blue-300';
    }
    switch (status) {
      case 'new':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'in_progress':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'resolved':
      case 'closed':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string, isRead?: boolean) => {
    if (!isRead) {
      return <Mail className="w-4 h-4" />;
    }
    switch (status) {
      case 'new':
        return <Eye className="w-4 h-4" />;
      case 'in_progress':
        return <Clock className="w-4 h-4" />;
      case 'resolved':
      case 'closed':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string, isRead?: boolean) => {
    if (!isRead) return 'New';
    switch (status) {
      case 'new': return 'Read';
      case 'in_progress': return 'In Progress';
      case 'resolved': return 'Resolved';
      case 'closed': return 'Closed';
      default: return status;
    }
  };

  const handleViewDetails = async (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    
    // Mark as read if it wasn't read
    if (!submission.isRead) {
      try {
        await adminAPI.contacts.markAsRead(submission._id);
        // Update local state
        setSubmissions(submissions.map(s => 
          s._id === submission._id ? { ...s, isRead: true, readAt: new Date().toISOString() } : s
        ));
        // Refresh stats
        fetchStats();
      } catch (err: any) {
        console.error('Error marking as read:', err);
      }
    }
  };

  const handleMarkAsResponded = async (id: string) => {
    try {
      setActionLoading(true);
      await adminAPI.contacts.updateStatus(id, 'resolved');
      
      // Update local state
      setSubmissions(submissions.map(s => 
        s._id === id ? { ...s, status: 'resolved' as const } : s
      ));
      
      // Refresh stats
      await fetchStats();
      setShowDetailModal(false);
    } catch (err: any) {
      console.error('Error updating status:', err);
      alert(err.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

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

  const handleReply = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setReplyMessage('');
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedSubmission || !replyMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      setReplySending(true);
      await adminAPI.contacts.reply(selectedSubmission._id, replyMessage);
      
      // Update local state to mark as resolved
      setSubmissions(submissions.map(s => 
        s._id === selectedSubmission._id ? { ...s, status: 'resolved' as const } : s
      ));
      
      // Refresh stats
      await fetchStats();
      
      alert('Reply sent successfully!');
      setShowReplyModal(false);
      setShowDetailModal(false);
      setReplyMessage('');
    } catch (err: any) {
      console.error('Error sending reply:', err);
      alert(err.message || 'Failed to send reply');
    } finally {
      setReplySending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-4 sm:px-6 md:px-8 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 truncate">Contact Form Submissions</h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden sm:block">Manage customer inquiries and support requests</p>
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
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Total Submissions</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{totalSubmissions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1b981b] rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-blue-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">New Messages</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{newSubmissions}</p>
                    <p className="text-[10px] sm:text-xs text-blue-600 mt-0.5 sm:mt-1 font-semibold">Needs Attention</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-yellow-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Pending</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{pendingSubmissions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-green-500 p-4 sm:p-5 md:p-6 shadow-lg">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Responded</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">{respondedSubmissions}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-sm p-4 sm:p-5 md:p-6 mb-4 sm:mb-6">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, email, subject..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredSubmissions.length}</span> of <span className="font-semibold text-gray-900">{totalSubmissions}</span> submissions
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-12 text-center">
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-[#1b981b] mx-auto mb-4 animate-spin" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Loading submissions...</h3>
                <p className="text-sm sm:text-base text-gray-600">Please wait while we fetch the data</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-red-200 p-8 sm:p-12 text-center">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Failed to load submissions</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => fetchSubmissions()}
                  className="px-6 py-2.5 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg font-semibold transition-all duration-200"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Submissions List */}
            {!loading && !error && (
              <div className="space-y-3 sm:space-y-4">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission._id}
                    className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-4 sm:p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-4">
                      {/* Submission Info */}
                      <div className="flex-1 space-y-2 sm:space-y-3">
                        {/* Name and Status */}
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900">{submission.name}</h3>
                          <span className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold border-2 ${getStatusColor(submission.status, submission.isRead)}`}>
                            {getStatusIcon(submission.status, submission.isRead)}
                            {getStatusLabel(submission.status, submission.isRead)}
                          </span>
                        </div>

                        {/* Contact Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900 truncate">{submission.email}</span>
                          </div>
                          {submission.category && (
                            <div className="flex items-center gap-1.5 sm:gap-2">
                              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-900">{submission.category}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-900">{formatDate(submission.createdAt)}</span>
                          </div>
                        </div>

                        {/* Subject */}
                        {submission.subject && (
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-700">Subject:</p>
                            <p className="text-sm sm:text-base font-bold text-gray-900 mt-0.5 sm:mt-1">{submission.subject}</p>
                          </div>
                        )}

                      {/* Message Preview */}
                      <div className="bg-gray-50 rounded-lg p-2.5 sm:p-3">
                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-2">{submission.message}</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center pt-3 sm:pt-0 border-t sm:border-t-0 sm:border-l-0 border-gray-200">
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-lg sm:rounded-xl transition-all duration-200 text-sm sm:text-base font-semibold whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}

            {/* Empty State */}
            {!loading && !error && filteredSubmissions.length === 0 && (
              <div className="bg-white rounded-lg sm:rounded-xl border-2 border-gray-200 p-8 sm:p-12 text-center">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">No submissions found</h3>
                <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredSubmissions.length > 0 && pagination.pages > 1 && (
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

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Contact Submission Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all duration-200 flex-shrink-0"
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Status */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Status</label>
                <span className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold border-2 ${getStatusColor(selectedSubmission.status, selectedSubmission.isRead)}`}>
                  {getStatusIcon(selectedSubmission.status, selectedSubmission.isRead)}
                  {getStatusLabel(selectedSubmission.status, selectedSubmission.isRead)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Name</label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Email</label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium break-all">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Phone</label>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedSubmission.phone}</p>
                  </div>
                )}
                {selectedSubmission.category && (
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Category</label>
                    <p className="text-sm sm:text-base text-gray-900 font-medium">{selectedSubmission.category}</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Submitted Date</label>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">{formatDate(selectedSubmission.createdAt)}</p>
                </div>
              </div>

              {/* Subject */}
              {selectedSubmission.subject && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Subject</label>
                  <p className="text-base sm:text-lg text-gray-900 font-bold">{selectedSubmission.subject}</p>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 sm:mb-2">Message</label>
                <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border-2 border-gray-200">
                  <p className="text-sm sm:text-base text-gray-900 whitespace-pre-line leading-relaxed">{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => handleReply(selectedSubmission)}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  disabled={actionLoading}
                >
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Reply</span>
                </button>
                {selectedSubmission.status !== 'resolved' && selectedSubmission.status !== 'closed' && (
                  <button
                    onClick={() => handleMarkAsResponded(selectedSubmission._id)}
                    disabled={actionLoading}
                    className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span>{actionLoading ? 'Updating...' : 'Mark as Resolved'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-white">Send Reply</h2>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-all duration-200 flex-shrink-0"
                  disabled={replySending}
                >
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Recipient Info */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                  <div>
                    <span className="font-semibold text-gray-700">To:</span>
                    <span className="ml-2 text-gray-900">{selectedSubmission.name}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Email:</span>
                    <span className="ml-2 text-gray-900">{selectedSubmission.email}</span>
                  </div>
                  {selectedSubmission.subject && (
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-700">Subject:</span>
                      <span className="ml-2 text-gray-900">Re: {selectedSubmission.subject}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Original Message */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Original Message</label>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-2 border-gray-200 max-h-32 overflow-y-auto">
                  <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line leading-relaxed">{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Reply Message */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">Your Reply *</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply message here..."
                  rows={8}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  disabled={replySending}
                />
                <p className="text-xs text-gray-500 mt-1.5">This message will be sent to {selectedSubmission.email}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => setShowReplyModal(false)}
                  disabled={replySending}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-800 disabled:text-gray-400 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={replySending || !replyMessage.trim()}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {replySending ? (
                    <>
                      <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Send Reply</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
