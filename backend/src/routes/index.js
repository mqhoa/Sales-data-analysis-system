// ✅ CLEAN - routes/index.js
const express = require("express");
const router = express.Router();

const revenueController = require("../controllers/revenueController");
const productController = require("../controllers/productController");
const customerController = require("../controllers/customerController");
const deliveryController = require("../controllers/deliveryController");

router.get("/revenue/monthly", revenueController.getMonthlyRevenue);
router.get("/product/top", productController.getTopProducts);
router.get("/customer/top", customerController.getTopCustomers);
router.get("/delivery/stats", deliveryController.getStats);

module.exports = router;