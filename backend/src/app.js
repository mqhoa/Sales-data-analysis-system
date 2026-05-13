console.log("APP STARTING...");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();

// ✅ Fix CORS - Allow frontend
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use("/api", routes);  // ✅ QUAN TRỌNG: Thêm /api prefix

app.get("/", (req, res) => {
  res.send("Ecommerce API running");
});

module.exports = app;