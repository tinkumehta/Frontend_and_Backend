import api from "./api";

export const paymentService = {
    createOrder : (orderData) => api.post('/paymets/create-order', orderData),
    verifyPayment: (paymentData) => api.post('/payments/test-payment-verify', paymentData),
    getUserOrders: () => api.get('/payments/orders'),
    getOrderById: (id) => api.get(`/payments/orders/{id}`),
    
}