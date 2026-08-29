import jwt, { SignOptions } from 'jsonwebtoken';
import { AuthenticatedUser } from '../models/userModel';
import { env } from '../config/env';

export const signToken = (payload: AuthenticatedUser): string => {
  const options: SignOptions = {
    expiresIn: env.jwtExpiresIn as NonNullable<SignOptions['expiresIn']>,
  };
  return jwt.sign(payload, env.jwtSecret, options);
};

export const verifyToken = (token: string): AuthenticatedUser => {
  return jwt.verify(token, env.jwtSecret) as AuthenticatedUser;
};