import api from '../../context/api';

export const shopService = {
  // Create shop - FIXED URL
  createShop: async (shopData) => {
    const response = await api.post('/shop/create', shopData); // Changed from '/shops/create'
    return response.data;
  },

  // Get all shops - FIXED URL
  getAllShops: async (params = {}) => {
    const response = await api.get('/shop', { params }); // Changed from '/shops'
    return response.data;
  },

  // Get my shops - FIXED URL
  getMyShops: async () => {
    const response = await api.get('/shop/my/shops'); // Changed from '/shops/my/shops'
    return response.data;
  },

  // Get nearby shops - FIXED URL
  getNearbyShops: async (latitude, longitude, distance = 5000) => {
    const params = { latitude, longitude, distance };
    const response = await api.get('/shop/nearby', { params }); // Changed from '/shops/nearby'
    return response.data;
  },

  // Get shop by ID - FIXED URL
  getShopById: async (shopId) => {
    const response = await api.get(`/shop/${shopId}`); // Changed from '/shops/:id'
    return response.data;
  },

  // Update shop - FIXED URL
  updateShop: async (shopId, shopData) => {
    const response = await api.put(`/shop/update/${shopId}`, shopData); // Changed from '/shops/update/:id'
    return response.data;
  },

  // Toggle shop status - FIXED URL
  toggleShopStatus: async (shopId) => {
    const response = await api.patch(`/shop/${shopId}/toggle`); // Changed from '/shops/:id/toggle'
    return response.data;
  },

  // Add service to shop - ADD NEW METHOD
  addService: async (shopId, serviceData) => {
    const response = await api.post(`/shop/${shopId}/services`, serviceData);
    return response.data;
  },

  // Remove service from shop - ADD NEW METHOD
  removeService: async (shopId, serviceId) => {
    const response = await api.delete(`/shop/${shopId}/services/${serviceId}`);
    return response.data;
  }
};