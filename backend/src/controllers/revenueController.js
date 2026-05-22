const OrderRepository = require("../repositories/orderRepository");
exports.getMonthlyRevenue = async (req, res) => {
  try {
    const data = await OrderRepository.getMonthlyRevenue();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};