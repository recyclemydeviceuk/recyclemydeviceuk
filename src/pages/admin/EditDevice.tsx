import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Smartphone, Info, Image as ImageIcon, Upload, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface FormData {
  name: string;
  description: string;
  brand: string;
  image: File | null;
  existingImageUrl?: string;
}

const EditDevice: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    brand: '',
    image: null,
    existingImageUrl: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Available options
  const brands = [
    'Apple',
    'Samsung',
    'Google',
    'OnePlus',
    'Xiaomi',
    'Oppo',
    'Vivo',
    'Realme',
    'Nothing',
    'Motorola',
  ];

  useEffect(() => {
    const fetchDeviceData = () => {
      setTimeout(() => {
        const mockDevice = {
          name: 'iPhone 15 Pro Max',
          description: 'Latest flagship iPhone with A17 Pro chip, titanium design, and advanced camera system. Features include ProMotion display, always-on display, and improved battery life.',
          brand: 'Apple',
          existingImageUrl: 'https://via.placeholder.com/400x300?text=iPhone+15+Pro+Max',
        };

        setFormData({
          name: mockDevice.name,
          description: mockDevice.description,
          brand: mockDevice.brand,
          image: null,
          existingImageUrl: mockDevice.existingImageUrl,
        });
        setLoading(false);
      }, 1000);
    };

    fetchDeviceData();
  }, [id]);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleImageUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({
        ...prev,
        image: file,
      }));
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      existingImageUrl: '',
    }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleImageUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Device name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.brand) {
      newErrors.brand = 'Please select a brand';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted (UPDATE):', formData);
      // TODO: API call to update device
      navigate('/panel/devices');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading device data...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayImage = formData.image 
    ? URL.createObjectURL(formData.image) 
    : formData.existingImageUrl;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/panel/devices')}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Edit Device</h1>
                  <p className="text-sm text-gray-600 mt-1">Update device information</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Basic Information</h2>
                      <p className="text-sm text-white/80">Update device details</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Device Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Device Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="e.g., iPhone 16 Pro Max"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all ${
                        errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Brand Selection */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Brand *
                    </label>
                    <select
                      value={formData.brand}
                      onChange={(e) => handleInputChange('brand', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all bg-white cursor-pointer ${
                        errors.brand ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select a brand</option>
                      {brands.map((brand) => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </select>
                    {errors.brand && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        {errors.brand}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter device description, specifications, and features..."
                      rows={4}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all resize-none ${
                        errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200'
                      }`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Upload Card */}
              <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Device Image</h2>
                      <p className="text-sm text-white/80">Upload new image or keep existing</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Upload Area */}
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#1b981b] hover:bg-gray-50 transition-all duration-200"
                  >
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                          <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-base font-semibold text-gray-700 mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG, JPEG or WEBP
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Image Preview */}
                  {displayImage && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        {formData.image ? 'New Image' : 'Current Image'}
                      </p>
                      <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#1b981b] transition-all duration-200 max-w-md">
                        <img
                          src={displayImage}
                          alt="Device preview"
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={removeImage}
                            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                          >
                            <X className="w-6 h-6 text-white" />
                          </button>
                        </div>
                        {formData.image && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <p className="text-sm text-white font-medium truncate">
                              {formData.image.name}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {errors.image && (
                    <p className="text-sm text-red-600 mt-3 flex items-center">
                      <Info className="w-4 h-4 mr-1" />
                      {errors.image}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/panel/devices')}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Update Device
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditDevice;
