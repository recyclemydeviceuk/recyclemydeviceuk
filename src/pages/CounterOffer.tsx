import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Check, X, AlertCircle, Loader, ArrowRight, DollarSign, FileText, Calendar, Package, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { counterOfferAPI } from '../services/api';

const CounterOffer: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [counterOffer, setCounterOffer] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerNotes, setCustomerNotes] = useState('');
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [actionType, setActionType] = useState<'accept' | 'decline' | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (token) {
      fetchCounterOffer();
    }
  }, [token]);

  const fetchCounterOffer = async () => {
    try {
      setLoading(true);
      setError('');
      const response: any = await counterOfferAPI.getByToken(token!);
      
      if (response.success) {
        setCounterOffer(response.data);
      } else {
        setError(response.message || 'Failed to load counter offer');
      }
    } catch (err: any) {
      console.error('Error fetching counter offer:', err);
      setError(err.response?.data?.message || 'Failed to load counter offer. Please check your link.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setActionType('accept');
    setShowNotesInput(true);
  };

  const handleDecline = async () => {
    setActionType('decline');
    setShowNotesInput(true);
  };

  const confirmAction = async () => {
    if (!actionType) return;

    setIsProcessing(true);
    setError('');

    try {
      let response: any;
      if (actionType === 'accept') {
        response = await counterOfferAPI.accept(token!, customerNotes);
      } else {
        response = await counterOfferAPI.decline(token!, customerNotes);
      }

      if (response.success) {
        // Refresh the counter offer data to show updated status
        await fetchCounterOffer();
        setShowNotesInput(false);
        setActionType(null);
        setCustomerNotes('');
      } else {
        setError(response.message || `Failed to ${actionType} counter offer`);
      }
    } catch (err: any) {
      console.error(`Error ${actionType}ing counter offer:`, err);
      setError(err.response?.data?.message || `Failed to ${actionType} counter offer`);
    } finally {
      setIsProcessing(false);
    }
  };

  const cancelAction = () => {
    setShowNotesInput(false);
    setActionType(null);
    setCustomerNotes('');
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setZoomLevel(1);
  };

  const closeImageModal = () => {
    setSelectedImageIndex(null);
    setZoomLevel(1);
  };

  const nextImage = () => {
    if (counterOffer.images && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % counterOffer.images.length);
      setZoomLevel(1);
    }
  };

  const prevImage = () => {
    if (counterOffer.images && selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex - 1 + counterOffer.images.length) % counterOffer.images.length);
      setZoomLevel(1);
    }
  };

  const zoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.25, 0.5));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading counter offer...</p>
        </div>
      </div>
    );
  }

  if (error && !counterOffer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Counter Offer Not Found</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full px-6 py-3 bg-[#1b981b] hover:bg-[#157a15] text-white rounded-xl font-bold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (!counterOffer) {
    return null;
  }

  const isExpired = counterOffer.status === 'expired' || (new Date(counterOffer.expiresAt) < new Date() && counterOffer.status === 'pending');
  const isAlreadyActioned = counterOffer.status === 'accepted' || counterOffer.status === 'declined';
  const canTakeAction = counterOffer.status === 'pending' && !isExpired;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] rounded-3xl shadow-2xl p-8 mb-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Counter Offer Received</h1>
            {counterOffer.status === 'accepted' && (
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span className="font-semibold">Accepted</span>
              </div>
            )}
            {counterOffer.status === 'declined' && (
              <div className="bg-red-500/80 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <X className="w-5 h-5" />
                <span className="font-semibold">Declined</span>
              </div>
            )}
            {isExpired && (
              <div className="bg-gray-700/80 backdrop-blur-sm px-4 py-2 rounded-xl flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">Expired</span>
              </div>
            )}
          </div>
          <p className="text-green-100">Order #{counterOffer.orderNumber}</p>
        </div>

        {/* Alert Messages */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {isAlreadyActioned && (
          <div className={`${counterOffer.status === 'accepted' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border-2 rounded-xl p-6 mb-6`}>
            <h3 className={`font-bold text-lg mb-2 ${counterOffer.status === 'accepted' ? 'text-green-800' : 'text-red-800'}`}>
              {counterOffer.status === 'accepted' ? '✓ Counter Offer Accepted' : '✗ Counter Offer Declined'}
            </h3>
            <p className={`${counterOffer.status === 'accepted' ? 'text-green-700' : 'text-red-700'}`}>
              You {counterOffer.status} this counter offer on {new Date(counterOffer.respondedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.
            </p>
            {counterOffer.customerNotes && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-1">Your feedback:</p>
                <p className="text-sm text-gray-600 italic">"{counterOffer.customerNotes}"</p>
              </div>
            )}
          </div>
        )}

        {isExpired && !isAlreadyActioned && (
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-lg mb-2 text-gray-800">Counter Offer Expired</h3>
            <p className="text-gray-700">This counter offer expired on {new Date(counterOffer.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>
            <p className="text-gray-600 mt-2">Please contact us if you'd like to discuss this order further.</p>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Order Details */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1b981b]" />
              Order Details
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Customer</p>
                <p className="font-semibold text-gray-900">{counterOffer.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{counterOffer.customerEmail}</p>
              </div>
              {counterOffer.orderId?.deviceName && (
                <div>
                  <p className="text-sm text-gray-600">Device</p>
                  <p className="font-semibold text-gray-900">{counterOffer.orderId.deviceName}</p>
                  {counterOffer.orderId.deviceCondition && (
                    <p className="text-sm text-gray-600">Condition: {counterOffer.orderId.deviceCondition}</p>
                  )}
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Created By</p>
                <p className="font-semibold text-gray-900">{counterOffer.createdByName || 'Recycler'}</p>
              </div>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#1b981b]" />
              Price Adjustment
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-600">Original Offer</p>
                  <p className="text-2xl font-bold text-gray-900">£{counterOffer.originalPrice.toFixed(2)}</p>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Revised Offer</p>
                  <p className="text-2xl font-bold text-[#1b981b]">£{counterOffer.amendedPrice.toFixed(2)}</p>
                </div>
              </div>
              <div className={`p-4 rounded-xl ${counterOffer.amendedPrice > counterOffer.originalPrice ? 'bg-green-50' : 'bg-red-50'}`}>
                <p className="text-sm font-semibold mb-1">
                  {counterOffer.amendedPrice > counterOffer.originalPrice ? 'Increase' : 'Decrease'}
                </p>
                <p className={`text-xl font-bold ${counterOffer.amendedPrice > counterOffer.originalPrice ? 'text-green-600' : 'text-red-600'}`}>
                  {counterOffer.amendedPrice > counterOffer.originalPrice ? '+' : ''}£{(counterOffer.amendedPrice - counterOffer.originalPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reason */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#1b981b]" />
            Reason for Adjustment
          </h2>
          <p className="text-gray-700 leading-relaxed">{counterOffer.reason}</p>
        </div>

        {/* Images */}
        {counterOffer.images && counterOffer.images.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#1b981b]" />
              Device Images ({counterOffer.images.length})
            </h2>
            <p className="text-sm text-gray-600 mb-4">Click on any image to view in full size</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {counterOffer.images.map((image: any, index: number) => (
                <div
                  key={index}
                  onClick={() => openImageModal(index)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl border-2 border-gray-200 hover:border-[#1b981b] transition-all"
                >
                  <img
                    src={image.url}
                    alt={`Device image ${index + 1}`}
                    className="w-full h-48 object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-lg">
                    {index + 1}/{counterOffer.images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image Lightbox Modal */}
        {selectedImageIndex !== null && counterOffer.images && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={closeImageModal}>
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-4 py-2 rounded-xl font-semibold z-10">
              {selectedImageIndex + 1} / {counterOffer.images.length}
            </div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl px-4 py-3 z-10">
              <button
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                className="w-10 h-10 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all"
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-5 h-5 text-white" />
              </button>
              <span className="text-white font-semibold min-w-[60px] text-center">{Math.round(zoomLevel * 100)}%</span>
              <button
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                className="w-10 h-10 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-lg flex items-center justify-center transition-all"
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {counterOffer.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); prevImage(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); nextImage(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Image */}
            <div className="max-w-6xl max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
              <img
                src={counterOffer.images[selectedImageIndex].url}
                alt={`Device image ${selectedImageIndex + 1}`}
                className="max-w-full h-auto transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
          </div>
        )}

        {/* Expiry Date */}
        {canTakeAction && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-blue-800">
              <Calendar className="w-5 h-5" />
              <p className="font-semibold">
                This offer expires on {new Date(counterOffer.expiresAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        )}

        {/* Notes Input (shown when user clicks accept/decline) */}
        {showNotesInput && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              {actionType === 'accept' ? 'Accepting Counter Offer' : 'Declining Counter Offer'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm">
              {actionType === 'accept' 
                ? 'You can optionally provide feedback about accepting this offer.'
                : 'Please let us know why you are declining this offer (optional).'}
            </p>
            <textarea
              value={customerNotes}
              onChange={(e) => setCustomerNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent resize-none mb-4"
              placeholder="Your feedback (optional)..."
            />
            <div className="flex gap-3">
              <button
                onClick={cancelAction}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                disabled={isProcessing}
                className={`flex-1 px-6 py-3 ${
                  actionType === 'accept' 
                    ? 'bg-[#1b981b] hover:bg-[#157a15]' 
                    : 'bg-red-600 hover:bg-red-700'
                } text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2`}
              >
                {isProcessing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {actionType === 'accept' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                    Confirm {actionType === 'accept' ? 'Accept' : 'Decline'}
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {canTakeAction && !showNotesInput && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Your Decision</h2>
            <p className="text-gray-600 text-center mb-6">Please review the counter offer and make your decision</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={handleDecline}
                className="px-8 py-4 bg-white border-2 border-red-300 hover:bg-red-50 text-red-700 rounded-xl font-bold transition-all flex items-center justify-center gap-2 hover:shadow-lg"
              >
                <X className="w-5 h-5" />
                Decline Offer
              </button>
              <button
                onClick={handleAccept}
                className="px-8 py-4 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#1b981b] text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Check className="w-5 h-5" />
                Accept Offer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CounterOffer;
