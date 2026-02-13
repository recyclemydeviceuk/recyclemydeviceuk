import { useState } from 'react';
import { Phone, Mail, Clock, HelpCircle, FileText, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    orderNumber: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
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
      <section className="bg-gradient-to-b from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have a question about your order or need help? We're here to assist you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Phone Support Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Phone Support
                    </h3>
                    <a href="tel:03301234567" className="text-primary font-semibold hover:underline block mb-1">
                      0330 123 4567
                    </a>
                    <p className="text-sm text-gray-600">Mon-Fri: 9am - 6pm</p>
                  </div>
                </div>
              </div>

              {/* Email Us Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      Email Us
                    </h3>
                    <a href="mailto:support@recyclemydevice.co.uk" className="text-primary text-sm font-semibold hover:underline block mb-1">
                      support@recyclemydevice.co.uk
                    </a>
                    <p className="text-sm text-gray-600">We reply within 24 hours</p>
                  </div>
                </div>
              </div>

              {/* Business Hours Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Business Hours
                    </h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Mon-Fri: 9am-6pm</p>
                      <p>Sat: 10am-4pm</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Help Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Quick Help
                    </h3>
                    <div className="space-y-2">
                      <Link to="/faqs" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors">
                        <HelpCircle className="w-4 h-4" />
                        <span>Frequently Asked Questions</span>
                      </Link>
                      <Link to="/how-it-works" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors">
                        <FileText className="w-4 h-4" />
                        <span>How It Works</span>
                      </Link>
                      <a href="https://www.royalmail.com/track-your-item" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 text-sm text-gray-600 hover:text-primary transition-colors">
                        <Package className="w-4 h-4" />
                        <span>Track Your Order</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send Us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name and Email */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Order Number and Subject */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="orderNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="orderNumber"
                        name="orderNumber"
                        value={formData.orderNumber}
                        onChange={handleChange}
                        placeholder="RM1001"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
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
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                  >
                    Send Message
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
