// backend/src/controllers/authController.js
const jwt = require('jsonwebtoken');
const UserRepository = require("../repositories/userRepository");
const { JWT_SECRET, JWT_EXPIRE } = require("../config/constants");

module.exports = {
  /**
   * ✅ POST /api/auth/register
   * Đăng ký user mới
   */
  register: async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;

      // Validation
      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Username, email, và password là bắt buộc"
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password phải có ít nhất 6 ký tự"
        });
      }

      const user = await UserRepository.register(username, email, password, fullName);
      
      res.status(201).json({
        success: true,
        data: user,
        message: "Đăng ký thành công"
      });
    } catch (err) {
      console.error('❌ Register error:', err);
      res.status(400).json({
        success: false,
        message: err.message || "Lỗi đăng ký"
      });
    }
  },

  /**
   * ✅ POST /api/auth/login
   * Đăng nhập user
   */
  login: async (req, res) => {
    try {
      const { username, password } = req.body;

      // Validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: "Username và password là bắt buộc"
        });
      }

      const user = await UserRepository.getUserByUsername(username);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Username hoặc password không chính xác"
        });
      }

      const isPasswordValid = await UserRepository.verifyPassword(password, user.password_hash);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Username hoặc password không chính xác"
        });
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
      );

      res.json({
        success: true,
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            fullName: user.full_name,
            role: user.role
          }
        },
        message: "Đăng nhập thành công"
      });
    } catch (err) {
      console.error('❌ Login error:', err);
      res.status(500).json({
        success: false,
        message: "Lỗi đăng nhập"
      });
    }
  },

  /**
   * ✅ GET /api/auth/me
   * Lấy thông tin user hiện tại
   */
  getMe: async (req, res) => {
    try {
      const user = await UserRepository.getUserById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User không tìm thấy"
        });
      }

      res.json({
        success: true,
        data: user,
        message: "User info retrieved"
      });
    } catch (err) {
      console.error('❌ Get me error:', err);
      res.status(500).json({
        success: false,
        message: "Lỗi lấy thông tin user"
      });
    }
  }
};