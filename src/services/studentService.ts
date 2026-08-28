import { AppError } from '../errors/appError';
import * as userRepo from '../repositories/userRepository';
import { hashPassword } from '../security/password';

export async function listStudents() {
  return userRepo.allStudents();
}

export async function createStudent(name: string, email: string, password: string) {
  if (!name || !email || !password) {
    throw new AppError(400, 'name, email and password are required');
  }

  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new AppError(409, 'Email already in use');
  }

  return userRepo.createStudent(name, email, await hashPassword(password));
}

export async function updateStudent(
  id: number,
  name: string,
  email: string,
  isActive: boolean,
  password?: string
) {
  if (!name || !email) {
    throw new AppError(400, 'name and email are required');
  }

  const student = await userRepo.findById(id);
  if (!student || student.role !== 'student') {
    throw new AppError(404, 'Student not found');
  }

  if (email !== student.email) {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      throw new AppError(409, 'Email already in use');
    }
  }

  const hash = password ? await hashPassword(password) : undefined;
  return userRepo.updateStudent(id, name, email, isActive, hash);
}

export async function deactivateStudent(id: number) {
  const student = await userRepo.findById(id);
  if (!student || student.role !== 'student') {
    throw new AppError(404, 'Student not found');
  }
  if (!student.is_active) {
    throw new AppError(400, 'Student is already disabled');
  }
  return userRepo.deactivate(id);
}
