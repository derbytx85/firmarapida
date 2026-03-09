import { useState, useRef, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';

/* ──────────────────────────────────────────────
   PALETA & TIPOGRAFÍA
   ────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',sans-serif;background:#F7F9FC;color:#1B2A6B}
::-webkit-scrollbar{width:6px}::-webkit-scrollbar-thumb{background:#CBD5E0;border-radius:3px}
.dark body{background:#0F172A;color:#E2E8F0}

/* Tokens */
:root{
  --primary:#1B2A6B;--green:#00C896;--white:#FFFFFF;
  --gray-50:#F7F9FC;--gray-100:#EBF0F7;--gray-200:#D1DCF0;
  --gray-400:#8A9BBD;--gray-600:#4A5568;--gray-800:#1A202C;
  --red:#EF4444;--amber:#F59E0B;--shadow:0 4px 24px rgba(27,42,107,.10);
}
.dark{
  --gray-50:#0F172A;--gray-100:#1E293B;--gray-200:#334155;
  --gray-400:#64748B;--gray-600:#94A3B8;--gray-800:#F1F5F9;
  --shadow:0 4px 24px rgba(0,0,0,.4);
}

/* Utilities */
.btn{display:inline-flex;align-items:center;gap:8px;padding:10px 20px;border-radius:10px;font-weight:600;font-size:14px;cursor:pointer;border:none;transition:all .2s}
.btn-primary{background:var(--primary);color:#fff}
.btn-primary:hover{background:#14206b;transform:translateY(-1px);box-shadow:0 6px 20px rgba(27,42,107,.3)}
.btn-green{background:var(--green);color:#fff}
.btn-green:hover{background:#00ad82;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,200,150,.3)}
.btn-outline{background:transparent;color:var(--primary);border:2px solid var(--primary)}
.btn-outline:hover{background:var(--primary);color:#fff}
.btn-ghost{background:var(--gray-100);color:var(--gray-600)}
.btn-ghost:hover{background:var(--gray-200)}
.btn-danger{background:#FEE2E2;color:#991B1B}
.btn-danger:hover{background:#FCA5A5}
.card{background:var(--white);border-radius:16px;box-shadow:var(--shadow);padding:24px}
.dark .card{background:#1E293B}
.badge{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:600}
.badge-green{background:#DCFCE7;color:#166534}
.badge-amber{background:#FEF3C7;color:#92400E}
.badge-red{background:#FEE2E2;color:#991B1B}
.badge-blue{background:#DBEAFE;color:#1e40af}
.input{width:100%;padding:10px 14px;border:2px solid var(--gray-200);border-radius:10px;font-family:inherit;font-size:14px;background:var(--white);color:var(--gray-800);transition:border .2s;outline:none}
.input:focus{border-color:var(--primary)}
.dark .input{background:#1E293B;color:#E2E8F0;border-color:#334155}
.label{display:block;font-size:13px;font-weight:600;color:var(--gray-600);margin-bottom:6px}
.section-title{font-size:28px;font-weight:800;color:var(--primary)}
.dark .section-title{color:#E2E8F0}
.shimmer{animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.fade-in{animation:fadeIn .4s ease}
@keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

/* Sidebar */
.sidebar{width:220px;min-height:100vh;background:var(--primary);padding:24px 16px;display:flex;flex-direction:column;gap:4px;position:fixed;top:0;left:0;z-index:50}
.sidebar-logo{font-size:20px;font-weight:800;color:#fff;padding:0 8px 20px;border-bottom:1px solid rgba(255,255,255,.15);margin-bottom:8px}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:10px;color:rgba(255,255,255,.7);font-size:14px;font-weight:500;cursor:pointer;transition:all .2s}
.sidebar-item:hover,.sidebar-item.active{background:rgba(255,255,255,.15);color:#fff}
.sidebar-item svg{flex-shrink:0}
.main-content{margin-left:220px;padding:32px;min-height:100vh;background:var(--gray-50)}
.dark .main-content{background:#0F172A}

/* Table */
table{width:100%;border-collapse:collapse;font-size:14px}
th{text-align:left;padding:12px 16px;color:var(--gray-400);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.05em;border-bottom:1px solid var(--gray-100)}
td{padding:14px 16px;border-bottom:1px solid var(--gray-100);color:var(--gray-600)}
.dark th{border-color:#334155;color:#64748B}
.dark td{border-color:#334155;color:#94A3B8}
tr:hover td{background:var(--gray-50)}
.dark tr:hover td{background:#1E293B}

/* Steps */
.step-circle{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;flex-shrink:0}
.step-active .step-circle{background:var(--primary);color:#fff}
.step-done .step-circle{background:var(--green);color:#fff}
.step-idle .step-circle{background:var(--gray-100);color:var(--gray-400)}

/* Landing */
.hero-bg{background:linear-gradient(135deg,#1B2A6B 0%,#0f1d4d 60%,#00C896 120%);min-height:100vh;display:flex;flex-direction:column}
.gradient-text{background:linear-gradient(90deg,#00C896,#7ed6c9);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.price-card{background:var(--white);border-radius:20px;padding:32px;text-align:center;box-shadow:var(--shadow);transition:transform .2s}
.price-card:hover{transform:translateY(-6px)}
.price-card.featured{background:var(--primary);color:#fff}
.trust-badge{display:flex;align-items:center;gap:8px;padding:8px 16px;background:rgba(255,255,255,.1);border-radius:30px;color:#fff;font-size:13px;font-weight:500}
.canvas-wrap{border:2px dashed var(--gray-200);border-radius:12px;background:var(--white);position:relative;overflow:hidden}
.otp-demo{background:#FEF9C3;border:2px solid #F59E0B;border-radius:12px;padding:12px 20px;font-size:14px;color:#92400E;font-weight:500}
`;

/* ──────────────────────────────────────────────
   DATOS DEMO
   ────────────────────────────────────────────── */
const DEMO_DOCS = [
    { id: 1, name: 'Contrato de servicios – Juan Pérez', signers: [{ name: 'Juan Pérez', email: 'juan@demo.cl', status: 'pending' }], status: 'pending', sent: '2026-02-28', expires: '2026-03-07', progress: 0 },
    { id: 2, name: 'NDA Proyecto Alpha – María González', signers: [{ name: 'María González', email: 'maria@demo.cl', status: 'signed' }], status: 'signed', sent: '2026-02-25', expires: '2026-03-04', progress: 100 },
    { id: 3, name: 'Finiquito – Carlos Rojas', signers: [{ name: 'Carlos Rojas', email: 'carlos@demo.cl', status: 'expired' }], status: 'expired', sent: '2026-02-20', expires: '2026-02-27', progress: 0 },
];

const TEMPLATES = [
    { id: 1, name: 'Contrato de Servicios', icon: '📄', fields: ['Nombre del prestador', 'Nombre del cliente', 'Descripción del servicio', 'Monto acordado', 'Fecha inicio'] },
    { id: 2, name: 'NDA / Acuerdo de Confidencialidad', icon: '🔒', fields: ['Nombre empresa', 'Contraparte', 'Fecha vigencia', 'Jurisdicción'] },
    { id: 3, name: 'Finiquito Laboral', icon: '📋', fields: ['Nombre trabajador', 'RUT trabajador', 'Fecha último día', 'Causal término', 'Monto liquidación'] },
    { id: 4, name: 'Carta Oferta Laboral', icon: '💼', fields: ['Nombre candidato', 'Cargo ofrecido', 'Sueldo bruto', 'Fecha ingreso'] },
    { id: 5, name: 'Poder Notarial Simple', icon: '⚖️', fields: ['Nombre poderdante', 'RUT poderdante', 'Nombre apoderado', 'Facultades específicas'] },
    { id: 6, name: 'Acuerdo Comercial', icon: '🤝', fields: ['Empresa A', 'Empresa B', 'Objeto del acuerdo', 'Vigencia'] },
];

const COLLABORATORS = [
    { id: 1, name: 'Ana Torres', role: 'Desarrolladora', docs: [{ type: 'Contrato', status: 'signed' }, { type: 'Anexo sueldo', status: 'signed' }, { type: 'Finiquito', status: 'none' }] },
    { id: 2, name: 'Pedro Soto', role: 'Diseñador', docs: [{ type: 'Contrato', status: 'signed' }, { type: 'Anexo sueldo', status: 'pending' }, { type: 'Finiquito', status: 'none' }] },
    { id: 3, name: 'Valeria Ríos', role: 'Marketing', docs: [{ type: 'Contrato', status: 'pending' }, { type: 'Anexo sueldo', status: 'none' }, { type: 'Finiquito', status: 'none' }] },
];

/* ──────────────────────────────────────────────
   ICONO SVG HELPER (subset de lucide)
   ────────────────────────────────────────────── */
const Icon = ({ name, size = 18, color = 'currentColor' }) => {
    const paths = {
        file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
        upload: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
        users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
        check: 'M20 6L9 17l-5-5',
        clock: 'M12 2a10 10 0 100 20A10 10 0 0012 2z M12 6v6l4 2',
        send: 'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7',
        shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
        zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
        edit: 'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z',
        download: 'M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3',
        trash: 'M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6 M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2',
        eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z',
        plus: 'M12 5v14 M5 12h14',
        home: 'M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10',
        layout: 'M3 3h18v18H3z M3 9h18 M9 21V9',
        settings: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
        moon: 'M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z',
        sun: 'M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42 M12 5a7 7 0 100 14A7 7 0 0012 5z',
        mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
        bell: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0',
        whatsapp: 'M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.4A10 10 0 1012 2z',
        copy: 'M20 9h-9a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-9a2 2 0 00-2-2z M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1',
        refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
        x: 'M18 6L6 18 M6 6l12 12',
        chevronRight: 'M9 18l6-6-6-6',
        lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
        alertCircle: 'M12 22a10 10 0 100-20 10 10 0 000 20z M12 8v4 M12 16h.01',
        pen: 'M12 20h9 M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
        folder: 'M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z',
        logOut: 'M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9',
    };
    const d = paths[name] || '';
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {d.split(' M').map((seg, i) => <path key={i} d={(i === 0 ? '' : ' M') + seg} />)}
        </svg>
    );
};

/* ──────────────────────────────────────────────
   COMPONENTE TOAST (NOTIFICACIONES)
   ────────────────────────────────────────────── */
const Toast = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: { bg: '#DCFCE7', border: '#16A34A', text: '#166534', icon: 'check' },
        error: { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', icon: 'alertCircle' },
        info: { bg: '#DBEAFE', border: '#1E40AF', text: '#1E3A8A', icon: 'mail' }
    };
    const s = styles[type] || styles.success;

    return (
        <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 2000, display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 20px', borderRadius: '12px', background: s.bg,
            borderLeft: `5px solid ${s.border}`, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            animation: 'slideUp 0.3s ease-out'
        }}>
            <Icon name={s.icon} color={s.border} size={20} />
            <span style={{ color: s.text, fontWeight: 500, fontSize: 14 }}>{message}</span>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.text, marginLeft: 8 }}>
                <Icon name="x" size={14} />
            </button>
            <style>{`
                @keyframes slideUp { from { transform: translate(-50%, 40px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
            `}</style>
        </div>
    );
};

/* ──────────────────────────────────────────────
   SUPABASE CLIENT & CONFIG
   ────────────────────────────────────────────── */

// TODO: Reemplaza estas con tus credenciales de Supabase Dashboard
const SUPABASE_URL = 'https://ofaabmiuabgvrrdmzzwo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mYWFibWl1YWJndnJyZG16endvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NDQwODQsImV4cCI6MjA4ODUyMDA4NH0.u6LHLmlwjdaX7__ipT1K9xXEkhRq1e3SKiZ4WjVqy2I';

// Inicialización del cliente Supabase
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

/* ──────────────────────────────────────────────
   CAPA DE API (INTEGRACIÓN CON SUPABASE)
   ────────────────────────────────────────────── */
const API = {
    isConfigured: () => !!supabase,

    login: async (email, password) => {
        if (!API.isConfigured()) {
            await new Promise(r => setTimeout(r, 800));
            return { user: { email, name: 'Usuario Demo' } };
        }
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    loginWithGoogle: async () => {
        if (!API.isConfigured()) {
            window.alert('Configura SUPABASE_URL y KEY para usar Google Auth.');
            return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) throw error;
    },

    logout: async () => {
        if (API.isConfigured()) await supabase.auth.signOut();
    },

    getDocuments: async () => {
        if (!API.isConfigured()) return DEMO_DOCS;
        const { data, error } = await supabase
            .from('documents')
            .select('*, signers(*)')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    sendDocument: async (docData) => {
        if (!API.isConfigured()) {
            await new Promise(r => setTimeout(r, 1200));
            return { success: true, id: Date.now() };
        }

        const { data: doc, error: docErr } = await supabase
            .from('documents')
            .insert([{ name: docData.name, status: 'pending' }])
            .select()
            .single();
        if (docErr) throw docErr;

        const signersToInsert = docData.signers.map(s => ({
            document_id: doc.id,
            name: s.name,
            email: s.email,
            status: 'pending'
        }));
        const { error: signErr } = await supabase.from('signers').insert(signersToInsert);
        if (signErr) throw signErr;

        return { success: true, id: doc.id };
    },

    verifyOtp: async (docId, otp) => {
        if (!API.isConfigured()) {
            await new Promise(r => setTimeout(r, 600));
            return otp === '847293';
        }
        return otp === '847293';
    }
};

/* ──────────────────────────────────────────────
   STATUS BADGE
   ────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
    const map = {
        pending: { label: 'Pendiente 🟡', cls: 'badge-amber' },
        signed: { label: 'Firmado ✅', cls: 'badge-green' },
        expired: { label: 'Vencido 🔴', cls: 'badge-red' },
        draft: { label: 'Borrador', cls: 'badge-blue' },
    };
    const m = map[status] || { label: status, cls: 'badge-blue' };
    return <span className={`badge ${m.cls}`}>{m.label}</span>;
};

/* ──────────────────────────────────────────────
   MODAL DE LOGIN
   ────────────────────────────────────────────── */
const LoginModal = ({ onLogin, onClose }) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onLogin(email, pass);
            onClose();
        } catch (err) {
            alert(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 20 }}>
            <div className="card fade-in" style={{ width: '100%', maxWidth: 400, padding: 32, position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}>
                    <Icon name="x" size={20} />
                </button>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>⚡</div>
                    <h2 style={{ fontWeight: 800, color: 'var(--primary)' }}>Bienvenido de nuevo</h2>
                    <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>Ingresa tus credenciales para continuar</p>
                </div>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                        <label className="label">Correo electrónico</label>
                        <input className="input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
                    </div>
                    <div>
                        <label className="label">Contraseña</label>
                        <input className="input" type="password" required value={pass} onChange={e => setPass(e.target.value)} placeholder="••••••••" />
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
                        {loading ? 'Iniciando sesión...' : 'Entrar ahora'}
                    </button>
                </form>
                <div style={{ marginTop: 24, padding: '16px 0', borderTop: '1px solid var(--gray-100)', textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 16 }}>O accede rápidamente con:</p>
                    <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={() => API.loginWithGoogle()}>
                        <Icon name="log-in" size={16} /> Continuar con Google
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   LANDING PAGE
   ────────────────────────────────────────────── */
const LandingPage = ({ onShowLogin, onStartDemo, dark, setDark }) => {
    const steps = [
        { icon: 'upload', title: 'Sube tu documento', desc: 'PDF, DOC o DOCX. O elige una plantilla lista para usar.' },
        { icon: 'send', title: 'Envía a los firmantes', desc: 'El firmante recibe un link único. Sin crear cuenta.' },
        { icon: 'pen', title: 'Firma en segundos', desc: 'Dibuja tu firma y confirma con código OTP. Listo.' },
    ];
    const plans = [
        { name: 'Free', price: 'Gratis', docs: '10 docs/mes', features: ['Firma simple', 'PDF sellado', '1 firmante por doc'], featured: false },
        { name: 'Pro', price: '$9.990', period: '/mes', docs: 'Ilimitado', features: ['Firma avanzada', 'Hasta 5 firmantes', 'Plantillas premium', 'Audit trail PDF', 'WhatsApp share'], featured: true },
        { name: 'Empresa', price: 'Cotizar', docs: 'Ilimitado', features: ['Todo lo de Pro', 'Módulo RRHH', 'API acceso', 'SLA garantizado', 'Soporte dedicado'], featured: false },
    ];
    return (
        <div>
            {/* NAV */}
            <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(27,42,107,0.97)', backdropFilter: 'blur(12px)', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>FirmaRápida ⚡</div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <button className="btn btn-ghost" style={{ color: '#fff', background: 'rgba(255,255,255,.1)' }} onClick={() => setDark(!dark)}>
                        <Icon name={dark ? 'sun' : 'moon'} size={16} />{dark ? 'Claro' : 'Oscuro'}
                    </button>
                    <button className="btn btn-ghost" style={{ color: '#fff', background: 'rgba(255,255,255,.1)' }} onClick={onShowLogin}>Iniciar sesión</button>
                    <button className="btn" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 700 }} onClick={() => API.loginWithGoogle()}>
                        <Icon name="log-in" size={16} /> Google
                    </button>
                    <button className="btn btn-green" onClick={onStartDemo}>Empieza gratis</button>
                </div>
            </nav>

            {/* HERO */}
            <div className="hero-bg" style={{ padding: '80px 32px 60px', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <div style={{ maxWidth: 720 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                        <div className="trust-badge"><Icon name="shield" size={14} />Ley 19.799 Chile</div>
                        <div className="trust-badge"><Icon name="lock" size={14} />Cifrado SSL 256-bit</div>
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
                        Firma documentos en<br /><span className="gradient-text">3 minutos, sin papel</span>
                    </h1>
                    <p style={{ fontSize: 18, color: 'rgba(255,255,255,.8)', marginBottom: 36, lineHeight: 1.7 }}>
                        La plataforma de firma electrónica más simple para PYMEs y freelancers en Chile y Latinoamérica. Sin filas, sin trámites, sin letra chica.
                    </p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button className="btn btn-green" style={{ fontSize: 16, padding: '14px 28px' }} onClick={onStartDemo}>
                            🚀 Empieza gratis ahora
                        </button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,.15)', color: '#fff', fontSize: 16, padding: '14px 28px' }} onClick={() => { const el = document.getElementById('como-funciona'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>
                            Ver funciones
                        </button>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,.6)', fontSize: 13, marginTop: 16 }}>
                        ✨ Más de <strong style={{ color: '#00C896' }}>10.000</strong> documentos firmados este mes
                    </p>
                </div>
            </div>

            {/* 3 PASOS */}
            <div id="como-funciona" style={{ background: 'var(--white)', padding: '64px 32px', textAlign: 'center' }}>
                <h2 className="section-title" style={{ marginBottom: 8 }}>¿Cómo funciona?</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: 48 }}>Simple, rápido y legalmente válido</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32, maxWidth: 900, margin: '0 auto' }}>
                    {steps.map((s, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'linear-gradient(135deg,#1B2A6B,#00C896)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon name={s.icon} size={28} color="#fff" />
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Paso {i + 1}</div>
                            <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--primary)' }}>{s.title}</h3>
                            <p style={{ color: 'var(--gray-400)', fontSize: 14, lineHeight: 1.7 }}>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* PRECIOS */}
            <div style={{ background: 'var(--gray-50)', padding: '64px 32px', textAlign: 'center' }}>
                <h2 className="section-title" style={{ marginBottom: 8 }}>Precios transparentes</h2>
                <p style={{ color: 'var(--gray-400)', marginBottom: 48 }}>Sin sorpresas. Sin letra chica. Cancela cuando quieras.</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, maxWidth: 860, margin: '0 auto' }}>
                    {plans.map((p, i) => (
                        <div key={i} className="price-card" style={p.featured ? { background: 'var(--primary)', color: '#fff', transform: 'scale(1.05)' } : {}}>
                            <div style={{ fontSize: 14, fontWeight: 600, opacity: .7, marginBottom: 8 }}>{p.name}</div>
                            <div style={{ fontSize: 36, fontWeight: 900, marginBottom: 4 }}>{p.price}<span style={{ fontSize: 14, fontWeight: 400, opacity: .7 }}>{p.period || ''}</span></div>
                            <div style={{ fontSize: 13, opacity: .6, marginBottom: 24 }}>{p.docs}</div>
                            <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {p.features.map((f, j) => (
                                    <li key={j} style={{ display: 'flex', gap: 8, fontSize: 14, alignItems: 'center' }}>
                                        <span style={{ color: p.featured ? '#00C896' : 'var(--green)' }}>✓</span>{f}
                                    </li>
                                ))}
                            </ul>
                            <button className={`btn ${p.featured ? 'btn-green' : 'btn-primary'}`} style={{ width: '100%', justifyContent: 'center' }} onClick={onStartDemo}>
                                {p.name === 'Empresa' ? 'Solicitar cotización' : 'Comenzar'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* TESTIMONIOS */}
            <div style={{ background: 'var(--white)', padding: '64px 32px' }}>
                <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>Lo que dicen nuestros usuarios</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, maxWidth: 800, margin: '0 auto' }}>
                    {[
                        { name: 'Francisca Mora', role: 'Dueña de PYME, Santiago', text: 'Antes tardaba días en firmar contratos. Ahora en 5 minutos tengo todo listo. Increíble.' },
                        { name: 'Rodrigo Valdés', role: 'Gerente RRHH, Concepción', text: 'Con el módulo de colaboradores envío todos los finiquitos del mes en una hora. Clave para nuestra empresa.' },
                    ].map((t, i) => (
                        <div key={i} className="card">
                            <p style={{ color: 'var(--gray-600)', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>"{t.text}"</p>
                            <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                            <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{t.role}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA FINAL */}
            <div style={{ background: 'linear-gradient(135deg,#1B2A6B,#0f1d4d)', padding: '64px 32px', textAlign: 'center' }}>
                <h2 style={{ color: '#fff', fontSize: 32, fontWeight: 800, marginBottom: 16 }}>¿Listo para firmar sin papel?</h2>
                <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 32 }}>Empieza gratis hoy. 10 documentos al mes, para siempre.</p>
                <button className="btn btn-green" style={{ fontSize: 16, padding: '14px 32px' }} onClick={() => API.loginWithGoogle()}>
                    Crear cuenta con Google ⚡
                </button>
            </div>

            {/* FOOTER */}
            <footer style={{ background: '#0f1d4d', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ color: 'rgba(255,255,255,.6)', fontSize: 13 }}>© 2026 FirmaRápida ⚡ · Clever Tech Gloval Ideas · Ley 19.799 Firma Electrónica · Chile</div>
                <div style={{ display: 'flex', gap: 16 }}>
                    {[
                        { label: 'Privacidad', href: '/privacidad' },
                        { label: 'Términos', href: '/terminos' },
                        { label: 'Soporte', href: '/soporte' }
                    ].map(l => (
                        <a key={l.label} href={l.href} style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, cursor: 'pointer', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
                            {l.label}
                        </a>
                    ))}
                </div>
            </footer>
        </div>
    );
};

/* ──────────────────────────────────────────────
   SIDEBAR + SHELL
   ────────────────────────────────────────────── */
const SidebarItem = ({ id, icon, label, active, onClick }) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            className={`sidebar-item ${active ? 'active' : ''}`}
            onClick={onClick}
            onKeyDown={handleKeyDown}
            aria-current={active ? 'page' : undefined}
        >
            <Icon name={icon} size={16} />{label}
        </div>
    );
};

const AppShell = ({ view, setView, dark, setDark, onLogout, children }) => {
    const items = [
        { id: 'dashboard', icon: 'home', label: 'Dashboard' },
        { id: 'templates', icon: 'layout', label: 'Plantillas' },
        { id: 'collaborators', icon: 'folder', label: 'Colaboradores' },
        { id: 'settings', icon: 'settings', label: 'Configuración' },
    ];
    return (
        <div>
            <div className="sidebar">
                <div className="sidebar-logo">FirmaRápida ⚡</div>
                {items.map(item => (
                    <SidebarItem
                        key={item.id}
                        id={item.id}
                        icon={item.icon}
                        label={item.label}
                        active={view === item.id}
                        onClick={() => setView(item.id)}
                    />
                ))}
                <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,.15)' }}>
                    <div role="button" tabIndex={0} className="sidebar-item" onClick={() => setDark(!dark)} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setDark(!dark)}>
                        <Icon name={dark ? 'sun' : 'moon'} size={16} />{dark ? 'Modo claro' : 'Modo oscuro'}
                    </div>
                    <div role="button" tabIndex={0} className="sidebar-item" onClick={onLogout} onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onLogout()}>
                        <Icon name="logOut" size={16} />Cerrar sesión
                    </div>
                    <div style={{ padding: '12px', fontSize: 12, color: 'rgba(255,255,255,.5)' }}>
                        <div style={{ fontWeight: 600, color: 'rgba(255,255,255,.8)', marginBottom: 2 }}>empresa@demo.cl</div>
                        <div>Plan Pro · 7/∞ docs</div>
                        <div style={{ fontSize: 10, marginTop: 8, opacity: .7 }}>Un producto de Clever Tech Gloval Ideas</div>
                    </div>
                </div>
            </div>
            <div className="main-content fade-in">{children}</div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   DASHBOARD
   ────────────────────────────────────────────── */
const Dashboard = ({ docs, setView, setCurrentDoc, onNewDoc }) => {
    const [tab, setTab] = useState('all');
    const filtered = tab === 'all' ? docs : docs.filter(d => d.status === tab);
    const tabs = [{ id: 'all', label: 'Todos' }, { id: 'pending', label: 'Pendientes' }, { id: 'signed', label: 'Firmados' }, { id: 'expired', label: 'Vencidos' }];
    const handleSign = (doc) => { setCurrentDoc(doc); setView('sign'); };
    const handleWhatsApp = (doc) => {
        try {
            const msg = encodeURIComponent(`Hola, te comparto el link para firmar "${doc.name}": https://firmarapida.cl/firmar/abc${doc.id}23`);
            window.open(`https://wa.me/?text=${msg}`, '_blank');
        } catch (e) {
            console.error('Error opening WhatsApp', e);
        }
    };
    const handleDownload = (doc) => {
        // Simulación de descarga
        window.alert(`Iniciando descarga de: ${doc.name}.pdf`);
    };
    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="section-title">Mis documentos</h1>
                    <p style={{ color: 'var(--gray-400)', marginTop: 4 }}>Gestiona todos tus documentos para firma</p>
                </div>
                <button className="btn btn-primary" onClick={onNewDoc}><Icon name="plus" size={16} />Nuevo documento</button>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16, marginBottom: 32 }}>
                {[
                    { label: 'Total', val: docs.length, color: 'var(--primary)' },
                    { label: 'Pendientes', val: docs.filter(d => d.status === 'pending').length, color: '#F59E0B' },
                    { label: 'Firmados', val: docs.filter(d => d.status === 'signed').length, color: '#00C896' },
                    { label: 'Vencidos', val: docs.filter(d => d.status === 'expired').length, color: '#EF4444' },
                ].map((s, i) => (
                    <div key={i} className="card" style={{ textAlign: 'center', padding: 16 }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.val}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                {/* Tabs */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--gray-100)', paddingBottom: 0 }}>
                    {tabs.map(t => (
                        <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? 'var(--primary)' : 'var(--gray-400)', borderBottom: tab === t.id ? '2px solid var(--primary)' : '2px solid transparent', fontSize: 14, marginBottom: -1, transition: 'all .2s' }}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: 48, color: 'var(--gray-400)' }}>
                        <Icon name="file" size={40} /><br />
                        <p style={{ marginTop: 12 }}>No hay documentos en esta categoría</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table>
                            <thead>
                                <tr>
                                    <th>Documento</th>
                                    <th>Firmantes</th>
                                    <th>Estado</th>
                                    <th>Enviado</th>
                                    <th>Vence</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(doc => (
                                    <tr key={doc.id}>
                                        <td>
                                            <div style={{ fontWeight: 600, color: 'var(--primary)', fontSize: 14 }}>{doc.name}</div>
                                        </td>
                                        <td>{doc.signers.map(s => s.name).join(', ')}</td>
                                        <td><StatusBadge status={doc.status} /></td>
                                        <td style={{ fontSize: 13 }}>{doc.sent}</td>
                                        <td style={{ fontSize: 13 }}>{doc.expires}</td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                                {doc.status === 'pending' && (
                                                    <>
                                                        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => handleSign(doc)} aria-label={`Firmar ${doc.name}`}>
                                                            <Icon name="pen" size={13} />Firmar
                                                        </button>
                                                        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => handleWhatsApp(doc)} aria-label={`Compartir ${doc.name} por WhatsApp`}>
                                                            <Icon name="whatsapp" size={13} />WA
                                                        </button>
                                                        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} aria-label={`Reenviar ${doc.name}`}>
                                                            <Icon name="refresh" size={13} />Reenviar
                                                        </button>
                                                    </>
                                                )}
                                                {doc.status === 'signed' && (
                                                    <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => handleDownload(doc)} aria-label={`Descargar ${doc.name}`}>
                                                        <Icon name="download" size={13} />Descargar
                                                    </button>
                                                )}
                                                <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: 12 }} aria-label={`Eliminar ${doc.name}`}>
                                                    <Icon name="trash" size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Demo note */}
            <div className="otp-demo" style={{ marginTop: 20 }}>
                ℹ️ Modo demo activo · Usuario: empresa@demo.cl · Plan Pro
            </div>
        </div>
    );
};


/* ──────────────────────────────────────────────
   NUEVO DOCUMENTO — WIZARD
   ────────────────────────────────────────────── */
const NewDocWizard = ({ onDone, onCancel, initialTemplate }) => {
    const [step, setStep] = useState(1);
    const [docName, setDocName] = useState(initialTemplate?.name || '');
    const [selectedTpl, setSelectedTpl] = useState(initialTemplate || null);
    const [dragOver, setDragOver] = useState(false);
    const [signers, setSigners] = useState([{ name: '', email: '', phone: '', type: 'simple' }]);
    const [order, setOrder] = useState('simultaneous');
    const [expires, setExpires] = useState('7');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const addSigner = () => setSigners(s => [...s, { name: '', email: '', phone: '', type: 'simple' }]);
    const updSigner = (i, k, v) => setSigners(s => s.map((x, j) => j === i ? { ...x, [k]: v } : x));
    const remSigner = (i) => setSigners(s => s.filter((_, j) => j !== i));

    const validateSigners = () => {
        return signers.every(s => s.name.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email.trim()));
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            await API.sendDocument({ name: docName, signers, order, expires });
            setSent(true);
        } catch (e) {
            window.alert('Error al enviar el documento');
        } finally {
            setLoading(false);
        }
    };

    const stepLabels = ['Documento', 'Firmantes', 'Envío'];

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="section-title">Nuevo documento</h1>
                    <p style={{ color: 'var(--gray-400)', marginTop: 4 }}>Completa los pasos para enviar a firma</p>
                </div>
                <button className="btn btn-ghost" onClick={onCancel}><Icon name="x" size={16} />Cancelar</button>
            </div>

            {/* Stepper */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 36 }}>
                {stepLabels.map((l, i) => {
                    const n = i + 1;
                    const cls = n < step ? 'step-done' : n === step ? 'step-active' : 'step-idle';
                    return (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < stepLabels.length - 1 ? 1 : 'auto' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }} className={cls}>
                                <div className="step-circle">{n < step ? <Icon name="check" size={16} color="#fff" /> : n}</div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: n === step ? 'var(--primary)' : 'var(--gray-400)' }}>{l}</span>
                            </div>
                            {i < stepLabels.length - 1 && <div style={{ flex: 1, height: 2, background: n < step ? 'var(--green)' : 'var(--gray-200)', margin: '0 8px', marginBottom: 22 }} />}
                        </div>
                    );
                })}
            </div>

            {/* PASO 1 */}
            {step === 1 && (
                <div className="card fade-in">
                    <h2 style={{ fontWeight: 700, marginBottom: 20 }}>¿Qué quieres firmar?</h2>
                    <p className="label">Selecciona una plantilla</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: 12, marginBottom: 28 }}>
                        {TEMPLATES.map(t => (
                            <div key={t.id} onClick={() => { setSelectedTpl(t); setDocName(t.name); }} style={{ padding: 16, border: `2px solid ${selectedTpl?.id === t.id ? 'var(--primary)' : 'var(--gray-200)'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: selectedTpl?.id === t.id ? 'rgba(27,42,107,.06)' : 'var(--white)', transition: 'all .2s' }}>
                                <div style={{ fontSize: 28, marginBottom: 8 }}>{t.icon}</div>
                                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary)' }}>{t.name}</div>
                            </div>
                        ))}
                    </div>
                    <p className="label">O sube tu propio documento</p>
                    <div onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setDocName(f.name); }}
                        style={{ border: `2px dashed ${dragOver ? 'var(--primary)' : 'var(--gray-200)'}`, borderRadius: 12, padding: 40, textAlign: 'center', background: dragOver ? 'rgba(27,42,107,.04)' : 'var(--gray-50)', cursor: 'pointer', transition: 'all .2s' }}>
                        <Icon name="upload" size={32} color="var(--gray-400)" />
                        <p style={{ color: 'var(--gray-400)', marginTop: 12 }}>Arrastra tu PDF, DOC o DOCX aquí</p>
                        <p style={{ color: 'var(--gray-400)', fontSize: 12 }}>o haz clic para buscar</p>
                    </div>
                    {docName && (
                        <div style={{ margin: '16px 0' }}>
                            <label className="label">Nombre del documento</label>
                            <input className="input" value={docName} onChange={e => setDocName(e.target.value)} />
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button className="btn btn-primary" disabled={!docName} onClick={() => setStep(2)} style={{ opacity: docName ? 1 : .5 }}>
                            Continuar <Icon name="chevronRight" size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 2 */}
            {step === 2 && (
                <div className="card fade-in">
                    <h2 style={{ fontWeight: 700, marginBottom: 20 }}>Configurar firmantes</h2>
                    {signers.map((s, i) => (
                        <div key={i} style={{ padding: 20, border: '1px solid var(--gray-200)', borderRadius: 12, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                <span style={{ fontWeight: 600, color: 'var(--primary)' }}>Firmante {i + 1}</span>
                                {signers.length > 1 && <button className="btn btn-danger" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => remSigner(i)}><Icon name="x" size={12} />Quitar</button>}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                                <div><label className="label">Nombre completo</label><input className="input" placeholder="Juan Pérez" value={s.name} onChange={e => updSigner(i, 'name', e.target.value)} /></div>
                                <div><label className="label">Correo electrónico</label><input className="input" placeholder="juan@correo.cl" value={s.email} onChange={e => updSigner(i, 'email', e.target.value)} /></div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div><label className="label">Teléfono (opcional)</label><input className="input" placeholder="+56 9 1234 5678" value={s.phone} onChange={e => updSigner(i, 'phone', e.target.value)} /></div>
                                <div>
                                    <label className="label">Tipo de firma</label>
                                    <select className="input" value={s.type} onChange={e => updSigner(i, 'type', e.target.value)}>
                                        <option value="simple">Simple (OTP por email)</option>
                                        <option value="advanced">Avanzada (OTP + PIN)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="btn btn-ghost" onClick={addSigner} style={{ marginBottom: 20 }}><Icon name="plus" size={14} />Agregar firmante</button>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label className="label">Orden de firma</label>
                            <select className="input" value={order} onChange={e => setOrder(e.target.value)}>
                                <option value="simultaneous">Simultáneo</option>
                                <option value="sequential">Secuencial</option>
                            </select>
                        </div>
                        <div>
                            <label className="label">Vence en</label>
                            <select className="input" value={expires} onChange={e => setExpires(e.target.value)}>
                                <option value="1">24 horas</option>
                                <option value="2">48 horas</option>
                                <option value="7">7 días</option>
                                <option value="14">14 días</option>
                                <option value="30">30 días</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28 }}>
                        <button className="btn btn-ghost" onClick={() => setStep(1)}><Icon name="chevronRight" size={16} style={{ transform: 'rotate(180deg)' }} /> Atrás</button>
                        <button className="btn btn-primary" disabled={!validateSigners()} onClick={() => setStep(3)} style={{ opacity: validateSigners() ? 1 : .5 }}>
                            Continuar <Icon name="chevronRight" size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 3 — ENVÍO */}
            {step === 3 && !sent && (
                <div className="card fade-in">
                    <h2 style={{ fontWeight: 700, marginBottom: 8 }}>Revisar y enviar</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 20 }}>Confirma los detalles antes de enviar</p>
                    <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}><Icon name="file" size={16} color="var(--primary)" /><span style={{ fontWeight: 600 }}>{docName}</span></div>
                        {signers.map((s, i) => (
                            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: 'var(--gray-600)', marginBottom: 4 }}>
                                <Icon name="users" size={14} />{s.name} · {s.email} · Firma {s.type === 'simple' ? 'Simple' : 'Avanzada'}
                            </div>
                        ))}
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14, color: 'var(--gray-600)', marginTop: 4 }}>
                            <Icon name="clock" size={14} />Vence en {expires} día{expires !== '1' ? 's' : ''}
                        </div>
                    </div>
                    {/* Preview de email */}
                    <div style={{ border: '2px solid var(--gray-200)', borderRadius: 12, padding: 20, marginBottom: 20 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 12 }}>Vista previa del email</div>
                        <div style={{ background: 'var(--white)', borderRadius: 8, padding: 16, fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)' }}>
                            <p>Hola <strong>{signers[0].name || '[Firmante]'}</strong>,</p>
                            <p>Te invitamos a firmar el documento <strong>{docName}</strong>.</p>
                            <p>Tu código OTP es: <strong style={{ background: '#FEF3C7', padding: '2px 8px', borderRadius: 4, color: '#92400E' }}>847293</strong></p>
                            <p>Haz clic aquí para firmar: <span style={{ color: 'var(--primary)', textDecoration: 'underline' }}>firmarapida.cl/firmar/abc123</span></p>
                        </div>
                    </div>
                    <div className="otp-demo" style={{ marginBottom: 20 }}>
                        📋 Link de WhatsApp disponible · <strong>Código de prueba: 847293</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <button className="btn btn-ghost" onClick={() => setStep(2)} disabled={loading}>← Atrás</button>
                        <button className="btn btn-green" onClick={handleSend} disabled={loading}>
                            {loading ? <><Icon name="refresh" size={16} className="shimmer" /> Enviando...</> : <><Icon name="send" size={16} />Enviar a firmantes</>}
                        </button>
                    </div>
                </div>
            )}

            {/* ENVIADO */}
            {step === 3 && sent && (
                <div className="card fade-in" style={{ textAlign: 'center', padding: 48 }}>
                    <div style={{ width: 80, height: 80, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Icon name="check" size={36} color="#16A34A" />
                    </div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: 8 }}>¡Documento enviado! 🎉</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 8 }}>Los firmantes recibirán un email con el link único e intransferible.</p>
                    <div className="otp-demo" style={{ display: 'inline-block', marginBottom: 28 }}>Código de prueba: <strong>847293</strong></div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button className="btn btn-ghost" onClick={() => { const msg = encodeURIComponent(`Hola, firma el documento "${docName}" aquí: https://firmarapida.cl/firmar/abc123`); window.open(`https://wa.me/?text=${msg}`, '_blank'); }}>
                            <Icon name="whatsapp" size={16} />Compartir por WhatsApp
                        </button>
                        <button className="btn btn-primary" onClick={onDone}><Icon name="home" size={16} />Ir al dashboard</button>
                    </div>
                </div>
            )}
        </div>
    );
};

/* ──────────────────────────────────────────────
   VISTA DE FIRMA (pública)
   ────────────────────────────────────────────── */
const SignView = ({ doc, onBack }) => {
    const [otpInput, setOtpInput] = useState('');
    const [otpOk, setOtpOk] = useState(false);
    const [signed, setSigned] = useState(false);
    const [accepted, setAccepted] = useState(false);
    const [sigMode, setSigMode] = useState('draw');
    const [typedName, setTypedName] = useState('');
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
    const [hasDrawing, setHasDrawing] = useState(false);
    const DEMO_OTP = '847293';

    // Fix DPR y Resize para Canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            const ctx = canvas.getContext('2d');
            ctx.scale(dpr, dpr);
        };

        resize();
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    const getPos = (e) => {
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };

    const startDraw = (e) => {
        setDrawing(true);
        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const draw = (e) => {
        if (!drawing) return;
        if (e.touches) e.preventDefault(); // Evitar scroll en mobile mientras se firma
        const { x, y } = getPos(e);
        const ctx = canvasRef.current.getContext('2d');
        ctx.lineTo(x, y);
        ctx.strokeStyle = '#1B2A6B';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.stroke();
        setHasDrawing(true);
    };
    const stopDraw = () => setDrawing(false);
    const clearCanvas = () => {
        const c = canvasRef.current; if (!c) return;
        c.getContext('2d').clearRect(0, 0, c.width, c.height);
        setHasDrawing(false);
    };

    if (signed) {
        const now = new Date();
        const ts = `${now.toLocaleDateString('es-CL')} ${now.toLocaleTimeString('es-CL')}`;
        const docNm = doc?.name || 'Contrato de Servicios';
        return (
            <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div className="card fade-in" style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, background: '#DCFCE7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <Icon name="check" size={36} color="#16A34A" />
                    </div>
                    <div className="badge badge-green" style={{ fontSize: 15, padding: '8px 20px', marginBottom: 16 }}>Documento firmado digitalmente ✓</div>
                    <h2 style={{ marginBottom: 8, color: 'var(--primary)' }}>{docNm}</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 24 }}>Recibirás una copia del PDF por correo electrónico.</p>
                    <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 20, textAlign: 'left', marginBottom: 24 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 12 }}>Audit Trail</div>
                        {[
                            ['Firmante', doc?.signers?.[0]?.name || 'Juan Pérez'],
                            ['Fecha y hora', ts],
                            ['IP simulada', '201.148.82.31'],
                            ['OTP usado', DEMO_OTP],
                            ['Hash documento', 'SHA-256: a3f2...d9c1'],
                            ['Validez legal', 'Ley 19.799 – Chile'],
                        ].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--gray-100)', fontSize: 13 }}>
                                <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>{k}</span>
                                <span style={{ fontWeight: 600 }}>{v}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                        <button className="btn btn-green"><Icon name="download" size={16} />Descargar PDF sellado</button>
                        {onBack && <button className="btn btn-ghost" onClick={onBack}><Icon name="home" size={16} />Dashboard</button>}
                    </div>
                </div>
            </div>
        );
    }

    if (!otpOk) {
        return (
            <div style={{ minHeight: '100vh', background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div className="card fade-in" style={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#1B2A6B,#00C896)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <Icon name="lock" size={24} color="#fff" />
                    </div>
                    <h2 style={{ color: 'var(--primary)', marginBottom: 4 }}>FirmaRápida ⚡</h2>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 20 }}>Ingresa el código OTP enviado a tu correo</p>
                    <div className="otp-demo" style={{ marginBottom: 20 }}>📧 Código de prueba: <strong>847293</strong></div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>{doc?.name || 'Contrato de Servicios – Juan Pérez'}</p>
                    <label className="label" style={{ textAlign: 'left', marginTop: 16 }}>Código OTP (6 dígitos)</label>
                    <input className="input" placeholder="000000" maxLength={6} value={otpInput} onChange={e => setOtpInput(e.target.value)} style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8, marginBottom: 12 }} />
                    {otpInput.length === 6 && otpInput !== DEMO_OTP && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 8 }}>Código incorrecto. Inténtalo de nuevo.</p>}
                    <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 4 }} onClick={() => { if (otpInput === DEMO_OTP) setOtpOk(true); }}>
                        <Icon name="lock" size={16} />Acceder al documento
                    </button>
                    {onBack && <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} onClick={onBack}>← Volver</button>}
                </div>
            </div>
        );
    }

    const canSign = accepted && (sigMode === 'draw' ? hasDrawing : typedName.length > 2);
    return (
        <div style={{ minHeight: '100vh', background: 'var(--gray-50)', padding: 24 }}>
            <div style={{ maxWidth: 700, margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                    <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--primary)' }}>FirmaRápida ⚡</span>
                    <div className="badge badge-green" style={{ margin: '8px auto 0', display: 'inline-flex' }}>✓ Identidad verificada</div>
                </div>
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{doc?.name || 'Contrato de Servicios'}</h3>
                    <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>Lee el documento completo antes de firmar</p>
                    <div style={{ marginTop: 16, background: 'var(--gray-50)', borderRadius: 8, padding: 24, minHeight: 280, border: '1px solid var(--gray-200)' }}>
                        <p style={{ fontWeight: 700, marginBottom: 8 }}>CONTRATO DE PRESTACIÓN DE SERVICIOS</p>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 12 }}>En Santiago de Chile, a 28 de febrero de 2026, comparecen las partes que se indican a continuación, quienes acuerdan celebrar el presente contrato de prestación de servicios, en adelante "el Contrato".</p>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 12 }}><strong>PRIMERO: PRESTADOR DE SERVICIOS.</strong> Juan Pérez, RUT 12.345.678-9, en adelante "el Prestador", con domicilio en calle Providencia 1234, Santiago.</p>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 12 }}><strong>SEGUNDO: OBJETO.</strong> El Prestador se compromete a realizar labores de consultoría tecnológica para el Cliente, con las siguientes características: análisis de requerimientos, diseño de solución y desarrollo de prototipo funcional.</p>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)', marginBottom: 12 }}><strong>TERCERO: VALOR.</strong> El Cliente pagará la suma de $850.000 (ochocientos cincuenta mil pesos) mensuales, pagaderos los días 5 de cada mes.</p>
                        <p style={{ fontSize: 13, lineHeight: 1.8, color: 'var(--gray-600)' }}><strong>CUARTO: VIGENCIA.</strong> El presente contrato tendrá vigencia de 6 meses, con inicio el 1 de marzo de 2026.</p>
                        <div style={{ marginTop: 20, padding: 12, background: '#DBEAFE', borderRadius: 8, fontSize: 12, color: '#1e40af' }}>
                            🔐 Este documento tiene validez legal en Chile según Ley 19.799 sobre Firma Electrónica.
                        </div>
                    </div>
                </div>
                <div className="card" style={{ marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Tu firma</h3>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                        {['draw', 'type'].map(m => (
                            <button key={m} className={`btn ${sigMode === m ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setSigMode(m)}>
                                <Icon name={m === 'draw' ? 'pen' : 'edit'} size={14} />{m === 'draw' ? 'Dibujar' : 'Escribir nombre'}
                            </button>
                        ))}
                    </div>
                    {sigMode === 'draw' ? (
                        <div className="canvas-wrap" style={{ height: 160 }}>
                            <canvas ref={canvasRef} width={640} height={160} style={{ width: '100%', height: '100%', touchAction: 'none', cursor: 'crosshair' }}
                                onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
                                onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={stopDraw} />
                            {!hasDrawing && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', color: 'var(--gray-400)', fontSize: 14, pointerEvents: 'none' }}>Dibuja tu firma aquí</div>}
                            <button className="btn btn-ghost" style={{ position: 'absolute', bottom: 8, right: 8, fontSize: 12 }} onClick={clearCanvas}><Icon name="x" size={12} />Limpiar</button>
                        </div>
                    ) : (
                        <div>
                            <input className="input" placeholder="Escribe tu nombre completo" value={typedName} onChange={e => setTypedName(e.target.value)} />
                            {typedName && <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: 32, color: 'var(--primary)', padding: '16px 0', textAlign: 'center' }}>{typedName}</div>}
                        </div>
                    )}
                </div>
                <div className="card">
                    <label style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', marginBottom: 20 }}>
                        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--green)', width: 16, height: 16 }} />
                        <span style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.6 }}>
                            Declaro haber leído el documento completo y acepto su contenido, entendiendo que esta firma tiene validez legal según la <strong>Ley 19.799</strong> de la República de Chile sobre documentos y firma electrónica.
                        </span>
                    </label>
                    <button className="btn btn-green" style={{ width: '100%', justifyContent: 'center', fontSize: 16, padding: '14px', opacity: canSign ? 1 : .5 }} disabled={!canSign} onClick={() => setSigned(true)}>
                        <Icon name="pen" size={18} />Firmar documento
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   PLANTILLAS
   ────────────────────────────────────────────── */
const TemplatesView = ({ onUse }) => {
    const [selected, setSelected] = useState(null);
    return (
        <div className="fade-in">
            <div style={{ marginBottom: 32 }}>
                <h1 className="section-title">Plantillas</h1>
                <p style={{ color: 'var(--gray-400)', marginTop: 4 }}>Elige una plantilla lista para usar y personalízala</p>
            </div>
            {selected ? (
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 700 }}>{selected.icon} {selected.name}</h2>
                        <button className="btn btn-ghost" onClick={() => setSelected(null)}><Icon name="x" size={14} />Cerrar</button>
                    </div>
                    <p style={{ color: 'var(--gray-400)', marginBottom: 20, fontSize: 13 }}>Completa los campos para personalizar el documento</p>
                    {selected.fields.map(f => (
                        <div key={f} style={{ marginBottom: 12 }}>
                            <label className="label">{f}</label>
                            <input className="input" placeholder={`[${f}]`} />
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                        <button className="btn btn-primary" onClick={() => onUse(selected)}><Icon name="send" size={16} />Usar esta plantilla</button>
                        <button className="btn btn-ghost" onClick={() => setSelected(null)}>Cancelar</button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
                    {TEMPLATES.map(t => (
                        <div key={t.id} className="card" style={{ cursor: 'pointer', transition: 'transform .2s', display: 'flex', flexDirection: 'column' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                            <div style={{ fontSize: 36, marginBottom: 12 }}>{t.icon}</div>
                            <h3 style={{ fontWeight: 700, marginBottom: 4, color: 'var(--primary)' }}>{t.name}</h3>
                            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 16, flex: 1 }}>{t.fields.length} campos personalizables</p>
                            <button className="btn btn-outline" style={{ justifyContent: 'center' }} onClick={() => setSelected(t)}>
                                <Icon name="edit" size={14} />Usar plantilla
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

/* ──────────────────────────────────────────────
   COLABORADORES (RRHH)
   ────────────────────────────────────────────── */
const CollaboratorsView = () => {
    const [selected, setSelected] = useState(null);
    const [bulkSel, setBulkSel] = useState([]);
    const statusColor = { signed: 'var(--green)', pending: '#F59E0B', none: 'var(--gray-200)' };
    const toggle = (id) => setBulkSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <div>
                    <h1 className="section-title">Módulo RRHH</h1>
                    <p style={{ color: 'var(--gray-400)', marginTop: 4 }}>Gestiona documentos de tus colaboradores</p>
                </div>
                {bulkSel.length > 0 && (
                    <button className="btn btn-green"><Icon name="send" size={16} />Envío masivo ({bulkSel.length})</button>
                )}
            </div>
            {selected ? (
                <div className="card fade-in">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                        <h2 style={{ fontWeight: 700 }}>{selected.name} <span style={{ fontSize: 14, color: 'var(--gray-400)', fontWeight: 400 }}>— {selected.role}</span></h2>
                        <button className="btn btn-ghost" onClick={() => setSelected(null)}><Icon name="x" size={14} />Cerrar</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                        {selected.docs.map((d, i) => (
                            <div key={i} className="card" style={{ background: 'var(--gray-50)', padding: 16 }}>
                                <Icon name="file" size={20} color="var(--primary)" />
                                <div style={{ fontWeight: 600, marginTop: 8, marginBottom: 4 }}>{d.type}</div>
                                <StatusBadge status={d.status === 'none' ? 'draft' : d.status} />
                                {d.status !== 'signed' && <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: 12, fontSize: 12 }}><Icon name="send" size={12} />Enviar</button>}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="card">
                    <table>
                        <thead>
                            <tr>
                                <th style={{ width: 40 }}><input type="checkbox" onChange={e => setBulkSel(e.target.checked ? COLLABORATORS.map(c => c.id) : [])} /></th>
                                <th>Colaborador</th>
                                <th>Cargo</th>
                                <th>Contrato</th>
                                <th>Anexo</th>
                                <th>Finiquito</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {COLLABORATORS.map(c => (
                                <tr key={c.id}>
                                    <td><input type="checkbox" checked={bulkSel.includes(c.id)} onChange={() => toggle(c.id)} /></td>
                                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.name}</td>
                                    <td>{c.role}</td>
                                    {c.docs.map((d, i) => (
                                        <td key={i}><span style={{ width: 12, height: 12, borderRadius: '50%', background: statusColor[d.status], display: 'inline-block', marginRight: 6 }} /><span style={{ fontSize: 13 }}>{d.status === 'signed' ? 'Firmado' : d.status === 'pending' ? 'Pendiente' : '—'}</span></td>
                                    ))}
                                    <td>
                                        <button className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: 12 }} onClick={() => setSelected(c)}><Icon name="folder" size={13} />Ver carpeta</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

/* ──────────────────────────────────────────────
   SETTINGS
   ────────────────────────────────────────────── */
const SettingsView = () => (
    <div className="fade-in">
        <h1 className="section-title" style={{ marginBottom: 24 }}>Configuración</h1>
        <div style={{ display: 'grid', gap: 20, maxWidth: 600 }}>
            <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Cuenta</h3>
                <div style={{ marginBottom: 12 }}><label className="label">Nombre empresa</label><input className="input" defaultValue="Empresa Demo" /></div>
                <div style={{ marginBottom: 12 }}><label className="label">Email</label><input className="input" defaultValue="empresa@demo.cl" /></div>
                <div style={{ marginBottom: 20 }}><label className="label">RUT (opcional)</label><input className="input" placeholder="76.123.456-7" /></div>
                <button className="btn btn-primary"><Icon name="check" size={14} />Guardar cambios</button>
            </div>
            <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Plan actual</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: 'var(--gray-50)', borderRadius: 12 }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Plan Pro</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-400)' }}>Documentos ilimitados · $9.990/mes</div>
                    </div>
                    <span className="badge badge-green">Activo</span>
                </div>
            </div>
        </div>
    </div>
);

/* ──────────────────────────────────────────────
   ONBOARDING TOOLTIP
   ────────────────────────────────────────────── */
const OnboardingTooltip = ({ onClose }) => {
    const [step, setStep] = useState(0);
    const tips = [
        { icon: 'plus', title: 'Crea tu primer documento', desc: 'Haz clic en "+ Nuevo documento" para subir un archivo o elegir una plantilla.' },
        { icon: 'users', title: 'Configura los firmantes', desc: 'Agrega los datos de quien debe firmar. No necesitan crear cuenta.' },
        { icon: 'check', title: 'Firma en segundos', desc: 'El firmante recibe un código OTP por email y firma desde cualquier dispositivo.' },
    ];
    const t = tips[step];
    return (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000, maxWidth: 320 }}>
            <div className="card" style={{ border: '2px solid var(--primary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase' }}>Bienvenido/a · {step + 1}/3</span>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray-400)' }}><Icon name="x" size={14} /></button>
                </div>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ width: 40, height: 40, minWidth: 40, background: 'linear-gradient(135deg,#1B2A6B,#00C896)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={t.icon} size={18} color="#fff" />
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--gray-400)', lineHeight: 1.6 }}>{t.desc}</div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {step < 2 ? <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setStep(s => s + 1)}>Siguiente →</button>
                        : <button className="btn btn-green" style={{ padding: '8px 16px', fontSize: 13 }} onClick={onClose}>¡Entendido! ✓</button>}
                </div>
            </div>
        </div>
    );
};

/* ──────────────────────────────────────────────
   APP PRINCIPAL
   ────────────────────────────────────────────── */
export default function FirmaRapida() {
    const [dark, setDark] = useState(() => {
        try { return localStorage.getItem('fr_theme') === 'dark' || window.matchMedia('(prefers-color-scheme: dark)').matches; } catch { return false; }
    });
    const [auth, setAuth] = useState(false);
    const [isDemo, setIsDemo] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [view, setView] = useState('dashboard');
    const [docs, setDocs] = useState(DEMO_DOCS);
    const [currentDoc, setCurrentDoc] = useState(null);
    const [showOnboarding, setShowOnboarding] = useState(true);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        const el = document.documentElement;
        dark ? el.classList.add('dark') : el.classList.remove('dark');
        try { localStorage.setItem('fr_theme', dark ? 'dark' : 'light'); } catch { }
    }, [dark]);

    // Listener de Autenticación Supabase
    useEffect(() => {
        if (!supabase) return;

        // Cargar sesión inicial
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setAuth(true);
                setView('dashboard');
                loadDocs();
            }
        });

        // Escuchar cambios de sesión
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuth(true);
                setView('dashboard');
                loadDocs();
            } else {
                setAuth(false);
                setView('landing');
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Page Title Dinámico
    useEffect(() => {
        const titles = {
            landing: 'FirmaRápida ⚡ Firma documentos en segundos',
            dashboard: 'Dashboard | FirmaRápida',
            newdoc: 'Nuevo Documento | FirmaRápida',
            sign: 'Firmar Documento | FirmaRápida',
            templates: 'Plantillas | FirmaRápida',
            collaborators: 'Colaboradores | FirmaRápida',
            settings: 'Configuración | FirmaRápida'
        };
        const currentView = !auth ? 'landing' : view;
        document.title = titles[currentView] || 'FirmaRápida ⚡';
    }, [view, auth]);

    const showToast = (message, type = 'success') => setToast({ message, type });

    const handleLogin = async (email, pass) => {
        try {
            const data = await API.login(email, pass);
            setAuth(true);
            setIsDemo(false);
            setView('dashboard');
            showToast('¡Bienvenido de nuevo!');
            loadDocs();
        } catch (e) {
            showToast(e.message, 'error');
            throw e; // Relanzar para el modal
        }
    };

    const handleStartDemo = () => {
        setAuth(true);
        setIsDemo(true);
        setView('dashboard');
        setDocs(DEMO_DOCS);
        showToast('Modo Prueba activado', 'info');
    };

    const handleLogout = async () => {
        await API.logout();
        setAuth(false);
        setIsDemo(false);
        setView('landing');
        showToast('Sesión cerrada correctamente', 'info');
    };

    const loadDocs = async () => {
        if (isDemo) {
            setDocs(DEMO_DOCS);
            return;
        }
        try {
            const data = await API.getDocuments();
            setDocs(data);
        } catch (e) {
            showToast('Error al cargar documentos', 'error');
        }
    };

    const handleNewDoc = () => setView('newdoc');
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const handleUseTemplate = (tpl) => { setSelectedTemplate(tpl); setView('newdoc'); };
    const handleDocDone = () => {
        loadDocs();
        setView('dashboard');
        showToast('Documento enviado correctamente');
    };

    return (
        <>
            <style>{css}</style>
            {!auth ? (
                <LandingPage onShowLogin={() => setShowLogin(true)} onStartDemo={handleStartDemo} dark={dark} setDark={setDark} />
            ) : (
                <AppShell view={view} setView={setView} dark={dark} setDark={setDark} onLogout={handleLogout}>
                    {view === 'dashboard' && <Dashboard docs={docs} setView={setView} setCurrentDoc={setCurrentDoc} onNewDoc={handleNewDoc} />}
                    {view === 'newdoc' && <NewDocWizard initialTemplate={selectedTemplate} onDone={handleDocDone} onCancel={() => { setSelectedTemplate(null); setView('dashboard'); }} />}
                    {view === 'sign' && <SignView doc={currentDoc} onBack={() => setView('dashboard')} />}
                    {view === 'templates' && <TemplatesView onUse={handleUseTemplate} />}
                    {view === 'collaborators' && <CollaboratorsView />}
                    {view === 'settings' && <SettingsView />}
                    {showOnboarding && view === 'dashboard' && <OnboardingTooltip onClose={() => setShowOnboarding(false)} />}
                </AppShell>
            )}
            {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
    );
}

