import type { Property, Policy, AlertItem, RiskLevel } from './types';

// Foco regional do MVP: Oeste da Bahia (Luís Eduardo Magalhães / Barreiras), cultura principal soja.
export const REGION = {
  name: 'Oeste da Bahia',
  hub: 'Luís Eduardo Magalhães / Barreiras (BA)',
  culture: 'Soja',
  centerLat: -12.09,
  centerLng: -45.8,
};

export const seedProperties: Property[] = [
  {
    id: 'PR-001',
    name: 'Fazenda Santa Clara',
    location: 'Luís Eduardo Magalhães, BA',
    lat: -12.092,
    lng: -45.801,
    culture: 'Soja',
    areaHa: 1250,
    cycle: 'Floração',
    risk: 'low',
  },
  {
    id: 'PR-002',
    name: 'Sítio Boa Vista',
    location: 'Barreiras, BA',
    lat: -12.143,
    lng: -44.99,
    culture: 'Milho',
    areaHa: 850,
    cycle: 'Emergência',
    risk: 'high',
    riskReason: 'Déficit Hídrico',
  },
  {
    id: 'PR-003',
    name: 'Agropecuária Vale Verde',
    location: 'São Desidério, BA',
    lat: -12.36,
    lng: -44.97,
    culture: 'Algodão',
    areaHa: 2100,
    cycle: 'Colheita',
    risk: 'medium',
  },
  {
    id: 'PR-004',
    name: 'Estância das Águas',
    location: 'Formosa do Rio Preto, BA',
    lat: -11.04,
    lng: -45.19,
    culture: 'Soja',
    areaHa: 420,
    cycle: 'Pré-plantio',
    risk: 'low',
  },
  {
    id: 'PR-005',
    name: 'Fazenda Horizonte',
    location: 'Correntina, BA',
    lat: -13.34,
    lng: -44.63,
    culture: 'Soja',
    areaHa: 3500,
    cycle: 'Enchimento de Grãos',
    risk: 'high',
    riskReason: 'Veranico',
  },
];

export const policies: Policy[] = [
  {
    id: 'POL-2024-8891A',
    partner: 'AgriSafeguard S.A.',
    coverage: 'Paramétrico — Déficit Hídrico',
    capital: 2450000,
    status: 'active',
    asset: 'Soja',
    region: 'Oeste da Bahia',
  },
  {
    id: 'POL-2024-4420B',
    partner: 'TerraNova Seguros',
    coverage: 'Paramétrico — Excesso de Chuva',
    capital: 1120000,
    status: 'active',
    asset: 'Milho',
    region: 'Oeste da Bahia',
  },
  {
    id: 'POL-2024-7741C',
    partner: 'ClimaTrust',
    coverage: 'Paramétrico — Veranico',
    capital: 860000,
    status: 'active',
    asset: 'Soja',
    region: 'Oeste da Bahia',
  },
];

export const alerts: AlertItem[] = [
  {
    id: 'AL-501',
    title: 'Gatilho Acionado: Déficit Hídrico',
    level: 'critical',
    description: 'Acumulado pluviométrico de 12 mm em 30 dias — abaixo do gatilho de 15 mm/mês no talhão.',
    date: '08 Jun 2026',
    time: '06:00',
  },
  {
    id: 'AL-502',
    title: 'Alerta de Risco Emitido: Veranico',
    level: 'high',
    description: 'Previsão de 15 dias consecutivos sem chuva avançando sobre o Oeste da Bahia.',
    date: '06 Jun 2026',
    time: '14:30',
  },
  {
    id: 'AL-503',
    title: 'Índice de Vegetação (NDVI) em queda',
    level: 'medium',
    description: 'Redução de vigor vegetativo detectada por satélite no Lote 04 da Fazenda Boa Vista.',
    date: '04 Jun 2026',
    time: '09:15',
  },
];

export const riskClassification: { level: RiskLevel; label: string; count: number }[] = [
  { level: 'critical', label: 'Crítico', count: 12 },
  { level: 'high', label: 'Alto', count: 34 },
  { level: 'medium', label: 'Médio', count: 89 },
  { level: 'low', label: 'Baixo', count: 245 },
];

export const riskMeta: Record<RiskLevel, { label: string; color: string; bg: string; text: string }> = {
  critical: { label: 'Crítico', color: '#DC2626', bg: 'bg-red-50', text: 'text-risk-critical' },
  high: { label: 'Alto', color: '#EF4444', bg: 'bg-red-50', text: 'text-risk-high' },
  medium: { label: 'Médio', color: '#F59E0B', bg: 'bg-amber-50', text: 'text-risk-medium' },
  low: { label: 'Baixo', color: '#16A34A', bg: 'bg-brand-50', text: 'text-risk-low' },
};

export const dataSources = [
  { name: 'INMET', role: 'Estações meteorológicas (oráculo primário)', status: 'Operacional' },
  { name: 'CPTEC / INPE', role: 'Previsão numérica e modelagem (fallback)', status: 'Operacional' },
  { name: 'Satélite NDVI', role: 'Índices de vegetação e umidade do solo', status: 'Operacional' },
];

export function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}
