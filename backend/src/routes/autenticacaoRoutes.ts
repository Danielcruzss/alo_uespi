import { Router } from "express";
import {
    cadastrarUsuario,
    loginUsuario
} from "../controllers/autenticacao";

export const autenticacaoRoutes = Router();

autenticacaoRoutes.post("/cadastro", cadastrarUsuario);
autenticacaoRoutes.post("/login", loginUsuario);