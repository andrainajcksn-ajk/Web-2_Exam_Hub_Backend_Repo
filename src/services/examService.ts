import { AppError } from '../errors/appError';
import * as examRepo from '../repositories/examRepository';
import * as courseRepo from '../repositories/courseRepository';

export const listExams = async () => {
  return examRepo.allExams();
};

export const getExam = async (id: number) => {
  const exam = await examRepo.findById(id);
  if (!exam) throw new AppError(404, 'Exam not found');
  return exam;
};

export const createExam = async (input: {
  course_id: number;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
}) => {
  if (!input.course_id || !input.title || !input.starts_at || !input.ends_at) {
    throw new AppError(400, 'course_id, title, starts_at and ends_at are required');
  }
  const course = await courseRepo.findById(input.course_id);
  if (!course) throw new AppError(400, 'Course not found');

  const start = new Date(input.starts_at);
  const end = new Date(input.ends_at);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError(400, 'Invalid dates');
  }
  if (end <= start) {
    throw new AppError(400, 'End date must be after start date');
  }

  return examRepo.createExam({
    course_id: input.course_id,
    title: input.title,
    description: input.description || null,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
  });
};

export const updateExam = async (id: number, input: {
  course_id: number;
  title: string;
  description?: string;
  starts_at: string;
  ends_at: string;
}) => {
  const exam = await examRepo.findById(id);
  if (!exam) throw new AppError(404, 'Exam not found');

  if (!input.course_id || !input.title || !input.starts_at || !input.ends_at) {
    throw new AppError(400, 'course_id, title, starts_at and ends_at are required');
  }
  const course = await courseRepo.findById(input.course_id);
  if (!course) throw new AppError(400, 'Course not found');

  const start = new Date(input.starts_at);
  const end = new Date(input.ends_at);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new AppError(400, 'Invalid dates');
  }
  if (end <= start) {
    throw new AppError(400, 'End date must be after start date');
  }

  return examRepo.updateExam(id, {
    course_id: input.course_id,
    title: input.title,
    description: input.description || null,
    starts_at: input.starts_at,
    ends_at: input.ends_at,
  });
};

export const deleteExam = async (id: number) => {
  const exam = await examRepo.findById(id);
  if (!exam) throw new AppError(404, 'Exam not found');

  const attempts = await examRepo.countAttempts(id);
  if (attempts > 0) {
    throw new AppError(409, 'Cannot delete an exam that has attempts');
  }
  await examRepo.deleteExam(id);
  return true;
};