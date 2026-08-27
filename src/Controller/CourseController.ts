import { Request, Response } from 'express';
import { CourseService } from '../Service/CourseService';
import { asyncHandler } from '../middlewares/errorHandler';

export const listCourses = asyncHandler(async (req: Request, res: Response) => {
  const courses = await CourseService.listCourses();
  res.status(200).json(courses);
});

export const createCourse = asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseService.createCourse(req.body);
  res.status(201).json(course);
});

export const updateCourse = asyncHandler(async (req: Request<{ id: number }>, res: Response) => {
  const course = await CourseService.updateCourse(req.params.id, req.body);
  res.status(200).json(course);
});

export const deleteCourse = asyncHandler(async (req: Request<{ id: number }>, res: Response) => {
  const course = await CourseService.deleteCourse(req.params.id);
  res.status(200).json(course);
});