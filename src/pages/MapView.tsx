import { MockMap } from '../components/MockMap';
import { RiskBadge } from '../components/primitives';
import { useStore } from '../lib/store';

export default function MapView() {
  const { properties } = useStore();
  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Mapa</h1>
      <p className="mt-1 text-sm text-body">Camadas ambientais sobrepostas às áreas de produção monitoradas.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="card overflow-hidden p-2">
          <MockMap properties={properties} height={560} label="Camada NDVI · Umidade do Solo" />
        </div>
        <div className="card p-5">
          <span className="label-mono">Ativos no mapa</span>
          <ul className="mt-4 space-y-3">
            {properties.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-2 border-b border-line pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{p.name}</p>
                  <p className="font-mono text-[11px] text-muted">{p.lat.toFixed(3)}, {p.lng.toFixed(3)}</p>
                </div>
                <RiskBadge level={p.risk} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
