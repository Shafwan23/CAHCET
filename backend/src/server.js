const app = require('./app');
const config = require('./config/app');
const prisma = require('./config/database');

const startServer = async () => {
  try {
    // Attempt to connect to the database (optional for this stage but good practice)
    await prisma.$connect();
    console.log('Successfully connected to the database.');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    console.warn('Continuing without database connection for now.');
  }

  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`Server is running in ${config.env} mode on port ${PORT}`);
  });
};

startServer();
