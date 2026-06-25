const productService = require("../services/productService");

module.exports = {
  getTopProducts: async (req, res) => {
    try {
      const data = await productService.getTopProducts();
      res.json(data);
    } catch (err) {
      console.error("❌ productController error:", err.message);
      res.status(500).json({ error: err.message });
    }
  }
};