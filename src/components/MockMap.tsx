import { Layers, Plus, Minus, Crosshair } from 'lucide-react';
import { riskMeta } from '../lib/data';
import type { Property } from '../lib/types';

interface Marker {
  x: number;
  y: number;
  property: Property;
}

/**
 * Mapa estilizado (SVG/CSS) inspirado no protótipo — terreno verde plano,
 * cursos d'água e marcadores georreferenciados em cores de risco.
 * Sem tiles externos: zero chave de API, deploy 100% confiável.
 */
export function MockMap({
  properties,
  height = '100%',
  showControls = true,
  label = 'Satélite Multi-Espectral',
}: {
  properties: Property[];
  height?: string | number;
  showControls?: boolean;
  label?: string;
}) {
  // Distribui marcadores de forma estável a partir das coordenadas.
  const markers: Marker[] = properties.slice(0, 8).map((p, i) => ({
    property: p,
    x: 14 + ((Math.abs(p.lng * 53 + i * 91) % 70)),
    y: 16 + ((Math.abs(p.lat * 47 + i * 67) % 64)),
  }));

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-line"
      style={{ height, background: '#dff0e2' }}
    >
      {/* Água e relevo */}
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#d8eede" />
        <path d="M0 90 Q120 70 200 110 T400 120 V0 H0 Z" fill="#e3f2e8" />
        <path d="M0 300 Q140 250 240 280 T400 250 V300 Z" fill="#cfe9d6" />
        {/* Rios */}
        <path d="M300 0 C290 60 330 110 280 160 S320 250 300 300" fill="none" stroke="#bcd9f2" strokeWidth="6" opacity="0.8" />
        <path d="M300 0 C290 60 330 110 280 160 S320 250 300 300" fill="none" stroke="#9ec9ec" strokeWidth="4" />
        <path d="M0 150 C80 140 120 180 200 160 S320 150 400 175" fill="none" stroke="#9ec9ec" strokeWidth="3" opacity="0.7" />
        {/* Lagos */}
        <ellipse cx="120" cy="60" rx="14" ry="8" fill="#a9d2f0" />
        <ellipse cx="350" cy="210" rx="18" ry="11" fill="#a9d2f0" />
        <ellipse cx="70" cy="230" rx="10" ry="6" fill="#a9d2f0" />
      </svg>

      {/* Grade sutil */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Etiqueta camada */}
      <div className="absolute left-4 top-4">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-white/90 px-3 py-2 shadow-card backdrop-blur">
          <Layers size={14} className="text-brand" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{label}</span>
        </div>
      </div>

      {/* Marcadores */}
      {markers.map((m) => {
        const color = riskMeta[m.property.risk].color;
        return (
          <div
            key={m.property.id}
            className="group absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            <div className="relative flex flex-col items-center">
              <div
                className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-lift"
                style={{ background: color }}
              >
                <span className="h-2 w-2 rounded-full bg-white" />
              </div>
              <div className="h-2 w-2 -mt-1 rotate-45 border-b-2 border-r-2 border-white" style={{ background: color }} />
              <div className="pointer-events-none absolute bottom-full mb-1 hidden whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lift group-hover:block">
                {m.property.name}
                <span className="ml-1.5 opacity-70">· {riskMeta[m.property.risk].label}</span>
              </div>
            </div>
          </div>
        );
      })}

      {showControls && (
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink shadow-card transition hover:text-brand">
            <Plus size={16} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-ink shadow-card transition hover:text-brand">
            <Minus size={16} />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-white text-brand shadow-card">
            <Crosshair size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
