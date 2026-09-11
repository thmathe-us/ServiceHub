import api from './api';

export const updateApi = {
  trigger: () => api.post('/update').then(res => res.data),
};
