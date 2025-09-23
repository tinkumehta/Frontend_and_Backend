import api from './api';

export const authService = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      console.log(response);
      
      return response;
    } catch (error) {
      console.error('Auth service login error:', error);
      throw error;
    }
  },
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};