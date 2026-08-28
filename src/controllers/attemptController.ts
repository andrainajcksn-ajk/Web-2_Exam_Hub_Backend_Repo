import { Request, Response } from 'express';
import * as attemptService from '../services/attemptService';

export async function myExams(req: Request, res: Response) {
  try {
    res.json(await attemptService.availableExams((req as any).user.userId));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function myExamDetail(req: Request, res: Response) {
  try {
    res.json(await attemptService.getExamDetail((req as any).user.userId, Number(req.params.id)));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function submit(req: Request, res: Response) {
  try {
    const result = await attemptService.submitExam(
      (req as any).user.userId,
      Number(req.params.id),
      req.body.answers
    );
    res.status(201).json(result);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}
