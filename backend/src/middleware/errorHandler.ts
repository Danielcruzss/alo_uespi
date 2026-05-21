import { Request, Response, NextFunction } from 'express';

export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error(error);
  return res.status(500).json({ message: 'Erro interno no servidor.' });
}
