/* ============================================================
   DATANA — Configuração de contato / integração
   👉 Edite aqui: troque FORM_ENDPOINT pela URL do seu servidor.
   Enquanto estiver vazio (''), o formulário só mostra a confirmação na tela.
   ============================================================ */
window.DATANA = {
  email: 'contato@datana.com.br',
  // Ex.: 'https://api.datana.com.br/leads'  (recebe POST JSON)
  FORM_ENDPOINT: '',
};

/* Datana — ícones geométricos simples (stroke), nada complexo */
const I = ({ d, size = 22, sw = 1.6, fill = "none", children, vb = 24 }) =>
  <svg width={size} height={size} viewBox={`0 0 ${vb} ${vb}`} fill={fill}
    stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>;

const Icon = {
  // automação — setas em ciclo
  Automate: (p) => <I {...p}><path d="M4 9a8 8 0 0 1 13-3l3 2" /><path d="M20 6v4h-4" /><path d="M20 15a8 8 0 0 1-13 3l-3-2" /><path d="M4 18v-4h4" /></I>,
  // IA — nó central + ramos
  Ai: (p) => <I {...p}><circle cx="12" cy="12" r="2.4" /><circle cx="5" cy="6" r="1.6" /><circle cx="19" cy="6" r="1.6" /><circle cx="5" cy="18" r="1.6" /><circle cx="19" cy="18" r="1.6" /><path d="M6.4 7 10 10.4M17.6 7 14 10.4M6.4 17 10 13.6M17.6 17 14 13.6" /></I>,
  // dados — pilha de discos
  Data: (p) => <I {...p}><ellipse cx="12" cy="6" rx="7" ry="2.6" /><path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6" /><path d="M5 12v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6v-6" /></I>,
  // dashboard — barras
  Chart: (p) => <I {...p}><path d="M4 20V10M9 20V4M14 20v-7M19 20V8" /></I>,
  // fluxo
  Flow: (p) => <I {...p}><rect x="3" y="4" width="6" height="5" rx="1.2" /><rect x="15" y="15" width="6" height="5" rx="1.2" /><path d="M9 6.5h4a2 2 0 0 1 2 2v9" /></I>,
  // escudo / segurança
  Shield: (p) => <I {...p}><path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" /><path d="M9 12l2 2 4-4" /></I>,
  Bolt: (p) => <I {...p}><path d="M13 3 5 13h6l-1 8 8-10h-6z" /></I>,
  Clock: (p) => <I {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></I>,
  Check: (p) => <I {...p}><path d="M5 12.5 10 17 19 6.5" /></I>,
  Plug: (p) => <I {...p}><path d="M9 3v5M15 3v5" /><path d="M6 8h12v3a6 6 0 0 1-12 0z" /><path d="M12 17v4" /></I>,
  Arrow: (p) => <I {...p}><path d="M5 12h13M13 6l6 6-6 6" /></I>,
  ArrowUR: (p) => <I {...p}><path d="M7 17 17 7M9 7h8v8" /></I>,
  Spark: (p) => <I {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></I>,
  Doc: (p) => <I {...p}><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4" /><path d="M10 13h6M10 17h6" /></I>,
  Mail: (p) => <I {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></I>,
  Send: (p) => <I {...p}><path d="M5 12 20 5l-5 15-3-6z" /><path d="m12 14 8-9" /></I>,
  X: (p) => <I {...p}><path d="M5 5l14 14M19 5 5 19" /></I>,
  In: (p) => <I {...p}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 10v7M7 7v0M11 17v-4a2 2 0 0 1 4 0v4" /></I>,
  Git: (p) => <I {...p}><circle cx="7" cy="6" r="2" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="9" r="2" /><path d="M7 8v8M17 11c0 3-4 2-4 5" /></I>,
};

window.Icon = Icon;
