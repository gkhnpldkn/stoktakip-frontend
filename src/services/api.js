import axios from 'axios';

// Ortam değişkeni VITE_API_URL olarak tanımlanmalı (.env dosyasında)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false, // CORS sorunu için false yapıyoruz
});

// Request interceptor - token ekleme
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - hata yönetimi
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      console.error('Error Response:', error.response.status, error.response.data);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/giris';
    }
    return Promise.reject(error);
  }
);

// Stock API
export const stockAPI = {
  getAll: () => api.get('/stock/all'),
  getById: (id) => api.get(`/stock/${id}`),
  getByItemCode: (itemCode) => api.get(`/stock/itemCode?itemCode=${itemCode}`),
  create: (itemData) => api.post('/stock', itemData),
  update: (itemCode, itemData) => api.put(`/stock/${itemCode}`, itemData),
  delete: (id) => api.delete(`/stock/${id}`),
};

// Item Movement API
export const movementAPI = {
  getMovements: (itemCode, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    return api.get(`/movements/${itemCode}?${params.toString()}`);
  },
};

// Production API
export const productionAPI = {
  produceItem: (itemCode, count) => api.post(`/production/${itemCode}?count=${count}`),
};

// Ürün Ağacı API
export const itemTreeAPI = {
  createTreeBulk: (data) => api.post('/item-tree/bulk', data),
  getTreeByItemCode: (itemCode) => api.get(`/item-tree/${itemCode}`),
  deleteRelation: (itemCode) => api.delete(`/item-tree/${itemCode}`),
  getTotalCost: (itemCode) => api.get(`/item-tree/${itemCode}/total-cost`)
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export default api;
