const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getTopCustomers: async () => {
    return await OrderRepository.getTopCustomers();
  }
};