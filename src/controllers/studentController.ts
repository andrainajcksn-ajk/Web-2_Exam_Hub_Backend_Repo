import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as studentService from '../services/studentService';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await studentService.listStudents());
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.createStudent(
    req.body.name,
    req.body.email,
    req.body.password
  );
  res.status(201).json(student);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.updateStudent(
    Number(req.params.id),
    req.body.name,
    req.body.email,
    req.body.is_active ?? true,
    req.body.password
  );
  res.json(student);
});

export const deactivate = asyncHandler(async (req: Request, res: Response) => {
  const student = await studentService.deactivateStudent(Number(req.params.id));
  res.json(student);
});