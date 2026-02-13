import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Search, 
  Star, 
  Eye, 
  EyeOff,
  Filter,
  Calendar,
  User,
  Building2,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface Review {
  id: string;
  recyclerName: string;
  customerName: string;
  rating: number;
  review: string;
  orderNumber: string;
  date: string;
  visible: boolean;
  sentiment: 'positive' | 'neutral' | 'negative';
}

const AdminReviews: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState('all');
  const [filterVisibility, setFilterVisibility] = useState('all');

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  // Mock reviews data
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: '1',
      recyclerName: 'EcoTech Recyclers Ltd',
      customerName: 'John Smith',
      rating: 4.9,
      review: 'Excellent service! They collected my device the same day and payment was received within 24 hours. Very professional and transparent pricing.',
      orderNumber: 'RM1234',
      date: '2026-02-10',
      visible: true,
      sentiment: 'positive'
    },
    {
      id: '2',
      recyclerName: 'PhoneReborn Industries',
      customerName: 'Sarah Johnson',
      rating: 4.5,
      review: 'Good experience overall. The price offered was competitive and the process was smooth. Would recommend to others.',
      orderNumber: 'RM1235',
      date: '2026-02-11',
      visible: true,
      sentiment: 'positive'
    },
    {
      id: '3',
      recyclerName: 'GreenTech Solutions',
      customerName: 'Mike Brown',
      rating: 5.0,
      review: 'Outstanding! Best recycling experience ever. Fast, efficient, and great customer service. The payment was instant and they handled my device with care.',
      orderNumber: 'RM1236',
      date: '2026-02-09',
      visible: true,
      sentiment: 'positive'
    },
    {
      id: '4',
      recyclerName: 'EcoTech Recyclers Ltd',
      customerName: 'Emily Davis',
      rating: 2.5,
      review: 'Service was slower than expected. Took 3 days for payment to arrive instead of the promised 24 hours.',
      orderNumber: 'RM1237',
      date: '2026-02-08',
      visible: false,
      sentiment: 'negative'
    },
    {
      id: '5',
      recyclerName: 'CircularTech Partners',
      customerName: 'Robert Wilson',
      rating: 3.2,
      review: 'Average experience. Nothing special but got the job done. Price was okay.',
      orderNumber: 'RM1238',
      date: '2026-02-12',
      visible: true,
      sentiment: 'neutral'
    },
    {
      id: '6',
      recyclerName: 'PhoneReborn Industries',
      customerName: 'Lisa Anderson',
      rating: 4.8,
      review: 'Really impressed with their service. Professional team, secure packaging, and quick payment. Will use again!',
      orderNumber: 'RM1239',
      date: '2026-02-11',
      visible: true,
      sentiment: 'positive'
    }
  ]);

  const toggleVisibility = (id: string) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, visible: !review.visible } : review
    ));
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.recyclerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.orderNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = filterRating === 'all' || 
      (filterRating === '5' && review.rating === 5) ||
      (filterRating === '4+' && review.rating >= 4) ||
      (filterRating === '3+' && review.rating >= 3) ||
      (filterRating === 'below3' && review.rating < 3);
    
    const matchesVisibility = filterVisibility === 'all' || 
      (filterVisibility === 'visible' && review.visible) ||
      (filterVisibility === 'hidden' && !review.visible);

    return matchesSearch && matchesRating && matchesVisibility;
  });

  const totalReviews = reviews.length;
  const visibleReviews = reviews.filter(r => r.visible).length;
  const hiddenReviews = reviews.filter(r => !r.visible).length;
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-lg">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-800">Customer Reviews</h1>
                </div>
                <p className="text-sm text-gray-500 ml-13 pl-1">Manage and moderate partner reviews</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-blue-100 font-medium mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-white">{totalReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-green-100 font-medium mb-1">Visible Reviews</p>
                <p className="text-3xl font-bold text-white">{visibleReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <EyeOff className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-xs text-red-100 font-medium mb-1">Hidden Reviews</p>
                <p className="text-3xl font-bold text-white">{hiddenReviews}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-white fill-white" />
                  </div>
                </div>
                <p className="text-xs text-yellow-100 font-medium mb-1">Average Rating</p>
                <p className="text-3xl font-bold text-white">{avgRating.toFixed(1)}</p>
              </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-5 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by recycler, customer, or order number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm"
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={filterRating}
                      onChange={(e) => setFilterRating(e.target.value)}
                      className="pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer appearance-none"
                    >
                      <option value="all">All Ratings</option>
                      <option value="5">5 Stars</option>
                      <option value="4+">4+ Stars</option>
                      <option value="3+">3+ Stars</option>
                      <option value="below3">Below 3</option>
                    </select>
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <select
                      value={filterVisibility}
                      onChange={(e) => setFilterVisibility(e.target.value)}
                      className="pl-10 pr-8 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm cursor-pointer appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="visible">Visible</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 hover:border-[#1b981b]/50 transition-all shadow-md overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">{review.recyclerName}</h3>
                          <div className="flex items-center gap-3 mt-1">
                            <div className="flex items-center gap-1">
                              <User className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-600">{review.customerName}</span>
                            </div>
                            <span className="text-gray-300">•</span>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span className="text-sm text-gray-600">
                                {new Date(review.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getSentimentBadge(review.sentiment)}`}>
                          {review.sentiment.charAt(0).toUpperCase() + review.sentiment.slice(1)}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${review.visible ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gray-100 text-gray-700 border-2 border-gray-300'}`}>
                          {review.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className={`text-xl font-bold ${getRatingColor(review.rating)}`}>
                        {review.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-700 leading-relaxed mb-4 italic">"{review.review}"</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-semibold">Order:</span>
                        <span className="text-[#1b981b] font-bold">{review.orderNumber}</span>
                      </div>
                      <button
                        onClick={() => toggleVisibility(review.id)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-105 ${
                          review.visible
                            ? 'bg-gray-500 hover:bg-gray-600 text-white'
                            : 'bg-[#1b981b] hover:bg-[#157a15] text-white'
                        }`}
                      >
                        {review.visible ? (
                          <>
                            <EyeOff className="w-4 h-4" />
                            Hide from Partner
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            Show to Partner
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredReviews.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-200 p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No reviews found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminReviews;
