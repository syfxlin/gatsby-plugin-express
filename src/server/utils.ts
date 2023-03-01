import { NextFunction, Request, RequestHandler, Response } from "express";

export const wrap = (
  fn: (request: Request, response: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
