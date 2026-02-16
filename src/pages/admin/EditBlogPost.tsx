import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Upload, 
  X,
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  FileText,
  Tag,
  Globe,
  Search,
  Loader
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import { adminAPI } from '../../services/api';

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  heroImage: File | null;
  heroImageUrl?: string;
  category: string;
  tags: string[];
  author: string;
  status: 'draft' | 'published';
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const EditBlogPost: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    heroImage: null,
    category: '',
    tags: [],
    author: 'Admin',
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [tagInput, setTagInput] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  const categories = [
    'Recycling Tips',
    'Device Reviews',
    'Environmental Impact',
    'Industry News',
    'How-to Guides',
    'Company Updates',
  ];

  useEffect(() => {
    // Fetch blog post data from backend
    const fetchBlogPost = async () => {
      if (!id) {
        alert('Blog ID not found');
        navigate('/panel/content');
        return;
      }

      try {
        setLoading(true);
        const response: any = await adminAPI.blogs.getById(id);
        
        if (response.success && response.data) {
          const blog = response.data;
          setFormData({
            title: blog.title || '',
            slug: blog.slug || '',
            excerpt: blog.excerpt || '',
            content: blog.content || '',
            heroImage: null,
            heroImageUrl: blog.image || undefined,
            category: blog.category || '',
            tags: blog.tags || [],
            author: blog.author || 'Admin',
            status: blog.status || 'draft',
            metaTitle: blog.metaTitle || '',
            metaDescription: blog.metaDescription || '',
            metaKeywords: blog.metaKeywords || '',
          });
        } else {
          alert('Blog post not found');
          navigate('/panel/content');
        }
      } catch (error: any) {
        console.error('Error fetching blog:', error);
        alert(error.message || 'Failed to load blog post');
        navigate('/panel/content');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleInputChange = (field: keyof BlogFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        heroImage: file,
        heroImageUrl: URL.createObjectURL(file),
      }));
    }
  };

  const removeImage = () => {
    if (formData.heroImageUrl && formData.heroImage) {
      URL.revokeObjectURL(formData.heroImageUrl);
    }
    setFormData(prev => ({
      ...prev,
      heroImage: null,
      heroImageUrl: undefined,
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag),
    }));
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!id) {
      alert('Blog ID not found');
      return;
    }

    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a blog title');
      return;
    }

    if (!formData.content.trim()) {
      alert('Please enter blog content');
      return;
    }

    if (!formData.category) {
      alert('Please select a category');
      return;
    }

    try {
      // Prepare blog data for API
      const blogData: any = {
        title: formData.title.trim(),
        slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        excerpt: formData.excerpt.trim(),
        content: formData.content.trim(),
        category: formData.category,
        author: formData.author || 'Admin',
        status: status,
        tags: formData.tags,
      };

      // Add image URL if available
      if (formData.heroImageUrl) {
        blogData.image = formData.heroImageUrl;
      }

      // Set published date if publishing for the first time
      if (status === 'published' && formData.status !== 'published') {
        blogData.publishedAt = new Date().toISOString();
      }

      const response: any = await adminAPI.blogs.update(id, blogData);
      
      if (response.success) {
        alert(`Blog post ${status === 'published' ? 'published' : 'updated'} successfully!`);
        navigate('/panel/content');
      } else {
        alert('Failed to update blog post');
      }
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      alert(error.message || 'Failed to update blog post');
    }
  };

  const insertTextFormat = (format: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    let newText = formData.content;

    switch (format) {
      case 'bold':
        newText = formData.content.substring(0, start) + `**${selectedText}**` + formData.content.substring(end);
        break;
      case 'italic':
        newText = formData.content.substring(0, start) + `*${selectedText}*` + formData.content.substring(end);
        break;
      case 'h1':
        newText = formData.content.substring(0, start) + `# ${selectedText}` + formData.content.substring(end);
        break;
      case 'h2':
        newText = formData.content.substring(0, start) + `## ${selectedText}` + formData.content.substring(end);
        break;
      case 'h3':
        newText = formData.content.substring(0, start) + `### ${selectedText}` + formData.content.substring(end);
        break;
      case 'link':
        newText = formData.content.substring(0, start) + `[${selectedText}](url)` + formData.content.substring(end);
        break;
      case 'quote':
        newText = formData.content.substring(0, start) + `> ${selectedText}` + formData.content.substring(end);
        break;
      case 'code':
        newText = formData.content.substring(0, start) + `\`${selectedText}\`` + formData.content.substring(end);
        break;
      case 'list':
        newText = formData.content.substring(0, start) + `- ${selectedText}` + formData.content.substring(end);
        break;
    }

    setFormData(prev => ({ ...prev, content: newText }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 text-[#1b981b] animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading blog post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm sticky top-0 z-10">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/panel/content')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
                  <p className="text-sm text-gray-600 mt-1">Update and manage your blog content</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                  formData.status === 'published' 
                    ? 'bg-green-100 text-green-700 border-2 border-green-200' 
                    : 'bg-yellow-100 text-yellow-700 border-2 border-yellow-200'
                }`}>
                  {formData.status === 'published' ? '● Published' : '● Draft'}
                </span>
                <button
                  onClick={() => handleSave('draft')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-200 font-semibold border-2 border-gray-200"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Draft</span>
                </button>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all duration-200 font-semibold border-2 border-blue-200"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
                <button
                  onClick={() => handleSave('published')}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:shadow-lg text-white rounded-xl transition-all duration-200 font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  <span>Update & Publish</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('content')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'content'
                    ? 'bg-white text-[#1b981b] shadow-lg border-2 border-[#1b981b]'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Content</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === 'seo'
                    ? 'bg-white text-[#1b981b] shadow-lg border-2 border-[#1b981b]'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border-2 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  <span>SEO & Meta</span>
                </div>
              </button>
            </div>

            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Title */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter your blog post title..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all text-lg font-semibold"
                  />
                </div>

                {/* Slug */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    URL Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">your-site.com/blog/</span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      placeholder="blog-post-slug"
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                    />
                  </div>
                </div>

                {/* Hero Image */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-700">
                      Hero Image
                    </label>
                    {formData.heroImageUrl && (
                      <button
                        onClick={removeImage}
                        className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Remove
                      </button>
                    )}
                  </div>

                  {formData.heroImageUrl ? (
                    <div className="relative rounded-xl overflow-hidden border-2 border-gray-200">
                      <img
                        src={formData.heroImageUrl}
                        alt="Hero"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                          className="hidden"
                          id="hero-image"
                        />
                        <label
                          htmlFor="hero-image"
                          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm"
                        >
                          <Upload className="w-4 h-4" />
                          Change Image
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1b981b] transition-all">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e.target.files)}
                        className="hidden"
                        id="hero-image"
                      />
                      <label
                        htmlFor="hero-image"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          Upload Hero Image
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </label>
                    </div>
                  )}
                </div>

                {/* Excerpt */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Excerpt
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Write a brief excerpt for your blog post..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.excerpt.length}/160 characters
                  </p>
                </div>

                {/* Content Editor */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Blog Content *
                  </label>

                  {/* Formatting Toolbar */}
                  <div className="flex flex-wrap gap-2 mb-4 p-3 bg-gray-50 rounded-xl border-2 border-gray-200">
                    <button
                      onClick={() => insertTextFormat('bold')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Bold"
                    >
                      <Bold className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('italic')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Italic"
                    >
                      <Italic className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('h1')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Heading 1"
                    >
                      <Heading1 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('h2')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Heading 2"
                    >
                      <Heading2 className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('h3')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Heading 3"
                    >
                      <Heading3 className="w-4 h-4 text-gray-700" />
                    </button>
                    <div className="w-px bg-gray-300 mx-1"></div>
                    <button
                      onClick={() => insertTextFormat('link')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Link"
                    >
                      <LinkIcon className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('quote')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Quote"
                    >
                      <Quote className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('code')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="Code"
                    >
                      <Code className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => insertTextFormat('list')}
                      className="p-2 hover:bg-white rounded-lg transition-colors border border-gray-200"
                      title="List"
                    >
                      <List className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Write your blog content here... Use the toolbar above for formatting."
                    rows={16}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all resize-none font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supports Markdown formatting
                  </p>
                </div>

                {/* Category & Tags */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all cursor-pointer"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Author */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                    <label className="block text-sm font-bold text-gray-700 mb-3">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                    />
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Tags
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      placeholder="Add a tag..."
                      className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                    />
                    <button
                      onClick={addTag}
                      className="px-5 py-2 bg-[#1b981b] text-white rounded-xl hover:bg-[#157a15] transition-colors font-semibold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium flex items-center gap-2 border border-gray-200"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'seo' && (
              <div className="space-y-6">
                {/* Meta Title */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                    placeholder="SEO optimized title for search engines..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.metaTitle.length}/60 characters (optimal for Google)
                  </p>
                </div>

                {/* Meta Description */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Meta Description
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                    placeholder="SEO optimized description for search engines..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {formData.metaDescription.length}/160 characters (optimal for Google)
                  </p>
                </div>

                {/* Meta Keywords */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Meta Keywords
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords}
                    onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3..."
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-[#1b981b] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Separate keywords with commas
                  </p>
                </div>

                {/* SEO Preview */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200 p-6 shadow-lg">
                  <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Google Search Preview
                  </h3>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <h4 className="text-blue-600 text-lg font-medium hover:underline cursor-pointer">
                      {formData.metaTitle || formData.title || 'Your blog post title'}
                    </h4>
                    <p className="text-green-700 text-xs mt-1">
                      https://your-site.com/blog/{formData.slug || 'blog-post-slug'}
                    </p>
                    <p className="text-gray-600 text-sm mt-2">
                      {formData.metaDescription || formData.excerpt || 'Your blog post description will appear here...'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditBlogPost;
