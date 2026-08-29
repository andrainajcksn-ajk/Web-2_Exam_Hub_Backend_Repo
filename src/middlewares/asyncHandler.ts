import { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) => RequestHandler;

export const asyncHandler: AsyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};