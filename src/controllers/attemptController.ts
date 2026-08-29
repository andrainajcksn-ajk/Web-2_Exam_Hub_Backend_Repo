import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as attemptService from '../services/attemptService';

export const myExams = asyncHandler(async (req: Request, res: Response) => {
  res.json(await attemptService.availableExams((req as any).user.userId));
});

export const myExamDetail = asyncHandler(async (req: Request, res: Response) => {
  res.json(await attemptService.getExamDetail((req as any).user.userId, Number(req.params.id)));
});

export const submit = asyncHandler(async (req: Request, res: Response) => {
  const result = await attemptService.submitExam(
    (req as any).user.userId,
    Number(req.params.id),
    req.body.answers
  );
  res.status(201).json(result);
});