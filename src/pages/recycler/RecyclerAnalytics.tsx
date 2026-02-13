import React from 'react';
import { TrendingUp } from 'lucide-react';
import RecyclerComingSoon from '../../components/RecyclerComingSoon';

const RecyclerAnalytics: React.FC = () => {
  return (
    <RecyclerComingSoon 
      pageName="Analytics"
      description="Get detailed insights into your performance metrics. Track revenue, device trends, and customer patterns with comprehensive analytics."
      icon={<TrendingUp className="w-12 h-12 text-[#1b981b]" />}
    />
  );
};

export default RecyclerAnalytics;
