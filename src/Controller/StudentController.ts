import { Request, Response } from 'express';
import { StudentService } from '../Service/StudentService';
import { asyncHandler } from '../middlewares/errorHandler';
import { BadRequestError } from '../errors/AppError';

const parseId = (raw: string): number => {
  const id = Number(raw);
  if (!Number.isInteger(id)) {
    throw new BadRequestError('Identifiant invalide');
  }
  return id;
};

export const listStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = await StudentService.listStudents();
  res.status(200).json(students);
});

export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const student = await StudentService.createStudent(req.body);
  res.status(201).json(student);
});

export const updateStudent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const id = parseId(req.params.id);
  const student = await StudentService.updateStudent(id, req.body);
  res.status(200).json(student);
});

export const desactivateStudent = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  const id = parseId(req.params.id);
  await StudentService.desactivateStudent(id);
  res.status(204).send();
});
