import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, X, Save, FileText, Calendar, Tag, Eye, Loader2, AlertCircle } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import Pagination from '../../components/Pagination';
import { adminAPI } from '../../services/api';

type TabType = 'blogs' | 'faqs';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedAt?: string;
  status: 'draft' | 'published';
  image?: string;
  createdAt: string;
}

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  status: 'active' | 'inactive';
}

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('blogs');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // State for blogs and FAQs
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Fetch blogs from backend
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      const response: any = await adminAPI.blogs.getAll(params);
      if (response.success) {
        setBlogPosts(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
      }
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError(err.message || 'Failed to fetch blogs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch FAQs from backend
  const fetchFAQs = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };
      const response: any = await adminAPI.faqs.getAll(params);
      if (response.success) {
        setFaqs(response.data || []);
        if (response.pagination) {
          setPagination(prev => ({
            ...prev,
            total: response.pagination.total,
            pages: response.pagination.pages,
          }));
        }
      }
    } catch (err: any) {
      console.error('Error fetching FAQs:', err);
      setError(err.message || 'Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and tab change
  useEffect(() => {
    // Reset to page 1 when switching tabs
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else {
      fetchFAQs();
    }
  }, [activeTab, pagination.page]);

  const [formData, setFormData] = useState<any>({});

  const openAddModal = () => {
    setModalType('add');
    setEditingItem(null);
    setFormData(activeTab === 'blogs' ? { status: 'draft' } : { order: faqs.length + 1 });
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

  const handleSave = async () => {
    try {
      if (modalType === 'add') {
        if (activeTab === 'blogs') {
          const response: any = await adminAPI.blogs.create(formData);
          if (response.success) {
            await fetchBlogs();
            alert('Blog created successfully!');
          }
        } else {
          const response: any = await adminAPI.faqs.create(formData);
          if (response.success) {
            await fetchFAQs();
            alert('FAQ created successfully!');
          }
        }
      } else {
        if (activeTab === 'blogs') {
          const response: any = await adminAPI.blogs.update(editingItem._id, formData);
          if (response.success) {
            await fetchBlogs();
            alert('Blog updated successfully!');
          }
        } else {
          const response: any = await adminAPI.faqs.update(editingItem._id, formData);
          if (response.success) {
            await fetchFAQs();
            alert('FAQ updated successfully!');
          }
        }
      }
      closeModal();
    } catch (err: any) {
      console.error('Error saving:', err);
      alert(err.message || 'Failed to save');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (activeTab === 'blogs') {
        await adminAPI.blogs.delete(id);
        await fetchBlogs();
        alert('Blog deleted successfully!');
      } else {
        await adminAPI.faqs.delete(id);
        await fetchFAQs();
        alert('FAQ deleted successfully!');
      }
    } catch (err: any) {
      console.error('Error deleting:', err);
      alert(err.message || 'Failed to delete');
    }
  };


  const getTabTitle = () => {
    return activeTab === 'blogs' ? 'Blog Posts' : 'FAQs';
  };

  const publishedBlogs = blogPosts.filter(b => b.status === 'published').length;
  const draftBlogs = blogPosts.filter(b => b.status === 'draft').length;
  const faqCategories = [...new Set(faqs.map(f => f.category))].length;

  const getStatusColor = (status: string) => {
    return status === 'published' 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-300';
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
                <h1 className="text-2xl font-bold text-gray-800">Content Management</h1>
                <p className="text-sm text-gray-600 mt-1">Create and manage blog posts, FAQs, pages, and all website content</p>
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
              <div className="bg-white rounded-xl border-2 border-blue-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Blogs</p>
                    <p className="text-3xl font-bold text-gray-800">{blogPosts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-green-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Published</p>
                    <p className="text-3xl font-bold text-gray-800">{publishedBlogs}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-yellow-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Drafts</p>
                    <p className="text-3xl font-bold text-gray-800">{draftBlogs}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                    <Edit2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border-2 border-purple-500 p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total FAQs</p>
                    <p className="text-3xl font-bold text-gray-800">{faqs.length}</p>
                    <p className="text-xs text-purple-600 mt-1 font-semibold">{faqCategories} categories</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
              <div className="flex border-b-2 border-gray-200">
                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                    activeTab === 'blogs'
                      ? 'bg-blue-50 text-blue-700 border-b-4 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Blog Posts
                </button>
                <button
                  onClick={() => setActiveTab('faqs')}
                  className={`flex-1 px-6 py-4 font-semibold transition-all duration-200 ${
                    activeTab === 'faqs'
                      ? 'bg-purple-50 text-purple-700 border-b-4 border-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  FAQs
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">{getTabTitle()}</h2>
                  <button
                    onClick={() => {
                      if (activeTab === 'blogs') {
                        navigate('/panel/blog/add');
                      } else {
                        openAddModal();
                      }
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl transition-all duration-200 font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Add New</span>
                  </button>
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-12 h-12 text-[#1b981b] animate-spin" />
                  </div>
                )}

                {/* Error State */}
                {error && !loading && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                    <p className="text-red-800 font-semibold mb-2">Failed to load {activeTab}</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {/* Items List */}
                {!loading && !error && (
                  <div className="space-y-4">
                    {activeTab === 'blogs' ? (
                    // Blog Posts List
                    blogPosts.map((blog) => (
                      <div
                        key={blog._id}
                        className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#1b981b] hover:shadow-md transition-all duration-200"
                      >
                        {blog.image && (
                          <img 
                            src={blog.image} 
                            alt={blog.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-bold text-gray-900">{blog.title}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border-2 ${getStatusColor(blog.status)}`}>
                                  {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{blog.excerpt}</p>
                              <div className="flex items-center gap-4 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Tag className="w-3 h-3" />
                                  <span>{blog.category}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'Not published'}</span>
                                </div>
                                <span>by {blog.author}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/panel/blog/edit/${blog._id}`)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                title="Edit"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                                title="Preview"
                              >
                                <Eye className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(blog._id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                title="Delete"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // FAQs List
                    faqs.sort((a, b) => {
                      if (a.category !== b.category) {
                        return a.category.localeCompare(b.category);
                      }
                      return a.order - b.order;
                    }).map((faq) => (
                      <div
                        key={faq._id}
                        className="p-4 border-2 border-gray-200 rounded-xl hover:border-[#1b981b] hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                {faq.category}
                              </span>
                              <span className="text-xs text-gray-500">Order: {faq.order}</span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(faq)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(faq._id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-8">
            <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">
                {modalType === 'add' ? 'Add New' : 'Edit'} {activeTab === 'blogs' ? 'Blog Post' : 'FAQ'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 hover:bg-white/20 rounded-lg transition-all duration-200"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {activeTab === 'blogs' ? (
                // Blog Post Form
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="Enter blog title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Slug *</label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="blog-post-slug"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="Recycling Tips"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Excerpt *</label>
                    <textarea
                      value={formData.excerpt || ''}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] resize-none"
                      placeholder="Short description for preview"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Content *</label>
                    <textarea
                      value={formData.content || ''}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] resize-none"
                      placeholder="Full blog content"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Author</label>
                      <input
                        type="text"
                        value={formData.author || 'Admin'}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Published Date</label>
                      <input
                        type="date"
                        value={formData.publishedDate || new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Featured Image URL</label>
                    <input
                      type="text"
                      value={formData.featuredImage || ''}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </>
              ) : (
                // FAQ Form
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      placeholder="Getting Started"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Question *</label>
                    <textarea
                      value={formData.question || ''}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] resize-none"
                      placeholder="Enter the question"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Answer *</label>
                    <textarea
                      value={formData.answer || ''}
                      onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] resize-none"
                      placeholder="Enter the answer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.order || 1}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b]"
                      min="1"
                    />
                  </div>
                </>
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

export default ContentManagement;
