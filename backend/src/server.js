const app = require('./app');
const config = require('./config/app');
const prisma = require('./config/database');

const startServer = async () => {
  try {
    // Attempt to connect to the database
    await prisma.$connect();
    console.log(`✅ [Prisma] Successfully initialized and connected to the database.`);
  } catch (error) {
    console.error('❌ [Prisma] Failed to connect to database:', error);
    console.warn('⚠️  Continuing without database connection for now.');
  }

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 Server starting up...`);
    console.log(`   - Environment: ${config.env}`);
    console.log(`   - Port: ${PORT}`);
    console.log(`   - Status: Ready to accept connections`);
  });
};

startServer();
