import React from 'react';
import { Settings } from 'lucide-react';
import RecyclerComingSoon from '../../components/RecyclerComingSoon';

const RecyclerSettings: React.FC = () => {
  return (
    <RecyclerComingSoon 
      pageName="Settings"
      description="Configure your account preferences, notification settings, and system configurations to customize your experience."
      icon={<Settings className="w-12 h-12 text-[#1b981b]" />}
    />
  );
};

export default RecyclerSettings;
