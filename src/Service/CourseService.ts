import { CourseRepositorie } from '../repositories/CourseRepositorie';
import { Course } from '../models/Course';
import { BadRequestError, NotFoundError, ConflictError } from '../errors/AppError';

interface CourseInput {
  code: string;
  name: string;
  description?: string | null;
}

const validateCourseInput = (data: CourseInput): void => {
  if (!data.code || !data.code.trim()) {
    throw new BadRequestError('Le code du cours est requis');
  }
  if (!data.name || !data.name.trim()) {
    throw new BadRequestError('Le nom du cours est requis');
  }
};

export const CourseService = {
  listCourses: async (): Promise<Course[]> => {
    return CourseRepositorie.findAll();
  },

  getCourseById: async (id: number): Promise<Course> => {
    const course = await CourseRepositorie.findById(id);
    if (!course) {
      throw new NotFoundError('Cours introuvable');
    }
    return course;
  },

  createCourse: async (data: CourseInput): Promise<Course> => {
    validateCourseInput(data);

    const existing = await CourseRepositorie.findByCode(data.code.trim());
    if (existing) {
      throw new ConflictError('Ce code de cours est déjà utilisé');
    }

    return CourseRepositorie.create({
      code: data.code.trim(),
      name: data.name.trim(),
      description: data.description ?? null,
    });
  },

  updateCourse: async (id: number, data: CourseInput): Promise<Course> => {
    validateCourseInput(data);

    const course = await CourseRepositorie.findById(id);
    if (!course) {
      throw new NotFoundError('Cours introuvable');
    }

    const existing = await CourseRepositorie.findByCode(data.code.trim());
    if (existing && existing.id !== id) {
      throw new ConflictError('Ce code de cours est déjà utilisé');
    }

    const updated = await CourseRepositorie.update(id, {
      code: data.code.trim(),
      name: data.name.trim(),
      description: data.description ?? null,
    });

    return updated!;
  },

  deleteCourse: async (id: number): Promise<void> => {
    const course = await CourseRepositorie.findById(id);
    if (!course) {
      throw new NotFoundError('Cours introuvable');
    }

    const hasExams = await CourseRepositorie.hasExams(id);
    if (hasExams) {
      throw new ConflictError('Ce cours possède des examens et ne peut pas être supprimé');
    }

    await CourseRepositorie.delete(id);
  },
};