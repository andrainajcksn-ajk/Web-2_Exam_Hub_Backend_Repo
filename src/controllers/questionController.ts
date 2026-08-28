import { Request, Response } from 'express';
import * as questionService from '../services/questionService';

export async function update(req: Request, res: Response) {
  try {
    const q = await questionService.updateQuestion(Number(req.params.id), req.body);
    res.json(q);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    await questionService.deleteQuestion(Number(req.params.id));
    res.json({ message: 'Question deleted' });
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}
