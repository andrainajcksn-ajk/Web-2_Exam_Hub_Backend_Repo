import { Request, Response } from 'express';
import * as resultService from '../Service/resultService';

export async function myResults(req: Request, res: Response) {
  try {
    res.json(await resultService.studentResults((req as any).user.userId));
  } catch (err: any) {
    res.status(err.status || 500).json({ message: err.message || 'Internal error' });
  }
}
