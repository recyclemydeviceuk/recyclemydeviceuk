import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { recyclerAPI } from '../services/api';

interface RecyclerProfile {
  _id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  website?: string;
  logo?: string;
  usps?: string[];
  businessDescription?: string;
  address?: string;
  city?: string;
  postcode?: string;
  isActive: boolean;
  status: string;
}

interface RecyclerContextType {
  profile: RecyclerProfile | null;
  partnerId: string;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<RecyclerProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const RecyclerContext = createContext<RecyclerContextType | undefined>(undefined);

export const useRecycler = () => {
  const context = useContext(RecyclerContext);
  if (context === undefined) {
    throw new Error('useRecycler must be used within a RecyclerProvider');
  }
  return context;
};

interface RecyclerProviderProps {
  children: ReactNode;
}

export const RecyclerProvider: React.FC<RecyclerProviderProps> = ({ children }) => {
  const [profile, setProfile] = useState<RecyclerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generatePartnerId = (id: string) => {
    if (!id) return 'RP-0000';
    return `RP-${id.slice(-4).toUpperCase()}`;
  };

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recyclerAPI.profile.get();
      if (response?.data) {
        setProfile(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching recycler profile:', err);
      setError(err.message || 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshProfile = async () => {
    await fetchProfile();
  };

  const updateProfile = async (data: Partial<RecyclerProfile>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await recyclerAPI.profile.update(data);
      if (response?.data) {
        setProfile(response.data);
      }
    } catch (err: any) {
      console.error('Error updating recycler profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if recycler is logged in (token exists)
    const token = localStorage.getItem('recyclerToken');
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
      setError('Not authenticated');
    }
  }, []);

  const partnerId = profile ? generatePartnerId(profile._id) : 'RP-0000';

  return (
    <RecyclerContext.Provider
      value={{
        profile,
        partnerId,
        isLoading,
        error,
        fetchProfile,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </RecyclerContext.Provider>
  );
};

export default RecyclerContext;
