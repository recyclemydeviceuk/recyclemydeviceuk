import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, X, Save, Settings, Loader2 } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';

type TabType = 'orderStatuses' | 'paymentStatuses' | 'brands' | 'conditions' | 'storageOptions' | 'categories' | 'blogCategories' | 'faqCategories';

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

interface StorageOption {
  id: string;
  name: string;
  category: string;
}

interface DeviceCategory {
  id: string;
  value: string;
  label: string;
}

const UtilitiesManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('brands');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Backend data
  const [orderStatuses, setOrderStatuses] = useState<OrderStatus[]>([]);

  const [paymentStatuses, setPaymentStatuses] = useState<PaymentStatus[]>([]);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [storageOptions, setStorageOptions] = useState<StorageOption[]>([]);
  const [categories, setCategories] = useState<DeviceCategory[]>([]);

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
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [shouldDeleteLogo, setShouldDeleteLogo] = useState<boolean>(false);

  // Fetch utilities data from backend
  useEffect(() => {
    fetchUtilitiesData();
  }, []);

  const fetchUtilitiesData = async () => {
    try {
      setLoading(true);
      const [brandsRes, orderStatusRes, paymentStatusRes, categoriesRes, storageRes, conditionsRes, blogCategoriesRes, faqCategoriesRes]: any[] = await Promise.all([
        adminAPI.utilities.getBrands(),
        adminAPI.utilities.getOrderStatuses().catch(() => ({ data: [] })),
        adminAPI.utilities.getPaymentStatuses().catch(() => ({ data: [] })),
        adminAPI.utilities.getCategories(),
        adminAPI.utilities.getStorageOptions(),
        adminAPI.utilities.getConditions(),
        adminAPI.utilities.getBlogCategories(),
        adminAPI.utilities.getFAQCategories(),
      ]);

      // Set brands
      setBrands((brandsRes.data || []).map((b: any) => ({ id: b._id, name: b.name, logo: b.logo })));

      // Set order statuses
      setOrderStatuses((orderStatusRes.data || []).map((s: any) => ({
        id: s._id || s.id,
        name: s.name || s.label,
        color: s.color || '#1b981b',
        description: s.description || '',
      })));

      // Set payment statuses
      setPaymentStatuses((paymentStatusRes.data || []).map((s: any) => ({
        id: s._id || s.id,
        name: s.name || s.label,
        color: s.color || '#1b981b',
        description: s.description || '',
      })));

      // Set device categories from database
      setCategories((categoriesRes.data || []).map((c: any) => ({
        id: c._id,
        value: c.value,
        label: c.label,
      })));

      // Set storage options from database
      setStorageOptions((storageRes.data || []).map((s: any) => ({
        id: s._id,
        name: s.name,
        category: s.category,
        description: s.description,
      })));

      // Set conditions from database
      setConditions((conditionsRes.data || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        description: c.description,
      })));

      // Set blog categories from database
      setBlogCategories((blogCategoriesRes.data || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        slug: c.slug,
        description: c.description,
      })));

      // Set FAQ categories from database
      setFaqCategories((faqCategoriesRes.data || []).map((c: any) => ({
        id: c._id,
        name: c.name,
        description: c.description,
      })));
    } catch (err: any) {
      console.error('Error fetching utilities:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData({});
    setLogoFile(null);
    setLogoPreview('');
    setShouldDeleteLogo(false);
    setShowModal(true);
  };

  const openEditModal = (item: any) => {
    setModalType('edit');
    setEditingItem(item);
    setFormData(item);
    setLogoFile(null);
    setLogoPreview(item.logo || '');
    setShouldDeleteLogo(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({});
    setLogoFile(null);
    setLogoPreview('');
    setShouldDeleteLogo(false);
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setSubmitting(true);
      let response: any;

      // Validate required fields
      if (!formData.name && !formData.label) {
        alert('Name or Label is required');
        return;
      }

      // Call appropriate backend API based on tab and mode
      if (modalType === 'add') {
        switch (activeTab) {
          case 'brands':
            const brandFormData = new FormData();
            brandFormData.append('name', formData.name);
            if (logoFile) {
              brandFormData.append('logo', logoFile);
            }
            response = await adminAPI.utilities.createBrand(brandFormData);
            setBrands([...brands, { id: response.data._id, name: response.data.name, logo: response.data.logo }]);
            break;
          case 'orderStatuses':
            response = await adminAPI.utilities.createOrderStatus(formData);
            setOrderStatuses([...orderStatuses, { id: response.data._id, name: response.data.name, color: response.data.color, description: response.data.description }]);
            break;
          case 'paymentStatuses':
            response = await adminAPI.utilities.createPaymentStatus(formData);
            setPaymentStatuses([...paymentStatuses, { id: response.data._id, name: response.data.name, color: response.data.color, description: response.data.description }]);
            break;
          case 'conditions':
            response = await adminAPI.utilities.createCondition(formData);
            setConditions([...conditions, { id: response.data._id, name: response.data.name, description: response.data.description }]);
            break;
          case 'storageOptions':
            response = await adminAPI.utilities.createStorageOption(formData);
            setStorageOptions([...storageOptions, { id: response.data._id, name: response.data.name, category: response.data.category }]);
            break;
          case 'categories':
            response = await adminAPI.utilities.createCategory(formData);
            setCategories([...categories, { id: response.data._id, value: response.data.value, label: response.data.label }]);
            break;
          case 'blogCategories':
            response = await adminAPI.utilities.createBlogCategory(formData);
            setBlogCategories([...blogCategories, { id: response.data._id, name: response.data.name, slug: response.data.slug, description: response.data.description }]);
            break;
          case 'faqCategories':
            response = await adminAPI.utilities.createFAQCategory(formData);
            setFaqCategories([...faqCategories, { id: response.data._id, name: response.data.name, description: response.data.description }]);
            break;
        }
      } else {
        // Update existing item
        const id = editingItem.id;
        switch (activeTab) {
          case 'brands':
            if (!formData.name || formData.name.trim() === '') {
              alert('Brand name is required');
              return;
            }
            const brandUpdateFormData = new FormData();
            brandUpdateFormData.append('name', formData.name.trim());
            if (logoFile) {
              brandUpdateFormData.append('logo', logoFile);
            }
            if (shouldDeleteLogo) {
              brandUpdateFormData.append('deleteLogo', 'true');
            }
            console.log('Updating brand with name:', formData.name, 'Delete logo:', shouldDeleteLogo);
            response = await adminAPI.utilities.updateBrand(id, brandUpdateFormData);
            setBrands(brands.map(item => item.id === id ? { id, name: response.data.name, logo: response.data.logo } : item));
            break;
          case 'orderStatuses':
            response = await adminAPI.utilities.updateOrderStatus(id, formData);
            setOrderStatuses(orderStatuses.map(item => item.id === id ? { id, name: response.data.name, color: response.data.color, description: response.data.description } : item));
            break;
          case 'paymentStatuses':
            response = await adminAPI.utilities.updatePaymentStatus(id, formData);
            setPaymentStatuses(paymentStatuses.map(item => item.id === id ? { id, name: response.data.name, color: response.data.color, description: response.data.description } : item));
            break;
          case 'conditions':
            response = await adminAPI.utilities.updateCondition(id, formData);
            setConditions(conditions.map(item => item.id === id ? { id, name: response.data.name, description: response.data.description } : item));
            break;
          case 'storageOptions':
            response = await adminAPI.utilities.updateStorageOption(id, formData);
            setStorageOptions(storageOptions.map(item => item.id === id ? { id, name: response.data.name, category: response.data.category } : item));
            break;
          case 'categories':
            response = await adminAPI.utilities.updateCategory(id, formData);
            setCategories(categories.map(item => item.id === id ? { id, value: response.data.value, label: response.data.label } : item));
            break;
          case 'blogCategories':
            response = await adminAPI.utilities.updateBlogCategory(id, formData);
            setBlogCategories(blogCategories.map(item => item.id === id ? { id, name: response.data.name, slug: response.data.slug, description: response.data.description } : item));
            break;
          case 'faqCategories':
            response = await adminAPI.utilities.updateFAQCategory(id, formData);
            setFaqCategories(faqCategories.map(item => item.id === id ? { id, name: response.data.name, description: response.data.description } : item));
            break;
        }
      }
      
      // Show success message
      alert(`${modalType === 'add' ? 'Created' : 'Updated'} successfully!`);
      closeModal();
    } catch (err: any) {
      console.error('Error saving:', err);
      const errorMsg = err.response?.data?.message || err.message || 'Failed to save. Please try again.';
      alert(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      // Call backend API to delete
      switch (activeTab) {
        case 'brands':
          await adminAPI.utilities.deleteBrand(id);
          setBrands(brands.filter(item => item.id !== id));
          break;
        case 'orderStatuses':
          await adminAPI.utilities.deleteOrderStatus(id);
          setOrderStatuses(orderStatuses.filter(item => item.id !== id));
          break;
        case 'paymentStatuses':
          await adminAPI.utilities.deletePaymentStatus(id);
          setPaymentStatuses(paymentStatuses.filter(item => item.id !== id));
          break;
        case 'conditions':
          await adminAPI.utilities.deleteCondition(id);
          setConditions(conditions.filter(item => item.id !== id));
          break;
        case 'storageOptions':
          await adminAPI.utilities.deleteStorageOption(id);
          setStorageOptions(storageOptions.filter(item => item.id !== id));
          break;
        case 'categories':
          await adminAPI.utilities.deleteCategory(id);
          setCategories(categories.filter(item => item.id !== id));
          break;
        case 'blogCategories':
          await adminAPI.utilities.deleteBlogCategory(id);
          setBlogCategories(blogCategories.filter(item => item.id !== id));
          break;
        case 'faqCategories':
          await adminAPI.utilities.deleteFAQCategory(id);
          setFaqCategories(faqCategories.filter(item => item.id !== id));
          break;
      }
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert(err.response?.data?.message || 'Failed to delete');
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'orderStatuses': return orderStatuses;
      case 'paymentStatuses': return paymentStatuses;
      case 'brands': return brands;
      case 'conditions': return conditions;
      case 'storageOptions': return storageOptions;
      case 'categories': return categories;
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
      case 'storageOptions': return 'Storage Options';
      case 'categories': return 'Device Categories';
      case 'blogCategories': return 'Blog Categories';
      case 'faqCategories': return 'FAQ Categories';
    }
  };

  const tabs = [
    { id: 'orderStatuses' as TabType, label: 'Order Statuses', color: 'blue' },
    { id: 'paymentStatuses' as TabType, label: 'Payment Statuses', color: 'green' },
    { id: 'brands' as TabType, label: 'Brands', color: 'purple' },
    { id: 'conditions' as TabType, label: 'Device Conditions', color: 'orange' },
    { id: 'storageOptions' as TabType, label: 'Storage Options', color: 'teal' },
    { id: 'categories' as TabType, label: 'Device Categories', color: 'cyan' },
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
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-[#1b981b] animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Loading utilities...</p>
              </div>
            </div>
          ) : (
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards - Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
              <div className="bg-white rounded-2xl border-2 border-blue-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Order Statuses</p>
                    <p className="text-3xl font-extrabold text-gray-900">{orderStatuses.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-green-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Payment Statuses</p>
                    <p className="text-3xl font-extrabold text-gray-900">{paymentStatuses.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-purple-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Brands</p>
                    <p className="text-3xl font-extrabold text-gray-900">{brands.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-orange-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Conditions</p>
                    <p className="text-3xl font-extrabold text-gray-900">{conditions.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Cards - Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <div className="bg-white rounded-2xl border-2 border-teal-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Storage Options</p>
                    <p className="text-3xl font-extrabold text-gray-900">{storageOptions.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-cyan-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Device Categories</p>
                    <p className="text-3xl font-extrabold text-gray-900">{categories.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-cyan-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-pink-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Blog Categories</p>
                    <p className="text-3xl font-extrabold text-gray-900">{blogCategories.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border-2 border-indigo-500 p-5 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">FAQ Categories</p>
                    <p className="text-3xl font-extrabold text-gray-900">{faqCategories.length}</p>
                  </div>
                  <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-md">
                    <Settings className="w-7 h-7 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Vertical Menu + Content Layout */}
            <div className="flex gap-6">
              {/* Vertical Menu Sidebar */}
              <div className="w-72 flex-shrink-0">
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-4 sticky top-4">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-3">Categories</h3>
                  <nav className="space-y-2">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-semibold transition-all duration-200 text-left ${
                          activeTab === tab.id
                            ? 'bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white shadow-lg scale-105'
                            : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                        }`}
                      >
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                  <div className="p-6 border-b-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-extrabold text-gray-900">{getTabTitle()}</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and configure {getTabTitle().toLowerCase()}</p>
                      </div>
                      <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0f5c0f] text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        <Plus className="w-5 h-5" />
                        <span>Add New</span>
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="p-6">
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
                            <h3 className="text-lg font-bold text-gray-900">
                              {item.name || item.label || item.value}
                            </h3>
                            {item.color && (
                              <div
                                className="w-6 h-6 rounded-full border-2 border-gray-300"
                                style={{ backgroundColor: item.color }}
                              />
                            )}
                            {item.category && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                                {item.category}
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          )}
                          {activeTab === 'categories' && item.value && (
                            <p className="text-sm text-gray-500 mt-1">Value: {item.value}</p>
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
            </div>
          </div>
          )}
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

              {/* Category Field (for storage options) */}
              {activeTab === 'storageOptions' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                  >
                    <option value="">Select category</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="tablet">Tablet</option>
                    <option value="laptop">Laptop</option>
                    <option value="smartwatch">Smartwatch</option>
                    <option value="console">Console</option>
                    <option value="other">Other</option>
                    <option value="default">Default</option>
                  </select>
                </div>
              )}

              {/* Value and Label Fields (for device categories) */}
              {activeTab === 'categories' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Label *
                    </label>
                    <input
                      type="text"
                      value={formData.label || ''}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value, value: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="e.g., Smartphone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={formData.value || ''}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] bg-gray-50"
                      placeholder="smartphone"
                    />
                    <p className="text-xs text-gray-500 mt-1">Lowercase, hyphens only</p>
                  </div>
                </>
              )}

              {/* Logo Upload Field (for brands) */}
              {activeTab === 'brands' && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Brand Logo {modalType === 'add' ? '' : '(Upload new to replace)'}
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1b981b] file:text-white hover:file:bg-[#157a15] file:cursor-pointer"
                    />
                    <p className="text-xs text-gray-500">Accepted formats: JPG, PNG, WebP (Max 5MB)</p>
                    {logoPreview && (
                      <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-700">Logo Preview</p>
                          <button
                            type="button"
                            onClick={() => {
                              setLogoFile(null);
                              setLogoPreview('');
                              setShouldDeleteLogo(true);
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                          >
                            Remove
                          </button>
                        </div>
                        <div className="w-24 h-24 rounded-lg border-2 border-gray-300 overflow-hidden bg-white mx-auto">
                          <img 
                            src={logoPreview} 
                            alt="Logo preview"
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                      </div>
                    )}
                  </div>
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
              {(activeTab === 'orderStatuses' || activeTab === 'paymentStatuses' || activeTab === 'conditions' || activeTab === 'storageOptions' || activeTab === 'blogCategories' || activeTab === 'faqCategories') && (
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
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>{modalType === 'add' ? 'Add' : 'Save'}</span>
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

export default UtilitiesManagement;
