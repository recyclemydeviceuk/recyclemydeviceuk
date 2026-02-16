import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Building2, Mail, Phone, Globe, CheckCircle, XCircle, Calendar, User } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';

interface RecyclerApplication {
  _id: string;
  companyName: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  businessDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  processedAt?: string;
  processedBy?: { email: string };
  rejectionReason?: string;
}

const RecyclerDetails: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<RecyclerApplication | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    const loadApplicationData = async () => {
      if (!id) return;
      
      try {
        const response: any = await adminAPI.recyclerApplications.getById(id);
        setApplicationData(response.data);
      } catch (error) {
        console.error('Error loading application:', error);
      } finally {
        setLoading(false);
      }
    };

    loadApplicationData();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    
    try {
      await adminAPI.recyclerApplications.approve(id);
      setShowApproveModal(false);
      setTimeout(() => {
        navigate('/panel/recyclers');
      }, 1000);
    } catch (error: any) {
      console.error('Error approving application:', error);
      alert(error?.message || 'Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!id || !rejectionReason.trim()) return;
    
    try {
      await adminAPI.recyclerApplications.reject(id, rejectionReason);
      setShowRejectModal(false);
      setRejectionReason('');
      setTimeout(() => {
        navigate('/panel/recyclers');
      }, 1000);
    } catch (error: any) {
      console.error('Error rejecting application:', error);
      alert(error?.message || 'Failed to reject application');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading application details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Application not found</p>
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
                  onClick={() => navigate('/panel/recyclers')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Recycler Application Review</h1>
                  <p className="text-sm text-gray-600 mt-1">{applicationData.companyName}</p>
                </div>
              </div>
              <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(applicationData.status)}`}>
                {applicationData.status === 'pending' && <Calendar className="w-4 h-4" />}
                {applicationData.status === 'approved' && <CheckCircle className="w-4 h-4" />}
                {applicationData.status === 'rejected' && <XCircle className="w-4 h-4" />}
                {applicationData.status.charAt(0).toUpperCase() + applicationData.status.slice(1)}
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Company Information */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Company Information</h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    <p className="text-lg font-bold text-gray-900">{applicationData.companyName}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Person</label>
                  <div className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <p className="text-gray-900 font-semibold">{applicationData.name}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a href={`mailto:${applicationData.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {applicationData.email}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a href={`tel:${applicationData.phone}`} className="text-gray-900 font-medium">
                      {applicationData.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`https://${applicationData.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {applicationData.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Description */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Business Description</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {applicationData.businessDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* Application Timeline */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Application Timeline</h2>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Application Submitted</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(applicationData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {applicationData.processedAt && (
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      applicationData.status === 'approved' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {applicationData.status === 'approved' ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        Application {applicationData.status === 'approved' ? 'Approved' : 'Rejected'}
                      </p>
                      <p className="text-lg font-bold text-gray-900">{new Date(applicationData.processedAt).toLocaleDateString()}</p>
                      {applicationData.processedBy && (
                        <p className="text-sm text-gray-500">by {applicationData.processedBy.email}</p>
                      )}
                    </div>
                  </div>
                )}

                {applicationData.rejectionReason && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-red-600">{applicationData.rejectionReason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {applicationData.status === 'pending' && (
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Review Actions</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-200 font-semibold text-lg"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Approve Application</span>
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all duration-200 font-semibold text-lg"
                  >
                    <XCircle className="w-6 h-6" />
                    <span>Reject Application</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Approve Application</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to approve <span className="font-bold text-gray-900">{applicationData.companyName}</span> as a recycler partner? 
              They will be notified via email and can start accepting devices.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleApprove}
                className="flex-1 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200"
              >
                Yes, Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Reject Application</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting <span className="font-bold text-gray-900">{applicationData.companyName}</span>'s application.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all resize-none"
              rows={4}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason('');
                }}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecyclerDetails;
