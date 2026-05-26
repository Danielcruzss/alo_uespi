import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../lib/prisma";

const cadastroSchema = z.object({
  nome: z.string().min(3, "O nome precisa ter pelo menos 3 caracteres."),
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z.string().email("Informe um e-mail válido."),
  senha: z.string().min(1, "Informe a senha."),
});

const JWT_SECRET = process.env.JWT_SECRET || "segredo_temporario_mvp";

export async function cadastrarUsuario(req: Request, res: Response): Promise<void> {
  try {
    const dados = cadastroSchema.parse(req.body);

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });

    if (usuarioExistente) {
      res.status(409).json({
        message: "Já existe um usuário cadastrado com este e-mail.",
      });
      return;
    }

    const senhaHash = await bcrypt.hash(dados.senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso.",
      usuario,
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Erro ao cadastrar usuário.",
      error,
    });
    return;
  }
}

export async function loginUsuario(req: Request, res: Response): Promise<void> {
  try {
    const dados = loginSchema.parse(req.body);

    const usuario = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });

    if (!usuario) {
      res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
      return;
    }

    const senhaCorreta = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaCorreta) {
      res.status(401).json({
        message: "E-mail ou senha inválidos.",
      });
      return;
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        email: usuario.email,
        admin: usuario.admin
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
    return;
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "Erro ao realizar login.",
      error,
    });
    return;
  }
}