import { useEffect, useRef, useState } from 'react';
import { Droplet, Sun, Activity, Landmark, ShieldCheck, ArrowRight, AlertTriangle, CheckCircle2, Satellite, Cloud, Gauge, Loader2 } from 'lucide-react';
import { Donut, Meter, RiskBadge } from '../components/primitives';
import { CountUp } from '../components/CountUp';
import { toast } from '../components/Toaster';
import { policies, formatBRL } from '../lib/data';
import type { RiskLevel } from '../lib/types';

const ANALYSIS_STEPS = [
  { icon: Satellite, label: 'Coletando imagens de satélite (NDVI)…' },
  { icon: Cloud, label: 'Cruzando estações INMET e CPTEC/INPE…' },
  { icon: Droplet, label: 'Modelando déficit hídrico e veranico…' },
  { icon: Gauge, label: 'Calculando gatilhos paramétricos…' },
];
const STEP_MS = 620;

export default function Insurance() {
  const [form, setForm] = useState({ talhao: 'Fazenda Boa Vista, Lote 04', culture: 'Soja (Glycine max)', period: 'Out 2025 - Mar 2026' });
  const [result, setResult] = useState<{ level: RiskLevel; rain: number; dry: number; score: number } | null>(null);
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function simulate() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setResult(null);
    setPhase('analyzing');
    setStep(0);

    ANALYSIS_STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i), i * STEP_MS));
    });

    timers.current.push(
      window.setTimeout(() => {
        // Cálculo mock determinístico a partir do talhão/período.
        const seed = form.talhao.length + form.period.length;
        const rain = 80 + (seed % 90);
        const dry = 6 + (seed % 16);
        const level: RiskLevel = dry > 15 ? 'high' : dry > 12 ? 'medium' : 'low';
        const score = Math.min(99, Math.round((dry / 25) * 60 + ((150 - Math.min(rain, 150)) / 150) * 40));
        setResult({ level, rain, dry, score });
        setPhase('done');
      }, ANALYSIS_STEPS.length * STEP_MS + 250)
    );
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Mitigação de Risco Climático de Precisão</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-body">
        Monitore gatilhos paramétricos em tempo real, gerencie apólices ativas e simule novos cenários de proteção
        agrícola baseados em dados satelitais de alta fidelidade.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Simulador (RF05) */}
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ background: 'radial-gradient(80% 80% at 90% 10%, #16A34A, transparent 60%)' }}
          />
          <div className="relative">
            <span className="label-mono text-brand">Simulador de Risco · RF05</span>
            <h2 className="mt-2 text-2xl font-bold text-ink">Configurar Nova Proposta</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-mono mb-1.5 block">Localização (Talhão)</label>
                <input className="field" value={form.talhao} onChange={(e) => setForm({ ...form, talhao: e.target.value })} />
              </div>
              <div>
                <label className="label-mono mb-1.5 block">Cultura</label>
                <select className="field" value={form.culture} onChange={(e) => setForm({ ...form, culture: e.target.value })}>
                  {['Soja (Glycine max)', 'Milho (Zea mays)', 'Algodão (Gossypium)'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-mono mb-1.5 block">Período de Cobertura</label>
                <select className="field" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
                  {['Out 2025 - Mar 2026', 'Nov 2025 - Abr 2026', 'Fev 2026 - Jun 2026'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button onClick={simulate} disabled={phase === 'analyzing'} className="btn-primary mt-6">
              {phase === 'analyzing' ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
              {phase === 'analyzing' ? 'Analisando…' : phase === 'done' ? 'Simular novamente' : 'Simular Gatilhos'}
            </button>

            {phase === 'analyzing' && <AnalyzingPanel step={step} />}

            {phase === 'done' && result && (
              <div key={result.score} className="mt-6 animate-fade-up rounded-xl border border-line bg-soft/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="label-mono">Resultado da Análise</span>
                  <RiskBadge level={result.level} />
                </div>

                {/* Score de risco com número correndo */}
                <div className="mt-4 flex items-end gap-3">
                  <CountUp
                    value={result.score}
                    duration={1200}
                    className="text-5xl font-extrabold leading-none tracking-tight"
                    suffix=""
                  />
                  <span className="pb-1 text-sm text-muted">/ 100 índice de risco</span>
                </div>

                <div className="mt-5 space-y-5">
                  <GaugeRow
                    label="Índice pluviométrico projetado"
                    value={result.rain}
                    unit="mm"
                    max={200}
                    trigger={150}
                    triggerLabel="Gatilho de déficit: < 150 mm"
                    breached={result.rain < 150}
                  />
                  <GaugeRow
                    label="Estresse hídrico estimado"
                    value={result.dry}
                    unit="dias"
                    max={25}
                    trigger={15}
                    triggerLabel="Gatilho de seca: > 15 dias"
                    breached={result.dry > 15}
                  />
                </div>

                <div className="mt-5 flex items-start gap-2 rounded-lg bg-surface px-3 py-2.5 text-xs leading-relaxed text-body">
                  <Activity size={14} className="mt-0.5 shrink-0 text-brand" />
                  <span>{verdict(result.level)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Índices */}
        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono">Índice Pluviométrico</span>
              <Droplet size={16} className="text-brand" />
            </div>
            <p className="mt-3 font-mono text-4xl font-bold text-ink">124<span className="text-base text-muted"> mm</span></p>
            <div className="mt-3"><Meter value={124} max={200} color="#16A34A" /></div>
            <p className="mt-2 font-mono text-[11px] text-muted">Acumulado (30d) · Gatilho: &lt; 150 mm</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono">Estresse Hídrico</span>
              <Sun size={16} className="text-risk-medium" />
            </div>
            <p className="mt-3 font-mono text-4xl font-bold text-ink">12<span className="text-base text-muted"> dias</span></p>
            <div className="mt-3"><Meter value={12} max={20} color="#F59E0B" /></div>
            <p className="mt-2 font-mono text-[11px] text-muted">Dias consecutivos s/ chuva · Gatilho: &gt; 15 dias</p>
          </div>
          {/* Visualizador de gatilho (mobile-friendly donut) */}
          <div className="card flex flex-col items-center p-5">
            <span className="label-mono self-start">Visualizador de Gatilho</span>
            <div className="mt-2"><Donut value={12} max={30} unit="mm" /></div>
            <div className="mt-3 flex w-full justify-between border-t border-line pt-3 text-xs">
              <span className="text-body">Gatilho<br /><strong className="font-mono text-ink">15mm / mês</strong></span>
              <span className="text-right text-body">Data Limite<br /><strong className="font-mono text-ink">28 Fev</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Contratos ativos */}
      <div className="card mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5">
          <span className="label-mono">Contratos Ativos</span>
          <button
            onClick={() => toast(`Exibindo ${policies.length} contratos ativos.`)}
            className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:text-brand-dark"
          >
            Ver todos <ArrowRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {['Parceiro / Seguradora', 'ID da Apólice', 'Tipo de Cobertura', 'Capital Segurado', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-soft/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lavender text-body">
                        {p.partner.includes('Seguros') || p.partner.includes('Safe') ? <Landmark size={16} /> : <ShieldCheck size={16} />}
                      </span>
                      <span className="font-semibold text-ink">{p.partner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-body">{p.id}</td>
                  <td className="px-5 py-4 text-body">{p.coverage}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-ink">{formatBRL(p.capital)}</td>
                  <td className="px-5 py-4">
                    <span className="chip bg-brand-50 text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Ativo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GaugeRow({
  label, value, unit, max, trigger, triggerLabel, breached,
}: {
  label: string; value: number; unit: string; max: number; trigger: number;
  triggerLabel: string; breached: boolean;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const triggerPct = Math.min(100, (trigger / max) * 100);
  const color = breached ? '#F87171' : '#34D399';
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-sm text-body">{label}</p>
        <p className="text-2xl font-extrabold tracking-tight text-ink">
          <CountUp value={value} duration={1100} />
          <span className="ml-0.5 text-sm font-medium text-muted">{unit}</span>
        </p>
      </div>
      <div className="relative mt-2 h-2.5 w-full overflow-visible rounded-full bg-line">
        <div className="animate-grow h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
        {/* Marcador do gatilho */}
        <div
          className="absolute -top-1 w-0.5"
          style={{ left: `${triggerPct}%`, height: '18px', top: '-4px', background: '#FBBF24' }}
          title={triggerLabel}
        />
      </div>
      <p className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color }}>
        {breached ? <AlertTriangle size={12} /> : <CheckCircle2 size={12} />}
        {triggerLabel}
        <span className="text-muted">· {breached ? 'gatilho acionável' : 'dentro do seguro'}</span>
      </p>
    </div>
  );
}

/** Painel de carregamento animado da análise (etapas + gráfico desenhando + progresso). */
function AnalyzingPanel({ step }: { step: number }) {
  const total = ANALYSIS_STEPS.length;
  const progress = Math.min(100, Math.round(((step + 1) / total) * 100));
  // Mini-gráfico que "desenha" durante a análise.
  const pts = [40, 32, 36, 24, 28, 16, 20, 12, 18, 10];
  const w = 260;
  const h = 70;
  const stepX = w / (pts.length - 1);
  const line = pts.map((v, i) => `${i * stepX},${v + 8}`).join(' ');

  return (
    <div className="mt-6 animate-fade-up overflow-hidden rounded-xl border border-line bg-soft/60 p-5">
      <div className="flex items-center justify-between">
        <span className="label-mono text-brand">Analisando risco climático</span>
        <span className="text-sm font-bold text-ink">
          <CountUp value={progress} duration={500} suffix="%" />
        </span>
      </div>

      {/* Gráfico desenhando + varredura */}
      <div className="relative mt-4 overflow-hidden rounded-lg bg-surface p-3">
        <svg viewBox={`0 0 ${w} ${h + 16}`} className="h-20 w-full">
          <defs>
            <linearGradient id="anFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline className="draw-line" points={line} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="scan-sweep pointer-events-none absolute inset-y-0 left-0 w-16" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.18), transparent)' }} />
      </div>

      {/* Barra de progresso */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-brand transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Etapas */}
      <div className="mt-4 space-y-2.5">
        {ANALYSIS_STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <div key={s.label} className={`flex items-center gap-3 text-sm transition ${done || active ? 'text-ink' : 'text-muted'}`}>
              <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${done ? 'bg-brand text-[#06100C]' : active ? 'bg-brand-50 text-brand' : 'bg-line text-muted'}`}>
                {done ? <CheckCircle2 size={15} /> : active ? <Loader2 size={15} className="animate-spin" /> : <s.icon size={15} />}
              </span>
              {s.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function verdict(level: RiskLevel): string {
  if (level === 'high' || level === 'critical')
    return 'Cenário de alto risco: as condições projetadas acionariam a cobertura paramétrica. Recomenda-se contratar proteção com gatilho de déficit hídrico para este talhão.';
  if (level === 'medium')
    return 'Risco moderado: os índices ainda estão dentro da faixa de segurança, mas próximos do gatilho. Vale monitorar a evolução diária antes do plantio.';
  return 'Risco baixo: os parâmetros projetados estão confortavelmente dentro da margem de segurança. Nenhum gatilho de proteção seria acionado neste cenário.';
}
