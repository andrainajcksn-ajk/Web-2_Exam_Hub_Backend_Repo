import { Request, Response } from 'express';
import * as studentService from '../services/studentService';

export async function list(req: Request, res: Response) {
  try {
    res.json(await studentService.listStudents());
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const student = await studentService.createStudent(
      req.body.name,
      req.body.email,
      req.body.password
    );
    res.status(201).json(student);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const student = await studentService.updateStudent(
      Number(req.params.id),
      req.body.name,
      req.body.email,
      req.body.is_active ?? true,
      req.body.password
    );
    res.json(student);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function deactivate(req: Request, res: Response) {
  try {
    const student = await studentService.deactivateStudent(Number(req.params.id));
    res.json(student);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}
