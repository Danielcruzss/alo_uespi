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

  if (
    texto.includes('infraestrutura') ||
    texto.includes('estrutura') ||
    texto.includes('sala') ||
    texto.includes('banheiro') ||
    texto.includes('laboratorio') ||
    texto.includes('laboratório')
  ) {
    return 2;
  }

  if (
    texto.includes('assistencia') ||
    texto.includes('bolsa') ||
    texto.includes('auxilio') ||
    texto.includes('auxílio') ||
    texto.includes('estudantil') ||
    texto.includes('assistência')
  ) {
    return 3;
  }

  if (
    texto.includes('biblioteca') ||
    texto.includes('livro') ||
    texto.includes('acervo')
  ) {
    return 4;
  }

  if (
    texto.includes('sistema') ||
    texto.includes('site') ||
    texto.includes('internet') ||
    texto.includes('ti') ||
    texto.includes('tecnologia')
  ) {
    return 5;
  }

  if (
    texto.includes('curso') ||
    texto.includes('disciplina') ||
    texto.includes('professor') ||
    texto.includes('aula')
  ) {
    return 1;
  }

  return 6;
}
