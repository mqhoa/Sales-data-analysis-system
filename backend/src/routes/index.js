// backend/src/routes/index.js
const express = require("express");
const router = express.Router();

// Middleware
const {authMiddleware} = require("../middleware/auth");
const authorize = require("../middleware/authorize");

// Controllers
const revenueController = require("../controllers/revenueController");
const productController = require("../controllers/productController");
const customerController = require("../controllers/customerController");
const deliveryController = require("../controllers/deliveryController");
const authController = require("../controllers/authController");
const insightController = require("../controllers/insightController");

// ============ AUTH ROUTES (Public) ============
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);


// ============ PROTECTED ROUTES (Require JWT) ============
router.get("/auth/me", authMiddleware, authController.getMe);
router.get("/auth/role", authMiddleware, authController.getRole);

// ============ ANALYTICS ROUTES (Require JWT) ============
router.get("/revenue/monthly", authMiddleware, revenueController.getMonthlyRevenue);
router.get("/product/top", authMiddleware, productController.getTopProducts);
router.get("/customer/top", authMiddleware, customerController.getTopCustomers);
router.get("/delivery/stats", authMiddleware, deliveryController.getStats);
router.get("/revenue/payment-stats", authMiddleware, revenueController.getPaymentStats);
// ============ INSIGHTS ROUTES (NEW - Require JWT) ============
router.get("/insights/revenue", authMiddleware, authorize("admin"), insightController.getRevenueInsights);
router.get("/insights/products", authMiddleware, authorize("admin"), insightController.getProductInsights);
router.get("/insights/customers", authMiddleware, authorize("admin"), insightController.getCustomerInsights);
router.get("/insights/quality", authMiddleware, authorize("admin"), insightController.getQualityInsights);
router.get("/insights/geography", authMiddleware, authorize("admin"), insightController.getGeographyInsights);
router.get("/insights/states", authMiddleware, authorize("admin"), insightController.getStateData);

// ============ HEALTH CHECK ============
router.get("/health", (req, res) => {
  res.json({ 
    success: true,
    message: "API is running",
    timestamp: new Date().toISOString()
  });
});

module.exports = router;