const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const { CORS_ORIGINS } = require("./config/constants");

const app = express();

// ============ CORS Configuration ============
const corsOptions = {
  origin: CORS_ORIGINS,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400
};

// ✅ Apply CORS to all routes
app.use(cors(corsOptions));

// ✅ Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// ============ MIDDLEWARE ============
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`📍 [${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ============ ROUTES ============
app.use("/api", routes);

// ============ HEALTH CHECK ============
app.get("/", (req, res) => {
  res.json({ 
    message: "🚀 Sales Analytics API running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      analytics: "/api/revenue, /api/product, /api/customer, /api/delivery",
      health: "/api/health"
    }
  });
});

// ============ 404 HANDLER ============
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.path} not found`
  });
});

// ============ ERROR HANDLER ============
app.use(errorHandler);

module.exports = app;