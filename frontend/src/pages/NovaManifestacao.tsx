import { FormEvent, useState } from 'react';
import { api } from '../api/client';

export function NovaManifestacao() {
  const [anonima, setAnonima] = useState(true);
  const [protocolo, setProtocolo] = useState('');
  const [erro, setErro] = useState('');

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro('');
    setProtocolo('');

    const form = new FormData(event.currentTarget);
    const payload = {
      tipo: form.get('tipo'),
      categoria: form.get('categoria'),
      titulo: form.get('titulo'),
      descricao: form.get('descricao'),
      anonima,
      nomeUsuario: form.get('nomeUsuario'),
      emailUsuario: form.get('emailUsuario'),
    };

    try {
      const { data } = await api.post('/manifestacoes', payload);
      setProtocolo(data.protocolo);
      event.currentTarget.reset();
      setAnonima(true);
    } catch {
      setErro('Não foi possível registrar. Confira os dados e tente novamente.');
    }
  }

  return (
    <section className="card">
      <h2>Registrar manifestação</h2>
      <p className="muted">Você pode registrar uma manifestação anônima ou identificada.</p>

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
        <input name="categoria" placeholder="Ex: infraestrutura, curso, assistência estudantil" required />

        <label>Título</label>
        <input name="titulo" placeholder="Resumo da manifestação" required />

        <label>Descrição</label>
        <textarea name="descricao" placeholder="Descreva a situação com detalhes" required />

        <label className="check">
          <input type="checkbox" checked={anonima} onChange={(e) => setAnonima(e.target.checked)} />
          Registrar de forma anônima
        </label>

        {!anonima && (
          <div className="grid">
            <div>
              <label>Nome</label>
              <input name="nomeUsuario" placeholder="Seu nome" />
            </div>
            <div>
              <label>E-mail</label>
              <input name="emailUsuario" type="email" placeholder="seu@email.com" />
            </div>
          </div>
        )}

        <button type="submit">Enviar manifestação</button>
      </form>

      {protocolo && <div className="success">Manifestação registrada. Seu protocolo é: <strong>{protocolo}</strong></div>}
      {erro && <div className="error">{erro}</div>}
    </section>
  );
}
