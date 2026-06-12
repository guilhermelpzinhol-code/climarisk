export interface LocalEncontrado {
  lat: number;
  lng: number;
  municipio: string;
  uf: string;
  label: string;
}

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  'ISO3166-2-lvl4'?: string;
}
interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address?: NominatimAddress;
}

function ufFrom(addr?: NominatimAddress): string {
  const iso = addr?.['ISO3166-2-lvl4']; // ex.: "BR-BA"
  if (iso && iso.includes('-')) return iso.split('-')[1];
  return '';
}

function municipioFrom(item: NominatimItem): string {
  const a = item.address;
  return a?.city || a?.town || a?.village || a?.municipality || a?.county || item.name || '';
}

/**
 * Busca locais no Brasil pela API pública do OpenStreetMap (Nominatim, sem chave).
 * Retorna coordenadas + município/UF para automatizar o cadastro de propriedades.
 */
export async function buscarLocais(q: string, signal?: AbortSignal): Promise<LocalEncontrado[]> {
  const termo = q.trim();
  if (termo.length < 3) return [];
  const url =
    'https://nominatim.openstreetmap.org/search' +
    `?q=${encodeURIComponent(termo)}` +
    '&format=jsonv2&addressdetails=1&countrycodes=br&accept-language=pt-BR&limit=6';

  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Falha na busca de locais.');
  const data = (await res.json()) as NominatimItem[];

  return data.map((it) => {
    const municipio = municipioFrom(it);
    const uf = ufFrom(it.address);
    const estado = it.address?.state ?? '';
    const label = municipio ? `${municipio}${uf ? ' - ' + uf : estado ? ' - ' + estado : ''}` : it.display_name;
    return {
      lat: parseFloat(it.lat),
      lng: parseFloat(it.lon),
      municipio: municipio || it.display_name.split(',')[0],
      uf: uf || '',
      label,
    };
  });
}
