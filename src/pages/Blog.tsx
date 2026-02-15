import { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogAPI, customerAPI } from '../services/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: number;
  slug: string;
  featured?: boolean;
  author?: string;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blogs and categories
  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const params = selectedCategory !== 'All' ? { category: selectedCategory } : {};
        const response: any = await blogAPI.getAll(params);
        setBlogPosts(response.data || []);
      } catch (err: any) {
        setError(err?.message || 'Failed to load blog posts');
        console.error('Error fetching blogs:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response: any = await blogAPI.getCategories();
        setCategories(['All', ...(response.data || [])]);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const featuredPost = blogPosts.find(post => post.featured);
  const latestPosts = blogPosts.filter(post => !post.featured);

  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setSubscribeMessage({ type: 'error', text: 'Please enter your email address' });
      return;
    }

    setIsSubscribing(true);
    setSubscribeMessage(null);

    try {
      await customerAPI.contact.subscribeNewsletter(email);
      setSubscribeMessage({ 
        type: 'success', 
        text: 'Successfully subscribed! Check your email for confirmation.' 
      });
      setEmail('');
    } catch (error: any) {
      setSubscribeMessage({ 
        type: 'error', 
        text: error?.message || 'Failed to subscribe. Please try again.' 
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Recycle My Device Blog
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Tips, guides, and insights on phone recycling, selling your devices, and sustainability.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white border-b sticky top-16 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-2 overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 sm:px-5 md:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-4 sm:p-6 text-center">
            <p className="text-sm sm:text-base text-red-800">{error}</p>
          </div>
        )}

        {/* Featured Article */}
        {!isLoading && !error && featuredPost && selectedCategory === 'All' && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 overflow-hidden mb-8 sm:mb-10 md:mb-12 hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="h-56 sm:h-64 md:h-auto overflow-hidden">
                <img 
                  src={featuredPost.image} 
                  alt={featuredPost.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <span className="bg-green-100 text-primary px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                    Featured
                  </span>
                  <span className="text-primary text-xs sm:text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
                
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{formatDate(featuredPost.publishedAt)}</span>
                    <span className="sm:hidden">{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{featuredPost.readTime} min</span>
                  </div>
                </div>

                <Link
                  to={`/blog/${featuredPost.slug || featuredPost._id}`}
                  className="inline-flex items-center space-x-2 text-sm sm:text-base text-primary font-semibold hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Latest Articles */}
        {!isLoading && !error && (
          <div className="mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">Latest Articles</h2>
            
            {blogPosts.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-white rounded-lg sm:rounded-xl border border-gray-200">
                <p className="text-sm sm:text-base text-gray-500">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {(selectedCategory === 'All' ? latestPosts : blogPosts).map((post: BlogPost) => (
                  <Link
                    key={post._id}
                    to={`/blog/${post.slug || post._id}`}
                    className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
                  >
                    {/* Image */}
                    <div className="h-40 sm:h-48 overflow-hidden">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-5 md:p-6">
                      <span className="bg-green-100 text-primary px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                        {post.category}
                      </span>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2.5 sm:mt-3 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span className="hidden sm:inline">{formatDate(post.publishedAt)}</span>
                          <span className="sm:hidden">{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Stay Updated</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest tips, market insights, and recycling news delivered to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isSubscribing}
                className="flex-1 px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubscribing ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            
            {subscribeMessage && (
              <div 
                className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-lg text-xs sm:text-sm ${
                  subscribeMessage.type === 'success' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}
              >
                {subscribeMessage.text}
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
