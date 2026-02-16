import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Smartphone, 
  ShoppingBag, 
  Wrench, 
  Recycle, 
  FileText, 
  Home,
  Users,
  MessageSquare,
  BarChart3,
  Star,
  Mail
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/panel',
      icon: <Home className="w-5 h-5" />
    },
    {
      name: 'Devices',
      path: '/panel/devices',
      icon: <Smartphone className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/panel/orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      name: 'Utilities',
      path: '/panel/utilities',
      icon: <Wrench className="w-5 h-5" />
    },
    {
      name: 'Recyclers',
      path: '/panel/recyclers',
      icon: <Recycle className="w-5 h-5" />
    },
    {
      name: 'Recycler Metrics',
      path: '/panel/recycler-metrics',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      name: 'Customer',
      path: '/panel/customers',
      icon: <Users className="w-5 h-5" />
    },
    {
      name: 'Reviews',
      path: '/panel/reviews',
      icon: <Star className="w-5 h-5" />
    },
    {
      name: 'Content',
      path: '/panel/content',
      icon: <FileText className="w-5 h-5" />
    },
    {
      name: 'Contact Forms',
      path: '/panel/contact-submissions',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      name: 'Newsletter',
      path: '/panel/newsletter-subscriptions',
      icon: <Mail className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => {
    if (path === '/panel') {
      return location.pathname === '/panel';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white border-r-2 border-gray-200 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b-2 border-gray-200">
        <img 
          src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564631/recycle_my_device_transparent_z6ra8s.png" 
          alt="Recycle My Device" 
          className="h-12 w-auto mx-auto"
        />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-[#1b981b] text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t-2 border-gray-200">
        <div className="text-center text-xs text-gray-500">
          <p>Admin Panel</p>
          <p className="mt-1">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
