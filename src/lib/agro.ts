import type { RiskLevel } from './types';

/**
 * Calendário agrícola simplificado (safra de verão no Cerrado/Oeste da Bahia).
 * Deriva o "ciclo atual" da cultura a partir do mês — evita pedir esse dado no cadastro.
 * Mês: 0=jan ... 11=dez.
 */
export function derivarCiclo(cultura: string, data = new Date()): string {
  const m = data.getMonth();
  const c = cultura.toLowerCase();

  if (c.includes('soja')) {
    if (m >= 8 && m <= 9) return 'Plantio'; // set–out
    if (m === 10) return 'Emergência'; // nov
    if (m === 11 || m === 0) return 'Floração'; // dez–jan
    if (m === 1) return 'Enchimento de grãos'; // fev
    if (m >= 2 && m <= 3) return 'Colheita'; // mar–abr
    return 'Pré-plantio';
  }
  if (c.includes('milho')) {
    if (m >= 0 && m <= 1) return 'Plantio'; // jan–fev (safrinha)
    if (m >= 2 && m <= 3) return 'Desenvolvimento';
    if (m >= 4 && m <= 5) return 'Floração';
    if (m >= 6 && m <= 7) return 'Colheita';
    return 'Pré-plantio';
  }
  if (c.includes('algod')) {
    if (m >= 10 || m === 0) return 'Plantio';
    if (m >= 1 && m <= 3) return 'Desenvolvimento';
    if (m >= 4 && m <= 6) return 'Maturação';
    if (m >= 6 && m <= 8) return 'Colheita';
    return 'Pré-plantio';
  }
  // Trigo / outras (inverno irrigado)
  if (m >= 4 && m <= 5) return 'Plantio';
  if (m >= 6 && m <= 7) return 'Desenvolvimento';
  if (m >= 8 && m <= 9) return 'Colheita';
  return 'Pré-plantio';
}

/**
 * Estimativa (mock) de risco inicial a partir de cultura, estação e latitude.
 * Serve só para já classificar a propriedade recém-cadastrada até a 1ª varredura.
 */
export function estimarRiscoInicial(
  cultura: string,
  data = new Date(),
  lat = -12
): { risk: RiskLevel; motivo?: string } {
  const m = data.getMonth();
  const c = cultura.toLowerCase();

  // Janela de veranico no Cerrado (jan–fev) pesa mais para soja em enchimento de grãos.
  const janelaVeranico = m === 0 || m === 1;
  const sulFrio = lat < -20 && (m === 4 || m === 5 || m === 6); // risco de geada no Sul

  if (c.includes('soja') && janelaVeranico) return { risk: 'medium', motivo: 'Janela de veranico' };
  if (sulFrio) return { risk: 'medium', motivo: 'Risco de geada' };
  if (m >= 8 && m <= 9) return { risk: 'low', motivo: 'Início de safra' };
  return { risk: 'low' };
}
