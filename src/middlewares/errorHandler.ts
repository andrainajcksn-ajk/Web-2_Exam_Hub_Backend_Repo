import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/appError';

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ message: 'Route not found' });
};

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(err);
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'Internal server error' });
};