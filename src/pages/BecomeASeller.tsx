import { useState } from 'react';
import { Users, TrendingUp, Shield, Headphones, CheckCircle, Mail, Loader } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { recyclerApplicationAPI } from '../services/api';

export default function BecomeASeller() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessDescription: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await recyclerApplicationAPI.submit({
        name: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        companyName: formData.companyName,
        website: formData.website || undefined,
        businessDescription: formData.businessDescription || undefined,
      }) as any;

      if (response.success) {
        setSubmitted(true);
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          website: '',
          businessDescription: '',
        });
      } else {
        setError('Submission failed. Please try again.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const benefits = [
    {
      icon: Users,
      title: 'Access Thousands of Sellers',
      description: 'Tap into our large customer base looking to sell their devices',
    },
    {
      icon: TrendingUp,
      title: 'Grow Your Business',
      description: 'Increase your device acquisition with quality leads',
    },
    {
      icon: Shield,
      title: 'Trusted Platform',
      description: 'Join a reputable marketplace trusted by thousands',
    },
    {
      icon: Headphones,
      title: 'Easy Integration',
      description: 'Simple onboarding process with dedicated support',
    },
  ];

  const steps = [
    {
      number: 1,
      title: 'Apply to Join',
      description: 'Fill out our partner application form with your business details',
    },
    {
      number: 2,
      title: 'Get Approved',
      description: 'Our team reviews your application within 2 business days',
    },
    {
      number: 3,
      title: 'Start Receiving Orders',
      description: 'Once live, customers can choose your offers and send devices',
    },
  ];

  const requirements = [
    'Registered UK business with valid company registration',
    'Minimum 6 months experience in device recycling/refurbishment',
    'Ability to process payments within 3 business days',
    'Professional customer service standards',
    'Secure data wiping certification (ADISA preferred)',
    'Competitive pricing for all device conditions',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-green-600 text-white py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 md:mb-6">
            Partner With Recycle My Device
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl mx-auto">
            Join the UK's leading phone recycling comparison platform and connect with thousands of customers looking to sell their devices.
          </p>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-10 md:mb-12">
            Why Partner With Us?
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-5 sm:p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-10 md:mb-12">
            How It Works
          </h2>
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 flex items-start space-x-3 sm:space-x-4 md:space-x-5 hover:shadow-lg transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-1 sm:pt-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Requirements */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 text-center mb-8 sm:mb-10 md:mb-12">
            Partner Requirements
          </h2>
          <div className="bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8">
            <ul className="space-y-3 sm:space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-2 sm:space-x-3">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm sm:text-base md:text-lg text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Apply Now
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Fill out the form below and our partnerships team will be in touch.
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8 shadow-lg">
            {submitted ? (
              <div className="text-center py-8 sm:py-10 md:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Application Submitted Successfully!
                </h3>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 sm:mb-6 max-w-md mx-auto">
                  Thank you for your interest in partnering with us. Our team will review your application and get back to you within 2 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-sm sm:text-base text-primary font-semibold hover:underline"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                    <p className="text-red-800 text-xs sm:text-sm font-medium">{error}</p>
                  </div>
                )}
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Your company name"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Contact Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                <div>
                  <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="business@example.com"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Your phone number"
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Business Description */}
              <div>
                <label htmlFor="businessDescription" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                  Tell us about your business
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  placeholder="Briefly describe your business, experience, and why you'd like to partner with us..."
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 sm:py-3.5 md:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Submit Application</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Have Questions?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-5 sm:mb-6">
            Our partnerships team is here to help. Get in touch to learn more about becoming a partner.
          </p>
          <a
            href="mailto:partnerships@recyclemydevice.co.uk"
            className="inline-flex items-center space-x-2 text-primary font-semibold text-base sm:text-lg hover:underline break-all"
          >
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>partnerships@recyclemydevice.co.uk</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
