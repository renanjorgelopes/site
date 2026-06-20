/* Datana — Planos + Contato (form validado) */
const { useState: useStateP } = React;

/* ===================== PLANOS ===================== */
const PLANS = [
  {
    tag: 'Início', name: 'Diagnóstico', custom: 'Grátis',
    desc: 'Para entender onde estão os gargalos antes de automatizar.',
    feats: ['Mapeamento de até 3 processos', 'Relatório de oportunidades', '1 dashboard de amostra', 'Reunião de resultados'],
    cta: 'Começar diagnóstico', feat: false,
  },
  {
    tag: 'Mais popular', name: 'Operação', custom: 'Sob consulta', pop: true,
    desc: 'A operação de dados completa, rodando e evoluindo todo mês.',
    feats: ['Automações sob medida', 'Copiloto de dados', 'Dashboards ilimitados', 'Base de dados unificada', 'Suporte prioritário'],
    cta: 'Falar com vendas', feat: true,
  },
  {
    tag: 'Escala', name: 'Enterprise', custom: 'Sob medida',
    desc: 'Para operações complexas, múltiplas áreas e governança.',
    feats: ['Automações ilimitadas', 'Modelos de IA dedicados', 'Integrações on-premise', 'SLA e segurança avançada', 'Squad dedicado'],
    cta: 'Falar com especialista', feat: false,
  },
];
function Pricing() {
  return (
    <section className="sec-pad wrap" id="planos">
      <div className="sec-head reveal">
        <span className="eyebrow">Planos</span>
        <h2 className="h-lg">Cada empresa é única.<br />O plano também é.</h2>
        <p className="lede">Montamos o escopo a partir do seu diagnóstico — você paga pelo que faz sentido para o seu negócio, sem pacote engessado.</p>
      </div>
      <div className="plans">
        {PLANS.map((p, i) => (
          <article className={'card bracket plan reveal' + (p.feat ? ' feat' : '')} key={i} style={{ transitionDelay: (i * 70) + 'ms' }}>
            <div className="plan-tag">
              <span>{p.tag}</span>
              {p.pop && <span className="pop">Popular</span>}
            </div>
            <h3>{p.name}</h3>
            <div className="pr">
              <span className="amt">{p.custom}</span>
            </div>
            <p className="desc">{p.desc}</p>
            <ul className="ticks">{p.feats.map((f, j) => <li key={j}>{f}</li>)}</ul>
            <a href="#contato" className={'btn ' + (p.feat ? 'btn-primary' : 'btn-soft')} style={{ marginTop: 'auto' }}
              onClick={(e) => { e.preventDefault(); goSection('#contato'); }}>
              {p.cta} <Icon.Arrow size={15} />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ===================== CONTATO ===================== */
function Contact() {
  const [f, setF] = useStateP({ nome: '', email: '', empresa: '', area: 'Financeiro', msg: '' });
  const [err, setErr] = useStateP({});
  const [sent, setSent] = useStateP(false);
  const [sending, setSending] = useStateP(false);
  const [sendErr, setSendErr] = useStateP('');
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErr(e => ({ ...e, [k]: false })); };
  const submit = async (e) => {
    e.preventDefault();
    const er = {};
    if (!f.nome.trim()) er.nome = true;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) er.email = true;
    if (!f.empresa.trim()) er.empresa = true;
    setErr(er);
    if (Object.keys(er).length > 0) return;

    const endpoint = (window.DATANA && window.DATANA.FORM_ENDPOINT) || '';
    setSendErr('');
    // Sem endpoint configurado: apenas confirma na tela (modo demonstração).
    if (!endpoint) { setSent(true); return; }
    try {
      setSending(true);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, origem: 'site-datana', enviadoEm: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error('status ' + res.status);
      setSent(true);
    } catch (err) {
      setSendErr('Não foi possível enviar agora. Tente novamente ou escreva para ' + ((window.DATANA && window.DATANA.email) || 'contato@datana.com.br') + '.');
    } finally {
      setSending(false);
    }
  };
  const feats = [
    ['Clock', 'Resposta em até 1 dia útil'],
    ['Shield', 'Seus dados ficam protegidos e sob NDA'],
    ['Bolt', 'Diagnóstico inicial sem custo'],
  ];
  return (
    <section className="sec-pad wrap" id="contato">
      <div className="sec-head reveal">
        <span className="eyebrow">Vamos conversar</span>
        <h2 className="h-lg">Conte seu maior gargalo.<br />A gente mostra o caminho.</h2>
      </div>
      <div className="contact-card reveal">
        <div className="contact-left">
          <h2>Diagnóstico gratuito de dados & automação</h2>
          <p className="lede">Em uma conversa de 30 minutos, identificamos onde sua empresa perde tempo e dinheiro — e o que dá para automatizar primeiro.</p>
          <div className="contact-feats">
            {feats.map(([ic, t], i) => { const Ic = Icon[ic]; return (
              <div className="cf" key={i}><span className="cfi"><Ic size={18} /></span>{t}</div>
            ); })}
          </div>
        </div>
        <div className="contact-right">
          {sent ? (
            <div className="form-ok">
              <div className="ok-ic"><Icon.Check size={28} /></div>
              <h3 className="h-md">Recebemos, {f.nome.split(' ')[0]}!</h3>
              <p className="lede" style={{ marginTop: 12 }}>Nossa equipe vai analisar o contexto da <b style={{ color: 'var(--text)' }}>{f.empresa}</b> e responder em até 1 dia útil no e-mail informado.</p>
              <button className="btn btn-soft" style={{ marginTop: 22 }} onClick={() => { setSent(false); setF({ nome: '', email: '', empresa: '', area: 'Financeiro', msg: '' }); }}>Enviar outro</button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <div className={'field' + (err.nome ? ' err' : '')}>
                <label>Nome</label>
                <input value={f.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome" />
                <span className="msg-err">Informe seu nome</span>
              </div>
              <div className={'field' + (err.email ? ' err' : '')}>
                <label>E-mail corporativo</label>
                <input value={f.email} onChange={e => set('email', e.target.value)} placeholder="voce@empresa.com.br" />
                <span className="msg-err">E-mail inválido</span>
              </div>
              <div className={'field' + (err.empresa ? ' err' : '')}>
                <label>Empresa</label>
                <input value={f.empresa} onChange={e => set('empresa', e.target.value)} placeholder="Nome da empresa" />
                <span className="msg-err">Informe a empresa</span>
              </div>
              <div className="field">
                <label>Área com maior gargalo</label>
                <select value={f.area} onChange={e => set('area', e.target.value)}>
                  {['Financeiro', 'Comercial / Vendas', 'Operações', 'Marketing', 'Diretoria', 'Outra'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label>Conte rapidamente seu desafio <span style={{ color: 'var(--faint)' }}>(opcional)</span></label>
                <textarea value={f.msg} onChange={e => set('msg', e.target.value)} placeholder="Ex.: gastamos horas conciliando planilhas toda semana…" />
              </div>
              {sendErr && <p className="msg-err" style={{ display: 'block', marginBottom: 14, fontSize: 13 }}>{sendErr}</p>}
              <button className="btn btn-primary" type="submit" style={{ width: '100%', opacity: sending ? .7 : 1, pointerEvents: sending ? 'none' : 'auto' }}>
                {sending ? 'Enviando…' : <>Agendar diagnóstico <Icon.Arrow size={16} /></>}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

window.Pricing = Pricing;
window.Contact = Contact;
