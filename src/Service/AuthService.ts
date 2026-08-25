import { UserRepositorie } from '../Repositorie/UserRepositorie';
import { comparePassword } from '../Security/password';
import { signToken } from '../Security/jwt';
import { BadRequestError, UnauthorizedError, ForbiddenError } from '../errors/AppError';

interface LoginResult {
  token: string;
  user: { id: number; name: string; email: string; role: string };
}

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResult> {
    if (!email || !password) {
      throw new BadRequestError('Email et mot de passe requis');
    }

    const user = await UserRepositorie.findByEmail(email);

    if (!user || !(await comparePassword(password, user.password_hash))) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    if (!user.is_active) {
      throw new ForbiddenError('Ce compte a été désactivé');
    }

    const token = signToken({ id: user.id, role: user.role });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  },
};
