// Recycler Authentication Service
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance for recycler auth
const recyclerAuthAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
recyclerAuthAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('recyclerToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
recyclerAuthAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - session expired
    if (error.response?.status === 401) {
      // Only clear auth data on specific auth-related errors
      // Don't auto-redirect - let the component/route handle it
      const errorMessage = error.response?.data?.message || '';
      
      // Only clear storage for session-related errors
      if (errorMessage.includes('Session') || errorMessage.includes('Invalid token') || errorMessage.includes('expired')) {
        console.warn('Session expired or invalid, clearing auth data');
        localStorage.removeItem('recyclerToken');
        localStorage.removeItem('recyclerSessionToken');
        localStorage.removeItem('recyclerEmail');
        localStorage.removeItem('recyclerId');
        localStorage.removeItem('recyclerName');
        localStorage.removeItem('recyclerCompany');
        localStorage.removeItem('recyclerStatus');
        localStorage.removeItem('recyclerAuth');
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const recyclerAuthService = {
  // Send OTP to email
  sendOTP: async (email: string) => {
    const response = await recyclerAuthAPI.post('/auth/recycler/send-otp', { email });
    return response.data;
  },

  // Verify OTP and login
  verifyOTP: async (email: string, otp: string) => {
    const response = await recyclerAuthAPI.post('/auth/recycler/verify-otp', { email, otp });
    return response.data;
  },

  // Logout (invalidate session)
  logout: async () => {
    try {
      await recyclerAuthAPI.post('/auth/recycler/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local storage regardless of API call result
      localStorage.removeItem('recyclerToken');
      localStorage.removeItem('recyclerSessionToken');
      localStorage.removeItem('recyclerEmail');
      localStorage.removeItem('recyclerId');
      localStorage.removeItem('recyclerName');
      localStorage.removeItem('recyclerCompany');
      localStorage.removeItem('recyclerStatus');
      localStorage.removeItem('recyclerAuth');
    }
  },

  // Get recycler profile
  getProfile: async () => {
    const response = await recyclerAuthAPI.get('/auth/recycler/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData: any) => {
    const response = await recyclerAuthAPI.put('/auth/recycler/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await recyclerAuthAPI.put('/auth/recycler/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Validate session (check if token is still valid)
  validateSession: async () => {
    try {
      const response = await recyclerAuthAPI.get('/auth/recycler/profile');
      return response.data.success;
    } catch (error) {
      return false;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('recyclerToken');
    const auth = localStorage.getItem('recyclerAuth');
    return !!token && auth === 'true';
  },

  // Get stored user data
  getUserData: () => {
    return {
      token: localStorage.getItem('recyclerToken'),
      sessionToken: localStorage.getItem('recyclerSessionToken'),
      email: localStorage.getItem('recyclerEmail'),
      id: localStorage.getItem('recyclerId'),
      name: localStorage.getItem('recyclerName'),
      company: localStorage.getItem('recyclerCompany'),
      status: localStorage.getItem('recyclerStatus'),
    };
  },

  // Store auth data after login
  storeAuthData: (data: {
    token: string;
    sessionToken: string;
    recycler: {
      id: string;
      email: string;
      name: string;
      companyName: string;
      status: string;
    };
  }) => {
    console.log('Storing auth data:', {
      hasToken: !!data.token,
      hasSessionToken: !!data.sessionToken,
      recyclerId: data.recycler?.id,
      recyclerEmail: data.recycler?.email,
      tokenPreview: data.token?.substring(0, 20) + '...'
    });
    
    localStorage.setItem('recyclerToken', data.token);
    localStorage.setItem('recyclerSessionToken', data.sessionToken);
    localStorage.setItem('recyclerEmail', data.recycler.email);
    localStorage.setItem('recyclerId', data.recycler.id);
    localStorage.setItem('recyclerName', data.recycler.name);
    localStorage.setItem('recyclerCompany', data.recycler.companyName);
    localStorage.setItem('recyclerStatus', data.recycler.status);
    localStorage.setItem('recyclerAuth', 'true');
    
    console.log('Auth data stored successfully in localStorage');
  },

  // Get all devices
  getAllDevices: async (params?: { search?: string; brand?: string; category?: string; page?: number; limit?: number }) => {
    const response = await recyclerAuthAPI.get('/recycler/devices', { params });
    return response.data;
  },

  // Get device by ID
  getDeviceById: async (id: string) => {
    const response = await recyclerAuthAPI.get(`/recycler/devices/${id}`);
    return response.data;
  },

  // Search devices
  searchDevices: async (query: string) => {
    const response = await recyclerAuthAPI.get('/recycler/devices/search', { params: { query } });
    return response.data;
  },

  // Get device stats
  getDeviceStats: async () => {
    const response = await recyclerAuthAPI.get('/recycler/devices/stats');
    return response.data;
  },

  // Get popular devices
  getPopularDevices: async (limit?: number) => {
    const response = await recyclerAuthAPI.get('/recycler/devices/popular', { params: { limit } });
    return response.data;
  },

  // Get device configuration (preferences + pricing)
  getDeviceConfiguration: async () => {
    const response = await recyclerAuthAPI.get('/recycler/device-config');
    return response.data;
  },

  // Save device configuration (batch save)
  saveDeviceConfiguration: async (data: {
    selectedDevices: string[];
    devicePricing: Array<{
      deviceId: string;
      pricing: Array<{
        condition: string;
        storage: string;
        price: number;
      }>;
    }>;
    enabledStorage: { [key: string]: boolean };
    enabledConditions: { [key: string]: boolean };
  }) => {
    const response = await recyclerAuthAPI.post('/recycler/device-config/batch-save', data);
    return response.data;
  },

  // Get recycler preferences
  getPreferences: async () => {
    const response = await recyclerAuthAPI.get('/recycler/preferences');
    return response.data;
  },

  // Update recycler preferences
  updatePreferences: async (data: {
    enabledStorage?: { [key: string]: boolean };
    enabledConditions?: { [key: string]: boolean };
    selectedDevices?: string[];
  }) => {
    const response = await recyclerAuthAPI.put('/recycler/preferences', data);
    return response.data;
  },
};

export default recyclerAuthService;
