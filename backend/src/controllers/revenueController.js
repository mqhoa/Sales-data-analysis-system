console.log("LOADING revenueController");
const RevenueService = require("../services/revenueService");

module.exports = {
  getMonthlyRevenue: async (req, res) => {
    try {
      const data = await RevenueService.getMonthlyRevenue();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};