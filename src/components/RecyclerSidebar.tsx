import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useRecycler } from '../contexts/RecyclerContext';
import { 
  LayoutDashboard,
  ShoppingBag,
  HelpCircle,
  User,
  Package,
  Star
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const RecyclerSidebar: React.FC = () => {
  const location = useLocation();
  const { partnerId, isLoading } = useRecycler();

  const menuItems: MenuItem[] = [
    {
      name: 'Dashboard',
      path: '/recycler/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      name: 'Devices We Accept',
      path: '/recycler/devices-accepted',
      icon: <Package className="w-5 h-5" />
    },
    {
      name: 'Orders',
      path: '/recycler/orders',
      icon: <ShoppingBag className="w-5 h-5" />
    },
    {
      name: 'Reviews',
      path: '/recycler/reviews',
      icon: <Star className="w-5 h-5" />
    },
    {
      name: 'Profile',
      path: '/recycler/profile',
      icon: <User className="w-5 h-5" />
    },
    {
      name: 'Help & Support',
      path: '/recycler/support',
      icon: <HelpCircle className="w-5 h-5" />
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src="https://res.cloudinary.com/dn2sab6qc/image/upload/v1770564631/recycle_my_device_transparent_z6ra8s.png" 
            alt="Recycle My Device" 
            className="h-10 w-auto"
          />
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Recycler</p>
            <p className="text-xs text-gray-400">Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-gradient-to-r from-[#1b981b] to-[#157a15] text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer Section - Always at bottom */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0 mt-auto">
        <div className="bg-gradient-to-br from-[#1b981b]/10 to-[#157a15]/5 rounded-xl p-4 border border-[#1b981b]/20">
          <p className="text-xs font-semibold text-gray-700 mb-1">Partner ID</p>
          <p className="text-sm font-mono font-bold text-[#1b981b]">
            {isLoading ? (
              <span className="animate-pulse">Loading...</span>
            ) : (
              partnerId
            )}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RecyclerSidebar;
