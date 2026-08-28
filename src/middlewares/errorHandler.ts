import { NextFunction, Request, Response } from 'express';

export const notFound = (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({ message: 'Ressource introuvable' });
};