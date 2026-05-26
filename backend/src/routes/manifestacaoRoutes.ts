import { Router } from "express";
import {
  criarManifestacao,
  consultarPorProtocolo,
  listarManifestacoes,
  atualizarManifestacao,
} from "../controllers/manifestacaoController";
import { autenticarUsuario } from "../middleware/autenticador2";

export const manifestacaoRoutes = Router();

manifestacaoRoutes.post("/", autenticarUsuario, criarManifestacao);
manifestacaoRoutes.get("/", listarManifestacoes);
manifestacaoRoutes.get("/:protocolo", consultarPorProtocolo);
manifestacaoRoutes.patch("/:id", atualizarManifestacao);