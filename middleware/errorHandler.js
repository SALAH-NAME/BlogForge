/* eslint-disable no-unused-vars */
// middleware/errorHandler.js
const logger = require('../utils/logger');

// Custom error class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production error handling
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        status: 'fail',
        message: Object.values(err.errors).map(e => e.message)
      });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Duplicate field value entered'
      });
    }

    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid token. Please log in again'
      });
    }

    res.status(err.statusCode).json({
      status: err.status,
      message: 'Something went wrong'
    });
  }
};

module.exports = {
  AppError,
  errorHandler
};
