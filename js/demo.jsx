/* Datana — Demo interativo: Copiloto + Dashboard + Automações */
const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;

/* ----- respostas simuladas do copiloto ----- */
const CANNED = {
  'Qual produto cresceu mais este mês?': {
    pre: 'Cruzando vendas dos últimos 30 dias…',
    parts: [
      ['O produto ', 'Plano Pro', ' cresceu ', '+38%', ' em receita no mês, puxado pela região Sul.'],
    ],
    extra: ['Ticket médio subiu de R$ 412 para R$ 511', 'Sugestão: replicar a campanha do Sul no Sudeste'],
  },
  'Onde estou perdendo tempo manual?': {
    pre: 'Analisando 9 processos mapeados…',
    parts: [['O maior gargalo é a ', 'conciliação de notas', ', que consome ', '~26h/mês', ' do financeiro e é 100% automatizável.']],
    extra: ['Erros nesse processo: 7 nos últimos 30 dias', 'ROI estimado da automação: 3.1x no 1º trimestre'],
  },
  'Algum cliente em risco de churn?': {
    pre: 'Rodando modelo de churn na carteira B2B…',
    parts: [['17 clientes', ' estão em risco alto. Juntos representam ', 'R$ 184 mil', ' em receita recorrente.']],
    extra: ['Sinal comum: queda de uso > 40% em 21 dias', 'Ação sugerida: contato proativo do CS esta semana'],
  },
};
const DEFAULT_ANSWER = {
  pre: 'Consultando sua base unificada…',
  parts: [['Encontrei os dados relevantes. ', 'Em resumo', ': seus indicadores estão dentro da meta, com 2 pontos de atenção que vale revisar.']],
  extra: ['Receita 30d: R$ 1,28 mi (+12%)', 'Processos automatizados ativos: 14'],
};

function Copilot() {
  const [msgs, setMsgs] = useStateD([
    { who: 'bot', kind: 'intro' },
  ]);
  const [typing, setTyping] = useStateD(false);
  const [val, setVal] = useStateD('');
  const bodyRef = useRefD(null);
  useEffectD(() => { if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight; }, [msgs, typing]);

  const ask = (q) => {
    if (!q.trim() || typing) return;
    setVal('');
    setMsgs(m => [...m, { who: 'user', text: q }]);
    setTyping(true);
    const ans = CANNED[q] || DEFAULT_ANSWER;
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { who: 'bot', kind: 'answer', ans }]);
    }, 1100);
  };

  const suggestions = Object.keys(CANNED);
  return (
    <div className="demo-body">
      <div className="chat" ref={bodyRef} style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
        {msgs.map((m, i) => {
          if (m.who === 'user') return (
            <div className="msg user" key={i}>
              <div className="bub">{m.text}</div>
              <div className="av">você</div>
            </div>
          );
          if (m.kind === 'intro') return (
            <div className="msg bot" key={i}>
              <div className="av">DT</div>
              <div className="bub">Olá! Sou o <b>Copiloto da Datana</b>. Pergunte sobre seus dados em linguagem natural — eu consulto a base unificada e respondo com números. Experimente uma sugestão abaixo.</div>
            </div>
          );
          const a = m.ans;
          return (
            <div className="msg bot" key={i}>
              <div className="av">DT</div>
              <div className="bub">
                {a.parts.map((p, j) => (
                  <div key={j} style={{ marginBottom: 8 }}>
                    {p.map((seg, k) => k % 2 ? <b key={k} className="stat">{seg}</b> : <React.Fragment key={k}>{seg}</React.Fragment>)}
                  </div>
                ))}
                <ul className="ticks" style={{ marginTop: 4 }}>
                  {a.extra.map((e, j) => <li key={j} style={{ fontSize: 13 }}>{e}</li>)}
                </ul>
              </div>
            </div>
          );
        })}
        {typing && (
          <div className="msg bot">
            <div className="av">DT</div>
            <div className="bub typing"><i></i><i></i><i></i></div>
          </div>
        )}
      </div>
      <div className="suggest">
        {suggestions.map(s => <button key={s} className="chip" onClick={() => ask(s)}>{s}</button>)}
      </div>
      <form className="chat-input" onSubmit={(e) => { e.preventDefault(); ask(val); }}>
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="Pergunte sobre seus dados…" />
        <button className="btn btn-primary" type="submit"><Icon.Send size={16} /></button>
      </form>
    </div>
  );
}

/* ----- Dashboard vivo ----- */
const SERIES = {
  '7d': [38, 52, 47, 63, 58, 71, 80],
  '30d': [30, 42, 38, 50, 47, 55, 49, 62, 58, 70, 66, 78],
  '90d': [22, 30, 28, 40, 36, 48, 44, 58, 64, 72, 80, 91],
};
function LineChart({ pts }) {
  const w = 560, h = 160, pad = 8;
  const max = Math.max(...pts), min = Math.min(...pts);
  const x = i => pad + (i * (w - pad * 2)) / (pts.length - 1);
  const y = v => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(p).toFixed(1)}`).join(' ');
  const area = `${line} L${x(pts.length - 1)} ${h} L${x(0)} ${h} Z`;
  return (
    <svg className="svg-chart" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".28" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(g => <line key={g} x1="0" x2={w} y1={h * g} y2={h * g} stroke="var(--line)" strokeWidth="1" />)}
      <path d={area} fill="url(#fillA)" />
      <path d={line} fill="none" stroke="var(--accent)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 10px var(--accent-glow))' }} />
      {pts.map((p, i) => <circle key={i} cx={x(i)} cy={y(p)} r={i === pts.length - 1 ? 4.5 : 0} fill="var(--accent)" />)}
    </svg>
  );
}
function Dashboard() {
  const [range, setRange] = useStateD('30d');
  const kpis = [
    ['Receita 30d', 'R$ 1,28 mi', '+12,4%', false],
    ['Processos auto.', '14 ativos', '+3 este mês', false],
    ['Erros evitados', '92%', 'vs. manual', false],
  ];
  return (
    <div className="demo-body">
      <div className="kpis">
        {kpis.map(([l, v, t], i) => (
          <div className="kpi" key={i}>
            <div className="k-lbl">{l}</div>
            <div className="k-val">{v}</div>
            <div className="k-tr"><Icon.ArrowUR size={13} />{t}</div>
          </div>
        ))}
      </div>
      <div className="chart">
        <div className="chart-head">
          <span className="ct">Receita & eficiência</span>
          <div className="seg">
            {['7d', '30d', '90d'].map(r => (
              <button key={r} className={range === r ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>
            ))}
          </div>
        </div>
        <LineChart pts={SERIES[range]} />
      </div>
    </div>
  );
}

/* ----- Automações ----- */
const FLOWS = [
  { ic: 'Doc', t: 'Conciliação de notas fiscais', sub: 'roda a cada 1h · financeiro', on: true },
  { ic: 'Data', t: 'Sincronização ERP ⇄ CRM', sub: 'tempo real · comercial', on: true },
  { ic: 'Chart', t: 'Relatório executivo semanal', sub: 'seg 08:00 · diretoria', on: true },
  { ic: 'Ai', t: 'Score de churn da carteira', sub: 'diário · CS', on: true },
  { ic: 'Mail', t: 'Alerta de meta de vendas', sub: 'pausado', on: false },
];
function Automations() {
  const [flows, setFlows] = useStateD(FLOWS);
  const toggle = i => setFlows(f => f.map((x, j) => j === i ? { ...x, on: !x.on } : x));
  return (
    <div className="demo-body">
      <div className="flow">
        {flows.map((f, i) => {
          const Ic = Icon[f.ic];
          return (
            <div className={'flow-step' + (f.on ? '' : ' idle')} key={i}>
              <div className="fi"><Ic size={18} /></div>
              <div className="fx">
                <b>{f.t}</b>
                <span>{f.on ? f.sub : 'pausado'}</span>
              </div>
              <button className="badge" onClick={() => toggle(i)} style={{ cursor: 'pointer' }}>
                {f.on ? '● ativo' : '○ inativo'}
              </button>
            </div>
          );
        })}
      </div>
      <p className="lede" style={{ fontSize: 13.5, marginTop: 18 }}>
        {flows.filter(f => f.on).length} de {flows.length} automações ativas · clique no status para ligar/desligar.
      </p>
    </div>
  );
}

/* ----- Shell da plataforma ----- */
function Platform() {
  const [tab, setTab] = useStateD('copilot');
  const tabs = [
    ['copilot', 'Spark', 'Copiloto de dados', 'pergunte em linguagem natural'],
    ['dash', 'Chart', 'Dashboards', 'indicadores em tempo real'],
    ['auto', 'Flow', 'Automações', 'fluxos rodando 24/7'],
  ];
  const titles = { copilot: 'Copiloto Datana', dash: 'Painel de decisão', auto: 'Central de automações' };
  return (
    <section className="sec-pad wrap" id="plataforma">
      <div className="sec-head reveal">
        <span className="eyebrow">A plataforma</span>
        <h2 className="h-lg">Tudo num só lugar — e funcionando<br />de verdade. Experimente abaixo.</h2>
        <p className="lede">Não é mockup: clique, pergunte e ligue automações. É assim que sua equipe usa a Datana no dia a dia.</p>
      </div>
      <div className="demo-shell reveal">
        <aside className="demo-side">
          <span className="side-lbl">Módulos</span>
          {tabs.map(([id, ic, t, sub]) => {
            const Ic = Icon[ic];
            return (
              <button key={id} className={'demo-tab' + (tab === id ? ' active' : '')} onClick={() => setTab(id)}>
                <span className="demo-tab-ico"><Ic size={18} /></span>
                <span>{t}<small>{sub}</small></span>
              </button>
            );
          })}
        </aside>
        <div className="demo-main">
          <div className="demo-main-bar">
            <span className="ttl">{titles[tab]}</span>
            <span className="st">conectado</span>
          </div>
          {tab === 'copilot' && <Copilot />}
          {tab === 'dash' && <Dashboard />}
          {tab === 'auto' && <Automations />}
        </div>
      </div>
    </section>
  );
}

window.Platform = Platform;
