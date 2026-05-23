import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { definirPrioridade, definirSetor } from "../services/classificacao";
import { gerarProtocolo } from "../utils/protocolo";

const criarManifestacaoSchema = z.object({
  tipo: z.enum(["RECLAMACAO", "DENUNCIA", "SUGESTAO", "SOLICITACAO", "ELOGIO"]),
  categoria: z.string().min(3),
  titulo: z.string().min(5),
  descricao: z.string().min(10),
  anonima: z.boolean().default(true),
  nomeUsuario: z.string().optional(),
  emailUsuario: z.string().email().optional().or(z.literal("")),
});

const atualizarStatusSchema = z.object({
  status: z.enum(["RECEBIDA", "EM_ANALISE", "ENCAMINHADA", "RESPONDIDA", "FINALIZADA"]),
  resposta: z.string().optional(),
});

export async function criarManifestacao(req: Request, res: Response) {
  try {
    const dados = criarManifestacaoSchema.parse(req.body);

    const protocolo = gerarProtocolo();
    const prioridade = definirPrioridade(dados.tipo);
    const setorId = definirSetor(dados.categoria);

    const manifestacao = await prisma.manifestacao.create({
      data: {
        protocolo,
        tipo: dados.tipo,
        categoria: dados.categoria,
        titulo: dados.titulo,
        descricao: dados.descricao,
        anonima: dados.anonima,
        nomeUsuario: dados.anonima ? null : dados.nomeUsuario || null,
        emailUsuario: dados.anonima ? null : dados.emailUsuario || null,
        prioridade,
        setorId,
      },
    });

    return res.status(201).json({
      message: "Manifestação registrada com sucesso.",
      protocolo: manifestacao.protocolo,
      prioridade: manifestacao.prioridade,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Erro ao registrar manifestação.",
      error,
    });
  }
}

export async function consultarPorProtocolo(req: Request, res: Response) {
  const { protocolo } = req.params;

  const manifestacao = await prisma.manifestacao.findUnique({
    where: { protocolo },
    include: {
      setor: true,
    },
  });

  if (!manifestacao) {
    return res.status(404).json({ message: "Protocolo não encontrado." });
  }

  return res.json(manifestacao);
}

export async function listarManifestacoes(_req: Request, res: Response) {
  const manifestacoes = await prisma.manifestacao.findMany({
    include: {
      setor: true,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });

  return res.json(manifestacoes);
}

export async function atualizarManifestacao(req: Request, res: Response) {
  const { id } = req.params;
  const dados = atualizarStatusSchema.parse(req.body);

  await prisma.manifestacao.update({
    where: {
      id: Number(id),
    },
    data: {
      status: dados.status,
      resposta: dados.resposta,
    },
  });

  return res.json({ message: "Manifestação atualizada com sucesso." });
}