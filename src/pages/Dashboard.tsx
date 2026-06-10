import { Thermometer, CloudRain, ArrowUp, ArrowDown, Satellite, AlertTriangle, TrendingUp, Minus, CheckCircle2, PieChart } from 'lucide-react';
import { MockMap } from '../components/MockMap';
import { RiskBar } from '../components/primitives';
import { useStore } from '../lib/store';
import { riskClassification, REGION } from '../lib/data';
import type { RiskLevel } from '../lib/types';

const riskIcon: Record<RiskLevel, typeof AlertTriangle> = {
  critical: AlertTriangle,
  high: TrendingUp,
  medium: Minus,
  low: CheckCircle2,
};

export default function Dashboard() {
  const { properties } = useStore();
  const maxCount = Math.max(...riskClassification.map((r) => r.count));

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Monitoramento Global</h1>
          <p className="mt-1 text-sm text-body">
            Visão georreferenciada de ativos agrícolas em tempo real — {REGION.hub}.
          </p>
        </div>
        <span className="chip bg-brand-50 text-brand">
          <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" /> Atualizado agora
        </span>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Mapa */}
        <div className="card overflow-hidden p-2 lg:col-span-2">
          <MockMap properties={properties} height={520} />
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono">Classificação de Risco Global</span>
              <PieChart size={16} className="text-muted" />
            </div>
            <div className="mt-4 space-y-3.5">
              {riskClassification.map((r) => {
                const Icon = riskIcon[r.level];
                const colorMap = { critical: '#DC2626', high: '#EF4444', medium: '#F59E0B', low: '#16A34A' };
                return (
                  <div key={r.level} className="flex items-center gap-3">
                    <span
                      className="flex h-9 w-9 items-center justify-center rounded-lg"
                      style={{ background: `${colorMap[r.level]}14`, color: colorMap[r.level] }}
                    >
                      <Icon size={17} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{r.label}</span>
                        <span className="font-mono text-sm font-bold" style={{ color: colorMap[r.level] }}>{r.count}</span>
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

          <div className="grid grid-cols-2 gap-5">
            <div className="card p-5">
              <span className="label-mono flex items-center gap-1.5"><Thermometer size={13} /> Temperatura</span>
              <p className="mt-3 font-mono text-3xl font-bold text-ink">28°<span className="text-base text-muted">C</span></p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-risk-high">
                <ArrowUp size={12} /> +2.4° nas últimas 24h
              </p>
            </div>
            <div className="card p-5">
              <span className="label-mono flex items-center gap-1.5"><CloudRain size={13} /> Chuva (24h)</span>
              <p className="mt-3 font-mono text-3xl font-bold text-ink">12.5<span className="text-base text-muted">mm</span></p>
              <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand">
                <ArrowDown size={12} /> -5% abaixo da média
              </p>
            </div>
          </div>

          <div className="card flex items-center gap-4 p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <Satellite size={20} />
            </span>
            <div className="flex-1">
              <span className="label-mono">Status do Sistema</span>
              <p className="text-sm font-semibold text-ink">API de Satélite</p>
            </div>
            <span className="chip bg-brand-50 text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" /> Operacional
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
