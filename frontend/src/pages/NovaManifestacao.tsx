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

  const payload: any = {
    tipo: String(form.get('tipo') || ''),
    categoria: String(form.get('categoria') || ''),
    titulo: String(form.get('titulo') || ''),
    descricao: String(form.get('descricao') || ''),
    anonima,
  };

  if (!anonima) {
    payload.nomeUsuario = String(form.get('nomeUsuario') || '');
    payload.emailUsuario = String(form.get('emailUsuario') || '');
  }

  try {
    const { data } = await api.post('/manifestacoes', payload);

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
        Você pode registrar uma manifestação anônima ou identificada.
      </p>

      <form onSubmit={enviar} className="form">
        <label>Tipo</label>

        <select name="tipo" required>
          <option value="RECLAMACAO">Reclamação</option>
          <option value="DENUNCIA">Denúncia</option>
          <option value="SUGESTAO">Sugestão</option>
          <option value="SOLICITACAO">Solicitação</option>
          <option value="ELOGIO">Elogio</option>
        </select>

        <label>Categoria</label>

        <input
          name="categoria"
          placeholder="Ex: infraestrutura, curso, assistência estudantil"
          required
        />

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
          <div className="grid">
            <div>
              <label>Nome</label>

              <input
                name="nomeUsuario"
                placeholder="Seu nome"
              />
            </div>

            <div>
              <label>E-mail</label>

              <input
                name="emailUsuario"
                type="email"
                placeholder="seu@email.com"
              />
            </div>
          </div>
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