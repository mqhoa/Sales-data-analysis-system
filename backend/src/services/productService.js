const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getTopProducts: async () => {
    return await OrderRepository.getTopProducts();
  }
};