import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, Filter, Eye, LogOut, Download, Mail, Phone, Globe, Clock, CheckCircle, XCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface RecyclerApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  businessDescription: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
}

const RecyclerManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock recycler applications data
  const applications: RecyclerApplication[] = [
    {
      id: '1',
      companyName: 'EcoTech Recycling Ltd',
      contactName: 'Robert Johnson',
      email: 'robert@ecotech-recycling.com',
      phone: '+44 20 7123 4567',
      website: 'www.ecotech-recycling.com',
      businessDescription: 'We are a leading electronics recycling company with over 15 years of experience. We specialize in environmentally-friendly disposal and refurbishment of mobile devices, ensuring compliance with all UK environmental regulations.',
      status: 'pending',
      submittedDate: '2026-02-10',
    },
    {
      id: '2',
      companyName: 'GreenCircle Solutions',
      contactName: 'Emma Thompson',
      email: 'emma@greencircle.co.uk',
      phone: '+44 161 555 0123',
      website: 'www.greencircle.co.uk',
      businessDescription: 'GreenCircle Solutions is committed to sustainable electronics recycling. We process thousands of devices monthly and have partnerships with major retailers across the UK. Our certified facilities ensure safe and ethical recycling practices.',
      status: 'approved',
      submittedDate: '2026-02-08',
      reviewedDate: '2026-02-09',
      reviewedBy: 'Admin',
    },
    {
      id: '3',
      companyName: 'Mobile Refresh UK',
      contactName: 'David Martinez',
      email: 'david@mobilerefresh.uk',
      phone: '+44 121 777 8899',
      website: 'www.mobilerefresh.uk',
      businessDescription: 'Mobile Refresh UK focuses on refurbishing and recycling smartphones and tablets. We have a dedicated team of technicians and a state-of-the-art facility in Birmingham. Our goal is to reduce e-waste while providing affordable refurbished devices.',
      status: 'pending',
      submittedDate: '2026-02-09',
    },
    {
      id: '4',
      companyName: 'TechCycle Pro',
      contactName: 'Sarah Williams',
      email: 'sarah@techcyclepro.com',
      phone: '+44 113 222 3344',
      website: 'www.techcyclepro.com',
      businessDescription: 'TechCycle Pro is a family-owned business specializing in mobile device recycling and refurbishment. We pride ourselves on transparent pricing and excellent customer service. Our operations are fully certified and environmentally compliant.',
      status: 'approved',
      submittedDate: '2026-02-07',
      reviewedDate: '2026-02-08',
      reviewedBy: 'Admin',
    },
    {
      id: '5',
      companyName: 'QuickRecycle Ltd',
      contactName: 'Michael Brown',
      email: 'michael@quickrecycle.com',
      phone: '+44 141 888 9900',
      website: 'www.quickrecycle.com',
      businessDescription: 'Small startup focusing on quick device recycling with instant payment options.',
      status: 'rejected',
      submittedDate: '2026-02-06',
      reviewedDate: '2026-02-07',
      reviewedBy: 'Admin',
    },
    {
      id: '6',
      companyName: 'PhoneReborn Industries',
      contactName: 'Jessica Lee',
      email: 'jessica@phonereborn.co.uk',
      phone: '+44 151 444 5566',
      website: 'www.phonereborn.co.uk',
      businessDescription: 'PhoneReborn Industries has been in the electronics recycling business for 10 years. We specialize in high-volume processing and work with corporate clients to manage their IT asset disposal. Our facility is ISO certified and we maintain strict data security protocols.',
      status: 'pending',
      submittedDate: '2026-02-11',
    },
  ];

  const filteredApplications = applications
    .filter(app => {
      const matchesSearch = 
        app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.phone.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime());

  const totalApplications = applications.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const approvedRecyclers = applications.filter(app => app.status === 'approved').length;
  const rejectedApplications = applications.filter(app => app.status === 'rejected').length;

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
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
                <h1 className="text-2xl font-bold text-gray-800">Recycler Management</h1>
                <p className="text-sm text-gray-600 mt-1">Review and manage recycler partnership applications</p>
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
                    <p className="text-sm text-gray-600 mb-1">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-800">{totalApplications}</p>
                  </div>
                  <div className="w-12 h-12 bg-[#1b981b] rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-yellow-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Review</p>
                    <p className="text-3xl font-bold text-gray-800">{pendingApplications}</p>
                    <p className="text-xs text-yellow-600 mt-1 font-semibold">Needs Attention</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Approved Partners</p>
                    <p className="text-3xl font-bold text-gray-800">{approvedRecyclers}</p>
                    <p className="text-xs text-green-600 mt-1 font-semibold">Active</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-red-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Rejected</p>
                    <p className="text-3xl font-bold text-gray-800">{rejectedApplications}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-white" />
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
                    placeholder="Search by company name, contact, email, or phone..."
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
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
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
                Showing <span className="font-semibold text-gray-900">{filteredApplications.length}</span> of <span className="font-semibold text-gray-900">{totalApplications}</span> applications
              </p>
            </div>

            {/* Applications List */}
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-xl border-2 border-gray-200 hover:border-[#1b981b] hover:shadow-lg transition-all duration-200 p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Application Info */}
                    <div className="flex-1 space-y-3">
                      {/* Company Name and Status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-[#1b981b]" />
                          <h3 className="text-xl font-bold text-gray-900">{application.companyName}</h3>
                        </div>
                        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(application.status)}`}>
                          {getStatusIcon(application.status)}
                          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </span>
                      </div>

                      {/* Contact Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Contact Person</p>
                            <p className="font-semibold text-gray-900">{application.contactName}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{application.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{application.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Globe className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Website</p>
                            <p className="font-medium text-blue-600">{application.website}</p>
                          </div>
                        </div>
                      </div>

                      {/* Business Description Preview */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-500 mb-1 font-semibold">Business Description:</p>
                        <p className="text-sm text-gray-700 line-clamp-2">{application.businessDescription}</p>
                      </div>

                      {/* Dates */}
                      <div className="flex items-center gap-6 text-xs text-gray-500">
                        <div>
                          <span className="font-semibold">Submitted: </span>
                          <span>{application.submittedDate}</span>
                        </div>
                        {application.reviewedDate && (
                          <div>
                            <span className="font-semibold">Reviewed: </span>
                            <span>{application.reviewedDate}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* View Button */}
                    <div className="flex items-center gap-2 lg:border-l-2 lg:pl-6 border-gray-200">
                      <button
                        onClick={() => navigate(`/panel/recyclers/${application.id}`)}
                        className="flex items-center gap-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold whitespace-nowrap"
                      >
                        <Eye className="w-5 h-5" />
                        <span>Review</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredApplications.length === 0 && (
              <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerManagement;
