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
  const texto = categoria.toLowerCase();
  if (texto.includes('infra') || texto.includes('estrutura')) return 4;
  if (texto.includes('assist') || texto.includes('bolsa')) return 3;
  if (texto.includes('curso') || texto.includes('disciplina')) return 2;
  return 1;
}
