import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  Star, 
  Filter,
  Calendar,
  User,
  MessageSquare,
  TrendingUp,
  Award
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  orderNumber: string;
  date: string;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const RecyclerReviews: React.FC = () => {
  const navigate = useNavigate();
  const recyclerEmail = localStorage.getItem('recyclerEmail');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuth');
    localStorage.removeItem('recyclerEmail');
    navigate('/recycler/login');
  };

  // Mock reviews data - Only visible/approved reviews from admin
  const reviews: Review[] = [
    {
      id: '1',
      customerName: 'John Smith',
      rating: 4.9,
      review: 'Excellent service! They collected my device the same day and payment was received within 24 hours. Very professional and transparent pricing.',
      orderNumber: 'RM1234',
      date: '2026-02-10',
      sentiment: 'positive'
    },
    {
      id: '2',
      customerName: 'Sarah Johnson',
      rating: 4.5,
      review: 'Good experience overall. The price offered was competitive and the process was smooth. Would recommend to others.',
      orderNumber: 'RM1235',
      date: '2026-02-11',
      sentiment: 'positive'
    },
    {
      id: '3',
      customerName: 'Mike Brown',
      rating: 5.0,
      review: 'Outstanding! Best recycling experience ever. Fast, efficient, and great customer service. The payment was instant and they handled my device with care.',
      orderNumber: 'RM1236',
      date: '2026-02-09',
      sentiment: 'positive'
    },
    {
      id: '4',
      customerName: 'Robert Wilson',
      rating: 3.2,
      review: 'Average experience. Nothing special but got the job done. Price was okay.',
      orderNumber: 'RM1238',
      date: '2026-02-12',
      sentiment: 'neutral'
    },
    {
      id: '5',
      customerName: 'Lisa Anderson',
      rating: 4.8,
      review: 'Really impressed with their service. Professional team, secure packaging, and quick payment. Will use again!',
      orderNumber: 'RM1239',
      date: '2026-02-11',
      sentiment: 'positive'
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.review.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || 
      (filterRating === '5' && review.rating === 5) ||
      (filterRating === '4+' && review.rating >= 4) ||
      (filterRating === '3+' && review.rating >= 3);

    return matchesSearch && matchesRating;
  });

  const totalReviews = reviews.length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const positiveReviews = reviews.filter(r => r.sentiment === 'positive').length;
  const positivePercentage = (positiveReviews / totalReviews * 100).toFixed(0);

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                    <Star className="w-8 h-8 text-white fill-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Customer Reviews</h1>
                  <p className="text-sm text-gray-600 mt-1.5 flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                    Reviews from your customers
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button className="p-3 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md">
                  <Search className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-semibold text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-blue-100 font-semibold mb-2">Total Reviews</p>
                <p className="text-4xl font-bold text-white">{totalReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white fill-white" />
                </div>
                <p className="text-sm text-yellow-100 font-semibold mb-2">Average Rating</p>
                <p className="text-4xl font-bold text-white">{avgRating.toFixed(1)}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-green-100 font-semibold mb-2">Positive Reviews</p>
                <p className="text-4xl font-bold text-white">{positivePercentage}%</p>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm text-purple-100 font-semibold mb-2">Excellent (5★)</p>
                <p className="text-4xl font-bold text-white">{reviews.filter(r => r.rating === 5).length}</p>
              </div>
            </div>

            {/* Info Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Approved Reviews Only</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    You are viewing reviews that have been approved by admin and are visible to customers. 
                    Keep providing excellent service to maintain your high ratings!
                  </p>
                </div>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by customer name, order number, or review..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="pl-10 pr-8 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer appearance-none"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4+">4+ Stars</option>
                    <option value="3+">3+ Stars</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-5">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-3xl border-2 border-gray-200 hover:border-[#1b981b]/50 transition-all shadow-lg hover:shadow-2xl overflow-hidden"
                >
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-md">
                          <User className="w-7 h-7 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{review.customerName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-xs font-bold border-2 ${getSentimentBadge(review.sentiment)}`}>
                        {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-6 h-6 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-2xl font-bold ${getRatingColor(review.rating)}`}>
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 mb-5 border-2 border-gray-200">
                      <p className="text-gray-700 leading-relaxed text-base italic">"{review.review}"</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-5 border-t-2 border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-600">Order Number:</span>
                        <span className="text-sm text-[#1b981b] font-bold bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                          {review.orderNumber}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-3xl border-2 border-gray-200 p-16 text-center shadow-lg">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">No reviews found</h3>
                <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerReviews;
