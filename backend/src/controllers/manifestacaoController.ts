import { Request, Response } from 'express';
import { z } from 'zod';
import { pool } from '../config/database';
import { definirPrioridade, definirSetor } from '../services/classificacao';
import { gerarProtocolo } from '../utils/protocolo';

const criarManifestacaoSchema = z.object({
  tipo: z.enum(['RECLAMACAO', 'DENUNCIA', 'SUGESTAO', 'SOLICITACAO', 'ELOGIO']),
  categoria: z.string().min(3),
  titulo: z.string().min(5),
  descricao: z.string().min(10),
  anonima: z.boolean().default(true),
  nomeUsuario: z.string().optional(),
  emailUsuario: z.string().email().optional().or(z.literal('')),
});

const atualizarStatusSchema = z.object({
  status: z.enum(['RECEBIDA', 'EM_ANALISE', 'ENCAMINHADA', 'RESPONDIDA', 'FINALIZADA']),
  resposta: z.string().optional(),
});

export async function criarManifestacao(req: Request, res: Response) {
  const dados = criarManifestacaoSchema.parse(req.body);
  const protocolo = gerarProtocolo();
  const prioridade = definirPrioridade(dados.tipo);
  const setorId = definirSetor(dados.categoria);

  await pool.execute(
    `INSERT INTO manifestacoes
      (protocolo, tipo, categoria, titulo, descricao, anonima, nome_usuario, email_usuario, prioridade, setor_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      protocolo,
      dados.tipo,
      dados.categoria,
      dados.titulo,
      dados.descricao,
      dados.anonima,
      dados.anonima ? null : dados.nomeUsuario || null,
      dados.anonima ? null : dados.emailUsuario || null,
      prioridade,
      setorId,
    ]
  );

  return res.status(201).json({
    message: 'Manifestação registrada com sucesso.',
    protocolo,
    prioridade,
  });
}

export async function consultarPorProtocolo(req: Request, res: Response) {
  const { protocolo } = req.params;
  const [rows] = await pool.execute(
    `SELECT m.protocolo, m.tipo, m.categoria, m.titulo, m.prioridade, m.status,
            m.resposta, m.criado_em, m.atualizado_em, s.nome AS setor
       FROM manifestacoes m
       LEFT JOIN setores s ON s.id = m.setor_id
      WHERE m.protocolo = ?`,
    [protocolo]
  );

  const manifestacoes = rows as unknown[];
  if (manifestacoes.length === 0) {
    return res.status(404).json({ message: 'Protocolo não encontrado.' });
  }

  return res.json(manifestacoes[0]);
}

export async function listarManifestacoes(_req: Request, res: Response) {
  const [rows] = await pool.execute(
    `SELECT m.id, m.protocolo, m.tipo, m.categoria, m.titulo, m.prioridade,
            m.status, m.anonima, m.criado_em, s.nome AS setor
       FROM manifestacoes m
       LEFT JOIN setores s ON s.id = m.setor_id
      ORDER BY m.criado_em DESC`
  );
  return res.json(rows);
}

export async function atualizarManifestacao(req: Request, res: Response) {
  const { id } = req.params;
  const dados = atualizarStatusSchema.parse(req.body);

  await pool.execute(
    `UPDATE manifestacoes SET status = ?, resposta = COALESCE(?, resposta) WHERE id = ?`,
    [dados.status, dados.resposta || null, id]
  );

  return res.json({ message: 'Manifestação atualizada com sucesso.' });
}
