import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Tractor, Landmark, Network, ShieldCheck, ArrowRight, Check, Satellite, Lock } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useStore } from '../lib/store';
import type { Profile } from '../lib/types';

const profiles: { id: Profile; label: string; desc: string; icon: typeof Tractor }[] = [
  { id: 'produtor', label: 'Produtor Rural', desc: 'Monitore safras, alertas e proteção das suas áreas.', icon: Tractor },
  { id: 'banco', label: 'Banco / FIDC', desc: 'Avalie risco climático da carteira de crédito rural.', icon: Landmark },
  { id: 'cooperativa', label: 'Cooperativa', desc: 'Gestão integrada de risco de todos os cooperados.', icon: Network },
  { id: 'seguradora', label: 'Seguradora', desc: 'Gatilhos paramétricos e laudos rastreáveis.', icon: ShieldCheck },
];

const defaultName: Record<Profile, string> = {
  produtor: 'Carlos Mendes',
  banco: 'Banco Rural',
  cooperativa: 'Coop. Oeste BA',
  seguradora: 'AgriSafeguard S.A.',
};

export default function Login() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Profile>('produtor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(selected, name.trim() || defaultName[selected]);
      navigate('/dashboard');
    }, 550);
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Painel visual */}
      <aside className="relative hidden overflow-hidden bg-ink-hero lg:block">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            background: 'radial-gradient(120% 100% at 80% 0%, #16A34A 0%, transparent 55%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '46px 46px',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <img src="/logo.png" alt="Climarisk" className="h-9 w-auto brightness-0 invert" />
          <div>
            <span className="label-mono text-brand-200">Agri-Intelligence Prime</span>
            <h1 className="mt-4 max-w-md text-4xl font-bold leading-[1.1]">
              Transforme a incerteza climática em vantagem competitiva.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Plataforma de alta precisão para mitigação de risco no agronegócio através de dados de satélite e
              estações meteorológicas em tempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2">
                <Satellite size={16} className="text-brand-200" /> Imagens de satélite diárias
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-brand-200" /> Gatilhos paramétricos
              </span>
            </div>
          </div>
          <p className="font-mono text-[11px] text-white/40">
            Foco MVP: Oeste da Bahia · Soja · Fontes INMET · CPTEC/INPE · Satélite NDVI
          </p>
        </div>
      </aside>

      {/* Formulário */}
      <main className="flex items-center justify-center bg-white px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h2 className="mt-8 text-2xl font-bold text-ink lg:mt-0">Acessar Plataforma</h2>
          <p className="mt-1.5 text-sm text-body">Selecione seu perfil para entrar no ambiente correto.</p>

          <span className="label-mono mt-7 block">Perfil de acesso</span>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {profiles.map((p) => {
              const active = selected === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={`group relative rounded-xl border p-3.5 text-left transition-all ${
                    active ? 'border-brand bg-brand-50 shadow-soft' : 'border-line hover:border-brand/40'
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      active ? 'bg-brand text-white' : 'bg-soft text-body'
                    }`}
                  >
                    <p.icon size={18} />
                  </span>
                  <span className="mt-2.5 block text-sm font-semibold text-ink">{p.label}</span>
                  {active && (
                    <span className="absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                      <Check size={11} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">{profiles.find((p) => p.id === selected)?.desc}</p>

          <div className="mt-6 space-y-4">
            <div>
              <label className="label-mono mb-1.5 block">Nome / Organização</label>
              <input
                className="field"
                placeholder={defaultName[selected]}
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div>
              <label className="label-mono mb-1.5 block">E-mail corporativo</label>
              <input
                type="email"
                className="field"
                placeholder="voce@empresa.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-7 w-full">
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : (
              <>
                Entrar na plataforma <ArrowRight size={16} />
              </>
            )}
          </button>

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock size={12} /> Ambiente de demonstração — RF01: cadastro de usuários por perfil.
          </p>
          <p className="mt-4 text-center text-sm text-body">
            <Link to="/" className="font-medium text-brand hover:underline">
              ← Voltar ao site
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
