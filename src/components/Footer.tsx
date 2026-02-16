import { Phone, Mail, MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { customerAPI } from '../services/api';

interface Brand {
  _id: string;
  name: string;
}

export default function Footer() {
  const [topBrands, setTopBrands] = useState<Brand[]>([]);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    quickLinks: false,
    popularBrands: false,
    contactUs: false
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response: any = await customerAPI.devices.getBrands();
        if (response?.success && response?.data) {
          // Get top 3 brands
          setTopBrands(response.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch brands:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12">
        {/* About Section - Always Visible */}
        <div className="mb-6 sm:mb-8 md:mb-10">
          <img 
            src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564725/logo-B5YScriS_1_gmfftq.jpg" 
            alt="Recycle My Device" 
            className="h-8 sm:h-10 w-auto mb-3 sm:mb-4"
          />
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            The UK's trusted phone recycling comparison service.
          </p>
        </div>

        {/* Mobile Accordion View */}
        <div className="sm:hidden space-y-4">
          {/* Quick Links Accordion */}
          <div className="border-b border-gray-700">
            <button
              onClick={() => toggleSection('quickLinks')}
              className="flex items-center justify-between w-full py-3 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Quick Links</h4>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openSections.quickLinks ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${
              openSections.quickLinks ? 'max-h-96 pb-4' : 'max-h-0'
            }`}>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell Your Phone</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link to="/become-a-seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
              </ul>
            </div>
          </div>

          {/* Popular Brands Accordion */}
          <div className="border-b border-gray-700">
            <button
              onClick={() => toggleSection('popularBrands')}
              className="flex items-center justify-between w-full py-3 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Popular Brands</h4>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openSections.popularBrands ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${
              openSections.popularBrands ? 'max-h-96 pb-4' : 'max-h-0'
            }`}>
              <ul className="space-y-2 text-xs text-gray-400">
                {topBrands.length > 0 ? (
                  <>
                    {topBrands.map((brand) => (
                      <li key={brand._id}>
                        <Link 
                          to={`/sell-your-phone?brand=${encodeURIComponent(brand.name)}`} 
                          className="hover:text-white transition-colors"
                        >
                          Sell {brand.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link 
                        to="/sell-your-phone" 
                        className="hover:text-white transition-colors"
                      >
                        All Phones
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell iPhone</Link></li>
                    <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell Samsung</Link></li>
                    <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">All Phones</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Contact Us Accordion */}
          <div className="border-b border-gray-700">
            <button
              onClick={() => toggleSection('contactUs')}
              className="flex items-center justify-between w-full py-3 text-left"
            >
              <h4 className="text-sm font-semibold text-white">Contact Us</h4>
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  openSections.contactUs ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${
              openSections.contactUs ? 'max-h-96 pb-4' : 'max-h-0'
            }`}>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <a href="tel:03301234567" className="hover:text-white transition-colors">0330 123 4567</a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                  <a href="mailto:support@recyclemydevice.co.uk" className="hover:text-white transition-colors break-all">support@recyclemydevice.co.uk</a>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 mt-0.5 text-primary flex-shrink-0" />
                  <span>123 Green Street, London, EC1A 1BB</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Desktop Grid View */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell Your Phone</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/become-a-seller" className="hover:text-white transition-colors">Become a Seller</Link></li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Popular Brands</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-400">
              {topBrands.length > 0 ? (
                <>
                  {topBrands.map((brand) => (
                    <li key={brand._id}>
                      <Link 
                        to={`/sell-your-phone?brand=${encodeURIComponent(brand.name)}`} 
                        className="hover:text-white transition-colors"
                      >
                        Sell {brand.name}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link 
                      to="/sell-your-phone" 
                      className="hover:text-white transition-colors"
                    >
                      All Phones
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell iPhone</Link></li>
                  <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell Samsung</Link></li>
                  <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">All Phones</Link></li>
                </>
              )}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold mb-3 sm:mb-4">Contact Us</h4>
            <ul className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <a href="tel:03301234567" className="hover:text-white transition-colors">0330 123 4567</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                <a href="mailto:support@recyclemydevice.co.uk" className="hover:text-white transition-colors break-all">support@recyclemydevice.co.uk</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mt-0.5 text-primary flex-shrink-0" />
                <span>123 Green Street, London, EC1A 1BB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-400 gap-3 sm:gap-0">
          <p className="text-center sm:text-left">© 2026 Recycle My Device. All rights reserved.</p>
          <div className="flex flex-wrap justify-center space-x-3 sm:space-x-4">
            <Link to="/privacy-policy" className="hover:text-white transition-colors whitespace-nowrap">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors whitespace-nowrap">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
