import { AppError } from '../appError';
import * as courseRepo from '../repositories/courseRepository';

export async function listCourses() {
  return courseRepo.allCourses();
}

export async function createCourse(code: string, name: string, description?: string) {
  if (!code || !name) {
    throw new AppError(400, 'code and name are required');
  }
  const existing = await courseRepo.findByCode(code);
  if (existing) {
    throw new AppError(409, 'Course code already in use');
  }
  return courseRepo.createCourse(code, name, description || null);
}

export async function updateCourse(id: number, code: string, name: string, description?: string) {
  if (!code || !name) {
    throw new AppError(400, 'code and name are required');
  }
  const course = await courseRepo.findById(id);
  if (!course) {
    throw new AppError(404, 'Course not found');
  }
  if (code.toLowerCase() !== course.code.toLowerCase()) {
    const existing = await courseRepo.findByCode(code);
    if (existing) {
      throw new AppError(409, 'Course code already in use');
    }
  }
  return courseRepo.updateCourse(id, code, name, description || null);
}

export async function deleteCourse(id: number) {
  const course = await courseRepo.findById(id);
  if (!course) {
    throw new AppError(404, 'Course not found');
  }
  const count = await courseRepo.countExams(id);
  if (count > 0) {
    throw new AppError(409, 'Cannot delete a course that has exams');
  }
  return courseRepo.deleteCourse(id);
}
