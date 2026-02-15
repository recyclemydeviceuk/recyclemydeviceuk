import { Search, BarChart3, Send, Wallet, Shield, Zap, Award, Package, CheckCircle, User, Smartphone, FileText, Box, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: Search,
      title: 'Find Your Device',
      description: 'Search for your phone model using our easy search tool. Select your device\'s storage capacity and honestly assess its condition.',
    },
    {
      number: 2,
      icon: BarChart3,
      title: 'Compare Prices',
      description: 'Instantly see prices from multiple trusted UK recyclers. Compare ratings, payment speeds, and choose the best offer for you.',
    },
    {
      number: 3,
      icon: Send,
      title: 'Send Your Device',
      description: 'Complete your order and receive a FREE prepaid shipping label. Pack your device securely and drop it off at any Royal Mail location.',
    },
    {
      number: 4,
      icon: Wallet,
      title: 'Get Paid Fast',
      description: 'Once your device is received and inspected, payment is sent directly to your bank account - usually within 1-3 working days.',
    },
  ];

  const features = [
    {
      icon: Shield,
      title: '100% Safe & Secure',
      description: 'All our partner recyclers are vetted and trusted. Your data is wiped securely before any device is processed.',
    },
    {
      icon: Zap,
      title: 'Fast Payments',
      description: 'Most buyers pay within 1-3 working days of receiving your device. Some even offer same-day payment!',
    },
    {
      icon: Award,
      title: 'Best Prices Guaranteed',
      description: 'We compare prices from 20+ recyclers so you always get the best value for your old phone.',
    },
    {
      icon: Package,
      title: 'Free Postage',
      description: 'Every order comes with a FREE prepaid shipping label. No hidden costs, ever.',
    },
  ];

  const tips = [
    {
      icon: CheckCircle,
      title: 'Be Honest About Condition',
      description: 'Accurately describe your device\'s condition to avoid price revisions. If in doubt, select a lower condition grade.',
    },
    {
      icon: User,
      title: 'Remove All Accounts',
      description: 'Sign out of iCloud, Google, and Samsung accounts. Disable Find My iPhone/Android before sending.',
    },
    {
      icon: Smartphone,
      title: 'Factory Reset',
      description: 'Perform a factory reset to remove all personal data. Back up anything important first!',
    },
    {
      icon: FileText,
      title: 'Remove SIM & Memory Cards',
      description: 'Take out your SIM card and any external memory cards before posting. These cannot be returned.',
    },
    {
      icon: Box,
      title: 'Pack Securely',
      description: 'Use the packaging provided or wrap your device in bubble wrap to prevent damage during transit.',
    },
    {
      icon: Receipt,
      title: 'Keep Your Tracking Number',
      description: 'Hold onto your Royal Mail receipt until payment is confirmed. This protects you if anything goes wrong.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-green-50 to-white py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Selling your old phone has never been easier. Compare prices, choose your buyer, and get paid fast - all in 4 simple steps.
          </p>
          <Link
            to="/sell-your-phone"
            className="inline-block bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-10 sm:py-14 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-5 sm:p-6 md:p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 sm:space-x-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg">
                        {step.number}
                      </div>
                    </div>
                    <div className="flex-1 pt-0.5 sm:pt-1">
                      <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Why Choose Us?
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              We make selling your phone simple, safe, and rewarding.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg sm:rounded-xl p-5 sm:p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-md">
                    <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Before You Send Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
              Before You Send Your Device
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Follow these tips to ensure a smooth sale and get the best price.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {tips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg sm:rounded-xl border border-gray-200 p-4 sm:p-5 md:p-6 hover:shadow-lg transition-all hover:border-primary/20"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-10 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Ready to Sell Your Phone?
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-6 sm:mb-8">
            Get an instant quote and see how much your device is worth today.
          </p>
          <Link
            to="/sell-your-phone"
            className="inline-block bg-primary text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg font-semibold hover:bg-primary-dark transition-colors shadow-md"
          >
            Get Your Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
