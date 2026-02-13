import { useState } from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  image: string;
  date: string;
  readTime: string;
  featured?: boolean;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Selling Tips', 'Market Analysis', 'Environment', 'Behind the Scenes'];

  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: 'How to Get the Best Price When Selling Your Old iPhone',
      excerpt: 'Discover the secrets to maximising the value of your old phone. From timing to trade factory reset to choosing the right buyer.',
      category: 'Selling Tips',
      image: 'iphone',
      date: '25 January 2025',
      readTime: '5 min read',
      featured: true,
    },
    {
      id: 2,
      title: 'Samsung vs iPhone: Which Holds Its Value Better?',
      excerpt: 'A comprehensive comparison of resale values between Samsung Galaxy and Apple iPhone devices over time.',
      category: 'Market Analysis',
      image: 'samsung',
      date: '22 Jan 2025',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'The Environmental Impact of Phone Recycling',
      excerpt: 'Discover how recycling your old phone helps reduce e-waste and contributes to a more sustainable future.',
      category: 'Environment',
      image: 'recycle',
      date: '20 Jan',
      readTime: '4 min read',
    },
    {
      id: 4,
      title: 'What Happens to Your Phone After You Sell It?',
      excerpt: 'Follow the journey of a recycled phone from collection to refurbishment and everything in between.',
      category: 'Behind the Scenes',
      image: 'process',
      date: '18 Jan',
      readTime: '6 min read',
    },
    {
      id: 5,
      title: '5 Things to Do Before Selling Your Phone',
      excerpt: 'Essential steps to prepare your device for sale, including data backup and removing security features.',
      category: 'Selling Tips',
      image: 'checklist',
      date: '15 Jan',
      readTime: '5 min read',
    },
    {
      id: 6,
      title: 'The Rise of Refurbished Phones in 2026',
      excerpt: 'Why more consumers are choosing refurbished devices and what it means for the resale market.',
      category: 'Market Analysis',
      image: 'refurb',
      date: '12 Jan',
      readTime: '8 min read',
    },
  ];

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPost = blogPosts.find(post => post.featured);
  const latestPosts = blogPosts.filter(post => !post.featured);

  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Recycle My Device Blog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tips, guides, and insights on phone recycling, selling your devices, and sustainability.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="bg-white border-b sticky top-16 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all ${
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Article */}
        {featuredPost && selectedCategory === 'All' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-12 hover:shadow-xl transition-shadow">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-80 md:h-auto flex items-center justify-center">
                <div className="w-48 h-64 bg-gray-800 rounded-xl"></div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center space-x-3 mb-4">
                  <span className="bg-green-100 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                  <span className="text-primary text-sm font-semibold">
                    {featuredPost.category}
                  </span>
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{featuredPost.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime}</span>
                  </div>
                </div>

                <Link
                  to={`/blog/${featuredPost.id}`}
                  className="inline-flex items-center space-x-2 text-primary font-semibold hover:underline"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Latest Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(selectedCategory === 'All' ? latestPosts : filteredPosts).map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all group"
              >
                {/* Image */}
                <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center overflow-hidden">
                  <div className="w-32 h-40 bg-gray-800 rounded-lg group-hover:scale-105 transition-transform"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <span className="bg-green-100 text-primary px-3 py-1 rounded-full text-xs font-semibold">
                    {post.category}
                  </span>

                  <h3 className="text-lg font-bold text-gray-900 mt-3 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest tips, market insights, and recycling news delivered to your inbox.
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
