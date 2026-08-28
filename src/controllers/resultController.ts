import { Request, Response } from 'express';
import * as resultService from '../services/resultService';

export async function myResults(req: Request, res: Response) {
  try {
    res.json(await resultService.studentResults((req as any).user.userId));
  } catch (err: any) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Internal error' });
  }
}
