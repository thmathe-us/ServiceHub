import api from './api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export const categoriesApi = {
  getAll: () => api.get('/categories').then((res) => res.data),
  getById: (id: string) => api.get(`/categories/${id}`).then((res) => res.data),
  create: (categoryData: any) => api.post('/categories', categoryData).then((res) => res.data),
  update: (id: string, categoryData: any) => api.put(`/categories/${id}`, categoryData).then((res) => res.data),
  delete: (id: string) => api.delete(`/categories/${id}`).then((res) => res.data),
};
