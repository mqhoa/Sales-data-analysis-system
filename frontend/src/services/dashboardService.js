import api from './api';

const dashboardService = {
  // Revenue endpoints
  getMonthlyRevenue: async () => {
    console.log('📡 dashboardService.getMonthlyRevenue called');
    const response = await api.get('/revenue/monthly');
    console.log('Response:', response);
    return response;
  },

  getRevenueInsights: () => api.get('/insights/revenue'),

  // Product endpoints
  getTopProducts: () => api.get('/product/top'),
  getProductInsights: () => api.get('/insights/products'),

  // Customer endpoints
  getTopCustomers: () => api.get('/customer/top'),
  getCustomerInsights: () => api.get('/insights/customers'),

  // Delivery endpoints
  getDeliveryStats: () => api.get('/delivery/stats'),
  getQualityInsights: () => api.get('/insights/quality'),

  // Geography endpoints
  getGeographyInsights: () => api.get('/insights/geography'),
  getStateData: () => api.get('/insights/states'),
};

export default dashboardService;