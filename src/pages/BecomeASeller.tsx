import { useState } from 'react';
import { Users, TrendingUp, Shield, Headphones, CheckCircle, Mail } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function BecomeASeller() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessDescription: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Application submitted:', formData);
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
      <section className="bg-gradient-to-br from-primary to-green-600 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Partner With Recycle My Device
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join the UK's leading phone recycling comparison platform and connect with thousands of customers looking to sell their devices.
          </p>
        </div>
      </section>

      {/* Why Partner With Us */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Partner With Us?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            How It Works
          </h2>
          <div className="space-y-6">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-xl border border-gray-200 p-6 flex items-start space-x-5 hover:shadow-lg transition-all"
              >
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Requirements */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Partner Requirements
          </h2>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
            <ul className="space-y-4">
              {requirements.map((requirement, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-base text-gray-700">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Apply Now
            </h2>
            <p className="text-lg text-gray-600">
              Fill out the form below and our partnerships team will be in touch.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Contact Name */}
              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-gray-700 mb-2">
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
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Email and Phone */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://yourcompany.com"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              {/* Business Description */}
              <div>
                <label htmlFor="businessDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                  Tell us about your business
                </label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  placeholder="Briefly describe your business, experience, and why you'd like to partner with us..."
                  rows={6}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white border-t">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Have Questions?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Our partnerships team is here to help. Get in touch to learn more about becoming a partner.
          </p>
          <a
            href="mailto:partnerships@recyclemydevice.co.uk"
            className="inline-flex items-center space-x-2 text-primary font-semibold text-lg hover:underline"
          >
            <Mail className="w-5 h-5" />
            <span>partnerships@recyclemydevice.co.uk</span>
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
