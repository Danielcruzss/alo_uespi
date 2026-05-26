import { Router } from "express";
import {
  criarManifestacao,
  consultarPorProtocolo,
  listarManifestacoes,
  atualizarManifestacao,
} from "../controllers/manifestacaoController";
import { autenticarUsuario } from "../middleware/autenticador2";
import { adminOnly } from "../middleware/admin";
import { responderManifestacao } from "../controllers/manifestacaoController";

export const manifestacaoRoutes = Router();

manifestacaoRoutes.post("/", autenticarUsuario, criarManifestacao);
manifestacaoRoutes.get("/", listarManifestacoes);
manifestacaoRoutes.get("/:protocolo", consultarPorProtocolo);
manifestacaoRoutes.patch("/:id", atualizarManifestacao);

router.put(
  "/manifestacoes/:id/responder",
  autenticador,
  adminOnly,
  responderManifestacao
);
router.put(
  "/manifestacoes/:id/responder",
  autenticador,
  adminOnly,
  responderManifestacao
);