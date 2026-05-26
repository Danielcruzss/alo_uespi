import { useEffect, useState } from 'react';
import { api } from '../api/client';

type Manifestacao = {
  id: number;
  protocolo: string;
  tipo: string;
  categoria: string;
  titulo: string;
  prioridade: string;
  status: string;
  anonima: boolean;
  criadoEm: string;
  resposta?: string | null;
  setor: {
    id: number;
    nome: string;
    email?: string | null;
  } | null;
};

export function Admin() {
  const [items, setItems] = useState<Manifestacao[]>([]);
  const [erro, setErro] = useState('');
  const [respostas, setRespostas] = useState<Record<number, string>>({});

  async function carregar() {
    try {
      const { data } = await api.get('/manifestacoes');
      setItems(data);
      setErro('');
    } catch (error) {
      console.log('Erro ao carregar manifestações:', error);
      setErro('Não foi possível carregar as manifestações.');
      setItems([]);
    }
  }

  async function atualizar(id: number, status: string) {
    try {
      await api.patch(`/manifestacoes/${id}`, { status });
      carregar();
    } catch (error) {
      console.log('Erro ao atualizar manifestação:', error);
      setErro('Não foi possível atualizar a manifestação.');
    }
  }

  async function responder(id: number) {

  try {

    await api.put(`/manifestacoes/${id}/responder`, {
      resposta: respostas[id]
    });

    carregar();

  } catch (error) {

    console.log('Erro ao responder manifestação:', error);

    setErro('Não foi possível responder a manifestação.');

  }
}

  useEffect(() => {
    carregar();
  }, []);

  return (
    <section className="card">
      <h2>Painel administrativo</h2>

      <p className="muted">
        Versão inicial para equipe da ouvidoria acompanhar demandas.
      </p>

      {erro && <div className="error">{erro}</div>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Protocolo</th>
              <th>Tipo</th>
              <th>Título</th>
              <th>Setor</th>
              <th>Prioridade</th>
              <th>Status</th>
              <th>Resposta</th>
              <th>Ação</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.protocolo}</td>
                <td>{item.tipo}</td>
                <td>{item.titulo}</td>
                <td>{item.setor?.nome || 'Não definido'}</td>
                <td>
                  <span className="pill">{item.prioridade}</span>
                </td>
                <td>{item.status}</td>
                 <td>
  <textarea
    value={respostas[item.id] || ''}
    onChange={(e) =>
      setRespostas({
        ...respostas,
        [item.id]: e.target.value
      })
    }
    placeholder="Digite a resposta"
  />

  <button onClick={() => responder(item.id)}>
    Responder
  </button>

  {item.resposta && (
    <p>
      <strong>Atual:</strong> {item.resposta}
    </p>
  )}
</td>
                <td>
                  <select
                    value={item.status}
                    onChange={(e) => atualizar(item.id, e.target.value)}
                  >
                    <option value="RECEBIDA">Recebida</option>
                    <option value="EM_ANALISE">Em análise</option>
                    <option value="ENCAMINHADA">Encaminhada</option>
                    <option value="RESPONDIDA">Respondida</option>
                    <option value="FINALIZADA">Finalizada</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}