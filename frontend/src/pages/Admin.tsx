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
      const token = sessionStorage.getItem('token');

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
      const token = sessionStorage.getItem('token');

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
    <section className="card admin-card">
      <div className="admin-header">
        <div>
          <h2>Painel administrativo</h2>

          <p className="muted">
            Acompanhe, atualize e responda às manifestações registradas na plataforma.
          </p>
        </div>

        <span className="admin-count">
          {items.length} manifestação{items.length === 1 ? '' : 'es'}
        </span>
      </div>

      {erro && <div className="error">{erro}</div>}

      <div className="admin-list">
        {items.map((item) => (
          <article key={item.id} className="admin-item">
            <div className="admin-item-main">
              <div>
                <span className="admin-label">Protocolo</span>
                <strong>{item.protocolo}</strong>
              </div>

              <div>
                <span className="admin-label">Tipo</span>
                <strong>{item.tipo}</strong>
              </div>

              <div>
                <span className="admin-label">Título</span>
                <strong>{item.titulo}</strong>
              </div>

              <div>
                <span className="admin-label">Setor</span>
                <strong>{item.setor?.nome || 'Não definido'}</strong>
              </div>

              <div>
                <span className="admin-label">Prioridade</span>
                <span className={`pill priority-${item.prioridade.toLowerCase()}`}>
                  {item.prioridade}
                </span>
              </div>

              <div>
                <span className="admin-label">Status</span>

                <div className="admin-status-box">
                  <span className={`status-badge status-${item.status.toLowerCase()}`}>
                    {item.status.replace('_', ' ')}
                  </span>

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
                </div>
              </div>
            </div>

            <div className="admin-response-area">
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
                className="admin-response-button"
                onClick={() => responder(item.id, respostas[item.id] || '')}
              >
                Responder
              </button>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="empty-table">
            Nenhuma manifestação encontrada.
          </div>
        )}
      </div>
    </section>
  );
}