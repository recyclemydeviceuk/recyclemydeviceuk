import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Search, Filter, Loader } from 'lucide-react';

interface Recycler {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  website?: string;
  businessDescription?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
}

export default function RecyclerApplications() {
  const [recyclers, setRecyclers] = useState<Recycler[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecycler, setSelectedRecycler] = useState<Recycler | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [approvalNotes, setApprovalNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRecyclers();
  }, [filter]);

  const fetchRecyclers = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== 'all') queryParams.append('status', filter);

      const response = await fetch(`http://localhost:5000/api/admin/recyclers?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setRecyclers(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch recyclers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedRecycler) return;

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/recyclers/${selectedRecycler._id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ notes: approvalNotes }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Recycler approved successfully! Login credentials have been sent via email.');
        setShowApproveModal(false);
        setApprovalNotes('');
        setSelectedRecycler(null);
        fetchRecyclers();
      } else {
        alert(data.message || 'Failed to approve recycler');
      }
    } catch (error) {
      console.error('Approval error:', error);
      alert('Failed to approve recycler');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRecycler || !rejectionReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    try {
      setActionLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/recyclers/${selectedRecycler._id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ reason: rejectionReason }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Recycler rejected. Rejection email has been sent.');
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedRecycler(null);
        fetchRecyclers();
      } else {
        alert(data.message || 'Failed to reject recycler');
      }
    } catch (error) {
      console.error('Rejection error:', error);
      alert('Failed to reject recycler');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredRecyclers = recyclers.filter(recycler =>
    recycler.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recycler.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recycler.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recycler Applications</h1>
          <p className="text-gray-600">Review and manage recycler partner applications</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredRecyclers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">There are no {filter !== 'all' ? filter : ''} applications at the moment.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applied On</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredRecyclers.map((recycler) => (
                    <tr key={recycler._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">{recycler.companyName}</div>
                          {recycler.website && (
                            <a href={recycler.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                              {recycler.website}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{recycler.name}</div>
                          <div className="text-sm text-gray-600">{recycler.email}</div>
                          <div className="text-sm text-gray-600">{recycler.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(recycler.status)}`}>
                          {recycler.status.charAt(0).toUpperCase() + recycler.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(recycler.createdAt).toLocaleDateString('en-GB', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedRecycler(recycler);
                              document.getElementById('detailsModal')?.classList.remove('hidden');
                            }}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {recycler.status === 'pending' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedRecycler(recycler);
                                  setShowApproveModal(true);
                                }}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Approve"
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedRecycler(recycler);
                                  setShowRejectModal(true);
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <div id="detailsModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
          </div>
          {selectedRecycler && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Company Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><span className="font-medium">Company Name:</span> {selectedRecycler.companyName}</div>
                  {selectedRecycler.website && <div><span className="font-medium">Website:</span> <a href={selectedRecycler.website} target="_blank" className="text-primary hover:underline">{selectedRecycler.website}</a></div>}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><span className="font-medium">Name:</span> {selectedRecycler.name}</div>
                  <div><span className="font-medium">Email:</span> {selectedRecycler.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedRecycler.phone}</div>
                </div>
              </div>

              {selectedRecycler.businessDescription && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Business Description</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedRecycler.businessDescription}</p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Application Status</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div><span className="font-medium">Status:</span> <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(selectedRecycler.status)}`}>{selectedRecycler.status}</span></div>
                  <div><span className="font-medium">Applied On:</span> {new Date(selectedRecycler.createdAt).toLocaleString()}</div>
                  {selectedRecycler.approvedAt && <div><span className="font-medium">Approved On:</span> {new Date(selectedRecycler.approvedAt).toLocaleString()}</div>}
                  {selectedRecycler.rejectedAt && <div><span className="font-medium">Rejected On:</span> {new Date(selectedRecycler.rejectedAt).toLocaleString()}</div>}
                  {selectedRecycler.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <span className="font-medium text-red-900">Rejection Reason:</span>
                      <p className="text-red-800 mt-1">{selectedRecycler.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className="p-6 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => {
                document.getElementById('detailsModal')?.classList.add('hidden');
                setSelectedRecycler(null);
              }}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Approve Application</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to approve <strong>{selectedRecycler?.companyName}</strong>?
              </p>
              <p className="text-sm text-gray-500 mb-4">
                An email with login credentials will be automatically sent to <strong>{selectedRecycler?.email}</strong>
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Approval Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  placeholder="Add any notes about this approval..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApproveModal(false);
                  setApprovalNotes('');
                }}
                disabled={actionLoading}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Approving...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Approve & Send Credentials</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Reject Application</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Please provide a reason for rejecting <strong>{selectedRecycler?.companyName}</strong>
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rejection Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Explain why this application is being rejected..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                disabled={actionLoading}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                {actionLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Rejecting...</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" />
                    <span>Reject & Send Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
