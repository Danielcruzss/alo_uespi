import { useEffect, useState } from 'react';
import {
  ClipboardList,
  Search,
  ShieldCheck,
  Home,
  User,
} from 'lucide-react';

import { NovaManifestacao } from './pages/NovaManifestacao';
import { ConsultaProtocolo } from './pages/ConsultaProtocolo';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';

type Tela = 'inicio' | 'nova' | 'consulta' | 'admin' | 'login';

type UsuarioLogado = {
  id: number;
  nome: string;
  email: string;
  admin?: boolean;
};

function Inicio() {
  return (
    <section className="card">
      <h2>Bem-vindo ao ALÔ UESPI</h2>

      <p className="muted">
        O Alô UESPI é uma plataforma digital de ouvidoria universitária criada
        para centralizar, organizar e facilitar o acompanhamento das
        manifestações da comunidade acadêmica.
      </p>

      <div className="info-grid">
        <div className="info-card">
          <h3>Registre manifestações</h3>
          <p>
            Envie reclamações, denúncias, sugestões, solicitações ou elogios
            relacionados ao ambiente acadêmico e administrativo.
          </p>
        </div>

        <div className="info-card">
          <h3>Acompanhe por protocolo</h3>
          <p>
            Após o envio, você recebe um número de protocolo para consultar o
            andamento da manifestação.
          </p>
        </div>

        <div className="info-card">
          <h3>Registro anônimo</h3>
          <p>
            Você pode registrar uma manifestação de forma anônima ou
            identificada, conforme a necessidade da situação.
          </p>
        </div>

        <div className="info-card">
          <h3>Encaminhamento por setor</h3>
          <p>
            As manifestações são classificadas por tipo e categoria, permitindo
            melhor organização para atendimento pela universidade.
          </p>
        </div>
      </div>

      <div className="notice">
        <strong>Como funciona?</strong>

        <ol>
          <li>Escolha o tipo de manifestação.</li>
          <li>Selecione a categoria relacionada ao assunto.</li>
          <li>Descreva a situação com clareza.</li>
          <li>Receba um protocolo para acompanhar o andamento.</li>
        </ol>
      </div>
    </section>
  );
}

export function App() {
  const [tela, setTela] = useState<Tela>('inicio');
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);

  function carregarUsuarioLogado() {
    const usuarioSalvo = sessionStorage.getItem('usuario');

    if (!usuarioSalvo) {
      setUsuario(null);
      return;
    }

    try {
      setUsuario(JSON.parse(usuarioSalvo));
    } catch {
      setUsuario(null);
    }
  }

  function trocarTela(novaTela: Tela) {
    carregarUsuarioLogado();
    setTela(novaTela);
  }

  useEffect(() => {
    carregarUsuarioLogado();
  }, [tela]);

  const usuarioEhAdmin = usuario?.admin === true;

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="badge">Site de Ouvidoria da UESPI</span>

          <h1>ALÔ UESPI</h1>

          <p>
            Registre e acompanhe manifestações acadêmicas em uma plataforma
            simples e centralizada.
          </p>
        </div>
      </header>

      <nav className="tabs">
        <button
          type="button"
          onClick={() => trocarTela('inicio')}
          className={tela === 'inicio' ? 'active' : ''}
        >
          <Home size={18} /> Início
        </button>

        <button
          type="button"
          onClick={() => trocarTela('nova')}
          className={tela === 'nova' ? 'active' : ''}
        >
          <ClipboardList size={18} /> Registrar
        </button>

        <button
          type="button"
          onClick={() => trocarTela('consulta')}
          className={tela === 'consulta' ? 'active' : ''}
        >
          <Search size={18} /> Consultar protocolo
        </button>

        {usuarioEhAdmin && (
          <button
            type="button"
            onClick={() => trocarTela('admin')}
            className={tela === 'admin' ? 'active' : ''}
          >
            <ShieldCheck size={18} /> Painel admin
          </button>
        )}

        <button
          type="button"
          onClick={() => trocarTela('login')}
          className={tela === 'login' ? 'active' : ''}
        >
          <User size={18} /> Entrar
        </button>
      </nav>

      <main>
        {tela === 'inicio' && <Inicio />}
        {tela === 'nova' && <NovaManifestacao />}
        {tela === 'consulta' && <ConsultaProtocolo />}

        {tela === 'admin' && usuarioEhAdmin && <Admin />}

        {tela === 'admin' && !usuarioEhAdmin && (
          <section className="card">
            <h2>Acesso restrito</h2>
            <p className="muted">
              O painel administrativo está disponível apenas para usuários
              administradores.
            </p>
          </section>
        )}

        {tela === 'login' && <Login />}
      </main>
    </div>
  );
}

export default App;