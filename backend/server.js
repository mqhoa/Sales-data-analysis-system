require('dotenv').config();
const app = require('./src/app');
const UserRepository = require('./src/repositories/userRepository');

const PORT = process.env.PORT || 8000;

/**
 * ✅ Initialize server with database setup
 */
async function startServer() {
  try {
    console.log('\n🚀 Starting Sales Analytics Backend...\n');
    
    // Create users table nếu chưa có
    await UserRepository.createUsersTable();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`✅ Server running successfully!`);
      console.log(`${'='.repeat(60)}`);
      console.log(`🌐 Backend URL: http://localhost:${PORT}`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: GET http://localhost:${PORT}/api/health`);
      console.log(`${'='.repeat(60)}\n`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();