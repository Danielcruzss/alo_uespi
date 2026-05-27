import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "./autenticador2";

export function adminOnly(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.admin) {
    res.status(403).json({
      message: "Acesso permitido apenas para administradores.",
    });
    return;
  }

  next();
}