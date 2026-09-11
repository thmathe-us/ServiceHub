import api from './api';

export const authApi = {
  login: async (username: string, password: string) => {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },

  logout: async (refreshToken: string) => {
    const response = await api.post('/auth/logout', {}, {
      headers: {
        'x-refresh-token': refreshToken,
      },
    });
    return response.data;
  },

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  checkFirstLogin: async () => {
    const response = await api.get('/auth/check-first-login');
    return response.data;
  },
};