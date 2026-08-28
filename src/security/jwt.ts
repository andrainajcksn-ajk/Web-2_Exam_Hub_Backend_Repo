import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthenticatedUser } from '../models/userModel';

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '8h') as NonNullable<SignOptions['expiresIn']>;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET manquant dans le fichier .env');
}

export const signToken = (payload: AuthenticatedUser): string => {
  const options: SignOptions = { expiresIn: JWT_EXPIRES_IN };
  return jwt.sign(payload, JWT_SECRET, options);
}

export const verifyToken = (token: string): AuthenticatedUser => {
  return jwt.verify(token, JWT_SECRET) as AuthenticatedUser;
}