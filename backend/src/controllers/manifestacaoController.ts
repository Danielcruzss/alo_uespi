import type { Request, Response } from "express";
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

export async function criarManifestacao(req: Request, res: Response): Promise<void> {
  try {
    const dados = criarManifestacaoSchema.parse(req.body);

    const protocolo = gerarProtocolo();
    const prioridade = definirPrioridade(dados.tipo);

    const setorIdRetornado = definirSetor(dados.categoria);

    const setor = await prisma.setor.findUnique({
      where: {
        id: setorIdRetornado,
      },
    });

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
        setorId: setor ? setor.id : null,
      },
    });

    res.status(201).json({
      message: "Manifestação registrada com sucesso.",
      protocolo: manifestacao.protocolo,
      prioridade: manifestacao.prioridade,
      setor: setor ? setor.nome : null,
    });
    return;
  } catch (error) {
    console.error(error);

    res.status(400).json({
      message: "Erro ao registrar manifestação.",
      error,
    });
    return;
  }
}

export async function consultarPorProtocolo(
  req: Request<{ protocolo: string }>,
  res: Response
): Promise<void> {
  const protocolo = req.params.protocolo;

  const manifestacao = await prisma.manifestacao.findUnique({
    where: {
      protocolo,
    },
    include: {
      setor: true,
    },
  });

  if (!manifestacao) {
    res.status(404).json({ message: "Protocolo não encontrado." });
    return;
  }

  res.json(manifestacao);
  return;
}

export async function listarManifestacoes(
  _req: Request,
  res: Response
): Promise<void> {
  const manifestacoes = await prisma.manifestacao.findMany({
    include: {
      setor: true,
    },
    orderBy: {
      criadoEm: "desc",
    },
  });

  res.json(manifestacoes);
  return;
}

export async function atualizarManifestacao(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const dados = atualizarStatusSchema.parse(req.body);

  await prisma.manifestacao.update({
    where: {
      id: Number(id),
    },
    data: {
      status: dados.status,
      ...(dados.resposta !== undefined && {
        resposta: dados.resposta,
      }),
    },
  });

  res.json({ message: "Manifestação atualizada com sucesso." });
  return;
}