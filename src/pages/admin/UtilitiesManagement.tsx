import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, X, Save, Settings } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

type TabType = 'orderStatuses' | 'paymentStatuses' | 'brands' | 'conditions' | 'blogCategories' | 'faqCategories';

interface OrderStatus {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface PaymentStatus {
  id: string;
  name: string;
  color: string;
  description: string;
}

interface Brand {
  id: string;
  name: string;
  logo?: string;
}

interface Condition {
  id: string;
  name: string;
  description: string;
}

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}

interface FAQCategory {
  id: string;
  name: string;
  description: string;
}

const UtilitiesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('orderStatuses');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock data
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([
    { id: '1', name: 'Pending', color: '#F59E0B', description: 'Order is awaiting confirmation' },
    { id: '2', name: 'Confirmed', color: '#3B82F6', description: 'Order has been confirmed' },
    { id: '3', name: 'Collected', color: '#8B5CF6', description: 'Device has been collected' },
    { id: '4', name: 'Completed', color: '#10B981', description: 'Order is completed' },
    { id: '5', name: 'Cancelled', color: '#EF4444', description: 'Order has been cancelled' },
  ]);

  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([
    { id: '1', name: 'Pending', color: '#F59E0B', description: 'Payment is pending' },
    { id: '2', name: 'Paid', color: '#10B981', description: 'Payment completed successfully' },
    { id: '3', name: 'Failed', color: '#EF4444', description: 'Payment failed' },
  ]);

  const [brands, setBrands] = useState<Brand[]>([
    { id: '1', name: 'Apple', logo: 'https://cdn-icons-png.flaticon.com/512/731/731985.png' },
    { id: '2', name: 'Samsung', logo: 'https://cdn-icons-png.flaticon.com/512/882/882799.png' },
    { id: '3', name: 'Google', logo: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' },
    { id: '4', name: 'OnePlus', logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969176.png' },
    { id: '5', name: 'Xiaomi', logo: 'https://cdn-icons-png.flaticon.com/512/882/882761.png' },
    { id: '6', name: 'Huawei', logo: 'https://cdn-icons-png.flaticon.com/512/882/882784.png' },
    { id: '7', name: 'Sony', logo: 'https://cdn-icons-png.flaticon.com/512/882/882706.png' },
    { id: '8', name: 'Nokia', logo: 'https://cdn-icons-png.flaticon.com/512/882/882738.png' },
  ]);

  const [conditions, setConditions] = useState<Condition[]>([
    { id: '1', name: 'Excellent', description: 'Like new, no visible wear' },
    { id: '2', name: 'Good', description: 'Minor cosmetic wear, fully functional' },
    { id: '3', name: 'Fair', description: 'Visible wear but works properly' },
    { id: '4', name: 'Poor', description: 'Heavy wear, may have issues' },
    { id: '5', name: 'Broken', description: 'Not functional, for parts only' },
  ]);

  const [blogCategories, setBlogCategories] = useState<BlogCategory[]>([
    { id: '1', name: 'Recycling Tips', slug: 'recycling-tips', description: 'Tips and guides for recycling electronics' },
    { id: '2', name: 'Device Reviews', slug: 'device-reviews', description: 'Reviews and comparisons of mobile devices' },
    { id: '3', name: 'Sustainability', slug: 'sustainability', description: 'Environmental impact and sustainability news' },
    { id: '4', name: 'Tech News', slug: 'tech-news', description: 'Latest technology news and updates' },
    { id: '5', name: 'How-To Guides', slug: 'how-to-guides', description: 'Step-by-step guides and tutorials' },
  ]);

  const [faqCategories, setFaqCategories] = useState<FAQCategory[]>([
    { id: '1', name: 'Getting Started', description: 'Basic information about using our service' },
    { id: '2', name: 'Device Condition', description: 'Questions about device condition and grading' },
    { id: '3', name: 'Selling Process', description: 'How to sell and ship your device' },
    { id: '4', name: 'Payment', description: 'Payment methods and timing' },
    { id: '5', name: 'Security & Data', description: 'Data privacy and security questions' },
    { id: '6', name: 'Problems & Returns', description: 'Troubleshooting and returns' },
  ]);

  const [formData, setFormData] = useState<any>({});

  const openAddModal = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({});
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (modalType === 'add') {
      const newItem = { ...formData, id: Date.now().toString() };
      switch (activeTab) {
        case 'orderStatuses':
          setOrderStatuses([...orderStatuses, newItem]);
          break;
        case 'paymentStatuses':
          setPaymentStatuses([...paymentStatuses, newItem]);
          break;
        case 'brands':
          setBrands([...brands, newItem]);
          break;
        case 'conditions':
          setConditions([...conditions, newItem]);
          break;
        case 'blogCategories':
          setBlogCategories([...blogCategories, newItem]);
          break;
        case 'faqCategories':
          setFaqCategories([...faqCategories, newItem]);
          break;
      }
    } else {
      switch (activeTab) {
        case 'orderStatuses':
          setOrderStatuses(orderStatuses.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'paymentStatuses':
          setPaymentStatuses(paymentStatuses.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'brands':
          setBrands(brands.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'conditions':
          setConditions(conditions.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'blogCategories':
          setBlogCategories(blogCategories.map(item => item.id === editingItem.id ? formData : item));
          break;
        case 'faqCategories':
          setFaqCategories(faqCategories.map(item => item.id === editingItem.id ? formData : item));
          break;
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    switch (activeTab) {
      case 'orderStatuses':
        setOrderStatuses(orderStatuses.filter(item => item.id !== id));
        break;
      case 'paymentStatuses':
        setPaymentStatuses(paymentStatuses.filter(item => item.id !== id));
        break;
      case 'brands':
        setBrands(brands.filter(item => item.id !== id));
        break;
      case 'conditions':
        setConditions(conditions.filter(item => item.id !== id));
        break;
      case 'blogCategories':
        setBlogCategories(blogCategories.filter(item => item.id !== id));
        break;
      case 'faqCategories':
        setFaqCategories(faqCategories.filter(item => item.id !== id));
        break;
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'orderStatuses': return orderStatuses;
      case 'paymentStatuses': return paymentStatuses;
      case 'brands': return brands;
      case 'conditions': return conditions;
      case 'blogCategories': return blogCategories;
      case 'faqCategories': return faqCategories;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'orderStatuses': return 'Order Statuses';
      case 'paymentStatuses': return 'Payment Statuses';
      case 'brands': return 'Brands';
      case 'conditions': return 'Device Conditions';
      case 'blogCategories': return 'Blog Categories';
      case 'faqCategories': return 'FAQ Categories';
    }
  };

  const tabs = [
    { id: 'orderStatuses' as TabType, label: 'Order Statuses', color: 'blue' },
    { id: 'paymentStatuses' as TabType, label: 'Payment Statuses', color: 'green' },
    { id: 'brands' as TabType, label: 'Brands', color: 'purple' },
    { id: 'conditions' as TabType, label: 'Device Conditions', color: 'orange' },
    { id: 'blogCategories' as TabType, label: 'Blog Categories', color: 'pink' },
    { id: 'faqCategories' as TabType, label: 'FAQ Categories', color: 'indigo' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Utilities Management</h1>
                <p className="text-sm text-gray-600 mt-1">Manage system settings and configurations</p>
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
            <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
              <div className="bg-white rounded-xl border-2 border-blue-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Statuses</p>
                    <p className="text-3xl font-bold text-gray-800">{orderStatuses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Statuses</p>
                    <p className="text-3xl font-bold text-gray-800">{paymentStatuses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-purple-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Brands</p>
                    <p className="text-3xl font-bold text-gray-800">{brands.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-orange-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Conditions</p>
                    <p className="text-3xl font-bold text-gray-800">{conditions.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-pink-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Blog Categories</p>
                    <p className="text-3xl font-bold text-gray-800">{blogCategories.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-indigo-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">FAQ Categories</p>
                    <p className="text-3xl font-bold text-gray-800">{faqCategories.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center">
                    <Settings className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="flex border-b-2 border-gray-200 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? `bg-${tab.color}-50 text-${tab.color}-700 border-b-4 border-${tab.color}-600`
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{getTabTitle()}</h2>
                  <button
                    onClick={openAddModal}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Items List */}
                <div className="space-y-3">
                  {getCurrentData().map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-[#1b981b] hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        {/* Brand Logo */}
                        {activeTab === 'brands' && item.logo && (
                          <div className="w-12 h-12 rounded-lg border-2 border-gray-200 overflow-hidden flex-shrink-0 bg-white">
                            <img 
                              src={item.logo} 
                              alt={item.name}
                              className="w-full h-full object-contain p-1"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                            {item.color && (
                              <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {modalType === 'add' ? 'Add New' : 'Edit'} {getTabTitle().slice(0, -1)}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                  placeholder="Enter name"
                />
              </div>

              {/* Color Field (for statuses) */}
              {(activeTab === 'orderStatuses' || activeTab === 'paymentStatuses') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color || '#1b981b'}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-16 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                    />
                    <input
                      type="text"
                      value={formData.color || ''}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="#1b981b"
                    />
                  </div>
                </div>
              )}

              {/* Logo Field (for brands) */}
              {activeTab === 'brands' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="text"
                    value={formData.logo || ''}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                    placeholder="https://example.com/logo.png"
                  />
                  {formData.logo && (
                    <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Logo Preview</p>
                      <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-white mx-auto">
                        <img 
                          src={formData.logo} 
                          alt="Logo preview"
                          className="w-full h-full object-contain p-2"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Slug Field (for blog categories) */}
              {activeTab === 'blogCategories' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                    placeholder="blog-category-slug"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly version (lowercase, hyphens only)</p>
                </div>
              )}

              {/* Description Field */}
              {(activeTab === 'orderStatuses' || activeTab === 'paymentStatuses' || activeTab === 'conditions' || activeTab === 'blogCategories' || activeTab === 'faqCategories') && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] resize-none"
                    placeholder="Enter description"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  <span>{modalType === 'add' ? 'Add' : 'Save'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilitiesManagement;
