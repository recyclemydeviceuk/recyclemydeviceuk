import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Clock, ArrowLeft } from 'lucide-react';
import RecyclerSidebar from './RecyclerSidebar';

interface RecyclerComingSoonProps {
  pageName: string;
  description?: string;
  icon?: React.ReactNode;
}

const RecyclerComingSoon: React.FC<RecyclerComingSoonProps> = ({ 
  pageName, 
  description = 'This feature is currently under development and will be available soon.',
  icon 
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('recyclerAuth');
    localStorage.removeItem('recyclerEmail');
    navigate('/recycler/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      <RecyclerSidebar />
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
          <div className="px-8 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{pageName}</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your {pageName.toLowerCase()}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 flex items-center justify-center">
          <div className="max-w-2xl w-full">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-12 text-center">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#1b981b]/10 to-[#157a15]/5 rounded-full mb-6">
                {icon || <Clock className="w-12 h-12 text-[#1b981b]" />}
              </div>

              {/* Title */}
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Coming Soon</h2>

              {/* Description */}
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                {description}
              </p>

              {/* Features List */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 mb-8 border border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">What to expect:</p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#1b981b] rounded-full"></div>
                    <span>Comprehensive data management</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#1b981b] rounded-full"></div>
                    <span>Real-time updates and notifications</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#1b981b] rounded-full"></div>
                    <span>Advanced filtering and search</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-[#1b981b] rounded-full"></div>
                    <span>Export and reporting capabilities</span>
                  </li>
                </ul>
              </div>

              {/* Back Button */}
              <button
                onClick={() => navigate('/recycler/dashboard')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#1b981b] to-[#157a15] hover:from-[#157a15] hover:to-[#0d8a0d] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need assistance?{' '}
                <button
                  onClick={() => navigate('/recycler/support')}
                  className="text-[#1b981b] hover:text-[#157a15] font-medium transition-colors"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecyclerComingSoon;
