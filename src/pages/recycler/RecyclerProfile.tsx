import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recyclerAuthService } from '../../services/recyclerAuth';
import { useRecycler } from '../../contexts/RecyclerContext';
import { 
  User, 
  LogOut,
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Star,
  CheckCircle2,
  Save,
  Upload,
  Image as ImageIcon,
  ToggleLeft,
  ToggleRight,
  Shield,
  Award,
  AlertCircle
} from 'lucide-react';
import RecyclerSidebar from '../../components/RecyclerSidebar';

const RecyclerProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, partnerId, isLoading: contextLoading, error: contextError, updateProfile } = useRecycler();
  
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Form state - initialize from context when profile loads
  const [recyclerName, setRecyclerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [city, setCity] = useState('');
  const [postcode, setPostcode] = useState('');
  const [website, setWebsite] = useState('');
  const [companyDescription, setCompanyDescription] = useState('');
  const [companyLogo, setCompanyLogo] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [usps, setUsps] = useState([
    'Certified Data Destruction & Security',
    'Same-Day Device Collection Service',
    'Competitive Pricing & Fast Payments'
  ]);

  // Sync form state with context profile when it loads/changes
  useEffect(() => {
    if (profile) {
      setRecyclerName(profile.name || '');
      setCompanyName(profile.companyName || '');
      setCompanyEmail(profile.email || '');
      setCompanyPhone(profile.phone || '');
      setCompanyAddress(profile.address || '');
      setCity(profile.city || '');
      setPostcode(profile.postcode || '');
      setWebsite(profile.website || '');
      setCompanyDescription(profile.businessDescription || '');
      setCompanyLogo(profile.logo || '');
      setIsActive(profile.isActive !== undefined ? profile.isActive : true);
      if (profile.usps && profile.usps.length > 0) {
        setUsps(profile.usps);
      }
    }
  }, [profile]);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    try {
      await recyclerAuthService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigate('/recycler/login');
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setLocalError(null);
    try {
      const profileData = {
        name: recyclerName,
        companyName,
        phone: companyPhone,
        address: companyAddress,
        city,
        postcode,
        website,
        businessDescription: companyDescription,
        logo: companyLogo,
        isActive,
        usps,
      };
      
      await updateProfile(profileData);
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);
    } catch (error: any) {
      console.error('Error saving profile:', error);
      setLocalError(error.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUSPChange = (index: number, value: string) => {
    const newUsps = [...usps];
    newUsps[index] = value;
    setUsps(newUsps);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCompanyLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200 shadow-sm">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                      <User className="w-7 h-7 text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Company Profile</h1>
                    <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <span className="w-2 h-2 bg-[#1b981b] rounded-full animate-pulse"></span>
                      Manage your business details and settings
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-semibold text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {/* Success Alert */}
            {showSuccessAlert && (
              <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                <div className="bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="font-bold">Profile updated successfully!</p>
                </div>
              </div>
            )}

            {/* Error Alert */}
            {(contextError || localError) && (
              <div className="fixed top-24 right-8 z-50 animate-in slide-in-from-right-5 duration-300">
                <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-white flex items-center gap-3">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-bold">{contextError || localError}</p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {contextLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#1b981b] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600 font-semibold">Loading profile...</p>
                </div>
              </div>
            ) : (
              <>

            {/* Partner ID Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-3xl shadow-2xl p-8 mb-6">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-6 h-6 text-white" />
                    <p className="text-white/80 text-sm font-semibold uppercase tracking-wide">Partner ID</p>
                  </div>
                  <p className="text-4xl font-bold text-white font-mono tracking-wider">{partnerId}</p>
                  <p className="text-white/70 text-sm mt-2">Your unique partner identification number</p>
                </div>
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <Award className="w-12 h-12 text-white" />
                </div>
              </div>
            </div>

            {/* Active/Inactive Toggle Card */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    isActive ? 'bg-gradient-to-br from-[#1b981b] to-[#157a15]' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                  }`}>
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Business Status</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {isActive ? 'Currently accepting new orders' : 'Not accepting orders at the moment'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsActive(!isActive)}
                  className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white'
                      : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                  }`}
                >
                  {isActive ? (
                    <>
                      <ToggleRight className="w-8 h-8" />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-8 h-8" />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>
              <div className={`mt-4 p-4 rounded-xl border-2 ${
                isActive ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'
              }`}>
                <p className={`text-sm font-semibold ${isActive ? 'text-green-700' : 'text-orange-700'}`}>
                  {isActive 
                    ? 'Your business is visible and accepting orders from customers' 
                    : 'Your business is hidden and not accepting new orders'}
                </p>
              </div>
            </div>

            {/* Company Details Form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Company Logo */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Company Logo
                  </h3>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-40 h-40 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center border-4 border-dashed border-gray-300 overflow-hidden">
                      {companyLogo ? (
                        <img src={companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-16 h-16 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                      <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        <Upload className="w-4 h-4" />
                        Upload Logo
                      </div>
                    </label>
                  </div>
                </div>

                {/* Company Name */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <label className="block mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-5 h-5 text-[#1b981b]" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Company Name</span>
                    </div>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm"
                      placeholder="Enter company name"
                    />
                  </label>
                </div>

                {/* Email */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <label className="block mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Email Address</span>
                    </div>
                    <input
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm"
                      placeholder="contact@company.com"
                    />
                  </label>
                </div>

                {/* Phone */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <label className="block mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Phone Number</span>
                    </div>
                    <input
                      type="tel"
                      value={companyPhone}
                      onChange={(e) => setCompanyPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm"
                      placeholder="+44 20 1234 5678"
                    />
                  </label>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Address */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <label className="block mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Business Address</span>
                    </div>
                    <textarea
                      value={companyAddress}
                      onChange={(e) => setCompanyAddress(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm resize-none"
                      placeholder="Enter full business address"
                    />
                  </label>
                </div>

                {/* Description */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border-2 border-gray-200 p-6">
                  <label className="block mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-indigo-600" />
                      <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Company Description</span>
                    </div>
                    <textarea
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1b981b]/50 focus:border-[#1b981b] transition-all text-sm font-medium shadow-sm resize-none"
                      placeholder="Describe your company and services..."
                    />
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    {companyDescription.length} characters
                  </p>
                </div>
              </div>
            </div>

            {/* USPs Section */}
            <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-3xl shadow-2xl border-2 border-purple-200 p-8 mb-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">Unique Selling Points</h3>
                  <p className="text-sm text-gray-600 mt-1">What makes your business stand out? (3 key points)</p>
                </div>
              </div>

              <div className="space-y-4">
                {usps.map((usp, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-gradient-to-br from-[#1b981b] to-[#157a15] rounded-xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <input
                      type="text"
                      value={usp}
                      onChange={(e) => handleUSPChange(index, e.target.value)}
                      maxLength={20}
                      className="w-full pl-16 pr-4 py-4 bg-white border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all text-sm font-semibold shadow-sm hover:shadow-md"
                      placeholder={`USP ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="group flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0d8a0d] text-white rounded-2xl font-bold text-lg transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    Save Profile Changes
                  </>
                )}
              </button>
            </div>
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerProfile;
