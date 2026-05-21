import { useState } from 'react';
import { ClipboardList, Search, ShieldCheck } from 'lucide-react';
import { NovaManifestacao } from './pages/NovaManifestacao';
import { ConsultaProtocolo } from './pages/ConsultaProtocolo';
import { Admin } from './pages/Admin';

type Tela = 'nova' | 'consulta' | 'admin';

export function App() {
  const [tela, setTela] = useState<Tela>('nova');

  return (
    <div className="app">
      <header className="hero">
        <div>
          <span className="badge">Site de Ouvidoria da UESPI</span>
          <h1>Alô UESPI</h1>
          <p>Registre e acompanhe manifestações acadêmicas em uma plataforma simples e centralizada.</p>
        </div>
      </header>

      <nav className="tabs">
        <button onClick={() => setTela('nova')} className={tela === 'nova' ? 'active' : ''}>
          <ClipboardList size={18} /> Registrar
        </button>
        <button onClick={() => setTela('consulta')} className={tela === 'consulta' ? 'active' : ''}>
          <Search size={18} /> Consultar protocolo
        </button>
        <button onClick={() => setTela('admin')} className={tela === 'admin' ? 'active' : ''}>
          <ShieldCheck size={18} /> Painel admin
        </button>
      </nav>

      <main>
        {tela === 'nova' && <NovaManifestacao />}
        {tela === 'consulta' && <ConsultaProtocolo />}
        {tela === 'admin' && <Admin />}
      </main>
    </div>
  );
}
export default App;
