import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  id: number;
  email: string;
  admin?: boolean;
};

export type AuthRequest = Request & {
  usuarioId?: number;
  admin?: boolean;
};

const JWT_SECRET = process.env.JWT_SECRET || "segredo_temporario_mvp";

export function autenticarUsuario(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      message: "Usuário não autenticado.",
    });
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    res.status(401).json({
      message: "Token não informado.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.usuarioId = decoded.id;
    req.admin = decoded.admin || false;

    next();
  } catch {
    res.status(401).json({
      message: "Token inválido ou expirado.",
    });
    return;
  }
}

export function autenticarUsuarioOpcional(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next();
    return;
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.usuarioId = decoded.id;
    req.admin = decoded.admin || false;
  } catch {
    // Se o token estiver inválido, segue sem usuário.
    // Isso permite manifestações anônimas.
  }

  next();
}