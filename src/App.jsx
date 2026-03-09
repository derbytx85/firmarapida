import { useState, useRef, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

/* ──────────────────────────────────────────────
   ESTILOS Y DISEÑO (MODO CLARO)
   ────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');

:root {
  --primary: #1B2A6B;
  --primary-light: #2A3D8F;
  --green: #00C896;
  --white: #FFFFFF;
  --gray-50: #F8FAFC;
  --gray-100: #F1F5F9;
  --gray-200: #E2E8F0;
  --gray-400: #94A3B8;
  --gray-600: #475569;
  --gray-800: #1E293B;
  --shadow: 0 10px 40px -10px rgba(27,42,107,0.12);
}

* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--gray-50); color: var(--primary); overflow-x: hidden; scroll-behavior: smooth; }
#root { width: 100%; min-height: 100vh; }

.btn { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; font-size: 14px; }
.btn-primary { background: var(--primary); color: #fff; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 5px 15px rgba(27,42,107,0.2); }
.btn-green { background: var(--green); color: #fff; }
.btn-green:hover { background: #00ad82; transform: translateY(-1px); }
.btn-ghost { background: rgba(255,255,255,0.1); color: #fff; }
.btn-ghost:hover { background: rgba(255,255,255,0.2); }
.btn-danger { background: #fee2e2; color: #991b1b; }

.card { background: var(--white); border-radius: 16px; padding: 24px; box-shadow: var(--shadow); border: 1px solid var(--gray-100); }
.input { width: 100%; padding: 12px 16px; border: 2px solid var(--gray-200); border-radius: 12px; font-size: 14px; transition: all 0.2s; outline: none; }
.input:focus { border-color: var(--primary); }

.sidebar { width: 240px; background: var(--primary); height: 100vh; position: fixed; left: 0; top: 0; color: #fff; padding: 24px 16px; display: flex; flex-direction: column; z-index: 1000; }
.main-content { margin-left: 240px; padding: 40px; min-height: 100vh; }
.sidebar-item { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; cursor: pointer; color: rgba(255,255,255,0.7); transition: 0.2s; margin-bottom: 4px; }
.sidebar-item:hover, .sidebar-item.active { background: rgba(255,255,255,0.1); color: #fff; }

.hero-bg { background: linear-gradient(135deg, #1B2A6B 0%, #0F172A 100%); color: #fff; padding: 100px 32px; text-align: center; }
.gradient-text { background: linear-gradient(90deg, #00C896, #00E6B0); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 16px; color: var(--gray-400); font-size: 12px; text-transform: uppercase; border-bottom: 1px solid var(--gray-100); }
td { padding: 16px; border-bottom: 1px solid var(--gray-100); color: var(--gray-600); font-size: 14px; }
tr:hover td { background: var(--gray-50); }

.badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge-amber { background: #FEF3C7; color: #92400E; }
.badge-green { background: #DCFCE7; color: #166534; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.4s ease-out; }
`;

/* ──────────────────────────────────────────────
   SUPABASE CLIENT
   ────────────────────────────────────────────── */
const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL || '',
    import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

const API = {
    loginWithGoogle: async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: window.location.origin }
        });
        if (error) alert(error.message);
    },
    logout: () => supabase.auth.signOut(),
};

/* ──────────────────────────────────────────────
   COMPONENTES
   ────────────────────────────────────────────── */
const Icon = ({ name, size = 18 }) => {
    const icons = {
        home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z',
        file: 'M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z',
        users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2',
        settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z',
        plus: 'M12 5v14M5 12h14',
        logOut: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9',
        pen: 'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
        whatsapp: 'M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.4A10 10 0 1012 2z'
    };
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d={icons[name] || ''} />
        </svg>
    );
};

const LandingPage = ({ onLogin, onGoogleLogin }) => (
    <div>
        <nav style={{ background: 'var(--primary)', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff', position: 'sticky', top: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>FirmaRápida ⚡</div>
            <div style={{ display: 'flex', gap: 12 }}>
                <button className="btn btn-ghost" onClick={onLogin}>Iniciar sesión</button>
                <button className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }} onClick={onGoogleLogin}>Continuar con Google</button>
                <button className="btn btn-green" onClick={onLogin}>Prueba el Demo</button>
            </div>
        </nav>
        <div className="hero-bg">
            <h1 style={{ fontSize: 56, fontWeight: 900, marginBottom: 24 }}>Firma documentos en <br /><span className="gradient-text">segundos, sin papel</span></h1>
            <p style={{ opacity: 0.8, fontSize: 18, maxWidth: 600, margin: '0 auto 40px' }}>La forma más rápida y segura de firmar documentos legales en Chile y Latam.</p>
            <button className="btn btn-green" style={{ padding: '16px 32px', fontSize: 18 }} onClick={onLogin}>Empieza Gratis Ahora</button>
        </div>
    </div>
);

const Dashboard = ({ docs, onNewDoc }) => (
    <div className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 28, fontWeight: 800 }}>Mis documentos</h1>
            <button className="btn btn-primary" onClick={onNewDoc}><Icon name="plus" /> Nuevo documento</button>
        </div>
        <div className="card">
            <table>
                <thead>
                    <tr><th>Documento</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
                </thead>
                <tbody>
                    {docs.map(d => (
                        <tr key={d.id}>
                            <td style={{ fontWeight: 600 }}>{d.name}</td>
                            <td><span className={`badge ${d.status === 'signed' ? 'badge-green' : 'badge-amber'}`}>{d.status}</span></td>
                            <td>{d.sent}</td>
                            <td><button className="btn btn-ghost" style={{ color: 'var(--primary)', padding: 8 }}><Icon name=" pen" size={14} /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const AppShell = ({ view, setView, onLogout, children }) => (
    <div>
        <div className="sidebar">
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 32, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 16 }}>FirmaRápida ⚡</div>
            <div className={`sidebar-item ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')}><Icon name="home" /> Dashboard</div>
            <div className={`sidebar-item ${view === 'templates' ? 'active' : ''}`} onClick={() => setView('templates')}><Icon name="file" /> Plantillas</div>
            <div style={{ marginTop: 'auto' }}>
                <div className="sidebar-item" onClick={onLogout}><Icon name="logOut" /> Cerrar sesión</div>
            </div>
        </div>
        <div className="main-content">{children}</div>
    </div>
);

export default function FirmaRapida() {
    const [auth, setAuth] = useState(false);
    const [view, setView] = useState('dashboard');
    const [docs] = useState([
        { id: 1, name: 'Contrato Servicios.pdf', status: 'pending', sent: '2026-03-08' },
        { id: 2, name: 'NDA Proyecto X.pdf', status: 'signed', sent: '2026-03-05' }
    ]);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) { setAuth(true); setView('dashboard'); }
            else { setAuth(false); }
        });
    }, []);

    const handleLogin = () => { setAuth(true); setView('dashboard'); };
    const handleLogout = () => { API.logout(); setAuth(false); };

    return (
        <>
            <style>{css}</style>
            {!auth ? (
                <LandingPage onLogin={handleLogin} onGoogleLogin={API.loginWithGoogle} />
            ) : (
                <AppShell view={view} setView={setView} onLogout={handleLogout}>
                    <Dashboard docs={docs} onNewDoc={() => alert('Nueva firma')} />
                </AppShell>
            )}
        </>
    );
}
