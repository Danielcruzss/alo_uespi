import { useState } from 'react';
import { api } from '../api/client';

export function ConsultaProtocolo() {
  const [resultado, setResultado] = useState<any>(null);
  const [erro, setErro] = useState('');

  async function consultar(
    event: React.SyntheticEvent<HTMLFormElement>
    //    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErro('');
    setResultado(null);

    const form = new FormData(event.currentTarget);
    const protocolo = form.get('protocolo');

    try {
      const { data } = await api.get(
        `/manifestacoes/protocolo/${protocolo}`
      );

      setResultado(data);
    } catch {
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
            <strong>Setor:</strong> {resultado.setor}
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