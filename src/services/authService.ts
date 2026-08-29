import { AppError } from '../errors/appError';
import * as userRepo from '../repositories/userRepository';
import { comparePassword } from '../security/password';
import { signToken } from '../security/jwt';

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw new AppError(400, 'Email and password are required');
  }

  const user = await userRepo.findByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  if (!user.is_active) {
    throw new AppError(401, 'Account disabled');
  }

  const valid = await comparePassword(password, user.password_hash!);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const token = signToken({ userId: user.id, role: user.role });
  return {
    token,
    user: { id: user.id, name: user.name, role: user.role },
  };
};