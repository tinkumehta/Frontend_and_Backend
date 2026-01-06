import api from '../../context/api';

export const shopService = {
  // Create shop
  createShop: async (shopData) => {
    const response = await api.post('/shops/create', shopData);
    return response.data;
  },

  // Get all shops
  getAllShops: async (params = {}) => {
    const response = await api.get('/shops', { params });
    return response.data;
  },

  // Get my shops
  getMyShops: async () => {
    const response = await api.get('/shops/my/shops');
    return response.data;
  },

  // Get nearby shops
  getNearbyShops: async (latitude, longitude, distance = 5000) => {
    const params = { latitude, longitude, distance };
    const response = await api.get('/shops/nearby', { params });
    return response.data;
  },

  // Get shop by ID
  getShopById: async (shopId) => {
    const response = await api.get(`/shops/${shopId}`);
    return response.data;
  },

  // Update shop
  updateShop: async (shopId, shopData) => {
    const response = await api.put(`/shops/update/${shopId}`, shopData);
    return response.data;
  },

  // Toggle shop status
  toggleShopStatus: async (shopId) => {
    const response = await api.patch(`/shops/${shopId}/toggle-status`);
    return response.data;
  },

  // Delete shop
  deleteShop: async (shopId) => {
    const response = await api.delete(`/shops/delete/${shopId}`);
    return response.data;
  },

  // Add service to shop
  addService: async (shopId, serviceData) => {
    const response = await api.post(`/shops/${shopId}/services`, serviceData);
    return response.data;
  },

  // Remove service from shop
  removeService: async (shopId, serviceId) => {
    const response = await api.delete(`/shops/${shopId}/services/${serviceId}`);
    return response.data;
  }
};