import { Phone, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564631/recycle_my_device_transparent_z6ra8s.png" 
              alt="Recycle My Device" 
              className="h-14 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
              Home
            </Link>
            <Link to="/sell-your-phone" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
              Sell Your Phone
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
              How It Works
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Cart and Phone */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-700 hover:text-primary">
              <ShoppingCart className="w-5 h-5" />
            </button>
            <a href="tel:08001234567" className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">0800 123 4567</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
