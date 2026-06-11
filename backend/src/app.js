const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running successfully',
    timestamp: new Date().toISOString(),
  });
});

const authRoutes = require('./routes/authRoutes');
const applicantRoutes = require('./routes/applicantRoutes');
const testRoutes = require('./routes/testRoutes');
const cmsRoutes = require('./routes/cmsRoutes');

// Routes will be mounted here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applicant', applicantRoutes);
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/cms', cmsRoutes);

// Serve Frontend in Production
if (process.env.NODE_ENV === 'production') {
  const path = require('path');
  const distPath = path.resolve(__dirname, '../../dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Handle 404
  app.use(notFoundMiddleware);
}

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
