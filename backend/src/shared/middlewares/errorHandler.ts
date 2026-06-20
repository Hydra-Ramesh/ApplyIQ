import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors/AppError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  // Default to 500 server error
  if (!statusCode) {
    statusCode = 500;
  }

  // If it's a known operational error, send the message, otherwise mask it in prod
  const responseMessage = err.isOperational || process.env.NODE_ENV !== 'production' 
    ? message 
    : 'Internal Server Error';

  console.error(`[Error] ${statusCode} - ${message}`);

  res.status(statusCode).json({
    status: 'error',
    message: responseMessage,
  });
};
