import React from 'react';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import AdminSidebar from '../../components/AdminSidebar';
import ComingSoon from '../../components/ComingSoon';

const Customer: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    navigate('/panel/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b-2 border-gray-200 shadow-sm">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Customer</h1>
                <p className="text-sm text-gray-600 mt-1">Manage customer accounts and data</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-8">
          <ComingSoon
            title="Customer Management"
            description="View and manage customer accounts, track purchases, handle support requests, and analyze customer data."
            icon={<Users className="w-12 h-12" />}
          />
        </main>
      </div>
    </div>
  );
};

export default Customer;
