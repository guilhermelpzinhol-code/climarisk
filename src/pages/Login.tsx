import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Tractor, Landmark, Network, ShieldCheck, ArrowRight, Check, Satellite, Lock,
  Mail, Eye, EyeOff, AlertCircle, MailCheck, KeyRound,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { useStore } from '../lib/store';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../lib/types';

const profiles: { id: Profile; label: string; icon: typeof Tractor }[] = [
  { id: 'produtor', label: 'Produtor Rural', icon: Tractor },
  { id: 'banco', label: 'Banco / FIDC', icon: Landmark },
  { id: 'cooperativa', label: 'Cooperativa', icon: Network },
  { id: 'seguradora', label: 'Seguradora', icon: ShieldCheck },
];

type View = 'login' | 'signup' | 'forgot';

export default function Login() {
  const { triggerWelcome } = useStore();
  const navigate = useNavigate();
  const [view, setView] = useState<View>('login');

  const [name, setName] = useState('');
  const [selected, setSelected] = useState<Profile>('produtor');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  function reset() {
    setError('');
    setInfo('');
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    reset();
    if (!supabase) {
      setError('Autenticação ainda não configurada. Defina as chaves do Supabase.');
      return;
    }
    setLoading(true);
    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        triggerWelcome();
        navigate('/dashboard');
      } else if (view === 'signup') {
        if (!name.trim()) throw new Error('Informe seu nome.');
        if (password.length < 6) throw new Error('A senha deve ter ao menos 6 caracteres.');
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name.trim(), profile: selected },
            emailRedirectTo: `${window.location.origin}/login`,
          },
        });
        if (error) throw error;
        if (data.session) {
          triggerWelcome();
          navigate('/dashboard');
        } else {
          setInfo('Conta criada! Enviamos um e-mail de confirmação — confirme para entrar.');
          setView('login');
        }
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setInfo('Enviamos um link para redefinir sua senha. Verifique seu e-mail.');
        setView('login');
      }
    } catch (err) {
      setError(translateError(err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  }

  const title = view === 'login' ? 'Acessar Plataforma' : view === 'signup' ? 'Criar Conta' : 'Recuperar Senha';
  const subtitle =
    view === 'login'
      ? 'Entre com seu e-mail e senha.'
      : view === 'signup'
      ? 'Crie sua conta para monitorar suas áreas.'
      : 'Enviaremos um link de redefinição para seu e-mail.';

  return (
    <div className="relative grid min-h-screen lg:grid-cols-2">
      {/* Painel visual */}
      <aside className="relative hidden overflow-hidden bg-ink-hero lg:block">
        <div className="absolute inset-0 opacity-25" style={{ background: 'radial-gradient(120% 100% at 80% 0%, #16A34A 0%, transparent 55%)' }} />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '46px 46px' }}
        />
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <img src="/logo-v2.png" alt="Climarisk" className="h-9 w-auto self-start max-w-[180px]" />
          <div>
            <h1 className="max-w-md text-4xl font-bold leading-[1.1]">
              Transforme a incerteza climática em vantagem competitiva.
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Plataforma de alta precisão para mitigação de risco no agronegócio através de dados de satélite e
              estações meteorológicas em tempo real.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="inline-flex items-center gap-2"><Satellite size={16} className="text-brand-200" /> Imagens de satélite diárias</span>
              <span className="inline-flex items-center gap-2"><Check size={16} className="text-brand-200" /> Gatilhos paramétricos</span>
            </div>
          </div>
          <p className="text-[11px] text-white/40">Foco MVP: Oeste da Bahia · Soja · Fontes INMET · CPTEC/INPE · Satélite NDVI</p>
        </div>
      </aside>

      {/* Formulário */}
      <main className="flex items-center justify-center bg-surface px-6 py-10">
        <form onSubmit={submit} className="w-full max-w-md animate-fade-up">
          <div className="lg:hidden"><Logo /></div>
          <h2 className="mt-8 text-2xl font-bold text-ink lg:mt-0">{title}</h2>
          <p className="mt-1.5 text-sm text-body">{subtitle}</p>

          {!isSupabaseConfigured && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-risk-medium/30 bg-amber-500/10 px-4 py-3 text-xs text-risk-medium">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              Autenticação ainda não configurada. Defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code>.
            </div>
          )}
          {error && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-risk-critical/30 bg-red-500/10 px-4 py-3 text-sm text-risk-critical">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
          )}
          {info && (
            <div className="mt-5 flex items-start gap-2 rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand">
              <MailCheck size={16} className="mt-0.5 shrink-0" /> {info}
            </div>
          )}

          {/* Cadastro: nome + perfil */}
          {view === 'signup' && (
            <>
              <div className="mt-6">
                <label className="label-mono mb-1.5 block">Nome completo</label>
                <input className="field" placeholder="Carlos Mendes" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
              </div>
              <span className="label-mono mt-5 block">Perfil de acesso</span>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {profiles.map((p) => {
                  const active = selected === p.id;
                  return (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelected(p.id)}
                      className={`group relative rounded-xl border p-3 text-left transition-all ${active ? 'border-brand bg-brand-50 shadow-soft' : 'border-line hover:border-brand/40'}`}
                    >
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${active ? 'bg-brand text-[#06100C]' : 'bg-soft text-body'}`}>
                        <p.icon size={16} />
                      </span>
                      <span className="mt-2 block text-sm font-semibold text-ink">{p.label}</span>
                      {active && <span className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[#06100C]"><Check size={11} strokeWidth={3} /></span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* E-mail */}
          <div className="mt-6">
            <label className="label-mono mb-1.5 block">E-mail</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input type="email" required className="field pl-10" placeholder="voce@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
          </div>

          {/* Senha (login/signup) */}
          {view !== 'forgot' && (
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between">
                <label className="label-mono">Senha</label>
                {view === 'login' && (
                  <button type="button" onClick={() => { reset(); setView('forgot'); }} className="text-xs font-semibold text-brand hover:text-brand-dark">
                    Esqueci a senha
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  className="field px-10"
                  placeholder={view === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={view === 'signup' ? 'new-password' : 'current-password'}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary mt-7 w-full">
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#06100C]/30 border-t-[#06100C]" />
            ) : (
              <>
                {view === 'login' ? 'Entrar' : view === 'signup' ? 'Criar conta' : 'Enviar link de redefinição'}
                {view === 'forgot' ? <KeyRound size={16} /> : <ArrowRight size={16} />}
              </>
            )}
          </button>

          {/* Alternar entre telas */}
          <div className="mt-5 text-center text-sm text-body">
            {view === 'login' && (
              <>Não tem conta?{' '}<button type="button" onClick={() => { reset(); setView('signup'); }} className="font-semibold text-brand hover:text-brand-dark">Criar conta</button></>
            )}
            {view === 'signup' && (
              <>Já tem conta?{' '}<button type="button" onClick={() => { reset(); setView('login'); }} className="font-semibold text-brand hover:text-brand-dark">Entrar</button></>
            )}
            {view === 'forgot' && (
              <button type="button" onClick={() => { reset(); setView('login'); }} className="font-semibold text-brand hover:text-brand-dark">← Voltar ao login</button>
            )}
          </div>

          <p className="mt-6 text-center text-sm text-body">
            <Link to="/" className="font-medium text-muted hover:text-ink">← Voltar ao site</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('invalid login credentials')) return 'E-mail ou senha inválidos.';
  if (m.includes('email not confirmed')) return 'Confirme seu e-mail antes de entrar.';
  if (m.includes('user already registered')) return 'Este e-mail já possui conta. Faça login.';
  if (m.includes('password should be at least')) return 'A senha deve ter ao menos 6 caracteres.';
  if (m.includes('unable to validate email') || m.includes('invalid email')) return 'E-mail inválido.';
  if (m.includes('rate limit')) return 'Muitas tentativas. Aguarde alguns instantes.';
  return msg;
}
