import { NextFunction, Request, Response } from 'express';
import { query } from '../config/db';

// Vérifie le rôle et que le compte est actif
export function requireRole(role: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const { rows } = await query('SELECT role, is_active FROM users WHERE id = $1', [
      user.userId,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const dbUser = rows[0];
    if (!dbUser.is_active) {
      return res.status(403).json({ message: 'Account disabled' });
    }

    if (dbUser.role !== role) {
      return res
        .status(403)
        .json({ message: role === 'admin' ? 'Admin access required' : 'Student access required' });
    }

    (req as any).user.role = dbUser.role;
    next();
  };
}
