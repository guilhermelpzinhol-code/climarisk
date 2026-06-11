import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Thermometer, CloudRain, ArrowDown, Satellite, AlertTriangle, TrendingUp, Minus, CheckCircle2,
  Building2, Maximize, BellRing, ArrowRight, Landmark, Users, ShieldCheck, FileText, Percent,
  TrendingDown, Plus, Sprout, FileSearch,
} from 'lucide-react';
import { RiskBar } from '../components/primitives';
import { useStore } from '../lib/store';
import { riskClassification, REGION, alerts, riskMeta, policies, formatBRL } from '../lib/data';
import type { RiskLevel, Profile } from '../lib/types';

const riskIcon: Record<RiskLevel, typeof AlertTriangle> = {
  critical: AlertTriangle, high: TrendingUp, medium: Minus, low: CheckCircle2,
};

const precip = [22, 18, 14, 9, 6, 4, 3, 2, 5, 11, 8, 6, 4, 3];
const TRIGGER = 15;
type Tone = 'brand' | 'ink' | 'risk' | 'medium';
interface KpiDef { icon: typeof Building2; label: string; value: string; hint: string; tone: Tone }
interface ExpItem { label: string; value: number; display: string }

function compactBRL(v: number): string {
  if (v >= 1e6) return `R$ ${(v / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} mi`;
  if (v >= 1e3) return `R$ ${(v / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 0 })} mil`;
  return formatBRL(v);
}

export default function Dashboard() {
  const { properties, profile, userName } = useStore();
  const firstName = (userName || 'Produtor').trim().split(/\s+/)[0];

  const ctx = useMemo(() => {
    const totalArea = properties.reduce((s, p) => s + p.areaHa, 0);
    const high = properties.filter((p) => p.risk === 'high' || p.risk === 'critical').length;
    return { count: properties.length, totalArea, high };
  }, [properties]);

  const byCulture = useMemo(() => {
    const map = new Map<string, number>();
    properties.forEach((p) => map.set(p.culture, (map.get(p.culture) ?? 0) + p.areaHa));
    return [...map.entries()].map(([culture, area]) => ({ culture, area })).sort((a, b) => b.area - a.area);
  }, [properties]);

  const persona = getPersona(profile, { ...ctx, firstName, byCulture });
  const maxCount = Math.max(...riskClassification.map((r) => r.count));
  const expMax = Math.max(...persona.exposure.map((e) => e.value), 1);

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="chip mb-2 bg-brand-50 text-brand">{persona.badge}</span>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">{persona.title}</h1>
          <p className="mt-1 text-sm text-body">{persona.subtitle}</p>
        </div>
        <span className="chip bg-brand-50 text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" /> Atualizado agora
        </span>
      </div>

      {/* Ações rápidas (produtor) */}
      {persona.isProducer && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <QuickAction to="/properties" icon={Plus} title="Adicionar área" desc="Cadastre um talhão por coordenadas" />
          <QuickAction to="/insurance" icon={ShieldCheck} title="Solicitar proteção" desc="Simule gatilhos paramétricos" />
          <QuickAction to="/alerts" icon={FileSearch} title="Ver laudos" desc="Relatórios e ocorrências" />
        </div>
      )}

      {/* KPIs */}
      <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {persona.kpis.map((k) => <Kpi key={k.label} {...k} />)}
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
            <span className="chip bg-amber-500/10 text-risk-medium"><ArrowDown size={12} /> Tendência de queda</span>
          </div>
          <AreaChart data={precip} trigger={TRIGGER} />
        </div>

        {/* Classificação de risco */}
        <div className="card p-5">
          <span className="label-mono">{persona.riskTitle}</span>
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
                    <div className="mt-1.5"><RiskBar level={r.level} value={r.count} max={maxCount} /></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        {/* Exposição (adaptada ao perfil) */}
        <div className="card p-5 lg:col-span-2">
          <span className="label-mono">{persona.exposureTitle}</span>
          <p className="mt-1 text-sm text-body">{persona.exposureSubtitle}</p>
          <div className="mt-5 space-y-4">
            {persona.exposure.map((c) => (
              <div key={c.label}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-ink">{c.label}</span>
                  <span className="text-body">{c.display}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-soft">
                  <div className="animate-grow h-full rounded-full bg-gradient-to-r from-brand-dark to-brand" style={{ width: `${(c.value / expMax) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-5">
            <MiniStat icon={CloudRain} label="Chuva (24h)" value="12,5 mm" hint="-5% da média" down />
            <MiniStat icon={Satellite} label="API de Satélite" value="Operacional" hint="oráculo primário ativo" />
          </div>
        </div>

        {/* Feed de alertas */}
        <div className="card flex flex-col p-5">
          <div className="flex items-center justify-between">
            <span className="label-mono">{persona.alertsTitle}</span>
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

interface PersonaCtx { count: number; totalArea: number; high: number; firstName: string; byCulture: { culture: string; area: number }[] }

function getPersona(profile: Profile | null, c: PersonaCtx) {
  const areaK = `${(c.totalArea / 1000).toFixed(1)}k`;
  const cultureExp = (rate = 0): ExpItem[] =>
    c.byCulture.map((x) => ({
      label: x.culture,
      value: rate ? x.area * rate : x.area,
      display: rate ? compactBRL(x.area * rate) : `${x.area.toLocaleString('pt-BR')} ha`,
    }));

  if (profile === 'banco') {
    const exposicao = c.totalArea * 12000;
    return {
      badge: 'Banco / FIDC', title: 'Carteira de Crédito Rural',
      subtitle: `Exposição climática das operações financiadas — ${REGION.name}.`,
      riskTitle: 'Risco da carteira', alertsTitle: 'Alertas na carteira',
      exposureTitle: 'Exposição financeira por cultura', exposureSubtitle: 'Valor financiado estimado por cultura.',
      exposure: cultureExp(12000), isProducer: false,
      kpis: [
        { icon: Landmark, label: 'Exposição da carteira', value: compactBRL(exposicao).replace('R$ ', 'R$'), hint: 'crédito rural financiado', tone: 'brand' },
        { icon: Building2, label: 'Operações', value: String(c.count), hint: 'propriedades financiadas', tone: 'ink' },
        { icon: AlertTriangle, label: 'Em risco alto', value: String(c.high), hint: 'garantias sob atenção', tone: 'risk' },
        { icon: TrendingDown, label: 'Default projetado', value: '3,2%', hint: 'inadimplência estimada', tone: 'medium' },
      ] as KpiDef[],
    };
  }

  if (profile === 'seguradora') {
    const capital = policies.reduce((s, p) => s + p.capital, 0);
    const exposure: ExpItem[] = policies.map((p) => ({
      label: p.coverage.replace('Paramétrico — ', ''), value: p.capital, display: compactBRL(p.capital),
    }));
    return {
      badge: 'Seguradora', title: 'Carteira de Apólices Paramétricas',
      subtitle: `Monitoramento de gatilhos e capital segurado — ${REGION.name}.`,
      riskTitle: 'Risco das apólices', alertsTitle: 'Gatilhos monitorados',
      exposureTitle: 'Capital segurado por cobertura', exposureSubtitle: 'Distribuição do capital por tipo de gatilho.',
      exposure, isProducer: false,
      kpis: [
        { icon: ShieldCheck, label: 'Capital segurado', value: compactBRL(capital).replace('R$ ', 'R$'), hint: 'exposição total', tone: 'brand' },
        { icon: FileText, label: 'Apólices ativas', value: String(policies.length), hint: 'contratos vigentes', tone: 'ink' },
        { icon: AlertTriangle, label: 'Gatilhos próximos', value: '2', hint: 'a 90% do limite', tone: 'risk' },
        { icon: Percent, label: 'Sinistralidade', value: '41%', hint: 'loss ratio da safra', tone: 'medium' },
      ] as KpiDef[],
    };
  }

  if (profile === 'cooperativa') {
    return {
      badge: 'Cooperativa', title: 'Visão da Cooperativa',
      subtitle: `Exposição climática regional dos cooperados — ${REGION.name}.`,
      riskTitle: 'Risco dos cooperados', alertsTitle: 'Alertas dos cooperados',
      exposureTitle: 'Área dos cooperados por cultura', exposureSubtitle: 'Hectares monitorados por cultura.',
      exposure: cultureExp(), isProducer: false,
      kpis: [
        { icon: Users, label: 'Cooperados', value: String(c.count), hint: 'áreas integradas', tone: 'brand' },
        { icon: Maximize, label: 'Área total', value: areaK, hint: 'hectares dos cooperados', tone: 'ink' },
        { icon: AlertTriangle, label: 'Em risco', value: String(c.high), hint: 'talhões sob atenção', tone: 'risk' },
        { icon: BellRing, label: 'Alertas ativos', value: '3', hint: 'na região', tone: 'medium' },
      ] as KpiDef[],
    };
  }

  // Produtor (padrão)
  return {
    badge: 'Produtor Rural', title: `Olá, ${c.firstName}`,
    subtitle: `Resumo da sua safra hoje — ${REGION.hub}.`,
    riskTitle: 'Classificação de risco', alertsTitle: 'Alertas das minhas áreas',
    exposureTitle: 'Minhas áreas por cultura', exposureSubtitle: 'Hectares monitorados por cultura.',
    exposure: cultureExp(), isProducer: true,
    kpis: [
      { icon: Sprout, label: 'Minhas áreas', value: String(c.count), hint: 'em monitoramento', tone: 'brand' },
      { icon: Maximize, label: 'Área total', value: areaK, hint: 'hectares da safra', tone: 'ink' },
      { icon: AlertTriangle, label: 'Risco da safra', value: String(c.high), hint: 'áreas em alerta', tone: 'risk' },
      { icon: Thermometer, label: 'Temperatura', value: '28°', hint: '+2.4° em 24h', tone: 'medium' },
    ] as KpiDef[],
  };
}

function QuickAction({ to, icon: Icon, title, desc }: { to: string; icon: typeof Plus; title: string; desc: string }) {
  return (
    <Link to={to} className="card group flex items-center gap-3 p-4 transition hover:-translate-y-0.5 hover:border-brand/40">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand transition group-hover:bg-brand group-hover:text-[#06100C]">
        <Icon size={20} />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="truncate text-xs text-muted">{desc}</p>
      </div>
      <ArrowRight size={16} className="ml-auto text-muted transition group-hover:text-brand" />
    </Link>
  );
}

function Kpi({ icon: Icon, label, value, hint, tone }: KpiDef) {
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

function MiniStat({ icon: Icon, label, value, hint, down }: { icon: typeof CloudRain; label: string; value: string; hint: string; down?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-soft text-brand"><Icon size={18} /></span>
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

function AreaChart({ data, trigger }: { data: number[]; trigger: number }) {
  const w = 600, h = 180, pad = 8;
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
      <line x1={pad} y1={triggerY} x2={w - pad} y2={triggerY} stroke="#FBBF24" strokeWidth="1.5" strokeDasharray="5 5" />
      <polygon points={areaPts} fill="url(#precipFill)" />
      <polyline className="draw-line" points={linePts} fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
      {data.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3" fill="#0E1714" stroke="#22C55E" strokeWidth="2" />)}
    </svg>
  );
}
