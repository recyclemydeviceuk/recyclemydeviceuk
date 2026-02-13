import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit2, Trash2, X, Save, FileText, Calendar, Tag, Eye } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

type TabType = 'blogs' | 'faqs';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  publishedDate: string;
  status: 'draft' | 'published';
  featuredImage?: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

const ContentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('blogs');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock blog posts data
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([
    {
      id: '1',
      title: '5 Tips for Preparing Your Phone for Recycling',
      slug: '5-tips-preparing-phone-recycling',
      excerpt: 'Learn the essential steps to prepare your device before recycling it safely and securely.',
      content: 'Full blog content here...',
      category: 'Recycling Tips',
      author: 'Admin',
      publishedDate: '2026-02-10',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=800',
    },
    {
      id: '2',
      title: 'iPhone 15 Pro Max: Is It Worth Upgrading?',
      slug: 'iphone-15-pro-max-worth-upgrading',
      excerpt: 'A comprehensive review of Apple\'s latest flagship and whether you should upgrade from older models.',
      content: 'Full blog content here...',
      category: 'Device Reviews',
      author: 'Admin',
      publishedDate: '2026-02-08',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1592286927505-b0b2a1f2b5f7?w=800',
    },
    {
      id: '3',
      title: 'The Environmental Impact of E-Waste',
      slug: 'environmental-impact-e-waste',
      excerpt: 'Understanding how electronic waste affects our planet and what you can do to help.',
      content: 'Full blog content here...',
      category: 'Sustainability',
      author: 'Admin',
      publishedDate: '2026-02-05',
      status: 'published',
      featuredImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800',
    },
    {
      id: '4',
      title: 'Samsung Galaxy S24 Ultra vs iPhone 15 Pro Max',
      slug: 'samsung-galaxy-s24-vs-iphone-15',
      excerpt: 'Which flagship smartphone offers the best value for your money? We compare the top contenders.',
      content: 'Full blog content here...',
      category: 'Device Reviews',
      author: 'Admin',
      publishedDate: '2026-01-28',
      status: 'draft',
    },
  ]);

  // Mock FAQs data - collected from FAQs.tsx
  const [faqs, setFaqs] = useState<FAQ[]>([
    // Getting Started
    { id: '1', question: 'How does Recycle My Device work?', answer: "We're a comparison website that helps you find the best price for your old phone. Simply search for your device, tell us its condition, and we'll show you quotes from multiple trusted UK recyclers. Choose the best offer, complete your order, and send your phone using the free postage label. Once received, you'll get paid directly to your bank account.", category: 'Getting Started', order: 1 },
    { id: '2', question: 'Is it free to use Recycle My Device?', answer: "Absolutely! Our service is completely free to use. We earn a small commission from our partner recyclers when you complete a sale, but this never affects the price you receive. There are no hidden fees or costs to you.", category: 'Getting Started', order: 2 },
    { id: '3', question: 'Which devices can I sell?', answer: "You can sell most smartphones including all iPhone models (from iPhone 6 onwards), Samsung Galaxy devices, and other popular brands. We also accept tablets and smartwatches. If you can't find your device, contact us and we'll try to help.", category: 'Getting Started', order: 3 },
    { id: '4', question: "How do I know I'm getting the best price?", answer: "We compare prices from over 20 trusted UK recyclers in real-time. Our comparison tool shows you all available offers so you can choose the one that suits you best - whether that's the highest price, fastest payment, or most trusted buyer.", category: 'Getting Started', order: 4 },
    
    // Device Condition
    { id: '5', question: "How do I determine my device's condition?", answer: "We have 5 condition grades: Like New (perfect, no signs of use), Good (minor scratches, fully working), Fair (visible wear but functional), Poor (heavy wear or minor damage), and Faulty (broken screen, battery issues, etc.). Be honest - if your device doesn't match the condition you selected, the buyer may revise the price or return it.", category: 'Device Condition', order: 1 },
    { id: '6', question: 'What if my phone has a cracked screen?', answer: "Cracked screens are usually classified as 'Faulty' or 'Poor' condition. You can still sell devices with cracked screens, but the price will be lower. Some buyers specialise in damaged devices, so you might be surprised at what you can still get!", category: 'Device Condition', order: 2 },
    { id: '7', question: 'Does my phone need to be working to sell it?', answer: "No! Many buyers accept non-working or faulty devices. Just select 'Faulty' as the condition and describe what's wrong. You'll still get quotes - just at a reduced price.", category: 'Device Condition', order: 3 },
    { id: '8', question: 'What happens if the buyer disagrees with my condition assessment?', answer: "If the buyer inspects your device and finds it's in worse condition than described, they'll offer you a revised price. You can accept the new offer or ask for your device to be returned (you may need to pay return postage). That's why it's important to be honest upfront!", category: 'Device Condition', order: 4 },
    
    // Selling Process
    { id: '9', question: 'What do I need to do before sending my phone?', answer: 'Before sending your device, you should: 1) Back up your data, 2) Sign out of all accounts (iCloud, Google, Samsung), 3) Disable Find My iPhone/Android, 4) Remove your SIM and memory cards, 5) Perform a factory reset. This protects your privacy and ensures smooth processing.', category: 'Selling Process', order: 1 },
    { id: '10', question: 'How do I send my phone?', answer: "After completing your order, you'll receive a FREE prepaid shipping label by email. Print it out, pack your phone securely (we recommend bubble wrap), attach the label, and drop it off at any Royal Mail location or collection point. Keep your proof of postage!", category: 'Selling Process', order: 2 },
    { id: '11', question: 'Is postage really free?', answer: "Yes! All orders include a free prepaid Royal Mail shipping label. You don't pay anything to send your device. Just print the label and drop it off.", category: 'Selling Process', order: 3 },
    { id: '12', question: 'Can I sell multiple phones at once?', answer: "Yes! You can add multiple devices to your order. Each device will need to be assessed and may go to different buyers depending on who offers the best price for each one.", category: 'Selling Process', order: 4 },
    { id: '13', question: 'How long does the process take?', answer: 'The whole process typically takes 5-7 days: 1-2 days for your device to arrive, 1-2 days for inspection, and 1-3 days for payment to reach your account. Some buyers offer same-day payment!', category: 'Selling Process', order: 5 },
    
    // Payment
    { id: '14', question: 'How do I get paid?', answer: "Payment is sent directly to your UK bank account. When you place your order, you'll need to provide your bank details (account name, sort code, and account number). All major UK banks are supported.", category: 'Payment', order: 1 },
    { id: '15', question: 'How long does payment take?', answer: "Most buyers pay within 1-3 working days of receiving and inspecting your device. Some offer same-day payment! The payment speed is shown on each buyer's offer so you know what to expect.", category: 'Payment', order: 2 },
    { id: '16', question: 'Is my payment guaranteed?', answer: "Your payment is guaranteed based on the condition of your device. If it matches your description, you'll receive the quoted price. If there's a discrepancy, the buyer will offer a revised price which you can accept or decline.", category: 'Payment', order: 3 },
    { id: '17', question: "What if I don't receive payment?", answer: "All our partner buyers are vetted and trusted. If you experience any issues with payment, contact us immediately with your order number and we'll help resolve it. That's why we recommend keeping your postage receipt until payment is confirmed.", category: 'Payment', order: 4 },
    
    // Security & Data
    { id: '18', question: 'Is my personal data safe?', answer: 'Yes. All buyers securely wipe devices before processing, permanently erasing all personal data. However, we strongly recommend doing a factory reset yourself before sending, just to be safe. Your order information is protected and only shared with your chosen buyer.', category: 'Security & Data', order: 1 },
    { id: '19', question: 'What happens to my old phone?', answer: "Depending on condition, your phone will either be refurbished and resold, recycled for parts, or responsibly disposed of following UK environmental regulations. Nothing goes to landfill - it's all about sustainability!", category: 'Security & Data', order: 2 },
    { id: '20', question: 'Are the buyers trustworthy?', answer: 'All buyers on our platform are vetted UK companies with established track records. We display their Trustpilot ratings and reviews so you can make an informed choice. We only work with reputable, reliable recyclers.', category: 'Security & Data', order: 3 },
    { id: '21', question: 'Is my bank information secure?', answer: 'Your bank details are encrypted and transmitted securely. We use industry-standard security measures to protect your information. Bank details are only used to process your payment and are not stored longer than necessary.', category: 'Security & Data', order: 4 },
    
    // Problems & Returns
    { id: '22', question: 'What if I change my mind?', answer: "If you haven't sent your device yet, simply don't use the shipping label - there's no obligation. If you've already sent it and the buyer hasn't processed it yet, contact them directly to request its return.", category: 'Problems & Returns', order: 1 },
    { id: '23', question: 'What if my phone gets lost in the post?', answer: "All shipments are tracked. If your device doesn't arrive, contact us with your tracking number and proof of postage. We'll work with Royal Mail and the buyer to resolve the issue. That's why keeping your receipt is important!", category: 'Problems & Returns', order: 2 },
    { id: '24', question: 'The buyer offered a lower price than quoted. What can I do?', answer: 'If the buyer\'s inspection finds issues not mentioned in your original description, they may offer a revised price. You can accept it, negotiate, or request your device back (return postage may apply). Always be accurate about condition to avoid surprises.', category: 'Problems & Returns', order: 3 },
    { id: '25', question: 'How do I contact customer support?', answer: 'You can reach us by email at support@recyclemydevice.co.uk, by phone at 0330 123 4567 (Mon-Fri 9am-6pm), or through our contact form. We aim to respond within 24 hours.', category: 'Problems & Returns', order: 4 },
  ]);

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

  const handleSave = () => {
    if (modalType === 'add') {
      const newItem = { ...formData, id: Date.now().toString() };
      if (activeTab === 'blogs') {
        if (!formData.slug) {
          newItem.slug = formData.title?.toLowerCase().replace(/\s+/g, '-') || '';
        }
        setBlogPosts([...blogPosts, newItem]);
      } else {
        setFaqs([...faqs, newItem]);
      }
    } else {
      if (activeTab === 'blogs') {
        setBlogPosts(blogPosts.map(item => item.id === editingItem.id ? formData : item));
      } else {
        setFaqs(faqs.map(item => item.id === editingItem.id ? formData : item));
      }
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    if (activeTab === 'blogs') {
      setBlogPosts(blogPosts.filter(item => item.id !== id));
    } else {
      setFaqs(faqs.filter(item => item.id !== id));
    }
  };

  const getCurrentData = () => {
    return activeTab === 'blogs' ? blogPosts : faqs;
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

                {/* Items List */}
                <div className="space-y-4">
                  {activeTab === 'blogs' ? (
                    // Blog Posts List
                    blogPosts.map((blog) => (
                      <div
                        key={blog.id}
                        className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-[#1b981b] hover:shadow-md transition-all duration-200"
                      >
                        {blog.featuredImage && (
                          <img 
                            src={blog.featuredImage} 
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
                                  <span>{blog.publishedDate}</span>
                                </div>
                                <span>by {blog.author}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/panel/blog/edit/${blog.id}`)}
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
                                onClick={() => handleDelete(blog.id)}
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
                        key={faq.id}
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
                              onClick={() => handleDelete(faq.id)}
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
