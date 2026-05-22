const OrderRepository = require("../repositories/orderRepository");

module.exports = {
  getTopCustomers: async (req, res) => {
    try {
      const data = await OrderRepository.getTopCustomers();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};