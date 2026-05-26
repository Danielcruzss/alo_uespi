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
      const token = localStorage.getItem('token');

      if (!token) {
        setErro('Você precisa estar logado como administrador.');
        return;
      }

      await api.patch(
        `/manifestacoes/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setErro('');
      await carregar();
    } catch (error) {
      console.log('Erro ao atualizar manifestação:', error);
      setErro('Não foi possível atualizar a manifestação.');
    }
  }

  async function responder(id: number, resposta: string) {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        setErro('Você precisa estar logado como administrador.');
        return;
      }

      if (!resposta.trim()) {
        setErro('Digite uma resposta antes de enviar.');
        return;
      }

      await api.put(
        `/manifestacoes/${id}/responder`,
        { resposta },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setErro('');

      setRespostas((respostasAtuais) => ({
        ...respostasAtuais,
        [id]: '',
      }));

      await carregar();
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
        Acompanhe, atualize e responda às manifestações registradas na plataforma.
      </p>

      {erro && <div className="error">{erro}</div>}

      <div className="table-wrapper">
        <table className="admin-table">
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
                  <div className="admin-response-box">
                    {item.resposta && (
                      <div className="current-response">
                        <strong>Resposta atual:</strong>
                        <p>{item.resposta}</p>
                      </div>
                    )}

                    <textarea
                      value={respostas[item.id] || ''}
                      onChange={(e) =>
                        setRespostas({
                          ...respostas,
                          [item.id]: e.target.value,
                        })
                      }
                      placeholder="Digite a resposta"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        responder(item.id, respostas[item.id] || '')
                      }
                    >
                      Responder
                    </button>
                  </div>
                </td>

                <td className="admin-actions">
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

            {items.length === 0 && (
              <tr>
                <td colSpan={8}>
                  Nenhuma manifestação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}