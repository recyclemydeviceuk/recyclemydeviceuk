import React from 'react';
import { Smartphone } from 'lucide-react';
import RecyclerComingSoon from '../../components/RecyclerComingSoon';

const RecyclerDevices: React.FC = () => {
  return (
    <RecyclerComingSoon 
      pageName="Devices Purchased"
      description="View and manage all the devices you've purchased from customers. Track device details, conditions, and purchase history."
      icon={<Smartphone className="w-12 h-12 text-[#1b981b]" />}
    />
  );
};

export default RecyclerDevices;
