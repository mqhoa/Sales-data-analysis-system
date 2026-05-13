console.log("LOADING customerController");
const CustomerService = require("../services/customerService");

module.exports = {
  getTopCustomers: async (req, res) => {
    try {
      const data = await CustomerService.getTopCustomers();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};