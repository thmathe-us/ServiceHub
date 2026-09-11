import api from './api';

export const servicesApi = {
  getAll: () => api.get('/services').then((res) => res.data),

  getFavorites: () => api.get('/services/favorites').then((res) => res.data),

  getByCategory: (category: string) => api.get(`/services/category/${category}`).then((res) => res.data),

  getById: (id: string) => api.get(`/services/${id}`).then((res) => res.data),

  create: (serviceData: any) => api.post('/services', serviceData).then((res) => res.data),

  update: (id: string, serviceData: any) => api.put(`/services/${id}`, serviceData).then((res) => res.data),

  delete: (id: string) => api.delete(`/services/${id}`).then((res) => res.data),

  search: (query: string) => api.get('/services/search', { params: { q: query } }).then((res) => res.data),

  checkStatus: (id: string) => api.post(`/healthcheck/${id}`).then((res) => res.data),

  checkAllStatuses: () => api.post('/healthcheck/all').then((res) => res.data),

  getServiceStatus: (id: string) => api.get(`/healthcheck/status/${id}`).then((res) => res.data),
};