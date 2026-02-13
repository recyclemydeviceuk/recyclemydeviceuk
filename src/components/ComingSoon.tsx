import React from 'react';
import { Clock } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title, description, icon }) => {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
          <div className="text-gray-400">
            {icon}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-3">{title}</h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Coming Soon Badge */}
        <div className="inline-flex items-center space-x-2 px-6 py-3 bg-[#1b981b] text-white rounded-xl">
          <Clock className="w-5 h-5" />
          <span className="font-semibold">Coming Soon</span>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500 mt-6">
          This feature is currently under development
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
