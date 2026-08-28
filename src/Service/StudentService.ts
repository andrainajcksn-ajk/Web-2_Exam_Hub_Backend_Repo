import { UserRepositorie } from '../repositories/UserRepositorie';
import { hashPassword } from '../security/password';
import { BadRequestError, NotFoundError, ConflictError } from '../errors/AppError';

interface StudentOutput {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
}

interface StudentInput {
  name: string;
  email: string;
  password?: string;
}

const toOutput = (user: {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: Date;
}): StudentOutput => ({
  id: user.id,
  name: user.name,
  email: user.email,
  is_active: user.is_active,
  created_at: user.created_at,
});

const validateStudentInput = (data: StudentInput, requirePassword: boolean): void => {
  if (!data.name || !data.name.trim()) {
    throw new BadRequestError('Le nom est requis');
  }
  if (!data.email || !data.email.trim()) {
    throw new BadRequestError("L'email est requis");
  }
  if (requirePassword && (!data.password || data.password.length < 8)) {
    throw new BadRequestError('Le mot de passe doit contenir au moins 8 caractères');
  }
};

export const StudentService = {
  listStudents: async (): Promise<StudentOutput[]> => {
    return UserRepositorie.findAllStudents();
  },

  createStudent: async (data: StudentInput): Promise<StudentOutput> => {
    validateStudentInput(data, true);

    const existing = await UserRepositorie.findByEmail(data.email.trim());
    if (existing) {
      throw new ConflictError('Cet email est déjà utilisé');
    }

    const password_hash = await hashPassword(data.password!);

    const student = await UserRepositorie.create({
      name: data.name.trim(),
      email: data.email.trim(),
      password_hash,
    });

    return toOutput(student);
  },

  updateStudent: async (id: number, data: StudentInput): Promise<StudentOutput> => {
    validateStudentInput(data, false);

    // Réinitialisation de mot de passe : optionnelle, via le même PUT
    // (le sujet n'impose pas de route dédiée). Si absent, on ne touche à rien.
    if (data.password !== undefined && data.password.length < 8) {
      throw new BadRequestError('Le mot de passe doit contenir au moins 8 caractères');
    }

    const existing = await UserRepositorie.findByEmail(data.email.trim());
    if (existing && existing.id !== id) {
      throw new ConflictError('Cet email est déjà utilisé');
    }

    const password_hash = data.password ? await hashPassword(data.password) : null;

    const updated = await UserRepositorie.update(id, {
      name: data.name.trim(),
      email: data.email.trim(),
      password_hash,
    });

    if (!updated) {
      throw new NotFoundError('Étudiant introuvable');
    }

    return toOutput(updated);
  },

  desactivateStudent: async (id: number): Promise<StudentOutput> => {
    const student = await UserRepositorie.desactivate(id);
    if (!student) {
      throw new NotFoundError('Student not found');
    }
    return toOutput(student)
  },
};
