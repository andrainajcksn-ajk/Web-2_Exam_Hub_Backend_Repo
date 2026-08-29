import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as questionService from '../services/questionService';

export const update = asyncHandler(async (req: Request, res: Response) => {
  const q = await questionService.updateQuestion(Number(req.params.id), req.body);
  res.json(q);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await questionService.deleteQuestion(Number(req.params.id));
  res.json({ message: 'Question deleted' });
});