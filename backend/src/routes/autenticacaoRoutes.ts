import { Router } from "express";
import {
    cadastrarUsuario,
    loginUsuario
} from "../controllers/autenticacao";

export const autenticacaoRouter = Router();

autenticacaoRouter.post("/cadastrar", cadastrarUsuario);
autenticacaoRouter.post("/login", loginUsuario);