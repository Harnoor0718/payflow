import axios from 'axios';

const API_BASE_URL = 'https://payflow-backend-l0g9.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Payment APIs
export const paymentAPI = {
  // Create new payment request
  createPayment: async (data) => {
    const response = await api.post('/payments/create', data);
    return response.data;
  },

  // Get all payments
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get single payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Update payment status
  updatePaymentStatus: async (id, status) => {
    const response = await api.post(`/payments/${id}/update-status`, { status });
    return response.data;
  },

  // Simulate payment
  simulatePayment: async (id) => {
    const response = await api.post(`/payments/${id}/simulate-payment`);
    return response.data;
  },

  // Get payments by status
  getPaymentsByStatus: async (status) => {
    const response = await api.get(`/payments/status/${status}`);
    return response.data;
  },

  // Get statistics
  getStatistics: async () => {
    const response = await api.get('/payments/stats/summary');
    return response.data;
  },
};

export default api;