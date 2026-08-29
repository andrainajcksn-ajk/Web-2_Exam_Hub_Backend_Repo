import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as courseService from '../services/courseService';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await courseService.listCourses());
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.createCourse(
    req.body.code,
    req.body.name,
    req.body.description
  );
  res.status(201).json(course);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourse(
    Number(req.params.id),
    req.body.code,
    req.body.name,
    req.body.description
  );
  res.json(course);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await courseService.deleteCourse(Number(req.params.id));
  res.json({ message: 'Course deleted' });
});