/* Datana — App raiz + Tweaks */
const { useEffect: useEffectA } = React;
const { useTweaks, TweaksPanel, TweakSection, TweakColor, TweakSlider, TweakRadio } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2fb3ea",
  "headingFont": "Space Grotesk",
  "glow": 0.9,
  "heroLayout": "split"
}/*EDITMODE-END*/;

function darken(hex, factor) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = Math.round(((n >> 16) & 255) * factor);
  const g = Math.round(((n >> 8) & 255) * factor);
  const b = Math.round((n & 255) * factor);
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useEffectA(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', t.accent);
    r.setProperty('--accent-ink', darken(t.accent, 0.16));
    r.setProperty('--display', `'${t.headingFont}', system-ui, sans-serif`);
    r.setProperty('--glow', String(t.glow));
  }, [t.accent, t.headingFont, t.glow]);

  return (
    <>
      <div className="grid-tex"></div>
      <Nav />
      <main>
        <Hero layout={t.heroLayout} />
        <Solutions />
        <Steps />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <TweaksPanel>
        <TweakSection label="Hero" />
        <TweakRadio label="Layout do hero" value={t.heroLayout}
          options={[
            { value: 'split', label: 'Split' },
            { value: 'center', label: 'Centrado' },
            { value: 'type', label: 'Tipo XL' },
          ]}
          onChange={v => setTweak('heroLayout', v)} />
        <TweakSection label="Marca" />
        <TweakColor label="Cor de acento" value={t.accent}
          options={['#2fb3ea', '#1fe3c2', '#38e07b', '#9b7bff', '#ffb648']}
          onChange={v => setTweak('accent', v)} />
        <TweakRadio label="Fonte de título" value={t.headingFont}
          options={['Space Grotesk', 'Sora']}
          onChange={v => setTweak('headingFont', v)} />
        <TweakSection label="Atmosfera" />
        <TweakSlider label="Brilho neon" value={t.glow} min={0} max={1.6} step={0.1}
          onChange={v => setTweak('glow', v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
