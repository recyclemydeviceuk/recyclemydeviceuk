import { Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <img 
              src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564725/logo-B5YScriS_1_gmfftq.jpg" 
              alt="Recycle My Device" 
              className="h-10 w-auto mb-4"
            />
            <p className="text-sm text-gray-400">
              The UK's trusted phone recycling comparison service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
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
            <h4 className="font-semibold mb-4">Popular Brands</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell iPhone</Link></li>
              <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">Sell Samsung</Link></li>
              <li><Link to="/sell-your-phone" className="hover:text-white transition-colors">All Phones</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary" />
                <a href="tel:03301234567" className="hover:text-white transition-colors">0330 123 4567</a>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@recyclemydevice.co.uk" className="hover:text-white transition-colors">support@recyclemydevice.co.uk</a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                <span>123 Green Street, London, EC1A 1BB</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2026 Recycle My Device. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
