import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
import logger from '../utils/logger.js';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) => {
  logger.error('Request error:', {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip
  });

  // Multer errors
  if (error.message.includes('File too large')) {
    return res.status(400).json({
      success: false,
      error: 'File size exceeds the maximum limit of 5MB'
    });
  }

  if (error.message.includes('not allowed')) {
    return res.status(400).json({
      success: false,
      error: error.message
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
};