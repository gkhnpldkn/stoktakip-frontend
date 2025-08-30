import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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

// Stock API - Backend'inizdeki StockController'a uygun
export const stockAPI = {
  // Tüm ürünleri getir
  getAll: () => api.get('/stock/all'),
  
  // ID ile ürün getir
  getById: (id) => api.get(`/stock/${id}`),
  
  // ItemCode ile ürün getir
  getByItemCode: (itemCode) => api.get(`/stock/itemCode?itemCode=${itemCode}`),
  
  // Yeni ürün ekle
  create: (itemData) => api.post('/stock', itemData),
  
  // Ürün güncelle (itemCode ile)
  update: (itemCode, itemData) => api.put(`/stock/${itemCode}`, itemData),
  
  // Ürün sil (ID ile)
  delete: (id) => api.delete(`/stock/${id}`),
};

// Item Movement API - Backend'inizdeki ItemMovementController'a uygun
export const movementAPI = {
  // Ürün hareketlerini listele
  getMovements: (itemCode, filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.from) params.append('from', filters.from);
    if (filters.to) params.append('to', filters.to);
    
    return api.get(`/movements/${itemCode}?${params.toString()}`);
  },
};

// Production API - Backend'inizdeki ProductionController'a uygun
export const productionAPI = {
  // Üretim yap
  produceItem: (itemCode, count) => api.post(`/production/${itemCode}?count=${count}`),
};

// Ürün Ağacı API
export const itemTreeAPI = {
  // Toplu ürün ağacı oluştur
  createTreeBulk: (data) => api.post('/item-tree/bulk', data),
  
  // Belirli bir ürünün bileşenlerini getir
  getTreeByItemCode: (itemCode) => api.get(`/item-tree/${itemCode}`),
  
  // Ürün ağacı ilişkisini sil
  deleteRelation: (itemCode) => api.delete(`/item-tree/${itemCode}`),
  
  // Ürünün toplam maliyetini hesapla
  getTotalCost: (itemCode) => api.get(`/item-tree/${itemCode}/total-cost`)
};

// Auth API (eğer backend'inizde auth varsa)
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
};

export default api;
