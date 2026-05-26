import { Router } from "express";
import {
  criarManifestacao,
  consultarPorProtocolo,
  listarManifestacoes,
  atualizarManifestacao,
  responderManifestacao,
} from "../controllers/manifestacaoController";
import {
  autenticarUsuario,
  autenticarUsuarioOpcional,
} from "../middleware/autenticador2";
import { adminOnly } from "../middleware/admin";

export const manifestacaoRoutes = Router();

manifestacaoRoutes.post("/", autenticarUsuarioOpcional, criarManifestacao);

manifestacaoRoutes.get("/", listarManifestacoes);
manifestacaoRoutes.get("/:protocolo", consultarPorProtocolo);

manifestacaoRoutes.patch(
  "/:id",
  autenticarUsuario,
  adminOnly,
  atualizarManifestacao
);

manifestacaoRoutes.put(
  "/:id/responder",
  autenticarUsuario,
  adminOnly,
  responderManifestacao
);
