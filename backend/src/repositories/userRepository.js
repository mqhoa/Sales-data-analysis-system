// backend/src/repositories/userRepository.js
const pool = require("../config/db");
const bcrypt = require("bcrypt");

class UserRepository {
  /**
   * ✅ Tạo bảng users nếu chưa có
   */
  static async createUsersTable() {
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) UNIQUE NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255),
          role VARCHAR(50) DEFAULT 'user',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      await pool.query(query);
      console.log('✅ Users table ensured');
    } catch (error) {
      console.error("❌ Error creating users table:", error);
    }
  }

  /**
   * ✅ Đăng ký user mới
   */
  static async register(username, email, password, fullName) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (username, email, password_hash, full_name)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, full_name, role
      `;
      
      const result = await pool.query(query, [username, email, hashedPassword, fullName]);
      return result.rows[0];
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new Error('Username hoặc email đã tồn tại');
      }
      throw error;
    }
  }

  /**
   * ✅ Lấy user theo username
   */
  static async getUserByUsername(username) {
    try {
      const query = `
        SELECT id, username, email, password_hash, full_name, role, is_active
        FROM users
        WHERE username = $1
      `;
      const result = await pool.query(query, [username]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by username:", error);
      throw error;
    }
  }

  /**
   * ✅ Lấy user theo ID
   */
  static async getUserById(id) {
    try {
      const query = `
        SELECT id, username, email, full_name, role, is_active, created_at
        FROM users
        WHERE id = $1
      `;
      const result = await pool.query(query, [id]);
      return result.rows[0] || null;
    } catch (error) {
      console.error("❌ Error getting user by id:", error);
      throw error;
    }
  }

  /**
   * ✅ Verify password
   */
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error("❌ Error verifying password:", error);
      throw error;
    }
  }
}

module.exports = UserRepository;