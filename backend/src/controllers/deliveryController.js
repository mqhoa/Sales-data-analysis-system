const deliveryService = require("../services/deliveryService");

module.exports = {
  getStats: async (req, res) => {
    try {
      const data = await deliveryService.getDeliveryStats();
      res.json(data);
    } catch (err) {
      console.error("❌ deliveryController error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
};