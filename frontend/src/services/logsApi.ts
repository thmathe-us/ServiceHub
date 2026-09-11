import api from './api';

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  entity: string;
  entityId: string;
  createdAt: string;
}

export const logsApi = {
  getAll: (params?: { search?: string; action?: string }) => api.get('/logs', { params }).then((res) => res.data),
};