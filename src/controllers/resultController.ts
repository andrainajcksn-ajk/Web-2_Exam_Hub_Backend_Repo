import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as resultService from '../services/resultService';

export const myResults = asyncHandler(async (req: Request, res: Response) => {
  res.json(await resultService.studentResults((req as any).user.userId));
});