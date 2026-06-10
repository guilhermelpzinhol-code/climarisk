export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export type Profile = 'produtor' | 'banco' | 'cooperativa' | 'seguradora';

export interface Property {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  culture: string;
  areaHa: number;
  cycle: string;
  risk: RiskLevel;
  riskReason?: string;
}

export interface Policy {
  id: string;
  partner: string;
  coverage: string;
  capital: number;
  status: 'active' | 'pending';
  asset: string;
  region: string;
}

export interface AlertItem {
  id: string;
  title: string;
  level: RiskLevel;
  description: string;
  date: string;
  time: string;
}
