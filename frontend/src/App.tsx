import { useState } from 'react';
import {
  ClipboardList,
  Search,
  ShieldCheck,
  Home,
  User,
} from 'lucide-react';

import { NovaManifestacao } from './pages/NovaManifestacao';
import { ConsultaProtocolo } from './pages/ConsultaProtocolo';
import { User } from "lucide-react";
import { Login } from "./pages/Login";
import { Admin } from './pages/Admin';

type Tela = 'inicio' | 'nova' | 'consulta' | 'admin' | 'login';

function Inicio() {
  return (
    <section className="card">
      <h2>Bem-vindo ao Alô UESPI</h2>

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

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="badge">Site de Ouvidoria da UESPI</span>

          <h1>Alô UESPI</h1>

          <p>
            Registre e acompanhe manifestações acadêmicas em uma plataforma
            simples e centralizada.
          </p>
        </div>
      </header>

      <nav className="tabs">
        <button
          onClick={() => setTela('inicio')}
          className={tela === 'inicio' ? 'active' : ''}
        >
          <Home size={18} /> Início
        </button>

        <button
          onClick={() => setTela('nova')}
          className={tela === 'nova' ? 'active' : ''}
        >
          <ClipboardList size={18} /> Registrar
        </button>

        <button
          onClick={() => setTela('consulta')}
          className={tela === 'consulta' ? 'active' : ''}
        >
          <Search size={18} /> Consultar protocolo
        </button>

        <button
          onClick={() => setTela('admin')}
          className={tela === 'admin' ? 'active' : ''}
        >
          <ShieldCheck size={18} /> Painel admin
        </button>

        <button 
          onClick={() => setTela ("login")}
          className={tela == 'login' ? 'active' : ''}
          >
            <User size={18} /> Entrar
            </button>

      </nav>

      <main>
        {tela === 'inicio' && <Inicio />}
        {tela === 'nova' && <NovaManifestacao />}
        {tela === 'consulta' && <ConsultaProtocolo />}
        {tela === 'admin' && <Admin />}
        {tela === 'login' && <Login />}
        
      </main>
    </div>
  );
}

export default App;