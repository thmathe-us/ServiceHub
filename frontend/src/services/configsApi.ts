import api from './api';

export interface SystemConfig {
  id: string;
  key: string;
  value: { type?: string; value?: string } | string;
  description?: string;
}

export const configsApi = {
  getAll: () => api.get<SystemConfig[]>('/configs').then((response) => response.data),
  update: (key: string, value: string, description?: string) =>
    api.put<SystemConfig>('/configs/update', { key, value: { type: 'string', value }, description })
      .then((response) => response.data),
};