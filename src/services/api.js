import axios from 'axios';

// ✅ CAMBIA ESTO - Apunta a tu backend en Render
const API_URL = 'https://indavco-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Autenticación
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Servicios (CRUD completo)
export const servicesAPI = {
  getAll: () => api.get('/services'),
  getOne: (id) => api.get(`/services/${id}`),  // ✅ CORREGIDO
  create: (data) => api.post('/services', data),
  update: (id, data) => api.put(`/services/${id}`, data),  // ✅ CORREGIDO
  delete: (id) => api.delete(`/services/${id}`),  // ✅ CORREGIDO
};

// Blog (CRUD completo)
export const blogAPI = {
  getAll: (params) => api.get('/blog', { params }),
  getOne: (slug) => api.get(`/blog/${slug}`),  // ✅ CORREGIDO
  create: (data) => api.post('/blog', data),
  update: (id, data) => api.put(`/blog/${id}`, data),  // ✅ CORREGIDO
  delete: (id) => api.delete(`/blog/${id}`),  // ✅ CORREGIDO
};

// Proyectos (CRUD completo)
export const projectsAPI = {
  getAll: (params) => api.get('/projects', { params }),
  getOne: (id) => api.get(`/projects/${id}`),  // ✅ CORREGIDO
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),  // ✅ CORREGIDO
  delete: (id) => api.delete(`/projects/${id}`),  // ✅ CORREGIDO
};

// Planes Corporativos (CRUD completo)
export const corporatePlansAPI = {
  getAll: () => api.get('/corporate-plans'),
  getOne: (id) => api.get(`/corporate-plans/${id}`),  // ✅ CORREGIDO
  create: (data) => api.post('/corporate-plans', data),
  update: (id, data) => api.put(`/corporate-plans/${id}`, data),  // ✅ CORREGIDO
  delete: (id) => api.delete(`/corporate-plans/${id}`),  // ✅ CORREGIDO
};

// Clientes (CRUD completo)
export const clientsAPI = {
  getAll: () => api.get('/clients'),
  getOne: (id) => api.get(`/clients/${id}`),  // ✅ CORREGIDO
  create: (formData) => api.post('/clients', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => api.put(`/clients/${id}`, formData, {  // ✅ CORREGIDO
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => api.delete(`/clients/${id}`),  // ✅ CORREGIDO
};

export default api;
