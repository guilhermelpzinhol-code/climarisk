import { useState } from 'react';
import { Droplet, Sun, Activity, Landmark, ShieldCheck, ArrowRight } from 'lucide-react';
import { Donut, Meter, RiskBadge } from '../components/primitives';
import { policies, formatBRL } from '../lib/data';
import type { RiskLevel } from '../lib/types';

export default function Insurance() {
  const [form, setForm] = useState({ talhao: 'Fazenda Boa Vista, Lote 04', culture: 'Soja (Glycine max)', period: 'Out 2025 - Mar 2026' });
  const [result, setResult] = useState<{ level: RiskLevel; rain: number; dry: number } | null>(null);
  const [simulating, setSimulating] = useState(false);

  function simulate() {
    setSimulating(true);
    setTimeout(() => {
      // Cálculo mock determinístico a partir do nome do talhão.
      const seed = form.talhao.length + form.period.length;
      const rain = 80 + (seed % 90);
      const dry = 6 + (seed % 16);
      const level: RiskLevel = dry > 15 ? 'high' : dry > 12 ? 'medium' : 'low';
      setResult({ level, rain, dry });
      setSimulating(false);
    }, 700);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Mitigação de Risco Climático de Precisão</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-body">
        Monitore gatilhos paramétricos em tempo real, gerencie apólices ativas e simule novos cenários de proteção
        agrícola baseados em dados satelitais de alta fidelidade.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {/* Simulador (RF05) */}
        <div className="card relative overflow-hidden p-6 lg:col-span-2">
          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{ background: 'radial-gradient(80% 80% at 90% 10%, #16A34A, transparent 60%)' }}
          />
          <div className="relative">
            <span className="label-mono text-brand">Simulador de Risco · RF05</span>
            <h2 className="mt-2 text-2xl font-bold text-ink">Configurar Nova Proposta</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label-mono mb-1.5 block">Localização (Talhão)</label>
                <input className="field" value={form.talhao} onChange={(e) => setForm({ ...form, talhao: e.target.value })} />
              </div>
              <div>
                <label className="label-mono mb-1.5 block">Cultura</label>
                <select className="field" value={form.culture} onChange={(e) => setForm({ ...form, culture: e.target.value })}>
                  {['Soja (Glycine max)', 'Milho (Zea mays)', 'Algodão (Gossypium)'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label-mono mb-1.5 block">Período de Cobertura</label>
                <select className="field" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })}>
                  {['Out 2025 - Mar 2026', 'Nov 2025 - Abr 2026', 'Fev 2026 - Jun 2026'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <button onClick={simulate} disabled={simulating} className="btn-primary mt-6">
              {simulating ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : <Activity size={16} />}
              Simular Gatilhos
            </button>

            {result && (
              <div className="mt-6 animate-fade-up rounded-xl border border-line bg-soft/60 p-5">
                <div className="flex items-center justify-between">
                  <span className="label-mono">Resultado da Simulação</span>
                  <RiskBadge level={result.level} />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-body">Índice pluviométrico projetado</p>
                    <p className="font-mono text-2xl font-bold text-ink">{result.rain}<span className="text-sm text-muted"> mm</span></p>
                    <p className="text-xs text-muted">Gatilho: &lt; 150 mm</p>
                  </div>
                  <div>
                    <p className="text-sm text-body">Estresse hídrico estimado</p>
                    <p className="font-mono text-2xl font-bold text-ink">{result.dry}<span className="text-sm text-muted"> dias</span></p>
                    <p className="text-xs text-muted">Gatilho: &gt; 15 dias</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Índices */}
        <div className="flex flex-col gap-5">
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono">Índice Pluviométrico</span>
              <Droplet size={16} className="text-brand" />
            </div>
            <p className="mt-3 font-mono text-4xl font-bold text-ink">124<span className="text-base text-muted"> mm</span></p>
            <div className="mt-3"><Meter value={124} max={200} color="#16A34A" /></div>
            <p className="mt-2 font-mono text-[11px] text-muted">Acumulado (30d) · Gatilho: &lt; 150 mm</p>
          </div>
          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="label-mono">Estresse Hídrico</span>
              <Sun size={16} className="text-risk-medium" />
            </div>
            <p className="mt-3 font-mono text-4xl font-bold text-ink">12<span className="text-base text-muted"> dias</span></p>
            <div className="mt-3"><Meter value={12} max={20} color="#F59E0B" /></div>
            <p className="mt-2 font-mono text-[11px] text-muted">Dias consecutivos s/ chuva · Gatilho: &gt; 15 dias</p>
          </div>
          {/* Visualizador de gatilho (mobile-friendly donut) */}
          <div className="card flex flex-col items-center p-5">
            <span className="label-mono self-start">Visualizador de Gatilho</span>
            <div className="mt-2"><Donut value={12} max={30} unit="mm" /></div>
            <div className="mt-3 flex w-full justify-between border-t border-line pt-3 text-xs">
              <span className="text-body">Gatilho<br /><strong className="font-mono text-ink">15mm / mês</strong></span>
              <span className="text-right text-body">Data Limite<br /><strong className="font-mono text-ink">28 Fev</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Contratos ativos */}
      <div className="card mt-5 overflow-hidden">
        <div className="flex items-center justify-between border-b border-line p-5">
          <span className="label-mono">Contratos Ativos</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand">Ver todos <ArrowRight size={14} /></span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {['Parceiro / Seguradora', 'ID da Apólice', 'Tipo de Cobertura', 'Capital Segurado', 'Status'].map((h) => (
                  <th key={h} className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-soft/60">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lavender text-body">
                        {p.partner.includes('Seguros') || p.partner.includes('Safe') ? <Landmark size={16} /> : <ShieldCheck size={16} />}
                      </span>
                      <span className="font-semibold text-ink">{p.partner}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-body">{p.id}</td>
                  <td className="px-5 py-4 text-body">{p.coverage}</td>
                  <td className="px-5 py-4 font-mono font-semibold text-ink">{formatBRL(p.capital)}</td>
                  <td className="px-5 py-4">
                    <span className="chip bg-brand-50 text-brand"><span className="h-1.5 w-1.5 rounded-full bg-brand" /> Ativo</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
