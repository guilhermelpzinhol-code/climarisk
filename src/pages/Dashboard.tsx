import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Thermometer,
  CloudRain,
  ArrowDown,
  Satellite,
  AlertTriangle,
  TrendingUp,
  Minus,
  CheckCircle2,
  Building2,
  Maximize,
  BellRing,
  ArrowRight,
} from 'lucide-react';
import { RiskBar } from '../components/primitives';
import { useStore } from '../lib/store';
import { riskClassification, REGION, alerts, riskMeta } from '../lib/data';
import type { RiskLevel } from '../lib/types';

const riskIcon: Record<RiskLevel, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: TrendingUp,
  medium: Minus,
  low: CheckCircle2,
};

// Precipitação acumulada (mm) — últimos 14 dias, com gatilho de déficit.
const precip = [22, 18, 14, 9, 6, 4, 3, 2, 5, 11, 8, 6, 4, 3];
const TRIGGER = 15;

export default function Dashboard() {
  const { properties } = useStore();

  const kpis = useMemo(() => {
    const totalArea = properties.reduce((s, p) => s + p.areaHa, 0);
    const high = properties.filter((p) => p.risk === 'high' || p.risk === 'critical').length;
    return {
      count: properties.length,
      totalArea,
      high,
    };
  }, [properties]);

  // Distribuição de risco por cultura (para o gráfico de barras).
  const byCulture = useMemo(() => {
    const map = new Map<string, number>();
    properties.forEach((p) => map.set(p.culture, (map.get(p.culture) ?? 0) + p.areaHa));
    return [...map.entries()].map(([culture, area]) => ({ culture, area })).sort((a, b) => b.area - a.area);
  }, [properties]);

  const maxCount = Math.max(...riskClassification.map((r) => r.count));

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Painel de Inteligência</h1>
          <p className="mt-1 text-sm text-body">
            Visão consolidada de risco climático — {REGION.hub}.
          </p>
        </div>
        <span className="chip bg-brand-50 text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" /> Atualizado agora
        </span>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={Building2} label="Propriedades" value={kpis.count.toString()} hint="ativas no monitoramento" tone="brand" />
        <Kpi icon={Maximize} label="Área total" value={`${(kpis.totalArea / 1000).toFixed(1)}k`} hint="hectares sob análise" tone="ink" />
        <Kpi icon={AlertTriangle} label="Risco elevado" value={kpis.high.toString()} hint="alto + crítico" tone="risk" />
        <Kpi icon={Thermometer} label="Temperatura" value="28°" hint="+2.4° em 24h" tone="medium" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Gráfico de precipitação */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-start justify-between">
            <div>
              <span className="label-mono">Índice Pluviométrico · 14 dias</span>
              <p className="mt-1 text-sm text-body">
                Acumulado diário (mm) vs. gatilho de déficit hídrico (<span className="font-semibold text-risk-medium">{TRIGGER} mm</span>)
              </p>
            </div>
            <span className="chip bg-amber-500/10 text-risk-medium">
              <ArrowDown size={12} /> Tendência de queda
            </span>
          </div>
          <AreaChart data={precip} trigger={TRIGGER} />
        </div>

        {/* Classificação de risco */}
        <div className="card p-5">
          <span className="label-mono">Classificação de Risco Global</span>
          <div className="mt-4 space-y-3.5">
            {riskClassification.map((r) => {
              const Icon = riskIcon[r.level];
              const color = riskMeta[r.level].color;
              return (
                <div key={r.level} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: `${color}1f`, color }}>
                    <Icon size={17} />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-ink">{r.label}</span>
                      <span className="text-sm font-bold" style={{ color }}>{r.count}</span>
                    </div>
                    <div className="mt-1.5">
                      <RiskBar level={r.level} value={r.count} max={maxCount} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Barras por cultura */}
        <div className="card p-5 lg:col-span-2">
          <span className="label-mono">Exposição por cultura</span>
          <p className="mt-1 text-sm text-body">Área monitorada (ha) agrupada por cultura.</p>
          <div className="mt-5 space-y-4">
            {byCulture.map((c) => {
              const max = byCulture[0].area;
              return (
                <div key={c.culture}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium text-ink">{c.culture}</span>
                    <span className="text-body">{c.area.toLocaleString('pt-BR')} ha</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-soft">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-dark to-brand transition-all"
                      style={{ width: `${(c.area / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <MiniStat icon={CloudRain} label="Chuva (24h)" value="12,5 mm" hint="-5% da média" down />
            <MiniStat icon={Satellite} label="API de Satélite" value="Operacional" hint="oráculo primário ativo" />
          </div>
        </div>

        {/* Feed de alertas */}
        <div className="card flex flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="label-mono">Alertas recentes</span>
            <BellRing size={15} className="text-risk-medium" />
          </div>
          <div className="mt-4 flex-1 space-y-3">
            {alerts.map((a) => {
              const color = riskMeta[a.level].color;
              return (
                <div key={a.id} className="rounded-xl border border-line bg-soft/50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                    <span className="text-sm font-semibold text-ink">{a.title}</span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-body">{a.description}</p>
                  <p className="mt-1 text-[11px] text-muted">{a.date} · {a.time}</p>
                </div>
              );
            })}
          </div>
          <Link to="/alerts" className="mt-4 inline-flex items-center justify-center gap-1.5 text-sm font-semibold text-brand hover:text-brand-dark">
            Ver central de laudos <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon, label, value, hint, tone,
}: { icon: typeof Building2; label: string; value: string; hint: string; tone: 'brand' | 'ink' | 'risk' | 'medium' }) {
  const toneMap = {
    brand: { color: '#22C55E', bg: '#22C55E1f' },
    ink: { color: '#ECFDF5', bg: '#ffffff14' },
    risk: { color: '#F87171', bg: '#F871711f' },
    medium: { color: '#FBBF24', bg: '#FBBF241f' },
  }[tone];
  return (
    <div className="card p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: toneMap.bg, color: toneMap.color }}>
        <Icon size={18} />
      </span>
      <p className="mt-3 text-2xl font-extrabold tracking-tight text-ink">{value}</p>
      <p className="text-sm font-medium text-ink">{label}</p>
      <p className="text-xs text-muted">{hint}</p>
    </div>
  );
}

function MiniStat({
  icon: Icon, label, value, hint, down,
}: { icon: typeof CloudRain; label: string; value: string; hint: string; down?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-brand">
        <Icon size={18} />
      </span>
      <div>
        <span className="label-mono">{label}</span>
        <p className="text-sm font-bold text-ink">{value}</p>
        <p className={`flex items-center gap-1 text-[11px] ${down ? 'text-risk-high' : 'text-muted'}`}>
          {down && <ArrowDown size={10} />} {hint}
        </p>
      </div>
    </div>
  );
}

/** Gráfico de área (SVG) sem dependências. */
function AreaChart({ data, trigger }: { data: number[]; trigger: number }) {
  const w = 600;
  const h = 180;
  const pad = 8;
  const max = Math.max(...data, trigger) * 1.15;
  const stepX = (w - pad * 2) / (data.length - 1);
  const x = (i: number) => pad + i * stepX;
  const y = (v: number) => h - pad - (v / max) * (h - pad * 2);

  const linePts = data.map((v, i) => `${x(i)},${y(v)}`).join(' ');
  const areaPts = `${pad},${h - pad} ${linePts} ${w - pad},${h - pad}`;
  const triggerY = y(trigger);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 h-44 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="precipFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Linha de gatilho */}
      <line x1={pad} y1={triggerY} x2={w - pad} y2={triggerY} stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="5 5" />
      <polygon points={areaPts} fill="url(#precipFill)" />
      <polyline points={linePts} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#0E1714" stroke="#22C55E" strokeWidth="2" />
      ))}
    </svg>
  );
}
