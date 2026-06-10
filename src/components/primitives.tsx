import type { RiskLevel } from '../lib/types';
import { riskMeta } from '../lib/data';

export function RiskBadge({ level, label }: { level: RiskLevel; label?: string }) {
  const m = riskMeta[level];
  return (
    <span className="chip" style={{ background: `${m.color}14`, color: m.color }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: m.color }} />
      {label ?? m.label}
    </span>
  );
}

export function StatPill({ children, tone = 'up' }: { children: React.ReactNode; tone?: 'up' | 'down' }) {
  const color = tone === 'up' ? '#16A34A' : '#DC2626';
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color }}>
      {children}
    </span>
  );
}

/** Donut de gatilho paramétrico (SVG, sem dependências). */
export function Donut({
  value,
  max,
  unit,
  color = '#DC2626',
  size = 168,
}: {
  value: number;
  max: number;
  unit: string;
  color?: string;
  size?: number;
}) {
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value / max);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#DBEAFE" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
      />
      <g className="rotate-90" style={{ transformOrigin: 'center' }}>
        <text x="50%" y="48%" textAnchor="middle" className="fill-ink font-mono" fontSize="30" fontWeight="700">
          {value}
          <tspan fontSize="14">{unit}</tspan>
        </text>
        <text x="50%" y="62%" textAnchor="middle" className="fill-muted font-mono" fontSize="11">
          Acumulado
        </text>
      </g>
    </svg>
  );
}

/** Barra de progresso de classificação de risco. */
export function RiskBar({ level, value, max }: { level: RiskLevel; value: number; max: number }) {
  const m = riskMeta[level];
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div
        className="h-full rounded-full transition-all"
        style={{ width: `${(value / max) * 100}%`, background: m.color }}
      />
    </div>
  );
}

export function Meter({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
    </div>
  );
}
