import { Router } from 'express';
import {
  atualizarManifestacao,
  consultarPorProtocolo,
  criarManifestacao,
  listarManifestacoes,
} from '../controllers/Home';

export const manifestacaoRoutes = Router();

manifestacaoRoutes.post('/', criarManifestacao);
manifestacaoRoutes.get('/protocolo/:protocolo', consultarPorProtocolo);
manifestacaoRoutes.get('/admin/listar', listarManifestacoes);
manifestacaoRoutes.patch('/admin/:id', atualizarManifestacao);
