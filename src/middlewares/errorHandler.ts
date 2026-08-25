import { Request, Response, NextFunction, RequestHandler } from 'express';
import { AppError } from '../errors/AppError';

export const asyncHandler = (fn: RequestHandler): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.method} ${req.originalUrl} introuvable` });
}

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  if (typeof err === 'object' && err !== null && (err as { code?: string }).code === '23505') {
    return res.status(409).json({ message: 'Conflit : cette ressource existe déjà' });
  }
  console.error(err);
  return res.status(500).json({ message: 'Erreur interne du serveur' });
}
