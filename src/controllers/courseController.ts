import { Request, Response } from 'express';
import * as courseService from '../service/courseService';

export async function list(req: Request, res: Response) {
  try {
    res.json(await courseService.listCourses());
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const course = await courseService.createCourse(
      req.body.code,
      req.body.name,
      req.body.description
    );
    res.status(201).json(course);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const course = await courseService.updateCourse(
      Number(req.params.id),
      req.body.code,
      req.body.name,
      req.body.description
    );
    res.json(course);
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await courseService.deleteCourse(Number(req.params.id));
    res.json({ message: 'Course deleted' });
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}
