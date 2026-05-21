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
  setor: string;
  criado_em: string;
};

export function Admin() {
  const [items, setItems] = useState<Manifestacao[]>([]);

  async function carregar() {
    const { data } = await api.get('/manifestacoes/admin/listar');
    setItems(data);
  }

  async function atualizar(id: number, status: string) {
    await api.patch(`/manifestacoes/admin/${id}`, { status });
    carregar();
  }

  useEffect(() => {
    carregar().catch(() => setItems([]));
  }, []);

  return (
    <section className="card">
      <h2>Painel administrativo</h2>
      <p className="muted">Versão inicial para equipe da ouvidoria acompanhar demandas.</p>

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
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.protocolo}</td>
                <td>{item.tipo}</td>
                <td>{item.titulo}</td>
                <td>{item.setor}</td>
                <td><span className="pill">{item.prioridade}</span></td>
                <td>{item.status}</td>
                <td>
                  <select value={item.status} onChange={(e) => atualizar(item.id, e.target.value)}>
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
