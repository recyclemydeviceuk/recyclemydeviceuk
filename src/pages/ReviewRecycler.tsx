import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Star, Send, ArrowLeft, CheckCircle2, Building2, Award, MessageSquare } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface ReviewData {
  recyclerName: string;
  orderNumber: string;
  rating: number;
  review: string;
}

export default function ReviewRecycler() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recyclerName = 'GreenTech Recyclers', orderNumber = 'RM1234' } = location.state || {};

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [review, setReview] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    
    // TODO: Submit to backend API
    console.log('Review submitted:', {
      recyclerName,
      orderNumber,
      rating,
      review,
    });
    
    setSubmitted(true);
    
    // Redirect after 3 seconds
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  const handleStarClick = (value: number) => {
    setRating(value);
  };

  const getRatingText = (rating: number) => {
    if (rating === 0) return 'No rating yet';
    if (rating <= 1) return 'Poor';
    if (rating <= 2) return 'Fair';
    if (rating <= 3) return 'Good';
    if (rating <= 4) return 'Very Good';
    return 'Excellent';
  };

  const getRatingColor = (rating: number) => {
    if (rating <= 2) return 'text-red-500';
    if (rating <= 3) return 'text-orange-500';
    if (rating <= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-white rounded-3xl border-2 border-green-200 p-12 shadow-2xl text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-xl text-gray-600 mb-6">Your review has been submitted successfully</p>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-800">{rating.toFixed(1)} / 5.0</p>
              <p className="text-sm text-gray-600 mt-2">Rating for {recyclerName}</p>
            </div>
            <p className="text-sm text-gray-500 mt-8">Redirecting to homepage...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border-2 border-gray-200 shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary to-blue-600 px-8 py-10 text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Award className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-3">Rate Your Experience</h1>
            <p className="text-blue-100 text-lg">Help others by sharing your feedback</p>
          </div>

          {/* Recycler Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 px-8 py-6 border-b-2 border-blue-100">
            <div className="flex items-center justify-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 font-semibold uppercase tracking-wide">You're Rating</p>
                <h2 className="text-2xl font-bold text-gray-900">{recyclerName}</h2>
                <p className="text-sm text-gray-500">Order #{orderNumber}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 md:p-12">
            {/* Star Rating Section */}
            <div className="mb-10">
              <label className="block text-center mb-6">
                <span className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  Rate the Service
                </span>
                <span className="text-sm text-gray-500 mt-2 block">Click on the stars or use the slider below</span>
              </label>

              {/* Stars Display */}
              <div className="flex items-center justify-center gap-3 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transform transition-all duration-200 hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-14 h-14 transition-colors duration-200 ${
                        star <= (hoverRating || rating)
                          ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg'
                          : 'text-gray-300 hover:text-gray-400'
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* Rating Slider for Decimal Values */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl p-6 border-2 border-gray-200 shadow-inner">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-gray-600">Fine-tune your rating</span>
                    <div className={`text-3xl font-bold ${getRatingColor(rating)}`}>
                      {rating > 0 ? rating.toFixed(1) : '0.0'}
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={rating}
                    onChange={(e) => setRating(parseFloat(e.target.value))}
                    className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-yellow-400 shadow-inner"
                    style={{
                      background: `linear-gradient(to right, #facc15 0%, #facc15 ${(rating / 5) * 100}%, #ffffff ${(rating / 5) * 100}%, #ffffff 100%)`,
                    }}
                  />
                  <div className="flex justify-between mt-3 text-xs text-gray-500 font-semibold">
                    <span>0.0</span>
                    <span>1.0</span>
                    <span>2.0</span>
                    <span>3.0</span>
                    <span>4.0</span>
                    <span>5.0</span>
                  </div>
                </div>

                {/* Rating Text */}
                {rating > 0 && (
                  <div className="text-center mt-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full border-2 border-gray-300 shadow-lg">
                      <span className="text-lg font-bold text-gray-700">Your Rating:</span>
                      <span className={`text-2xl font-bold ${getRatingColor(rating)}`}>
                        {getRatingText(rating)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Review Text Section */}
            <div className="mb-8">
              <label className="block mb-4">
                <span className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  Write Your Review
                  <span className="text-sm text-gray-500 font-normal ml-2">(Optional)</span>
                </span>
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={6}
                placeholder="Share your experience with this recycler. What did you like? What could be improved?"
                className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none text-gray-800 placeholder-gray-400 shadow-inner"
              />
              <p className="text-sm text-gray-500 mt-2 text-right">{review.length} characters</p>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={rating === 0}
                className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-2xl font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Send className="w-5 h-5" />
                Submit Review
              </button>
            </div>

            {rating === 0 && (
              <p className="text-center text-sm text-red-500 mt-4 font-semibold">
                Please select a rating before submitting
              </p>
            )}
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-white rounded-2xl border-2 border-blue-100 p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Why Your Review Matters</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Helps other customers make informed decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Encourages recyclers to maintain high quality service</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Your honest feedback improves the recycling experience for everyone</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
