console.log("LOADING productController");
const ProductService = require("../services/productService");

module.exports = {
  getTopProducts: async (req, res) => {
    try {
      const data = await ProductService.getTopProducts();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};