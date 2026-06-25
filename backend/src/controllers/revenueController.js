const revenueService = require("../services/revenueService");

exports.getMonthlyRevenue = async (req, res) => {
  try {
    const data = await revenueService.getMonthlyRevenue();
    res.json(data);
  } catch (err) {
    console.error("❌ revenueController error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

exports.getPaymentStats = async (req, res) => {
  try {
    const data = await revenueService.getPaymentStats();
    res.json(data);
  } catch (err) {
    console.error("❌ paymentStats error:", err.message);
    res.status(500).json({ error: err.message });
  }
};