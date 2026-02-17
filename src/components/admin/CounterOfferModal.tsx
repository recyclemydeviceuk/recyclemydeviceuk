import React, { useState } from 'react';
import { X, Trash2, AlertCircle, Camera } from 'lucide-react';
import { counterOfferAPI } from '../../services/api';

interface CounterOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: {
    id: string;
    orderNumber: string;
    customerName: string;
    deviceName?: string;
    amount: number;
  };
  onSuccess: () => void;
}

const CounterOfferModal: React.FC<CounterOfferModalProps> = ({
  isOpen,
  onClose,
  order,
  onSuccess,
}) => {
  const [amendedPrice, setAmendedPrice] = useState(order.amount.toString());
  const [reason, setReason] = useState('');
  const [images, setImages] = useState<Array<{ url: string; file?: File }>>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      const newImages: Array<{ url: string; file: File }> = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          setError('Only image files are allowed');
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Image size should not exceed 5MB');
          continue;
        }

        // Create preview URL
        const url = URL.createObjectURL(file);
        newImages.push({ url, file });
      }

      setImages([...images, ...newImages]);
    } catch (err: any) {
      setError(err.message || 'Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    // Revoke object URL to free memory
    URL.revokeObjectURL(newImages[index].url);
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const uploadToS3 = async (files: File[]): Promise<Array<{ url: string; publicId: string }>> => {
    const response = await counterOfferAPI.uploadImages(files);
    console.log('S3 Upload response:', response);
    return response.data; // Fixed: response.data not response.data.data
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!amendedPrice || parseFloat(amendedPrice) <= 0) {
      setError('Please enter a valid amended price');
      return;
    }

    if (!reason.trim()) {
      setError('Please provide a reason for the counter offer');
      return;
    }

    if (parseFloat(amendedPrice) === order.amount) {
      setError('Amended price must be different from the original price');
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload images to S3 if any
      let uploadedImages: Array<{ url: string; publicId?: string }> = [];
      
      if (images.length > 0) {
        const filesToUpload = images.filter(img => img.file).map(img => img.file!);
        if (filesToUpload.length > 0) {
          uploadedImages = await uploadToS3(filesToUpload);
          console.log('Images uploaded to S3:', uploadedImages);
        }
      }

      // Create counter offer
      await counterOfferAPI.create({
        orderId: order.id,
        amendedPrice: parseFloat(amendedPrice),
        reason: reason.trim(),
        images: uploadedImages,
      });

      // Clean up object URLs
      images.forEach(img => URL.revokeObjectURL(img.url));

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Counter offer creation error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create counter offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#1b981b] to-[#157a15] px-8 py-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Create Counter Offer</h2>
              <p className="text-green-100 text-sm mt-1">Order #{order.orderNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Order Details */}
          <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3">Order Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">Customer:</span> <span className="font-semibold text-gray-900">{order.customerName}</span></p>
              <p><span className="text-gray-600">Device:</span> <span className="font-semibold text-gray-900">{order.deviceName || 'N/A'}</span></p>
              <p><span className="text-gray-600">Original Offer:</span> <span className="font-bold text-xl text-gray-900">£{order.amount.toFixed(2)}</span></p>
            </div>
          </div>

          {/* Amended Price */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Amended Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">£</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amendedPrice}
                onChange={(e) => setAmendedPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>
            {amendedPrice && parseFloat(amendedPrice) !== order.amount && (
              <p className="mt-2 text-sm">
                {parseFloat(amendedPrice) > order.amount ? (
                  <span className="text-green-600">↑ Increase of £{(parseFloat(amendedPrice) - order.amount).toFixed(2)}</span>
                ) : (
                  <span className="text-red-600">↓ Decrease of £{(order.amount - parseFloat(amendedPrice)).toFixed(2)}</span>
                )}
              </p>
            )}
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Reason for Counter Offer <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] focus:border-transparent resize-none"
              placeholder="Explain why the price has been adjusted after device collection/inspection (e.g., device condition, missing accessories, damage found, etc.)"
              required
            />
            <p className="mt-2 text-xs text-gray-500">{reason.length} characters</p>
          </div>

          {/* Image Upload */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Device Images (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-3">Upload images showing the device condition</p>

            {/* Upload Button */}
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#1b981b] hover:bg-green-50 transition-colors">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-gray-700">
                  {isUploading ? 'Processing...' : 'Click to upload images'}
                </p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB each</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-xl border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#1b981b] text-white rounded-xl font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Sending...' : 'Send Counter Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterOfferModal;
