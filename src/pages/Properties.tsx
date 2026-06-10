import { useMemo, useState } from 'react';
import { Plus, Download, X, MapPin, MoreVertical } from 'lucide-react';
import { RiskBadge } from '../components/primitives';
import { useStore } from '../lib/store';
import type { Property, RiskLevel } from '../lib/types';

const filters = ['Todos', 'Alto Risco', 'Soja'] as const;

export default function Properties() {
  const { properties, addProperty } = useStore();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
  const [modal, setModal] = useState(false);

  const filtered = useMemo(() => {
    if (filter === 'Alto Risco') return properties.filter((p) => p.risk === 'high' || p.risk === 'critical');
    if (filter === 'Soja') return properties.filter((p) => p.culture === 'Soja');
    return properties;
  }, [properties, filter]);

  function exportCSV() {
    const header = ['ID', 'Nome', 'Localização', 'Cultura', 'Área (ha)', 'Ciclo', 'Risco', 'Lat', 'Lng'];
    const rows = properties.map((p) => [p.id, p.name, p.location, p.culture, p.areaHa, p.cycle, p.risk, p.lat, p.lng]);
    const csv = [header, ...rows].map((r) => r.join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'climarisk-propriedades.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Propriedades Monitoradas</h1>
          <p className="mt-1 text-sm text-body">Portfólio de propriedades sob análise de risco climático.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-ghost px-4 py-2.5">
            <Download size={16} /> Exportar CSV
          </button>
          <button onClick={() => setModal(true)} className="btn-primary px-4 py-2.5">
            <Plus size={16} /> Adicionar Propriedade
          </button>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  filter === f ? 'bg-brand-50 text-brand' : 'text-body hover:bg-soft'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-muted">
            Visualizando {filtered.length} de {properties.length}
          </span>
        </div>

        {/* Tabela desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {['Nome da Propriedade', 'Localização', 'Cultura', 'Área (ha)', 'Ciclo Atual', 'Status de Risco', ''].map((h) => (
                  <th key={h} className="px-5 py-3 font-mono text-[11px] uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-line last:border-0 hover:bg-soft/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="font-mono text-[11px] text-muted">ID: {p.id}</p>
                  </td>
                  <td className="px-5 py-4 text-body">{p.location}</td>
                  <td className="px-5 py-4">
                    <span className="chip bg-lavender text-body">{p.culture}</span>
                  </td>
                  <td className="px-5 py-4 font-mono font-semibold text-ink">{p.areaHa.toLocaleString('pt-BR')}</td>
                  <td className="px-5 py-4 text-body">{p.cycle}</td>
                  <td className="px-5 py-4">
                    <RiskBadge level={p.risk} label={p.riskReason ? `${riskLabel(p.risk)} (${p.riskReason})` : undefined} />
                  </td>
                  <td className="px-5 py-4 text-muted"><MoreVertical size={16} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="divide-y divide-line md:hidden">
          {filtered.map((p) => (
            <div key={p.id} className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-ink">{p.name}</p>
                  <p className="text-xs text-body">{p.location}</p>
                </div>
                <RiskBadge level={p.risk} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <Info label="Cultura" value={p.culture} />
                <Info label="Área" value={`${p.areaHa.toLocaleString('pt-BR')} ha`} />
                <Info label="Ciclo" value={p.cycle} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && <AddPropertyModal onClose={() => setModal(false)} onAdd={addProperty} />}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="label-mono text-[9px]">{label}</span>
      <p className="font-medium text-ink">{value}</p>
    </div>
  );
}

function riskLabel(r: RiskLevel) {
  return { critical: 'Crítico', high: 'Alto', medium: 'Médio', low: 'Baixo' }[r];
}

function AddPropertyModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Omit<Property, 'id'>) => void }) {
  const [form, setForm] = useState({ name: '', location: '', lat: '', lng: '', culture: 'Soja', areaHa: '' });
  const [error, setError] = useState('');

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lat = parseFloat(form.lat);
    const lng = parseFloat(form.lng);
    if (!form.name.trim()) return setError('Informe o nome da propriedade.');
    if (Number.isNaN(lat) || lat < -90 || lat > 90) return setError('Latitude inválida (-90 a 90).');
    if (Number.isNaN(lng) || lng < -180 || lng > 180) return setError('Longitude inválida (-180 a 180).');
    onAdd({
      name: form.name.trim(),
      location: form.location.trim() || 'Oeste da Bahia, BA',
      lat,
      lng,
      culture: form.culture,
      areaHa: parseFloat(form.areaHa) || 0,
      cycle: 'Pré-plantio',
      risk: 'low',
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={onClose}>
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-lg animate-fade-up rounded-2xl bg-white p-6 shadow-lift"
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="label-mono text-brand">RF02 · Coordenadas</span>
            <h3 className="mt-1 text-xl font-bold text-ink">Adicionar Propriedade</h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted hover:text-ink"><X size={20} /></button>
        </div>

        <div className="mt-5 space-y-4">
          <Field label="Nome da propriedade" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Fazenda Nova Esperança" />
          <Field label="Localização" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Barreiras, BA" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude" value={form.lat} onChange={(v) => setForm({ ...form, lat: v })} placeholder="-12.092" mono />
            <Field label="Longitude" value={form.lng} onChange={(v) => setForm({ ...form, lng: v })} placeholder="-45.801" mono />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-mono mb-1.5 block">Cultura</label>
              <select className="field" value={form.culture} onChange={(e) => setForm({ ...form, culture: e.target.value })}>
                {['Soja', 'Milho', 'Algodão', 'Trigo'].map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Área (ha)" value={form.areaHa} onChange={(v) => setForm({ ...form, areaHa: v })} placeholder="1250" mono />
          </div>
        </div>

        {error && <p className="mt-3 flex items-center gap-1.5 text-sm text-risk-critical"><MapPin size={14} /> {error}</p>}

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className="btn-ghost flex-1">Cancelar</button>
          <button type="submit" className="btn-primary flex-1"><Plus size={16} /> Vincular ao monitoramento</button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, mono,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <div>
      <label className="label-mono mb-1.5 block">{label}</label>
      <input className={`field ${mono ? 'font-mono' : ''}`} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
