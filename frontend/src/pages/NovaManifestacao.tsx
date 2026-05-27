import { FormEvent, useState } from 'react';
import { api } from '../api/client';

export function NovaManifestacao() {
  const [anonima, setAnonima] = useState(true);
  const [protocolo, setProtocolo] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formulario = event.currentTarget;

    setErro('');
    setProtocolo('');

    const form = new FormData(formulario);

    const payload = {
      tipo: String(form.get('tipo') || ''),
      categoria: String(form.get('categoria') || ''),
      titulo: String(form.get('titulo') || ''),
      descricao: String(form.get('descricao') || ''),
      anonima,
    };

    try {
      const token = sessionStorage.getItem('token');

      if (!anonima && !token) {
        setErro(
          'Para registrar uma manifestação identificada, você precisa fazer login.'
        );
        return;
      }

      const { data } = await api.post('/manifestacoes', payload, {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      setErro('');
      setProtocolo(data.protocolo);

      formulario.reset();
      setAnonima(true);
    } catch (error: any) {
      console.log('Erro ao registrar:', error.response?.data || error);

      setProtocolo('');
      setErro(
        error.response?.data?.message ||
          'Não foi possível registrar. Confira os dados e tente novamente.'
      );
    }
  }

  return (
    <section className="card">
      <h2>Registrar manifestação</h2>

      <p className="muted">
        Você pode registrar uma manifestação anônima ou identificada. Para
        manifestações identificadas, é necessário estar logado na plataforma.
      </p>

      <form onSubmit={enviar} className="form">
        <label>Tipo</label>

        <select name="tipo" required>
          <option value="">Selecione o tipo da manifestação</option>
          <option value="RECLAMACAO">Reclamação</option>
          <option value="DENUNCIA">Denúncia</option>
          <option value="SUGESTAO">Sugestão</option>
          <option value="SOLICITACAO">Solicitação</option>
          <option value="ELOGIO">Elogio</option>
        </select>

        <label>Categoria</label>

        <select name="categoria" required>
          <option value="">Selecione uma categoria</option>
          <option value="infraestrutura">Infraestrutura</option>
          <option value="assistencia_estudantil">Assistência Estudantil</option>
          <option value="curso_disciplina">Curso ou Disciplina</option>
          <option value="biblioteca">Biblioteca</option>
          <option value="tecnologia">Tecnologia da Informação</option>
          <option value="atendimento">Atendimento Institucional</option>
          <option value="outros">Outros</option>
        </select>

        <label>Título</label>

        <input
          name="titulo"
          placeholder="Resumo da manifestação"
          required
        />

        <label>Descrição</label>

        <textarea
          name="descricao"
          placeholder="Descreva a situação com detalhes"
          required
        />

        <label className="check">
          <input
            type="checkbox"
            checked={anonima}
            onChange={(e) => setAnonima(e.target.checked)}
          />

          Registrar de forma anônima
        </label>

        {!anonima && (
          <p className="muted">
            Esta manifestação será vinculada ao usuário logado.
          </p>
        )}

        <button type="submit">
          Enviar manifestação
        </button>
      </form>

      {protocolo && (
        <div className="success">
          Manifestação registrada. Seu protocolo é:{' '}
          <strong>{protocolo}</strong>
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

