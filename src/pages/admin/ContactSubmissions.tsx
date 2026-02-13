import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Search, Filter, Eye, Mail, Phone, Calendar, MessageSquare, CheckCircle, XCircle, Clock } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface ContactSubmission {
  id: string;
  fullName: string;
  email: string;
  orderNumber?: string;
  subject: string;
  message: string;
  submittedDate: string;
  status: 'new' | 'read' | 'responded';
}

const ContactSubmissions: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock contact submissions data
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([
    {
      id: '1',
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      orderNumber: 'RM1001',
      subject: 'Query about device valuation',
      message: 'Hi, I have an iPhone 14 Pro in excellent condition. I got a quote of £650 but I think it should be worth more. Can you help me understand how the pricing works? The device is barely 6 months old with no scratches.',
      submittedDate: '2026-02-11 14:30',
      status: 'new'
    },
    {
      id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      subject: 'Payment not received',
      message: 'I sent my Samsung Galaxy S23 two weeks ago and it was received according to the tracking. The buyer confirmed the condition but I still haven\'t received payment. My order number is RM1015. Can you please check the status?',
      submittedDate: '2026-02-11 11:15',
      status: 'read'
    },
    {
      id: '3',
      fullName: 'Michael Brown',
      email: 'michael.b@email.com',
      orderNumber: 'RM1025',
      subject: 'Device return request',
      message: 'The buyer reduced the price from £450 to £280 saying there are scratches, but my phone was in perfect condition when I sent it. I want to reject their offer and get my device back. How do I proceed?',
      submittedDate: '2026-02-10 16:45',
      status: 'responded'
    },
    {
      id: '4',
      fullName: 'Emma Wilson',
      email: 'emma.w@email.com',
      subject: 'How to track my device',
      message: 'I posted my phone yesterday using the prepaid label but I can\'t find any tracking information in my email. How can I track if my device has been received by the buyer?',
      submittedDate: '2026-02-10 09:20',
      status: 'responded'
    },
    {
      id: '5',
      fullName: 'David Taylor',
      email: 'david.t@email.com',
      orderNumber: 'RM1032',
      subject: 'Question about device condition',
      message: 'My phone screen has a tiny hairline crack that\'s barely visible. Should I select "Good" or "Fair" condition? I don\'t want any price reductions later. Please advise.',
      submittedDate: '2026-02-09 18:30',
      status: 'read'
    },
    {
      id: '6',
      fullName: 'Sophie Anderson',
      email: 'sophie.a@email.com',
      subject: 'Unable to print shipping label',
      message: 'I\'ve completed my order but the shipping label PDF won\'t download. I\'ve tried multiple browsers but it keeps showing an error. Can you please email it to me directly?',
      submittedDate: '2026-02-09 13:55',
      status: 'new'
    },
    {
      id: '7',
      fullName: 'James Miller',
      email: 'james.m@email.com',
      orderNumber: 'RM1048',
      subject: 'Selling multiple devices',
      message: 'I have 3 old iPhones to sell - iPhone 11, iPhone 12, and iPhone 13. Do I need to create separate orders for each or can I send them together? Also, will I get separate payments or one combined payment?',
      submittedDate: '2026-02-08 15:40',
      status: 'responded'
    },
    {
      id: '8',
      fullName: 'Lucy Roberts',
      email: 'lucy.r@email.com',
      subject: 'Payment method question',
      message: 'I see the payment is sent via bank transfer. I don\'t have a UK bank account, only PayPal. Is there any way to receive payment through PayPal instead?',
      submittedDate: '2026-02-08 10:25',
      status: 'new'
    },
  ]);

  const filteredSubmissions = submissions
    .filter(sub => {
      const matchesSearch = 
        sub.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.orderNumber?.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

  const totalSubmissions = submissions.length;
  const newSubmissions = submissions.filter(s => s.status === 'new').length;
  const readSubmissions = submissions.filter(s => s.status === 'read').length;
  const respondedSubmissions = submissions.filter(s => s.status === 'responded').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'read':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'responded':
        return 'bg-green-100 text-green-700 border-green-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new':
        return <Mail className="w-4 h-4" />;
      case 'read':
        return <Eye className="w-4 h-4" />;
      case 'responded':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
    // Mark as read if it was new
    if (submission.status === 'new') {
      setSubmissions(submissions.map(s => 
        s.id === submission.id ? { ...s, status: 'read' as const } : s
      ));
    }
  };

  const handleMarkAsResponded = (id: string) => {
    setSubmissions(submissions.map(s => 
      s.id === id ? { ...s, status: 'responded' as const } : s
    ));
    setShowDetailModal(false);
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
                <h1 className="text-2xl font-bold text-gray-800">Contact Form Submissions</h1>
                <p className="text-sm text-gray-600 mt-1">Manage customer inquiries and support requests</p>
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
                    <p className="text-sm text-gray-600 mb-1">Total Submissions</p>
                    <p className="text-3xl font-bold text-gray-800">{totalSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-blue-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">New Messages</p>
                    <p className="text-3xl font-bold text-gray-800">{newSubmissions}</p>
                    <p className="text-xs text-blue-600 mt-1 font-semibold">Needs Attention</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-yellow-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Read</p>
                    <p className="text-3xl font-bold text-gray-800">{readSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Responded</p>
                    <p className="text-3xl font-bold text-gray-800">{respondedSubmissions}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
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
                    placeholder="Search by name, email, subject, or order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all bg-white cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="responded">Responded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredSubmissions.length}</span> of <span className="font-semibold text-gray-900">{totalSubmissions}</span> submissions
              </p>
            </div>

            {/* Submissions List */}
            <div className="space-y-4">
              {filteredSubmissions.map((submission) => (
                <div
                  key={submission.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Submission Info */}
                    <div className="flex-1 space-y-3">
                      {/* Name and Status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{submission.fullName}</h3>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(submission.status)}`}>
                          {getStatusIcon(submission.status)}
                          {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                        </span>
                      </div>

                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{submission.email}</span>
                        </div>
                        {submission.orderNumber && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-900">Order: {submission.orderNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{submission.submittedDate}</span>
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Subject:</p>
                        <p className="text-base font-bold text-gray-900 mt-1">{submission.subject}</p>
                      </div>

                      {/* Message Preview */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-sm text-gray-700 line-clamp-2">{submission.message}</p>
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center gap-2 lg:border-l-2 lg:pl-6 border-gray-200">
                      <button
                        onClick={() => handleViewDetails(submission)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap"
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
            {filteredSubmissions.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No submissions found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Contact Submission Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all duration-200"
                >
                  <XCircle className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border-2 ${getStatusColor(selectedSubmission.status)}`}>
                  {getStatusIcon(selectedSubmission.status)}
                  {selectedSubmission.status.charAt(0).toUpperCase() + selectedSubmission.status.slice(1)}
                </span>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <p className="text-gray-900 font-medium">{selectedSubmission.fullName}</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900 font-medium">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.orderNumber && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Order Number</label>
                    <p className="text-gray-900 font-medium">{selectedSubmission.orderNumber}</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Submitted Date</label>
                  <p className="text-gray-900 font-medium">{selectedSubmission.submittedDate}</p>
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                <p className="text-gray-900 font-bold text-lg">{selectedSubmission.subject}</p>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                  <p className="text-gray-900 whitespace-pre-line leading-relaxed">{selectedSubmission.message}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => window.open(`mailto:${selectedSubmission.email}?subject=Re: ${selectedSubmission.subject}`)}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  <span>Reply via Email</span>
                </button>
                {selectedSubmission.status !== 'responded' && (
                  <button
                    onClick={() => handleMarkAsResponded(selectedSubmission.id)}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark as Responded</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSubmissions;
