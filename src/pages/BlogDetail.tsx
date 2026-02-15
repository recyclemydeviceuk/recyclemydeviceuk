import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2, Loader, User } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { blogAPI } from '../services/api';

interface BlogPost {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  image: string;
  publishedAt: string;
  readTime: number;
  slug: string;
  author?: string;
  tags?: string[];
  views?: number;
}

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response: any = await blogAPI.getById(slug);
        setBlog(response.data);
        
        // Fetch related blogs
        if (response.data?.category) {
          const relatedResponse: any = await blogAPI.getAll({ 
            category: response.data.category,
            limit: 3 
          });
          const filtered = (relatedResponse.data || []).filter((b: BlogPost) => b._id !== response.data._id);
          setRelatedBlogs(filtered.slice(0, 3));
        }
      } catch (err: any) {
        setError(err?.message || 'Failed to load blog post');
        console.error('Error fetching blog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
    window.scrollTo(0, 0);
  }, [slug]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-12 sm:py-16 md:py-20">
          <Loader className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-red-900 mb-3 sm:mb-4">Blog Post Not Found</h2>
            <p className="text-sm sm:text-base text-red-700 mb-4 sm:mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
            <Link
              to="/blog"
              className="inline-flex items-center space-x-2 bg-primary text-white px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-dark transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Back to Blog</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate('/blog')}
            className="inline-flex items-center space-x-2 text-sm sm:text-base text-gray-600 hover:text-primary transition-colors mb-4 sm:mb-6"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Back to Blog</span>
          </button>

          {/* Category */}
          <div className="mb-3 sm:mb-4">
            <span className="bg-green-100 text-primary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
            {blog.author && (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="font-medium">{blog.author}</span>
              </div>
            )}
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{formatDate(blog.publishedAt)}</span>
              <span className="sm:hidden">{new Date(blog.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{blog.readTime} min</span>
            </div>
            {blog.views !== undefined && (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span>{blog.views.toLocaleString()} views</span>
              </div>
            )}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 text-xs sm:text-sm rounded-lg font-medium transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Featured Image */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-8">
          <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg sm:shadow-xl">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-56 sm:h-72 md:h-80 lg:h-96 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        <article className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 md:p-8 lg:p-12">
          {/* Blog Content with proper HTML styling */}
          <div 
            className="prose prose-sm sm:prose-base md:prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 prose-headings:leading-tight
              prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-10 prose-h2:mb-4 sm:prose-h2:mb-5 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b-2 prose-h2:border-gray-300
              prose-h3:text-lg sm:prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-2 sm:prose-h3:mb-3 prose-h3:text-gray-800
              prose-h4:text-base sm:prose-h4:text-lg prose-h4:font-semibold prose-h4:mt-5 sm:prose-h4:mt-6 prose-h4:mb-2 sm:prose-h4:mb-3
              prose-p:text-sm sm:prose-p:text-[15px] prose-p:text-gray-700 prose-p:leading-relaxed sm:prose-p:leading-[1.8] prose-p:mb-4 sm:prose-p:mb-5
              prose-a:text-primary prose-a:font-medium prose-a:underline hover:prose-a:text-primary-dark
              prose-strong:text-gray-900 prose-strong:font-bold
              prose-em:text-gray-600 prose-em:italic
              prose-ul:my-3 sm:prose-ul:my-4 prose-ul:space-y-1.5 sm:prose-ul:space-y-2 prose-ul:pl-5 sm:prose-ul:pl-6
              prose-ol:my-3 sm:prose-ol:my-4 prose-ol:space-y-1.5 sm:prose-ol:space-y-2 prose-ol:pl-5 sm:prose-ol:pl-6
              prose-li:text-sm sm:prose-li:text-[15px] prose-li:text-gray-700 prose-li:leading-relaxed sm:prose-li:leading-[1.7] prose-li:mb-1 sm:prose-li:mb-1.5
              prose-li::marker:text-primary prose-li::marker:font-bold
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-green-50 
              prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:my-5 sm:prose-blockquote:my-6 prose-blockquote:rounded-r-lg
              prose-blockquote:not-italic prose-blockquote:text-gray-800
              prose-code:text-primary prose-code:bg-gray-100 prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded prose-code:text-xs sm:prose-code:text-sm
              prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-md sm:prose-img:shadow-lg prose-img:my-6 sm:prose-img:my-8"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedBlogs.length > 0 && (
          <div className="mt-10 sm:mt-12 md:mt-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Related Articles</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {relatedBlogs.map((post) => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug || post._id}`}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
                >
                  <div className="h-40 sm:h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-5 md:p-6">
                    <span className="bg-green-100 text-primary px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                      {post.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mt-2.5 sm:mt-3 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-10 sm:mt-12 md:mt-16 bg-gradient-to-br from-green-50 to-green-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Ready to Recycle Your Device?</h2>
          <p className="text-sm sm:text-base text-gray-700 mb-5 sm:mb-6 max-w-2xl mx-auto">
            Get an instant quote for your old phone and help create a more sustainable future.
          </p>
          <Link
            to="/sell-your-phone"
            className="inline-block bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md sm:shadow-lg"
          >
            Get Instant Quote
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
