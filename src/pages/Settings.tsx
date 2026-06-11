import { useState } from 'react';
import { SlidersHorizontal, Code2, CreditCard, Users } from 'lucide-react';
import { toast } from '../components/Toaster';

const tabs = [
  { id: 'prefs', label: 'Preferências da Plataforma', icon: SlidersHorizontal },
  { id: 'integ', label: 'Integrações de Dados', icon: Code2 },
  { id: 'billing', label: 'Faturamento & Assinatura', icon: CreditCard },
  { id: 'team', label: 'Gerenciamento de Equipe', icon: Users },
];

export default function Settings() {
  const [tab, setTab] = useState('prefs');

  return (
    <div className="mx-auto max-w-5xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Configurações</h1>
      <p className="mt-1 text-sm text-body">Gerencie suas preferências de plataforma, integrações e equipe.</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[280px_1fr]">
        <nav className="card h-fit p-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium transition ${
                tab === t.id ? 'bg-brand-50 text-brand' : 'text-body hover:bg-soft'
              }`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="card p-6">
          {tab === 'prefs' && (
            <>
              <div className="flex items-center gap-3 border-b border-line pb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand"><SlidersHorizontal size={18} /></span>
                <h2 className="text-lg font-bold text-ink">Preferências da Plataforma</h2>
              </div>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Select label="Idioma" options={['Português (Brasil)', 'English (US)', 'Español']} />
                <Select label="Sistema de Medição" options={['Métrico (Celsius, mm, km/h)', 'Imperial (°F, in, mph)']} />
                <Select label="Fuso Horário" options={['(GMT-03:00) Brasília', '(GMT-04:00) Manaus']} full />
              </div>
              <div className="mt-6 flex justify-end">
                <button onClick={() => toast('Preferências salvas com sucesso.')} className="btn-primary">Salvar Preferências</button>
              </div>
            </>
          )}
          {tab !== 'prefs' && (
            <div className="flex h-64 flex-col items-center justify-center text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-soft text-muted">
                {(() => { const T = tabs.find((t) => t.id === tab)!.icon; return <T size={22} />; })()}
              </span>
              <p className="mt-4 font-semibold text-ink">{tabs.find((t) => t.id === tab)?.label}</p>
              <p className="mt-1 text-sm text-muted">Módulo disponível na versão completa da plataforma.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ label, options, full }: { label: string; options: string[]; full?: boolean }) {
  return (
    <div className={full ? 'sm:col-span-2' : ''}>
      <label className="label-mono mb-1.5 block">{label}</label>
      <select className="field">
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
