import { Request, Response } from 'express';
import { AuthService } from '../service/AuthService';
import { asyncHandler } from '../middlewares/errorHandler';

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await AuthService.login(email, password);
  res.status(200).json(result);
});
