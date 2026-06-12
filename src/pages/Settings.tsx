import { useState } from 'react';
import { SlidersHorizontal, Code2, CreditCard, Users, Database, Plus, Trash2, Check, Crown } from 'lucide-react';
import { toast } from '../components/Toaster';

const tabs = [
  { id: 'prefs', label: 'Preferências da Plataforma', icon: SlidersHorizontal },
  { id: 'integ', label: 'Integrações de Dados', icon: Code2 },
  { id: 'billing', label: 'Faturamento e Assinatura', icon: CreditCard },
  { id: 'team', label: 'Gerenciamento de Equipe', icon: Users },
];

function load<T>(k: string, fb: T): T {
  try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : fb; } catch { return fb; }
}

export default function Settings() {
  const [tab, setTab] = useState('prefs');

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Configurações</h1>
      <p className="mt-1 text-sm text-body">Gerencie suas preferências de plataforma, integrações e equipe.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[280px_1fr]">
        <nav className="card h-fit p-2">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${tab === t.id ? 'bg-brand-50 text-brand' : 'text-body hover:bg-soft'}`}>
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="card p-6">
          {tab === 'prefs' && <Preferencias />}
          {tab === 'integ' && <Integracoes />}
          {tab === 'billing' && <Faturamento />}
          {tab === 'team' && <Equipe />}
        </div>
      </div>
    </div>
  );
}

function Header({ icon: Icon, title }: { icon: typeof Users; title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-line pb-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand"><Icon size={18} /></span>
      <h2 className="text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

function Preferencias() {
  const [prefs, setPrefs] = useState(() => load('climarisk:prefs', { idioma: 'Português (Brasil)', medicao: 'Métrico (Celsius, mm, km/h)', fuso: '(GMT-03:00) Brasília' }));
  function set(k: string, v: string) { setPrefs((p) => ({ ...p, [k]: v })); }
  return (
    <>
      <Header icon={SlidersHorizontal} title="Preferências da Plataforma" />
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Select label="Idioma" value={prefs.idioma} onChange={(v) => set('idioma', v)} options={['Português (Brasil)', 'Inglês (EUA)', 'Espanhol']} />
        <Select label="Sistema de Medição" value={prefs.medicao} onChange={(v) => set('medicao', v)} options={['Métrico (Celsius, mm, km/h)', 'Imperial (°F, in, mph)']} />
        <Select label="Fuso Horário" value={prefs.fuso} onChange={(v) => set('fuso', v)} options={['(GMT-03:00) Brasília', '(GMT-04:00) Manaus']} full />
      </div>
      <div className="mt-6 flex justify-end">
        <button onClick={() => { localStorage.setItem('climarisk:prefs', JSON.stringify(prefs)); toast('Preferências salvas com sucesso.'); }} className="btn-primary"><Check size={16} /> Salvar Preferências</button>
      </div>
    </>
  );
}

function Integracoes() {
  const [itens, setItens] = useState(() => load('climarisk:integracoes', [
    { nome: 'INMET', papel: 'Estações meteorológicas (oráculo primário)', conectado: true },
    { nome: 'CPTEC / INPE', papel: 'Previsão numérica e modelagem (contingência)', conectado: true },
    { nome: 'Satélite NDVI', papel: 'Índices de vegetação e umidade do solo', conectado: true },
    { nome: 'ERP Agrícola', papel: 'Integração com sistema de gestão da fazenda', conectado: false },
  ]));
  function toggle(i: number) {
    setItens((prev) => {
      const next = prev.map((x, idx) => (idx === i ? { ...x, conectado: !x.conectado } : x));
      localStorage.setItem('climarisk:integracoes', JSON.stringify(next));
      toast(`${next[i].nome} ${next[i].conectado ? 'conectada' : 'desconectada'}.`);
      return next;
    });
  }
  return (
    <>
      <Header icon={Code2} title="Integrações de Dados" />
      <div className="mt-5 space-y-3">
        {itens.map((it, i) => (
          <div key={it.nome} className="flex items-center gap-4 rounded-xl border border-line p-4">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand"><Database size={18} /></span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{it.nome}</p>
              <p className="text-xs text-body">{it.papel}</p>
            </div>
            <button onClick={() => toggle(i)} className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${it.conectado ? 'bg-brand-50 text-brand hover:bg-brand-100' : 'btn-primary'}`}>
              {it.conectado ? 'Conectada' : 'Conectar'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function Faturamento() {
  const faturas = [
    { mes: 'Mai/2026', valor: 'R$ 1.890,00', status: 'Pago' },
    { mes: 'Abr/2026', valor: 'R$ 1.890,00', status: 'Pago' },
    { mes: 'Mar/2026', valor: 'R$ 1.890,00', status: 'Pago' },
  ];
  return (
    <>
      <Header icon={CreditCard} title="Faturamento e Assinatura" />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-brand/30 bg-brand-50 p-5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-[#06100C]"><Crown size={20} /></span>
          <div>
            <p className="text-sm font-bold text-ink">Plano Agri-Intelligence Prime</p>
            <p className="text-xs text-body">Até 50 propriedades · varredura diária · laudos ilimitados</p>
          </div>
        </div>
        <button onClick={() => toast('Plano gerenciado — sua assinatura continua ativa.')} className="btn-ghost">Gerenciar plano</button>
      </div>
      <p className="label-mono mt-6 mb-2">Histórico de faturas</p>
      <div className="overflow-hidden rounded-xl border border-line">
        {faturas.map((f, i) => (
          <div key={f.mes} className={`flex items-center justify-between px-4 py-3 text-sm ${i > 0 ? 'border-t border-line' : ''}`}>
            <span className="font-medium text-ink">{f.mes}</span>
            <span className="text-body">{f.valor}</span>
            <span className="chip bg-brand-50 text-brand">{f.status}</span>
            <button onClick={() => toast(`Recibo de ${f.mes} disponível para download.`)} className="text-sm font-semibold text-brand hover:text-brand-dark">Recibo</button>
          </div>
        ))}
      </div>
    </>
  );
}

function Equipe() {
  const [membros, setMembros] = useState(() => load('climarisk:equipe', [
    { nome: 'Carlos Mendes', email: 'carlos@agrocorp.com.br', papel: 'Administrador' },
    { nome: 'Ana Ribeiro', email: 'ana@agrocorp.com.br', papel: 'Analista' },
  ]));
  const [email, setEmail] = useState('');
  function convidar() {
    const e = email.trim();
    if (!e || !e.includes('@')) { toast('Informe um e-mail válido para convidar.'); return; }
    const next = [...membros, { nome: e.split('@')[0], email: e, papel: 'Convidado' }];
    setMembros(next);
    localStorage.setItem('climarisk:equipe', JSON.stringify(next));
    setEmail('');
    toast(`Convite enviado para ${e}.`);
  }
  function remover(i: number) {
    const next = membros.filter((_, idx) => idx !== i);
    setMembros(next);
    localStorage.setItem('climarisk:equipe', JSON.stringify(next));
    toast('Membro removido da equipe.');
  }
  return (
    <>
      <Header icon={Users} title="Gerenciamento de Equipe" />
      <div className="mt-5 flex gap-2">
        <input className="field" type="email" placeholder="email@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={convidar} className="btn-primary shrink-0"><Plus size={16} /> Convidar</button>
      </div>
      <div className="mt-4 space-y-2">
        {membros.map((m, i) => (
          <div key={m.email} className="flex items-center gap-3 rounded-xl border border-line p-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-bold text-[#06100C]">{m.nome.slice(0, 2).toUpperCase()}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-ink">{m.nome}</p>
              <p className="text-xs text-muted">{m.email}</p>
            </div>
            <span className="chip bg-lavender text-body">{m.papel}</span>
            {m.papel !== 'Administrador' && (
              <button onClick={() => remover(i)} aria-label="Remover membro" className="text-muted hover:text-risk-high"><Trash2 size={16} /></button>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Select({ label, options, value, onChange, full }: { label: string; options: string[]; value: string; onChange: (v: string) => void; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label-mono mb-1.5 block">{label}</label>
      <select className="field" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
