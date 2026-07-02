const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const errorMiddleware = require('./middleware/errorMiddleware');
const notFoundMiddleware = require('./middleware/notFoundMiddleware');

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Clean trailing slash
    const originClean = origin ? origin.replace(/\/$/, '') : '';
    const envFrontendUrl = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : '';
    
    // Allow any localhost, any Render subdomain, the exact FRONTEND_URL, or the known custom domain
    if (!originClean || 
        /^http:\/\/localhost:\d+$/.test(originClean) || 
        /\.onrender\.com$/.test(originClean) || 
        originClean === envFrontendUrl ||
        originClean === 'https://cahcet.shafwan.in') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(cookieParser());
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

const contactRoutes = require('./routes/contactRoutes');
const userRoutes = require('./routes/userRoutes');

// Routes will be mounted here
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/applicant', applicantRoutes);
app.use('/api/v1/test', testRoutes);
app.use('/api/v1/cms', cmsRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/users', userRoutes);

// Handle 404
app.use(notFoundMiddleware);

// Centralized error handler
app.use(errorMiddleware);

module.exports = app;
