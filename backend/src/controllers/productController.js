const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getTopProducts: async (req, res) => {
    try {
      const data = await OrderRepository.getTopProducts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};