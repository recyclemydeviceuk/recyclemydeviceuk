import { useState } from 'react';
import { Phone, Mail, Clock, HelpCircle, FileText, Package, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { customerAPI } from '../services/api';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset previous status
    setSubmitStatus({ type: null, message: '' });
    setIsSubmitting(true);

    try {
      // Prepare data for backend
      const contactData = {
        name: formData.fullName,
        email: formData.email,
        orderNumber: formData.orderNumber,
        subject: formData.subject,
        message: formData.message,
      };

      // Submit to backend
      const response: any = await customerAPI.contact.submit(contactData);

      // Show success message
      setSubmitStatus({
        type: 'success',
        message: response.message || 'Your message has been sent successfully! We will get back to you soon.',
      });

      // Clear form
      setFormData({
        fullName: '',
        email: '',
        orderNumber: '',
        subject: '',
        message: '',
      });

      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Contact form submission error:', error);
      
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to send message. Please try again or contact us directly.',
      });

      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Contact Us
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question about your order or need help? We're here to assist you.
          </p>
        </div>
      </section>

      {/* Success/Error Message */}
      {submitStatus.type && (
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
          <div className="max-w-6xl mx-auto">
            <div
              className={`rounded-lg sm:rounded-xl border p-3 sm:p-4 flex items-start space-x-2 sm:space-x-3 ${
                submitStatus.type === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              {submitStatus.type === 'success' ? (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p
                  className={`text-sm sm:text-base font-semibold ${
                    submitStatus.type === 'success' ? 'text-green-900' : 'text-red-900'
                  }`}
                >
                  {submitStatus.type === 'success' ? 'Success!' : 'Error'}
                </p>
                <p
                  className={`text-xs sm:text-sm mt-1 ${
                    submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {submitStatus.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            {/* Left Sidebar - Contact Info */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
              {/* Phone Support Card */}
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      Phone Support
                    </h3>
                    <a href="tel:03301234567" className="text-sm sm:text-base text-primary font-semibold hover:underline block mb-1">
                      0330 123 4567
                    </a>
                    <p className="text-xs sm:text-sm text-gray-600">Mon-Fri: 9am - 6pm</p>
                  </div>
                </div>
              </div>

              {/* Email Us Card */}
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
                      Email Us
                    </h3>
                    <a href="mailto:support@recyclemydevice.co.uk" className="text-primary text-xs sm:text-sm font-semibold hover:underline block mb-1 break-all">
                      support@recyclemydevice.co.uk
                    </a>
                    <p className="text-xs sm:text-sm text-gray-600">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                      Business Hours
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                      <p>Mon-Fri: 9am-6pm</p>
                      <p>Sat: 10am-4pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">
                      Quick Help
                    </h3>
                    <div className="space-y-2">
                      <Link to="/faqs" className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors">
                        <HelpCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Frequently Asked Questions</span>
                      </Link>
                      <Link to="/how-it-works" className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors">
                        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>How It Works</span>
                      </Link>
                      <a href="https://www.royalmail.com/track-your-item" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors">
                        <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Track Your Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-5 sm:p-6 md:p-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Full Name and Email */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="John Smith"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Order Number and Subject */}
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label htmlFor="orderNumber" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        placeholder="RM1001"
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="How can we help?"
                        required
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your enquiry in detail..."
                      required
                      rows={6}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-primary text-white py-3 sm:py-3.5 md:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all shadow-md flex items-center justify-center space-x-2 ${
                      isSubmitting
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:bg-primary-dark hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <span>Send Message</span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
