import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signToken(payload: { userId: number; role: string }) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as any);
}

export function verifyToken(token: string) {
  return jwt.verify(token, env.jwtSecret) as {
    userId: number;
    role: string;
  };
}
