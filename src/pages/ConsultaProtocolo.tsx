import { useState } from 'react';
import { api } from '../api/client';

type ResultadoManifestacao = {
  titulo: string;
  status: string;
  prioridade: string;
  resposta?: string | null;
  setor: {
    id: number;
    nome: string;
    email?: string | null;
  } | null;
};

export function ConsultaProtocolo() {
  const [resultado, setResultado] = useState<ResultadoManifestacao | null>(null);
  const [erro, setErro] = useState('');

  async function consultar(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro('');
    setResultado(null);

    const form = new FormData(event.currentTarget);
    const protocolo = String(form.get('protocolo') || '').trim();

    try {
      const { data } = await api.get(`/manifestacoes/${protocolo}`);
      setResultado(data);
    } catch (error) {
      console.log('Erro ao consultar protocolo:', error);
      setErro('Protocolo não encontrado.');
    }
  }

  return (
    <section className="card">
      <h2>Consultar protocolo</h2>

      <form onSubmit={consultar} className="inline-form">
        <input
          name="protocolo"
          placeholder="Ex: ALO-2026-123456"
          required
        />

        <button type="submit">
          Consultar
        </button>
      </form>

      {resultado && (
        <div className="result">
          <h3>{resultado.titulo}</h3>

          <p>
            <strong>Status:</strong> {resultado.status}
          </p>

          <p>
            <strong>Prioridade:</strong> {resultado.prioridade}
          </p>

          <p>
            <strong>Setor:</strong>{' '}
            {resultado.setor?.nome || 'Não definido'}
          </p>

          <p>
            <strong>Resposta:</strong>{' '}
            {resultado.resposta || 'Ainda não há resposta.'}
          </p>
        </div>
      )}

      {erro && (
        <div className="error">
          {erro}
        </div>
      )}
    </section>
  );
}