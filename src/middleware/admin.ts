import { Request, Response, NextFunction } from "express";

export function adminOnly(req: any, res: Response, next: NextFunction) {

  if (!req.admin) {
    return res.status(403).json({
      erro: "Apenas administradores"
    });
  }

  next();
}