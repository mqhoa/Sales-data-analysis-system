// backend/src/controllers/insightController.js
const InsightRepository = require("../repositories/insightRepository");

module.exports = {
  /**
   * ✅ GET /api/insights/revenue
   */
  getRevenueInsights: async (req, res) => {
    try {
      const data = await InsightRepository.getRevenueInsights();
      res.json({
        success: true,
        data: data,
        message: "Revenue insights retrieved"
      });
    } catch (err) {
      console.error('❌ Revenue insights error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * ✅ GET /api/insights/products
   */
  getProductInsights: async (req, res) => {
    try {
      const data = await InsightRepository.getProductInsights();
      res.json({
        success: true,
        data: data,
        message: "Product insights retrieved"
      });
    } catch (err) {
      console.error('❌ Product insights error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * ✅ GET /api/insights/customers
   */
  getCustomerInsights: async (req, res) => {
    try {
      const data = await InsightRepository.getCustomerInsights();
      res.json({
        success: true,
        data: data,
        message: "Customer insights retrieved"
      });
    } catch (err) {
      console.error('❌ Customer insights error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * ✅ GET /api/insights/quality
   */
  getQualityInsights: async (req, res) => {
    try {
      const data = await InsightRepository.getQualityInsights();
      res.json({
        success: true,
        data: data,
        message: "Quality insights retrieved"
      });
    } catch (err) {
      console.error('❌ Quality insights error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * ✅ GET /api/insights/geography
   */
  getGeographyInsights: async (req, res) => {
    try {
      const data = await InsightRepository.getGeographyInsights();
      res.json({
        success: true,
        data: data,
        message: "Geography insights retrieved"
      });
    } catch (err) {
      console.error('❌ Geography insights error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },

  /**
   * ✅ GET /api/insights/states - Dữ liệu chi tiết theo state
   */
  getStateData: async (req, res) => {
    try {
      const data = await InsightRepository.getStateData();
      res.json({
        success: true,
        data: data,
        message: "State data retrieved"
      });
    } catch (err) {
      console.error('❌ State data error:', err);
      res.status(500).json({
        success: false,
        message: err.message
      });
    }
  }
};