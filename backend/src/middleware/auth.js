// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config/constants");

/**
 * ✅ Middleware xác thực JWT token
 */
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: "Token không tìm thấy"
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Auth middleware error:', err.message);
    res.status(401).json({
      success: false,
      message: "Token không hợp lệ"
    });
  }
};

/**
 * ✅ Middleware kiểm tra role admin
 */
const adminMiddleware = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Chỉ admin mới có quyền truy cập"
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };