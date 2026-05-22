const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getStats: async (req, res) => {
    try {
      const data = await OrderRepository.getDeliveryStats();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};