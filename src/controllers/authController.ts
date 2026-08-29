import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import * as authService from '../services/authService';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const data = await authService.login(email, password);
  res.json(data);
});