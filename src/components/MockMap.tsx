import { REGION } from '../lib/data';
import type { Property } from '../lib/types';

/**
 * Mapa real do Google Maps (embed oficial, sem necessidade de chave de API).
 * - App (Dashboard / Mapa): interativo, permite pan e zoom.
 * - Landing: `interactive={false}` → comporta-se como uma imagem estática do
 *   local em um mapa profissional, sem ser um mapa responsivo.
 */
export function MockMap({
  properties,
  height = 400,
  interactive = true,
}: {
  properties: Property[];
  height?: string | number;
  showControls?: boolean;
  label?: string;
  interactive?: boolean;
}) {
  // Centraliza no primeiro ativo monitorado ou no polo regional (Oeste da Bahia).
  const focus = properties[0];
  const lat = focus?.lat ?? REGION.centerLat;
  const lng = focus?.lng ?? REGION.centerLng;
  const zoom = interactive ? 9 : 11;
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=pt-BR&output=embed`;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line" style={{ height }}>
      <iframe
        title="Mapa Climarisk"
        src={src}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full"
        style={{ border: 0, filter: 'grayscale(0.15) contrast(1.05)' }}
      />
      {/* Na landing, bloqueia a interação para virar uma imagem do local. */}
      {!interactive && <div className="absolute inset-0 z-[5] cursor-default" />}
    </div>
  );
}
