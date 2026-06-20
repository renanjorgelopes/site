/* Datana — seções: Nav, Hero, Logos, Soluções, Steps, Métricas, Footer */
const { useState, useEffect, useRef } = React;

/* ---- smooth-scroll helper (avoids scrollIntoView) ---- */
function goSection(hash) {
  const el = document.querySelector(hash);
  if (!el) return;
  const y = hash === '#top' ? 0 : el.getBoundingClientRect().top + window.scrollY - 70;
  window.scrollTo({ top: y, behavior: 'smooth' });
}

/* ---- scroll reveal hook ---- */
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.reveal, .step'));
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((ents) => {
        ents.forEach((e) => {if (e.isIntersecting) {e.target.classList.add('in');io.unobserve(e.target);}});
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      els.forEach((el) => io.observe(el));
    }
    // Reveal anything already in view immediately, and guarantee a fallback
    const showInView = () => {
      els.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96) el.classList.add('in');
      });
    };
    requestAnimationFrame(showInView);
    const fb = setTimeout(() => els.forEach((el) => el.classList.add('in')), 1400);
    return () => {io && io.disconnect();clearTimeout(fb);};
  }, []);
}

/* ===================== NAV ===================== */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setScrolled(window.scrollY > 12);
    f();window.addEventListener('scroll', f, { passive: true });
    return () => window.removeEventListener('scroll', f);
  }, []);
  const links = [
  ['Soluções', '#solucoes'],
  ['Como funciona', '#como'], ['Planos', '#planos']];

  const go = (e, h) => {e.preventDefault();setOpen(false);goSection(h);};
  return (
    <nav className={'nav' + (scrolled ? ' scrolled' : '')}>
      <div className="wrap nav-in">
        <a href="#top" className="brand" onClick={(e) => go(e, '#top')}>
          <img className="logo" src="assets/datana-mark.png" alt="Datana" /> <span>Data<b>na</b></span>
        </a>
        <div className="nav-links">
          {links.map(([t, h]) => <a key={h} href={h} onClick={(e) => go(e, h)}>{t}</a>)}
        </div>
        <div className="nav-cta">
          <a href="#contato" className="btn btn-primary" onClick={(e) => go(e, '#contato')}>
            Falar com a Datana <Icon.Arrow size={16} />
          </a>
          <button className={'burger' + (open ? ' open' : '')} aria-label="Menu" onClick={() => setOpen((o) => !o)}>
            <i></i><i></i><i></i>
          </button>
        </div>
      </div>
      <div className="mobile-menu" style={{ display: open ? 'flex' : 'none' }}>
        {links.map(([t, h]) => <a key={h} href={h} onClick={(e) => go(e, h)}>{t}</a>)}
        <a href="#contato" className="btn btn-primary" onClick={(e) => go(e, '#contato')}>Falar com a Datana</a>
      </div>
    </nav>);

}

/* ===================== HERO TERMINAL ===================== */
const HERO_TASKS = [
{ t: 'Automatizar conciliação de notas fiscais', out: [['Lançamentos processados', '1.284', true], ['Tempo manual evitado', '6h 20min', true], ['Inconsistências sinalizadas', '3', false]] },
{ t: 'Unificar dados de vendas de 4 sistemas', out: [['Fontes conectadas', '4 / 4', true], ['Registros normalizados', '38.902', true], ['Pronto para dashboard', 'sim', true]] },
{ t: 'Prever risco de churn da carteira B2B', out: [['Clientes analisados', '512', true], ['Em risco alto', '17', false], ['Ação sugerida', 'gerada', true]] },
{ t: 'Gerar relatório financeiro semanal', out: [['Planilhas integradas', '9', true], ['Gráficos montados', '6', true], ['Envio agendado', 'seg 08:00', true]] }];

function HeroTerminal() {
  const [idx, setIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [phase, setPhase] = useState('typing'); // typing | run | done
  useEffect(() => {
    let to;
    const task = HERO_TASKS[idx].t;
    if (phase === 'typing') {
      if (typed.length < task.length) to = setTimeout(() => setTyped(task.slice(0, typed.length + 1)), 34);else
      to = setTimeout(() => setPhase('run'), 360);
    } else if (phase === 'run') {
      to = setTimeout(() => setPhase('done'), 900);
    } else {
      to = setTimeout(() => {setTyped('');setPhase('typing');setIdx((i) => (i + 1) % HERO_TASKS.length);}, 3200);
    }
    return () => clearTimeout(to);
  }, [typed, phase, idx]);
  const task = HERO_TASKS[idx];
  return (
    <div className="term reveal">
      <div className="card bracket term-card">
        <div className="term-bar">
          <div className="term-dots"><i></i><i></i><i></i></div>
          <span className="term-title">Datana</span>
          <span className="term-live">EXECUTANDO</span>
        </div>
        <div className="term-body">
          <div className="term-line">
            <span className="pfx">›</span>
            <span className="term-task">{typed}{phase === 'typing' && <span className="term-caret"></span>}</span>
          </div>
          {phase !== 'typing' &&
          <div className="term-out">
              {phase === 'run' ?
            <div className="row"><span className="mono" style={{ color: 'var(--accent)' }}>analisando fontes de dados…</span></div> :
            task.out.map(([k, v, ok], i) =>
            <div className="row" key={i}>
                  <span>{k}</span>
                  <b className={ok ? 'ok' : ''}>{v}</b>
                </div>
            )}
              {phase === 'done' &&
            <div className="bars">
                  {[.5, .8, .6, 1, .7, .9, .55, .85, .65, .95, .6, .75].map((h, i) =>
              <i key={i} style={{ height: h * 100 + '%', animationDelay: i * .12 + 's' }}></i>)}
                </div>
            }
            </div>
          }
        </div>
      </div>
    </div>);

}

/* ===================== HERO ===================== */
function Hero({ layout = 'split' }) {
  return (
    <header className={'hero wrap hero-' + layout} id="top">
      <div className="hero-grid">
        <div className="reveal">
          <span className="eyebrow">Automação · IA · Ciência de Dados</span>
          <h1 className="h-xl">Automação, IA e dados para empresas que querem <br /><span className="grad">ganhar tempo e decidir melhor.</span></h1>
          <p className="lede">A Datana ajuda empresas a automatizar tarefas manuais, organizar dados e criar dashboards inteligentes para melhorar a produtividade e a tomada de decisão.</p>
          <div className="hero-cta">
            <a href="#contato" className="btn btn-primary" onClick={(e) => {e.preventDefault();goSection('#contato');}}>
              Agendar diagnóstico <Icon.Arrow size={16} />
            </a>
            <a href="#como" className="btn btn-ghost" onClick={(e) => {e.preventDefault();goSection('#como');}}>
              Como funciona
            </a>
          </div>
          <div className="hero-meta">
            <div className="m"><b><em>—70%</em></b><span>Tempo em tarefas manuais</span></div>
            <div className="m"><b>4.2x</b><span>Velocidade na decisão</span></div>
          </div>
        </div>
        {layout !== 'type' && <HeroTerminal />}
      </div>
    </header>);

}

/* ===================== LOGOS ===================== */
function Logos() {
  const names = ['Planilhas', 'ERPs', 'CRMs', 'APIs', 'Bancos de dados', 'Marketing'];
  return (
    <div className="logos">
      <div className="wrap logos-in">
        <span className="lbl">Conectamos os dados que já existem na sua empresa</span>
        {names.map((n) => <span key={n} className="logo-chip">{n}</span>)}
      </div>
    </div>);

}

/* ===================== SOLUÇÕES ===================== */
const SOLUTIONS = [
{ ic: 'Automate', t: 'Automação de processos', d: 'Robôs e fluxos que executam tarefas repetitivas — conciliações, relatórios, cadastros e integrações — sem intervenção manual.', pts: ['Conciliação e back-office', 'Integração entre sistemas', 'Rotinas agendadas 24/7'] },
{ ic: 'Ai', t: 'Inteligência artificial aplicada', d: 'Modelos sob medida para o seu negócio: previsão de demanda, risco de churn, classificação de documentos e copilotos internos.', pts: ['Previsão e classificação', 'Copiloto de dados em linguagem natural', 'Detecção de anomalias'] },
{ ic: 'Data', t: 'Engenharia de dados', d: 'Reunimos dados dispersos em planilhas, ERPs e ferramentas numa base única, limpa e confiável, pronta para análise.', pts: ['Pipelines e ETL', 'Limpeza e padronização', 'Base única de verdade'] },
{ ic: 'Chart', t: 'Dashboards de decisão', d: 'Painéis claros e em tempo real com os indicadores que importam — para a liderança decidir com confiança, não no achismo.', pts: ['KPIs em tempo real', 'Alertas automáticos', 'Visões por área e por papel'] }];

function Solutions() {
  return (
    <section className="sec-pad wrap" id="solucoes">
      <div className="sec-head reveal">
        <span className="eyebrow">O que fazemos</span>
        <h2 className="h-lg">Quatro frentes que se conectam<br />numa só operação de dados.</h2>
        <p className="lede">Unimos automação, inteligência artificial e ciência de dados para transformar processos repetitivos em soluções eficientes, práticas e personalizadas para cada negócio.</p>
      </div>
      <div className="sol-grid">
        {SOLUTIONS.map((s, i) => {
          const Ic = Icon[s.ic];
          return (
            <article className="card bracket sol reveal" key={i} style={{ transitionDelay: i * 60 + 'ms' }}>
              <div className="sol-top">
                <div className="sol-ico"><Ic size={24} /></div>
                <span className="sol-num">0{i + 1} / 04</span>
              </div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
              <ul className="ticks">{s.pts.map((p, j) => <li key={j}>{p}</li>)}</ul>
              <span className="more">Explorar frente <Icon.ArrowUR size={14} /></span>
            </article>);

        })}
      </div>
    </section>);

}

/* ===================== STEPS ===================== */
const STEPS = [
{ n: '01', t: 'Diagnóstico', d: 'Mapeamos seus processos, fontes de dados e gargalos. Em poucos dias você enxerga onde o tempo e o dinheiro estão vazando.' },
{ n: '02', t: 'Construção', d: 'Desenhamos e implementamos as automações, modelos e pipelines — integrados aos sistemas que sua equipe já usa.' },
{ n: '03', t: 'Operação e evolução', d: 'Acompanhamos os resultados em dashboards vivos, ajustamos os modelos e escalamos o que funciona, mês a mês.' }];

function Steps() {
  return (
    <section className="sec-pad wrap" id="como">
      <div className="sec-head reveal">
        <span className="eyebrow">Como funciona</span>
        <h2 className="h-lg">Do caos manual à operação<br />orientada por dados em 3 passos.</h2>
      </div>
      <div className="steps">
        {STEPS.map((s, i) =>
        <article className="card bracket step" key={i}>
            <span className="ln"></span>
            <span className="sn">PASSO {s.n}</span>
            <h3>{s.t}</h3>
            <p>{s.d}</p>
          </article>
        )}
      </div>
    </section>);

}

/* ===================== MÉTRICAS ===================== */
function Metrics() {
  const data = [
  ['IMPACTO', '12.400h', 'Horas manuais economizadas por ano nos clientes ativos'],
  ['PRECISÃO', '−92%', 'Redução média de erros em processos automatizados'],
  ['VELOCIDADE', '4.2x', 'Mais rápido para fechar relatórios e decidir'],
  ['ADOÇÃO', '40+', 'Empresas operando com dashboards da Datana']];

  return (
    <section className="sec-pad wrap">
      <div className="sec-head reveal" style={{ marginBottom: 8 }}>
        <span className="eyebrow">Resultados reais</span>
        <h2 className="h-lg">Eficiência que aparece no<br />balanço, não só no slide.</h2>
      </div>
      <div className="metrics reveal">
        {data.map(([k, v, l], i) =>
        <div className="metric" key={i}>
            <div className="mk">{k}</div>
            <div className="mv"><em>{v}</em></div>
            <div className="ml">{l}</div>
          </div>
        )}
      </div>
    </section>);

}

/* ===================== FOOTER ===================== */
function Footer() {
  const nav = [
    ['Soluções', '#solucoes'], ['Como funciona', '#como'],
    ['Planos', '#planos'], ['Contato', '#contato'],
  ];
  const email = (window.DATANA && window.DATANA.email) || 'contato@datana.com.br';
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <a href="#top" className="brand" onClick={(e) => { e.preventDefault(); goSection('#top'); }}><img className="logo" src="assets/datana-mark.png" alt="Datana" /> <span>Data<b>na</b></span></a>
            <p>Automação, inteligência artificial e ciência de dados para empresas que querem decidir melhor — com menos esforço manual.</p>
          </div>
          <div className="foot-col">
            <h5>Navegação</h5>
            {nav.map(([t, h]) => <a key={h} href={h} onClick={(e) => { e.preventDefault(); goSection(h); }}>{t}</a>)}
          </div>
          <div className="foot-col">
            <h5>Contato</h5>
            <a href={'mailto:' + email}>{email}</a>
            <a href="#contato" onClick={(e) => { e.preventDefault(); goSection('#contato'); }}>Agendar diagnóstico</a>
          </div>
        </div>
        <div className="foot-bottom">
          <span className="cp">© {new Date().getFullYear()} Datana Tecnologia · Feito com dados, não com achismo.</span>
          <div className="soc">
            <a href={'mailto:' + email} aria-label="E-mail"><Icon.Mail size={17} /></a>
          </div>
        </div>
      </div>
    </footer>);

}

Object.assign(window, { useReveal, goSection, Nav, Hero, Logos, Solutions, Steps, Metrics, Footer });