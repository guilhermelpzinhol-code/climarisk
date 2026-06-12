import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!supabase) {
      setError('Autenticação não configurada.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível redefinir a senha. Abra o link do e-mail novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6">
      <form onSubmit={submit} noValidate className="w-full max-w-md animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-[#06100C]">
            <KeyRound size={26} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-ink">Definir nova senha</h1>
          <p className="mt-1.5 text-sm text-body">Escolha uma nova senha para sua conta Climarisk.</p>
        </div>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-risk-critical/30 bg-red-500/10 px-4 py-3 text-sm text-risk-critical">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
          </div>
        )}
        {done ? (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand">
            <CheckCircle2 size={16} /> Senha redefinida! Redirecionando…
          </div>
        ) : (
          <>
            <div className="mt-6">
              <label className="label-mono mb-1.5 block">Nova senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  className="field px-10"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary mt-7 w-full">
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#06100C]/30 border-t-[#06100C]" /> : 'Salvar nova senha'}
            </button>
          </>
        )}
      </form>
    </div>
  );
}
