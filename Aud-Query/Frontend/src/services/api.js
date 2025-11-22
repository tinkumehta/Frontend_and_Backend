import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Query API calls
export const queryAPI = {
  // Get all queries with optional filters
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return api.get(`/queries?${params}`);
  },

  // Get single query
  getById: (id) => api.get(`/queries/${id}`),

  // Create new query
  create: (queryData) => api.post('/queries', queryData),

  // Update query
  update: (id, updateData) => api.put(`/queries/${id}`, updateData),

  // Get analytics
  getAnalytics: () => api.get('/queries/analytics/summary'),
};

// User API calls
export const userAPI = {
  getAll: () => api.get('/users'),
  create: (userData) => api.post('/users', userData),
};

export default api;