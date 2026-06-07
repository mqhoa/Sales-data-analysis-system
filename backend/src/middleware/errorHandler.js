// backend/src/middleware/errorHandler.js

/**
 * ✅ Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Lỗi server';

  res.status(status).json({
    success: false,
    status: status,
    message: message,
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

module.exports = errorHandler;