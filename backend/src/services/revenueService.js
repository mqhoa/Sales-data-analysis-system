const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getMonthlyRevenue: async () => {
    return await OrderRepository.getMonthlyRevenue();
  },
  getPaymentStats: async () => {
    return await OrderRepository.getPaymentStats();
  }
};