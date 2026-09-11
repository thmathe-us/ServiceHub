import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  role: 'ADMIN' | 'OPERATOR' | 'READER';
  isActive: boolean;
  createdAt: string;
}

export interface UserCreateData {
  username: string;
  email: string;
  name: string;
  lastName: string;
  password: string;
  role: 'ADMIN' | 'OPERATOR' | 'READER';
  isActive: boolean;
}

export const usersApi = {
  getAll: () => api.get('/users').then((res) => res.data),
  getById: (id: string) => api.get(`/users/${id}`).then((res) => res.data),
  create: (userData: UserCreateData) => api.post('/users', userData).then((res) => res.data),
  update: (id: string, userData: Partial<User> & { password?: string }) => api.put(`/users/${id}`, userData).then((res) => res.data),
  delete: (id: string) => api.delete(`/users/${id}`).then((res) => res.data),
  toggleStatus: (id: string, isActive: boolean) => api.put(`/users/${id}/status`, { isActive }).then((res) => res.data),
};