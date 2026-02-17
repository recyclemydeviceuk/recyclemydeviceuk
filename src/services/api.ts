import axios, { AxiosInstance, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

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
    // Check for admin token first (in sessionStorage)
    const adminToken = sessionStorage.getItem('adminToken');
    
    // Check for recycler token (in localStorage)
    const recyclerToken = localStorage.getItem('recyclerToken');
    
    // Prioritize admin token over recycler token
    // Admin token takes precedence when both exist
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    } else if (recyclerToken) {
      config.headers.Authorization = `Bearer ${recyclerToken}`;
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
      // Unauthorized - clear tokens and redirect to login
      sessionStorage.removeItem('adminToken');
      sessionStorage.removeItem('adminEmail');
      sessionStorage.removeItem('adminAuth');
      sessionStorage.removeItem('sessionToken');
      
      // Redirect to admin login if on admin panel
      if (window.location.pathname.startsWith('/panel')) {
        window.location.href = '/panel/login';
      }
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
    getAll: (params?: { brand?: string; category?: string; search?: string; sortBy?: string; page?: number; limit?: number }) => 
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
      api.post('/auth/admin/send-otp', { email }),
    
    verifyOTP: (email: string, otp: string) => 
      api.post('/auth/admin/verify-otp', { email, otp }),
    
    resendOTP: (email: string) => 
      api.post('/auth/admin/send-otp', { email }),
    
    logout: () => 
      api.post('/auth/admin/logout'),
    
    getProfile: () => 
      api.get('/auth/admin/profile'),
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
      api.put(`/admin/orders/${id}/status`, { status, notes }),
    
    assignRecycler: (orderId: string, recyclerId: string) => 
      api.put(`/admin/orders/${orderId}/assign-recycler`, { recyclerId }),
    
    delete: (id: string) => 
      api.delete(`/admin/orders/${id}`),
    
    bulkUpdate: (orderIds: string[], status: string) => 
      api.post('/admin/orders/bulk-update', { orderIds, status }),
    
    exportOrders: (params?: { startDate?: string; endDate?: string; status?: string }) => 
      api.get('/admin/orders/export', { params }),
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
    
    approve: (id: string, notes?: string) => 
      api.put(`/admin/recyclers/${id}/approve`, { notes }),
    
    reject: (id: string, reason: string) => 
      api.put(`/admin/recyclers/${id}/reject`, { reason }),
    
    suspend: (id: string, reason: string) => 
      api.patch(`/admin/recyclers/${id}/suspend`, { reason }),
    
    activate: (id: string, reason: string) => 
      api.patch(`/admin/recyclers/${id}/activate`, { reason }),
    
    updateStatus: (id: string, status: string) => 
      api.patch(`/admin/recyclers/${id}/status`, { status }),
    
    toggleActiveStatus: (id: string, isActive: boolean) => 
      api.patch(`/admin/recyclers/${id}/toggle-active`, { isActive }),
    
    delete: (id: string) => 
      api.delete(`/admin/recyclers/${id}`),
    
    getStats: (id: string) => 
      api.get(`/admin/recyclers/${id}/stats`),
  },

  // Recycler Applications
  recyclerApplications: {
    getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) => 
      api.get('/admin/recycler-applications', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/recycler-applications/${id}`),
    
    approve: (id: string, notes?: string) => 
      api.patch(`/admin/recycler-applications/${id}/approve`, { notes }),
    
    reject: (id: string, reason: string) => 
      api.patch(`/admin/recycler-applications/${id}/reject`, { reason }),
    
    delete: (id: string) => 
      api.delete(`/admin/recycler-applications/${id}`),
    
    getStats: () => 
      api.get('/admin/recycler-applications/stats'),
  },

  // Customers
  customers: {
    getAll: (params?: { search?: string; sortBy?: string; page?: number; limit?: number }) => 
      api.get('/admin/customers', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/customers/${id}`),
    
    getStats: () => 
      api.get('/admin/customers/stats'),
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
    getAll: (params?: { status?: string; search?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) => 
      api.get('/admin/contacts', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/contacts/${id}`),
    
    getStats: () => 
      api.get('/admin/contacts/stats'),
    
    reply: (id: string, message: string) => 
      api.post(`/admin/contacts/${id}/reply`, { message }),
    
    updateStatus: (id: string, status: string) => 
      api.put(`/admin/contacts/${id}/status`, { status }),
    
    markAsRead: (id: string) => 
      api.put(`/admin/contacts/${id}/mark-read`),
    
    delete: (id: string) => 
      api.delete(`/admin/contacts/${id}`),
    
    bulkDelete: (contactIds: string[]) => 
      api.post('/admin/contacts/bulk-delete', { contactIds }),
  },

  // Newsletter Subscriptions
  newsletters: {
    getAll: (params?: { status?: string; search?: string; startDate?: string; endDate?: string; page?: number; limit?: number }) => 
      api.get('/admin/newsletters', { params }),
    
    getStats: () => 
      api.get('/admin/newsletters/stats'),
    
    updateStatus: (id: string, status: string) => 
      api.patch(`/admin/newsletters/${id}/status`, { status }),
    
    delete: (id: string) => 
      api.delete(`/admin/newsletters/${id}`),
    
    bulkDelete: (newsletterIds: string[]) => 
      api.post('/admin/newsletters/bulk-delete', { newsletterIds }),
    
    export: (params?: { status?: string }) => 
      api.get('/admin/newsletters/export', { params, responseType: 'blob' }),
  },

  // Content Management - Blogs
  blogs: {
    getAll: (params?: { status?: string; category?: string; search?: string; page?: number; limit?: number }) => 
      api.get('/admin/content/blogs', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/content/blogs/${id}`),
    
    create: (data: any) => 
      api.post('/admin/content/blogs', data),
    
    update: (id: string, data: any) => 
      api.put(`/admin/content/blogs/${id}`, data),
    
    delete: (id: string) => 
      api.delete(`/admin/content/blogs/${id}`),
  },

  // Content Management - FAQs
  faqs: {
    getAll: (params?: { category?: string; search?: string }) => 
      api.get('/admin/content/faqs', { params }),
    
    getById: (id: string) => 
      api.get(`/admin/content/faqs/${id}`),
    
    create: (data: any) => 
      api.post('/admin/content/faqs', data),
    
    update: (id: string, data: any) => 
      api.put(`/admin/content/faqs/${id}`, data),
    
    delete: (id: string) => 
      api.delete(`/admin/content/faqs/${id}`),
    
    reorder: (faqs: any[]) => 
      api.put('/admin/content/faqs/reorder', { faqs }),
  },

  // Dashboard Stats
  dashboard: {
    getStats: () => 
      api.get('/admin/dashboard/stats'),
    
    getRecentActivity: (params?: { limit?: number }) => 
      api.get('/admin/dashboard/recent-activity', { params }),
    
    getRevenueAnalytics: (params?: { period?: 'week' | 'month' | 'year' }) => 
      api.get('/admin/dashboard/revenue-analytics', { params }),
  },

  // Reviews
  reviews: {
    getAll: (params?: any) => 
      api.get('/admin/reviews', { params }),
    
    getStats: () => 
      api.get('/admin/reviews/stats'),
    
    approve: (id: string) => 
      api.patch(`/admin/reviews/${id}/approve`),
    
    reject: (id: string) => 
      api.patch(`/admin/reviews/${id}/reject`),
    
    delete: (id: string) => 
      api.delete(`/admin/reviews/${id}`),
  },

  // Metrics
  metrics: {
    getPlatform: (params?: { startDate?: string; endDate?: string }) => 
      api.get('/admin/metrics/platform', { params }),
    
    getRecyclers: (params?: { startDate?: string; endDate?: string; search?: string; status?: string }) => 
      api.get('/admin/metrics/recyclers', { params }),
    
    getOrderTrends: (params?: { period?: string }) => 
      api.get('/admin/metrics/orders/trends', { params }),
    
    getDevices: () => 
      api.get('/admin/metrics/devices'),
    
    getCustomers: () => 
      api.get('/admin/metrics/customers'),
    
    getRevenue: (params?: { startDate?: string; endDate?: string }) => 
      api.get('/admin/metrics/revenue', { params }),
    
    getOrderStats: (params?: { startDate?: string; endDate?: string }) => 
      api.get('/admin/metrics/orders', { params }),
  },

  // Utilities
  utilities: {
    // Constants
    getOrderStatuses: () => 
      api.get('/admin/utilities/constants/order-statuses'),
    
    getPaymentStatuses: () => 
      api.get('/admin/utilities/constants/payment-statuses'),
    
    getDeviceConditions: () => 
      api.get('/admin/utilities/constants/device-conditions'),
    
    getDeviceCategories: () => 
      api.get('/admin/utilities/constants/device-categories'),
    
    exportData: (type: string, params?: any) => 
      api.get(`/admin/utilities/export/${type}`, { params, responseType: 'blob' }),
    
    uploadImage: (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      return api.post('/admin/utilities/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    
    // Brands
    getBrands: () => api.get('/admin/utilities/brands'),
    createBrand: (data: any) => {
      const isFormData = data instanceof FormData;
      return api.post('/admin/utilities/brands', data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
    },
    updateBrand: (id: string, data: any) => {
      const isFormData = data instanceof FormData;
      return api.put(`/admin/utilities/brands/${id}`, data, {
        headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
      });
    },
    deleteBrand: (id: string) => api.delete(`/admin/utilities/brands/${id}`),
    
    // Storage Options
    getStorageOptions: () => api.get('/admin/utilities/storage-options'),
    createStorageOption: (data: any) => api.post('/admin/utilities/storage-options', data),
    updateStorageOption: (id: string, data: any) => api.put(`/admin/utilities/storage-options/${id}`, data),
    deleteStorageOption: (id: string) => api.delete(`/admin/utilities/storage-options/${id}`),
    
    // Device Categories
    getCategories: () => api.get('/admin/utilities/device-categories'),
    createCategory: (data: any) => api.post('/admin/utilities/device-categories', data),
    updateCategory: (id: string, data: any) => api.put(`/admin/utilities/device-categories/${id}`, data),
    deleteCategory: (id: string) => api.delete(`/admin/utilities/device-categories/${id}`),
    
    // Conditions
    getConditions: () => api.get('/admin/utilities/conditions'),
    createCondition: (data: any) => api.post('/admin/utilities/conditions', data),
    updateCondition: (id: string, data: any) => api.put(`/admin/utilities/conditions/${id}`, data),
    deleteCondition: (id: string) => api.delete(`/admin/utilities/conditions/${id}`),
    
    // Blog Categories
    getBlogCategories: () => api.get('/admin/utilities/blog-categories'),
    createBlogCategory: (data: any) => api.post('/admin/utilities/blog-categories', data),
    updateBlogCategory: (id: string, data: any) => api.put(`/admin/utilities/blog-categories/${id}`, data),
    deleteBlogCategory: (id: string) => api.delete(`/admin/utilities/blog-categories/${id}`),
    
    // FAQ Categories
    getFAQCategories: () => api.get('/admin/utilities/faq-categories'),
    createFAQCategory: (data: any) => api.post('/admin/utilities/faq-categories', data),
    updateFAQCategory: (id: string, data: any) => api.put(`/admin/utilities/faq-categories/${id}`, data),
    deleteFAQCategory: (id: string) => api.delete(`/admin/utilities/faq-categories/${id}`),
    
    // Order Status Management
    createOrderStatus: (data: any) => api.post('/admin/utilities/order-statuses', data),
    updateOrderStatus: (id: string, data: any) => api.put(`/admin/utilities/order-statuses/${id}`, data),
    deleteOrderStatus: (id: string) => api.delete(`/admin/utilities/order-statuses/${id}`),
    
    // Payment Status Management
    createPaymentStatus: (data: any) => api.post('/admin/utilities/payment-statuses', data),
    updatePaymentStatus: (id: string, data: any) => api.put(`/admin/utilities/payment-statuses/${id}`, data),
    deletePaymentStatus: (id: string) => api.delete(`/admin/utilities/payment-statuses/${id}`),
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
    
    bulkUpdate: (orderIds: string[], status: string) => 
      api.post('/recycler/orders/bulk-update', { orderIds, status }),
    
    submitInspection: (orderId: string, inspectionData: any) => 
      api.post(`/recycler/orders/${orderId}/inspection`, inspectionData),
    
    getOrderStatuses: () => 
      api.get('/recycler/orders/utilities/statuses'),
    
    getPaymentStatuses: () => 
      api.get('/recycler/orders/utilities/payment-statuses'),
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
    getAll: (params?: any) => 
      api.get('/recycler/reviews', { params }),
    getStats: () => 
      api.get('/recycler/reviews/stats'),
    getRecent: (limit?: number) => 
      api.get('/recycler/reviews/recent', { params: { limit } }),
    getByRating: (rating: number, limit?: number) => 
      api.get(`/recycler/reviews/rating/${rating}`, { params: { limit } }),
    getRatingBreakdown: () => 
      api.get('/recycler/reviews/rating-breakdown'),
    respond: (id: string, response: string) => 
      api.post(`/recycler/reviews/${id}/respond`, { response }),
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
  getAllDevices: (params?: { brand?: string; category?: string; search?: string; sortBy?: string; page?: number; limit?: number }) => 
    customerAPI.devices.getAll(params),
  
  getDeviceById: (id: string | number) => 
    customerAPI.devices.getById(id),
  
  getCategories: () => 
    api.get('/customer/devices/categories'),
  
  searchDevices: (query: string) => 
    customerAPI.devices.getAll({ search: query }),
  
  getDevicesByBrand: (brand: string) => 
    customerAPI.devices.getAll({ brand }),
  
  getDevicesByCategory: (category: string) => 
    customerAPI.devices.getAll({ category }),
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

export const counterOfferAPI = {
  create: (data: { orderId: string; amendedPrice: number; reason: string; images?: any[] }) =>
    api.post('/counter-offers', data),
  
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/counter-offers/upload-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  getByToken: (token: string) =>
    api.get(`/counter-offers/token/${token}`),
  
  accept: (token: string, customerNotes?: string) =>
    api.post(`/counter-offers/${token}/accept`, { customerNotes }),
  
  decline: (token: string, customerNotes?: string) =>
    api.post(`/counter-offers/${token}/decline`, { customerNotes }),
  
  getByOrder: (orderId: string) =>
    api.get(`/counter-offers/order/${orderId}`),
};
