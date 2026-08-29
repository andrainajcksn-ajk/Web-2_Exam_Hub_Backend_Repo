import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as examService from '../services/examService';
import * as questionService from '../services/questionService';
import * as resultService from '../services/resultService';

export const list = asyncHandler(async (_req: Request, res: Response) => {
  res.json(await examService.listExams());
});

export const get = asyncHandler(async (req: Request, res: Response) => {
  res.json(await examService.getExam(Number(req.params.id)));
});

export const create = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.createExam(req.body);
  res.status(201).json(exam);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const exam = await examService.updateExam(Number(req.params.id), req.body);
  res.json(exam);
});

export const remove = asyncHandler(async (req: Request, res: Response) => {
  await examService.deleteExam(Number(req.params.id));
  res.json({ message: 'Exam deleted' });
});

export const questions = asyncHandler(async (req: Request, res: Response) => {
  res.json(await questionService.questionsForExam(Number(req.params.id)));
});

export const addQuestion = asyncHandler(async (req: Request, res: Response) => {
  const q = await questionService.addQuestion(Number(req.params.id), req.body);
  res.status(201).json(q);
});

export const results = asyncHandler(async (req: Request, res: Response) => {
  res.json(await resultService.examResults(Number(req.params.id)));
});