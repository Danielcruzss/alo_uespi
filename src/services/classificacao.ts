export type TipoManifestacao = 'RECLAMACAO' | 'DENUNCIA' | 'SUGESTAO' | 'SOLICITACAO' | 'ELOGIO';

export function definirPrioridade(tipo: TipoManifestacao) {
  const prioridades = {
    DENUNCIA: 'URGENTE',
    RECLAMACAO: 'ALTA',
    SOLICITACAO: 'MEDIA',
    SUGESTAO: 'BAIXA',
    ELOGIO: 'BAIXA',
  } as const;
  return prioridades[tipo];
}

export function definirSetor(categoria: string) {
  const setoresPorCategoria: Record<string, number> = {
    curso_disciplina: 1,
    infraestrutura: 2,
    assistencia_estudantil: 3,
    biblioteca: 4,
    tecnologia: 5,
    atendimento: 6,
    outros: 6,
  };

  return setoresPorCategoria[categoria] || 6;
}

