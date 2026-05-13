console.log("LOADING deliveryController");
const DeliveryService = require("../services/deliveryService");

module.exports = {
  getStats: async (req, res) => {
    try {
      const data = await DeliveryService.getStats();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};