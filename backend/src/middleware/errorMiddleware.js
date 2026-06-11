const errorMiddleware = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const env = process.env.NODE_ENV || 'development';
  
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: env === 'development' ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
