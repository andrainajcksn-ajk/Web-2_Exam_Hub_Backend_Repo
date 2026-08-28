import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwt';
import { UnauthorizedError, ForbiddenError } from '../errors/appError';
import { AuthenticatedUser, UserRole } from '../models/user';

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith('Bearer ')) {
    return next(new UnauthorizedError());
  }

  const token = header.slice('Bearer '.length);

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Token invalide ou expiré'));
  }
}

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return next(new UnauthorizedError());
    if (!roles.includes(req.user.role)) return next(new ForbiddenError());
    next();
  };
}
