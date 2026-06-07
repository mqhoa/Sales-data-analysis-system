// backend/scripts/seedUsers.js
require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function seedUsers() {
  try {
    console.log('🔧 Creating users table...');
    
    // Create users table
    await pool.query(`
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
    `);

    console.log('✅ Users table created/verified');

    // Hash password
    const hashedPassword = await bcrypt.hash('demo123', 10);

    // Insert demo user
    const result = await pool.query(`
      INSERT INTO users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) DO UPDATE SET
        password_hash = $3,
        full_name = $4
      RETURNING id, username, email, full_name, role
    `, ['demo', 'demo@example.com', hashedPassword, 'Demo User', 'user']);

    console.log('✅ Demo user created/updated:');
    console.log('   Username: demo');
    console.log('   Password: demo123');
    console.log('   Email: demo@example.com');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedUsers();