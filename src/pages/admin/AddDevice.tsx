import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Smartphone, Info, Image as ImageIcon, Upload, X } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';

interface FormData {
  name: string;
  description: string;
  brand: string;
  category: string;
  storageOptions: string[];
  conditionOptions: string[];
  image: File | null;
}

const AddDevice: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    brand: '',
    category: '',
    storageOptions: [],
    conditionOptions: ['Excellent', 'Good', 'Fair', 'Poor'],
    image: null,
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

  const categories = [
    { value: 'smartphone', label: 'Smartphone' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'laptop', label: 'Laptop' },
    { value: 'smartwatch', label: 'Smartwatch' },
    { value: 'gaming', label: 'Gaming Console' },
    { value: 'other', label: 'Other' },
  ];

  const storageOptionsPresets = {
    smartphone: ['64GB', '128GB', '256GB', '512GB', '1TB'],
    tablet: ['64GB', '128GB', '256GB', '512GB', '1TB', '2TB'],
    laptop: ['256GB', '512GB', '1TB', '2TB'],
    default: ['64GB', '128GB', '256GB', '512GB', '1TB'],
  };

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
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    if (formData.storageOptions.length === 0) {
      newErrors.storageOptions = 'Please add at least one storage option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
      // TODO: API call to save device
      navigate('/panel/devices');
    }
  };

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
                  <h1 className="text-2xl font-bold text-gray-800">Add New Device</h1>
                  <p className="text-sm text-gray-600 mt-1">Create a new device listing</p>
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
                      <p className="text-sm text-white/80">Enter device details</p>
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

                  {/* Brand and Category Row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => {
                          const newCategory = e.target.value;
                          handleInputChange('category', newCategory);
                          // Auto-populate storage options based on category
                          if (newCategory && formData.storageOptions.length === 0) {
                            const preset = storageOptionsPresets[newCategory as keyof typeof storageOptionsPresets] || storageOptionsPresets.default;
                            handleInputChange('storageOptions', preset);
                          }
                        }}
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all bg-white cursor-pointer ${
                          errors.category ? 'border-red-300 bg-red-50' : 'border-gray-200'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-sm text-red-600 mt-1 flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Storage Options */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Storage Options * <span className="text-xs text-gray-500">(Recyclers will set prices per storage)</span>
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.storageOptions.map((storage, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1.5 bg-[#1b981b] text-white rounded-lg text-sm font-medium"
                        >
                          {storage}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = formData.storageOptions.filter((_, i) => i !== index);
                              handleInputChange('storageOptions', newOptions);
                            }}
                            className="ml-2 hover:text-red-200 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., 128GB"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const value = input.value.trim();
                            if (value && !formData.storageOptions.includes(value)) {
                              handleInputChange('storageOptions', [...formData.storageOptions, value]);
                              input.value = '';
                            }
                          }
                        }}
                        className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b] transition-all"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          const value = input.value.trim();
                          if (value && !formData.storageOptions.includes(value)) {
                            handleInputChange('storageOptions', [...formData.storageOptions, value]);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all"
                      >
                        Add
                      </button>
                    </div>
                    {errors.storageOptions && (
                      <p className="text-sm text-red-600 mt-1 flex items-center">
                        <Info className="w-4 h-4 mr-1" />
                        {errors.storageOptions}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">Press Enter or click Add to add storage options</p>
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
                    <p className="text-xs text-gray-500 mt-1">Admins manage device info. Recyclers set prices per storage/condition.</p>
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
                      <p className="text-sm text-white/80">Upload device image (drag & drop supported)</p>
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
                  {formData.image && (
                    <div className="mt-6">
                      <p className="text-sm font-semibold text-gray-700 mb-3">
                        Uploaded Image
                      </p>
                      <div className="relative group rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#1b981b] transition-all duration-200 max-w-md">
                        <img
                          src={URL.createObjectURL(formData.image)}
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                          <p className="text-sm text-white font-medium truncate">
                            {formData.image.name}
                          </p>
                        </div>
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
                  Add Device
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddDevice;
