import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if exists
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<any>) => {
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      // window.location.href = '/admin/login';
    }
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

// ============================================
// CUSTOMER API ENDPOINTS
// ============================================

export const customerAPI = {
  // Devices
  devices: {
    getAll: (params?: { brand?: string; search?: string; sortBy?: string }) => 
      api.get('/customer/devices', { params }),
    
    getById: (id: string | number) => 
      api.get(`/customer/devices/${id}`),
    
    getBrands: () => 
      api.get('/customer/devices/brands'),
    
    getPopular: () => 
      api.get('/customer/devices/popular'),
  },

  // Orders
  orders: {
    create: (orderData: any) => 
      api.post('/customer/orders', orderData),
    
    getById: (id: string) => 
      api.get(`/customer/orders/${id}`),
    
    verifyOrder: (orderNumber: string, email: string) =>
      api.post('/customer/orders/verify', { orderNumber, email }),
    
    trackOrder: (orderNumber: string) =>
      api.get(`/customer/orders/track/${orderNumber}`),
  },

  // Contact
  contact: {
    submit: (contactData: { 
      name: string; 
      email: string; 
      phone?: string; 
      subject?: string;
      message: string;
      category?: string;
    }) => 
      api.post('/customer/contact', contactData),
    
    getCategories: () =>
      api.get('/customer/contact/categories'),
    
    subscribeNewsletter: (email: string, name?: string) =>
      api.post('/customer/contact/newsletter', { email, name }),
  },

  // Reviews
  reviews: {
    getAll: (params?: { recyclerId?: string; limit?: number }) => 
      api.get('/customer/reviews', { params }),
    
    getByRecycler: (recyclerId: string) => 
      api.get(`/customer/reviews/recycler/${recyclerId}`),
    
    submit: (reviewData: {
      orderNumber: string;
      email: string;
      rating: number;
      comment?: string;
      customerName?: string;
    }) => 
      api.post('/customer/reviews', reviewData),
    
    checkEligibility: (orderNumber: string, email: string) =>
      api.post('/customer/reviews/check-eligibility', { orderNumber, email }),
    
    create: (reviewData: any) => 
      api.post('/customer/reviews', reviewData),
  },

  // Blog
  blog: {
    getAll: (params?: { category?: string; limit?: number; page?: number }) => 
      api.get('/customer/blogs', { params }),
    
    getById: (id: string) => 
      api.get(`/customer/blogs/${id}`),
    
    getCategories: () => 
      api.get('/customer/blogs/categories'),
  },

  // FAQ
  faq: {
    getAll: (params?: { category?: string }) => 
      api.get('/customer/faqs', { params }),
    
    getCategories: () => 
      api.get('/customer/faqs/categories'),
  },
};

// ============================================
// ADMIN API ENDPOINTS
// ============================================

export const adminAPI = {
  // Auth
  auth: {
    login: (email: string) => 
      api.post('/auth/admin/login', { email }),
    
    verifyOTP: (email: string, otp: string) => 
      api.post('/auth/admin/verify-otp', { email, otp }),
    
    resendOTP: (email: string) => 
      api.post('/auth/admin/resend-otp', { email }),
  },

  // Dashboard
  dashboard: {
    getStats: () => 
      api.get('/admin/dashboard/stats'),
    
    getRecentOrders: (limit?: number) => 
      api.get('/admin/dashboard/recent-orders', { params: { limit } }),
  },

  // Devices
  devices: {
    getAll: (params?: any) => 
      api.get('/admin/devices', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/devices/${id}`),
    
    create: (deviceData: any) => 
      api.post('/admin/devices', deviceData),
    
    update: (id: string, deviceData: any) => 
      api.put(`/admin/devices/${id}`, deviceData),
    
    delete: (id: string) => 
      api.delete(`/admin/devices/${id}`),
    
    bulkUpload: (devicesData: any[]) => 
      api.post('/admin/devices/bulk', { devices: devicesData }),
  },

  // Orders
  orders: {
    getAll: (params?: any) => 
      api.get('/admin/orders', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/orders/${id}`),
    
    updateStatus: (id: string, status: string, notes?: string) => 
      api.patch(`/admin/orders/${id}/status`, { status, notes }),
    
    assignRecycler: (orderId: string, recyclerId: string) => 
      api.patch(`/admin/orders/${orderId}/assign`, { recyclerId }),
  },

  // Recyclers
  recyclers: {
    getAll: (params?: any) => 
      api.get('/admin/recyclers', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/recyclers/${id}`),
    
    create: (recyclerData: any) => 
      api.post('/admin/recyclers', recyclerData),
    
    update: (id: string, recyclerData: any) => 
      api.put(`/admin/recyclers/${id}`, recyclerData),
    
    updateStatus: (id: string, status: string) => 
      api.patch(`/admin/recyclers/${id}/status`, { status }),
    
    delete: (id: string) => 
      api.delete(`/admin/recyclers/${id}`),
  },

  // Content Management
  content: {
    // Blog
    blogs: {
      getAll: (params?: any) => 
        api.get('/admin/content/blogs', { params }),
      
      getById: (id: string) => 
        api.get(`/admin/content/blogs/${id}`),
      
      create: (blogData: any) => 
        api.post('/admin/content/blogs', blogData),
      
      update: (id: string, blogData: any) => 
        api.put(`/admin/content/blogs/${id}`, blogData),
      
      delete: (id: string) => 
        api.delete(`/admin/content/blogs/${id}`),
    },
    
    // FAQ
    faqs: {
      getAll: (params?: any) => 
        api.get('/admin/content/faqs', { params }),
      
      create: (faqData: any) => 
        api.post('/admin/content/faqs', faqData),
      
      update: (id: string, faqData: any) => 
        api.put(`/admin/content/faqs/${id}`, faqData),
      
      delete: (id: string) => 
        api.delete(`/admin/content/faqs/${id}`),
    },
  },

  // Contact Submissions
  contacts: {
    getAll: (params?: any) => 
      api.get('/admin/contacts', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/contacts/${id}`),
    
    markAsRead: (id: string) => 
      api.patch(`/admin/contacts/${id}/read`),
    
    delete: (id: string) => 
      api.delete(`/admin/contacts/${id}`),
  },

  // Reviews
  reviews: {
    getAll: (params?: any) => 
      api.get('/admin/reviews', { params }),
    
    approve: (id: string) => 
      api.patch(`/admin/reviews/${id}/approve`),
    
    reject: (id: string) => 
      api.patch(`/admin/reviews/${id}/reject`),
    
    delete: (id: string) => 
      api.delete(`/admin/reviews/${id}`),
  },

  // Metrics
  metrics: {
    getRevenue: (params?: { startDate?: string; endDate?: string }) => 
      api.get('/admin/metrics/revenue', { params }),
    
    getOrderStats: (params?: { startDate?: string; endDate?: string }) => 
      api.get('/admin/metrics/orders', { params }),
  },

  // Utilities
  utilities: {
    exportData: (type: string, params?: any) => 
      api.get(`/admin/utilities/export/${type}`, { params, responseType: 'blob' }),
    
    uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/admin/utilities/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
  },
};

// ============================================
// RECYCLER API ENDPOINTS
// ============================================

export const recyclerAPI = {
  // Auth
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/recycler/login', { email, password }),
    
    register: (applicationData: any) => 
      api.post('/auth/recycler/register', applicationData),
  },

  // Dashboard
  dashboard: {
    getStats: () => 
      api.get('/recycler/dashboard/stats'),
    
    getRecentOrders: (limit?: number) => 
      api.get('/recycler/dashboard/recent-orders', { params: { limit } }),
  },

  // Orders
  orders: {
    getAll: (params?: any) => 
      api.get('/recycler/orders', { params }),
    
    getById: (id: string) => 
      api.get(`/recycler/orders/${id}`),
    
    updateStatus: (id: string, status: string, notes?: string) => 
      api.patch(`/recycler/orders/${id}/status`, { status, notes }),
    
    submitInspection: (orderId: string, inspectionData: any) => 
      api.post(`/recycler/orders/${orderId}/inspection`, inspectionData),
  },

  // Profile
  profile: {
    get: () => 
      api.get('/recycler/profile'),
    
    update: (profileData: any) => 
      api.put('/recycler/profile', profileData),
    
    changePassword: (currentPassword: string, newPassword: string) => 
      api.patch('/recycler/profile/password', { currentPassword, newPassword }),
  },

  // Devices
  devices: {
    getAll: (params?: any) => 
      api.get('/recycler/devices', { params }),
  },

  // Reviews
  reviews: {
    getAll: () => 
      api.get('/recycler/reviews'),
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
};

export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

// Export the base axios instance for custom requests
export const faqAPI = {
  getAll: (params?: { category?: string }) => 
    api.get('/customer/faqs', { params }),
  
  getCategories: () => 
    api.get('/customer/faqs/categories'),
};

export const recyclerApplicationAPI = {
  submit: (applicationData: {
    name: string;
    email: string;
    phone: string;
    companyName: string;
    website?: string;
    businessDescription?: string;
  }) => 
    api.post('/customer/recycler-applications/apply', applicationData),
};

export default api;

// Backward compatibility exports using customerAPI structure
export const deviceAPI = {
  getAllDevices: (params?: { brand?: string; search?: string; sortBy?: string; page?: number; limit?: number }) => 
    customerAPI.devices.getAll(params),
  
  getDeviceById: (id: string | number) => 
    customerAPI.devices.getById(id),
  
  searchDevices: (query: string) => 
    customerAPI.devices.getAll({ search: query }),
  
  getDevicesByBrand: (brand: string) => 
    customerAPI.devices.getAll({ brand }),
  
  getDevicesByCategory: (category: string) => 
    customerAPI.devices.getAll(),
};

export const brandAPI = {
  getAllBrands: () => 
    customerAPI.devices.getBrands(),
  
  getBrandById: (id: string) => 
    api.get(`/customer/devices/brands/${id}`),
};

export const pricingAPI = {
  getDevicePrices: (deviceId: string, storage?: string | null, condition?: string | null) => {
    const params: any = {};
    if (storage) params.storage = storage;
    if (condition) params.condition = condition;
    
    return api.get(`/customer/pricing/device/${deviceId}`, { params });
  },
};

export const orderAPI = {
  createOrder: (orderData: any) => 
    customerAPI.orders.create(orderData),
  
  trackOrder: (orderNumber: string) => 
    api.get(`/customer/orders/${orderNumber}/track`),
  
  verifyOrder: (orderNumber: string, email: string) => 
    api.post('/customer/orders/verify', { orderNumber, email }),
  
  cancelOrder: (orderNumber: string, email: string, reason: string) => 
    api.put(`/customer/orders/${orderNumber}/cancel`, { email, reason }),
};

export const blogAPI = {
  getAll: (params?: { category?: string; limit?: number; page?: number }) => 
    api.get('/customer/blogs', { params }),
  
  getById: (slug: string) => 
    api.get(`/customer/blogs/${slug}`),
  
  getCategories: () => 
    api.get('/customer/blogs/categories'),
  
  getFeatured: (limit?: number) =>
    api.get('/customer/blogs/featured', { params: { limit } }),
  
  getRecent: (limit?: number) =>
    api.get('/customer/blogs/recent', { params: { limit } }),
};
