const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getDeliveryStats: async () => {
    return await OrderRepository.getDeliveryStats();
  }
};