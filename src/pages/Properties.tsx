import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus, Download, MapPin, MoreVertical, Search, Loader2, Navigation, Pencil, Trash2,
  ShieldCheck, Check, ChevronDown, Eye, Sprout, CalendarClock,
} from 'lucide-react';
import { RiskBadge } from '../components/primitives';
import { Modal } from '../components/Modal';
import { MockMap } from '../components/MockMap';
import { toast } from '../components/Toaster';
import { useStore } from '../lib/store';
import { buscarLocais, type LocalEncontrado } from '../lib/geocode';
import { derivarCiclo, estimarRiscoInicial } from '../lib/agro';
import type { Property, RiskLevel } from '../lib/types';

const filters = ['Todos', 'Alto Risco', 'Soja'] as const;
const CULTURAS = ['Soja', 'Milho', 'Algodão', 'Trigo', 'Café', 'Cana-de-açúcar'];

function riskLabel(r: RiskLevel) {
  return { critical: 'Crítico', high: 'Alto', medium: 'Médio', low: 'Baixo' }[r];
}

export default function Properties() {
  const { properties, addProperty, updateProperty, removeProperty } = useStore();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [filter, setFilter] = useState<(typeof filters)[number]>('Todos');
  const [addOpen, setAddOpen] = useState(false);
  const [detail, setDetail] = useState<Property | null>(null);
  const [edit, setEdit] = useState<Property | null>(null);
  const [toDelete, setToDelete] = useState<Property | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (filter === 'Alto Risco') return properties.filter((p) => p.risk === 'high' || p.risk === 'critical');
    if (filter === 'Soja') return properties.filter((p) => p.culture === 'Soja');
    return properties;
  }, [properties, filter]);

  // Abre o detalhe quando chega via busca global (?p=ID)
  useEffect(() => {
    const id = params.get('p');
    if (!id) return;
    const found = properties.find((p) => p.id === id);
    if (found) setDetail(found);
    params.delete('p');
    setParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, properties]);

  function exportCSV() {
    const header = ['ID', 'Nome', 'Localização', 'Cultura', 'Área (ha)', 'Ciclo', 'Risco', 'Lat', 'Lng'];
    const rows = properties.map((p) => [p.id, p.name, p.location, p.culture, p.areaHa, p.cycle, riskLabel(p.risk), p.lat, p.lng]);
    const csv = [header, ...rows].map((r) => r.join(';')).join('\n');
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'climarisk-propriedades.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('CSV exportado com sucesso.');
  }

  return (
    <div className="mx-auto max-w-7xl animate-fade-up">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink sm:text-3xl">Propriedades Monitoradas</h1>
          <p className="mt-1 text-sm text-body">Portfólio de propriedades sob análise de risco climático.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="btn-ghost px-4 py-2.5"><Download size={16} /> Exportar CSV</button>
          <button onClick={() => setAddOpen(true)} className="btn-primary px-4 py-2.5"><Plus size={16} /> Adicionar Propriedade</button>
        </div>
      </div>

      <div className="card mt-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4">
          <div className="flex gap-2">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${filter === f ? 'bg-brand-50 text-brand' : 'text-body hover:bg-soft'}`}>
                {f}
              </button>
            ))}
          </div>
          <span className="text-xs text-muted">Visualizando {filtered.length} de {properties.length}</span>
        </div>

        {/* Tabela desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line text-muted">
                {['Nome da Propriedade', 'Localização', 'Cultura', 'Área (ha)', 'Ciclo Atual', 'Status de Risco', 'Ações'].map((h) => (
                  <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} onClick={() => setDetail(p)} className="cursor-pointer border-b border-line last:border-0 transition hover:bg-soft/60">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-ink">{p.name}</p>
                    <p className="text-[11px] text-muted">ID: {p.id}</p>
                  </td>
                  <td className="px-5 py-4 text-body">{p.location}</td>
                  <td className="px-5 py-4"><span className="chip bg-lavender text-body">{p.culture}</span></td>
                  <td className="px-5 py-4 font-semibold text-ink">{p.areaHa.toLocaleString('pt-BR')}</td>
                  <td className="px-5 py-4 text-body">{p.cycle}</td>
                  <td className="px-5 py-4"><RiskBadge level={p.risk} label={p.riskReason ? `${riskLabel(p.risk)} · ${p.riskReason}` : undefined} /></td>
                  <td className="relative px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => setMenuId(menuId === p.id ? null : p.id)} aria-label="Ações" className="rounded-lg p-1.5 text-muted transition hover:bg-soft hover:text-ink">
                      <MoreVertical size={16} />
                    </button>
                    {menuId === p.id && (
                      <RowMenu
                        onClose={() => setMenuId(null)}
                        onView={() => { setMenuId(null); setDetail(p); }}
                        onEdit={() => { setMenuId(null); setEdit(p); }}
                        onDelete={() => { setMenuId(null); setToDelete(p); }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="divide-y divide-line md:hidden">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => setDetail(p)} className="w-full p-4 text-left">
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
            </button>
          ))}
        </div>
      </div>

      <AddPropertyFlow open={addOpen} onClose={() => setAddOpen(false)} onAdd={(p) => { const novo = addProperty(p); setAddOpen(false); setDetail(novo); toast(`Propriedade "${novo.name}" vinculada ao monitoramento.`); }} />

      <PropertyDetail
        property={detail}
        onClose={() => setDetail(null)}
        onEdit={(p) => { setDetail(null); setEdit(p); }}
        onDelete={(p) => { setDetail(null); setToDelete(p); }}
        onProtect={() => { setDetail(null); navigate('/insurance'); }}
      />

      <EditProperty property={edit} onClose={() => setEdit(null)} onSave={(id, patch) => { updateProperty(id, patch); setEdit(null); toast('Propriedade atualizada.'); }} />

      <Modal
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        title="Remover propriedade"
        subtitle={toDelete ? `Esta ação remove "${toDelete.name}" do monitoramento.` : ''}
        footer={
          <>
            <button onClick={() => setToDelete(null)} className="btn-ghost">Cancelar</button>
            <button onClick={() => { if (toDelete) { removeProperty(toDelete.id); toast('Propriedade removida.'); } setToDelete(null); }} className="btn-primary !bg-none" style={{ background: '#F87171', color: '#1a0606' }}>
              <Trash2 size={16} /> Remover
            </button>
          </>
        }
      >
        <p className="text-sm text-body">Tem certeza? Os dados históricos desta área deixarão de ser exibidos no portfólio.</p>
      </Modal>
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

function RowMenu({ onClose, onView, onEdit, onDelete }: { onClose: () => void; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);
  return (
    <div ref={ref} className="absolute right-4 top-12 z-20 w-44 overflow-hidden rounded-xl border border-line bg-surface py-1 shadow-lift">
      <MenuItem icon={Eye} label="Ver detalhes" onClick={onView} />
      <MenuItem icon={Pencil} label="Editar" onClick={onEdit} />
      <MenuItem icon={Trash2} label="Remover" danger onClick={onDelete} />
    </div>
  );
}
function MenuItem({ icon: Icon, label, onClick, danger }: { icon: typeof Eye; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button onClick={onClick} className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-sm transition hover:bg-soft ${danger ? 'text-risk-high' : 'text-ink'}`}>
      <Icon size={15} /> {label}
    </button>
  );
}

/* ---------- Detalhe ---------- */
function PropertyDetail({ property, onClose, onEdit, onDelete, onProtect }: {
  property: Property | null; onClose: () => void; onEdit: (p: Property) => void; onDelete: (p: Property) => void; onProtect: () => void;
}) {
  if (!property) return null;
  const p = property;
  return (
    <Modal open={!!property} onClose={onClose} title={p.name} subtitle={`${p.location} · ID ${p.id}`} maxW="max-w-2xl"
      footer={
        <>
          <button onClick={() => onDelete(p)} className="btn-ghost text-risk-high hover:text-risk-critical"><Trash2 size={16} /> Remover</button>
          <button onClick={() => onEdit(p)} className="btn-ghost"><Pencil size={16} /> Editar</button>
          <button onClick={onProtect} className="btn-primary"><ShieldCheck size={16} /> Solicitar proteção</button>
        </>
      }
    >
      <div className="overflow-hidden rounded-xl border border-line">
        <MockMap properties={[p]} height={200} interactive={false} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Detail label="Cultura" value={p.culture} />
        <Detail label="Área total" value={`${p.areaHa.toLocaleString('pt-BR')} ha`} />
        <Detail label="Ciclo atual" value={p.cycle} />
        <Detail label="Coordenadas" value={`${p.lat.toFixed(4)}, ${p.lng.toFixed(4)}`} />
        <div className="sm:col-span-1">
          <span className="label-mono">Status de risco</span>
          <div className="mt-1"><RiskBadge level={p.risk} label={p.riskReason ? `${riskLabel(p.risk)} · ${p.riskReason}` : undefined} /></div>
        </div>
      </div>
    </Modal>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="label-mono">{label}</span>
      <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

/* ---------- Editar ---------- */
function EditProperty({ property, onClose, onSave }: { property: Property | null; onClose: () => void; onSave: (id: string, patch: Partial<Property>) => void }) {
  const [name, setName] = useState('');
  const [culture, setCulture] = useState('Soja');
  const [areaHa, setAreaHa] = useState('');
  useEffect(() => {
    if (property) { setName(property.name); setCulture(property.culture); setAreaHa(String(property.areaHa)); }
  }, [property]);
  if (!property) return null;
  return (
    <Modal open={!!property} onClose={onClose} title="Editar propriedade" subtitle={property.location}
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={() => onSave(property.id, { name: name.trim() || property.name, culture, areaHa: parseFloat(areaHa) || property.areaHa, cycle: derivarCiclo(culture) })} className="btn-primary"><Check size={16} /> Salvar</button>
        </>
      }
    >
      <div className="space-y-4">
        <LabeledInput label="Nome da propriedade" value={name} onChange={setName} />
        <div className="grid grid-cols-2 gap-4">
          <LabeledSelect label="Cultura" value={culture} onChange={setCulture} options={CULTURAS} />
          <LabeledInput label="Área (ha)" value={areaHa} onChange={setAreaHa} numeric />
        </div>
      </div>
    </Modal>
  );
}

/* ---------- Adicionar (automatizado) ---------- */
function AddPropertyFlow({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (p: Omit<Property, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [culture, setCulture] = useState('Soja');
  const [areaHa, setAreaHa] = useState('');
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocalEncontrado[]>([]);
  const [local, setLocal] = useState<LocalEncontrado | null>(null);
  const [searching, setSearching] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  // Reset ao abrir/fechar
  useEffect(() => {
    if (!open) {
      setName(''); setCulture('Soja'); setAreaHa(''); setQuery(''); setResults([]); setLocal(null); setError(''); setAdvanced(false);
    }
  }, [open]);

  // Busca com debounce
  useEffect(() => {
    if (local && query === local.label) return; // já selecionado
    if (query.trim().length < 3) { setResults([]); return; }
    const t = setTimeout(async () => {
      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      setSearching(true);
      try {
        setResults(await buscarLocais(query, ctrl.signal));
      } catch {
        /* abortos/erros de rede são silenciados aqui */
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [query, local]);

  const derived = useMemo(() => {
    if (!local) return null;
    const ciclo = derivarCiclo(culture);
    const { risk, motivo } = estimarRiscoInicial(culture, new Date(), local.lat);
    return { ciclo, risk, motivo };
  }, [local, culture]);

  function selectLocal(l: LocalEncontrado) {
    setLocal(l);
    setQuery(l.label);
    setResults([]);
  }

  async function usarGPS() {
    if (!navigator.geolocation) { setError('Geolocalização indisponível neste dispositivo.'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const l: LocalEncontrado = { lat: pos.coords.latitude, lng: pos.coords.longitude, municipio: 'Local atual', uf: '', label: 'Minha localização atual' };
        selectLocal(l);
      },
      () => setError('Não foi possível obter sua localização.')
    );
  }

  function submit() {
    setError('');
    if (!name.trim()) return setError('Informe o nome da propriedade.');
    if (!local) return setError('Busque e selecione o local da propriedade.');
    const area = parseFloat(areaHa);
    if (Number.isNaN(area) || area <= 0) return setError('Informe a área em hectares.');
    onAdd({
      name: name.trim(),
      location: local.uf ? `${local.municipio} - ${local.uf}` : local.municipio,
      lat: local.lat,
      lng: local.lng,
      culture,
      areaHa: area,
      cycle: derived?.ciclo ?? 'Pré-plantio',
      risk: derived?.risk ?? 'low',
      riskReason: derived?.motivo,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Adicionar propriedade" subtitle="Informe poucos dados — o resto é preenchido automaticamente." maxW="max-w-2xl"
      footer={
        <>
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={submit} className="btn-primary"><Plus size={16} /> Vincular ao monitoramento</button>
        </>
      }
    >
      <div className="space-y-4">
        <LabeledInput label="Nome da propriedade" value={name} onChange={setName} placeholder="Ex.: Fazenda Nova Esperança" />

        {/* Busca de local */}
        <div className="relative">
          <label className="label-mono mb-1.5 block">Local (cidade, fazenda ou endereço)</label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="field pl-10 pr-24"
              placeholder="Ex.: Luís Eduardo Magalhães, BA"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setLocal(null); }}
            />
            <button type="button" onClick={usarGPS} className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1 rounded-lg bg-soft px-2.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand-50">
              <Navigation size={13} /> GPS
            </button>
            {searching && <Loader2 size={15} className="absolute right-[4.7rem] top-1/2 -translate-y-1/2 animate-spin text-muted" />}
          </div>
          {results.length > 0 && (
            <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-line bg-surface shadow-lift">
              {results.map((r, i) => (
                <button key={i} type="button" onClick={() => selectLocal(r)} className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition hover:bg-soft">
                  <MapPin size={15} className="shrink-0 text-brand" />
                  <span className="truncate text-ink">{r.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LabeledSelect label="Cultura" value={culture} onChange={setCulture} options={CULTURAS} />
          <LabeledInput label="Área (ha)" value={areaHa} onChange={setAreaHa} numeric placeholder="Ex.: 1250" />
        </div>

        {/* Cartão de confirmação — dados automáticos */}
        {local && (
          <div className="animate-fade-up overflow-hidden rounded-xl border border-line bg-soft/50">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
              <Check size={14} className="text-brand" />
              <span className="text-xs font-semibold text-ink">Preenchido automaticamente a partir do local</span>
            </div>
            <div className="grid gap-4 p-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-lg border border-line">
                <MockMap properties={[{ id: 'novo', name: name || 'Nova área', location: local.label, lat: local.lat, lng: local.lng, culture, areaHa: 0, cycle: '', risk: derived?.risk ?? 'low' }]} height={150} interactive={false} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Auto icon={MapPin} label="Município/UF" value={local.uf ? `${local.municipio} - ${local.uf}` : local.municipio} />
                <Auto icon={Navigation} label="Coordenadas" value={`${local.lat.toFixed(3)}, ${local.lng.toFixed(3)}`} />
                <Auto icon={CalendarClock} label="Ciclo atual" value={derived?.ciclo ?? '—'} />
                <Auto icon={Sprout} label="Risco inicial" value={derived ? `${riskLabel(derived.risk)}${derived.motivo ? ' · ' + derived.motivo : ''}` : '—'} />
              </div>
            </div>
            <button type="button" onClick={() => setAdvanced((v) => !v)} className="flex w-full items-center justify-center gap-1.5 border-t border-line py-2.5 text-xs font-semibold text-brand">
              Ajustar coordenadas manualmente <ChevronDown size={13} className={`transition ${advanced ? 'rotate-180' : ''}`} />
            </button>
            {advanced && (
              <div className="grid grid-cols-2 gap-4 border-t border-line p-4">
                <LabeledInput label="Latitude" value={String(local.lat)} onChange={(v) => setLocal({ ...local, lat: parseFloat(v) || local.lat })} numeric />
                <LabeledInput label="Longitude" value={String(local.lng)} onChange={(v) => setLocal({ ...local, lng: parseFloat(v) || local.lng })} numeric />
              </div>
            )}
          </div>
        )}

        {error && <p className="flex items-center gap-1.5 text-sm text-risk-critical"><MapPin size={14} /> {error}</p>}
      </div>
    </Modal>
  );
}

function Auto({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon size={15} className="mt-0.5 shrink-0 text-brand" />
      <div className="min-w-0">
        <span className="label-mono text-[9px]">{label}</span>
        <p className="truncate text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  );
}

function LabeledInput({ label, value, onChange, placeholder, numeric }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; numeric?: boolean }) {
  return (
    <div>
      <label className="label-mono mb-1.5 block">{label}</label>
      <input className="field" inputMode={numeric ? 'decimal' : undefined} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
function LabeledSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="label-mono mb-1.5 block">{label}</label>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
