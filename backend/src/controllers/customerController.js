const customerService = require("../services/customerService");

module.exports = {
  getTopCustomers: async (req, res) => {
    try {
      const data = await customerService.getTopCustomers();
      res.json(data);
    } catch (err) {
      console.error("❌ customerController error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
};