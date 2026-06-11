import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Layers } from 'lucide-react';
import { riskMeta, REGION } from '../lib/data';
import type { Property } from '../lib/types';

function pinIcon(color: string) {
  return L.divIcon({
    className: 'climarisk-pin',
    html: `<span style="
      display:flex;align-items:center;justify-content:center;
      width:24px;height:24px;border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:${color};border:2px solid #fff;
      box-shadow:0 4px 10px rgba(0,0,0,.5)">
      <span style="width:7px;height:7px;border-radius:50%;background:#fff;transform:rotate(45deg)"></span>
    </span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22],
  });
}

/**
 * Mapa real (OpenStreetMap via tiles escuros CartoDB), sem chave de API,
 * com marcadores georreferenciados por nível de risco. Centrado no Oeste da Bahia.
 */
export function MockMap({
  properties,
  height = 400,
  showControls = true,
  label = 'Satélite Multi-Espectral',
}: {
  properties: Property[];
  height?: string | number;
  showControls?: boolean;
  label?: string;
}) {
  const center: [number, number] = [REGION.centerLat, REGION.centerLng];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line" style={{ height }}>
      <MapContainer
        center={center}
        zoom={8}
        scrollWheelZoom={false}
        zoomControl={showControls}
        attributionControl
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={19}
        />
        {properties.map((p) => (
          <Marker key={p.id} position={[p.lat, p.lng]} icon={pinIcon(riskMeta[p.risk].color)}>
            <Popup>
              <div style={{ minWidth: 150 }}>
                <strong>{p.name}</strong>
                <br />
                <span style={{ color: '#9fb0aa', fontSize: 12 }}>{p.location}</span>
                <br />
                <span style={{ color: riskMeta[p.risk].color, fontWeight: 600, fontSize: 12 }}>
                  Risco {riskMeta[p.risk].label}
                </span>{' '}
                <span style={{ color: '#9fb0aa', fontSize: 12 }}>· {p.culture}</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Etiqueta de camada */}
      <div className="pointer-events-none absolute left-3 top-3 z-[1000]">
        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface/90 px-3 py-2 shadow-card backdrop-blur">
          <Layers size={14} className="text-brand" />
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink">{label}</span>
        </div>
      </div>
    </div>
  );
}
