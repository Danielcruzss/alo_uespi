import { Router } from "express";
import {
  criarManifestacao,
  consultarPorProtocolo,
  listarManifestacoes,
  atualizarManifestacao,
} from "../controllers/manifestacaoController";

export const manifestacaoRoutes = Router();

manifestacaoRoutes.post("/", criarManifestacao);
manifestacaoRoutes.get("/", listarManifestacoes);
manifestacaoRoutes.get("/:protocolo", consultarPorProtocolo);
manifestacaoRoutes.patch("/:id", atualizarManifestacao);