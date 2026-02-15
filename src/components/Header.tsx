import { Phone, ShoppingCart, Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';

export default function Header() {
  const navigate = useNavigate();
  const { cartItem } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCartClick = () => {
    if (cartItem) {
      navigate('/checkout');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img 
              src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564631/recycle_my_device_transparent_z6ra8s.png" 
              alt="Recycle My Device" 
              className="h-10 sm:h-14 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">
              Home
            </Link>
            <Link to="/sell-your-phone" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">
              Sell Your Phone
            </Link>
            <Link to="/how-it-works" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">
              How It Works
            </Link>
            <Link to="/blog" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">
              Blog
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap">
              Contact
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Cart */}
            <button 
              onClick={handleCartClick}
              className={`relative text-gray-700 transition-colors ${
                cartItem ? 'hover:text-primary cursor-pointer' : 'cursor-default'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItem && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  1
                </span>
              )}
            </button>

            {/* Phone - Hidden on small mobile */}
            <a href="tel:08001234567" className="hidden sm:flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors">
              <Phone className="w-4 h-4 text-primary" />
              <span className="hidden md:inline text-sm font-semibold">0800 123 4567</span>
            </a>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-primary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 space-y-3 animate-in slide-in-from-top">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 text-sm font-medium transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/sell-your-phone" 
              className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 text-sm font-medium transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sell Your Phone
            </Link>
            <Link 
              to="/how-it-works" 
              className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 text-sm font-medium transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            <Link 
              to="/blog" 
              className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 text-sm font-medium transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/contact" 
              className="block px-4 py-2 text-gray-700 hover:text-primary hover:bg-gray-50 text-sm font-medium transition-colors rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile Phone Number */}
            <a 
              href="tel:08001234567" 
              className="flex items-center space-x-2 px-4 py-2 text-primary hover:bg-gray-50 text-sm font-semibold transition-colors rounded-lg sm:hidden"
            >
              <Phone className="w-4 h-4" />
              <span>0800 123 4567</span>
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
