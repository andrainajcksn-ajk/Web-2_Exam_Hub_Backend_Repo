import { Request, Response } from 'express';
import * as authService from '../service/authService';

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    res.json(data);
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}
