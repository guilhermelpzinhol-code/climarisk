import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2, KeyRound, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Status = 'verificando' | 'pronto' | 'erro' | 'salvo';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [status, setStatus] = useState<Status>('verificando');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Valida o link assim que a página abre (fluxo token_hash ou sessão da URL).
  useEffect(() => {
    let ativo = true;
    async function validar() {
      if (!supabase) { setStatus('erro'); setError('Autenticação não configurada.'); return; }

      // Erro vindo na hash (ex.: link expirado)
      const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      if (hash.get('error_description')) {
        if (ativo) { setStatus('erro'); setError(traduz(hash.get('error_description')!)); }
        return;
      }

      const token_hash = params.get('token_hash');
      const type = params.get('type');

      if (token_hash) {
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: (type as 'recovery') || 'recovery' });
        if (!ativo) return;
        if (error) { setStatus('erro'); setError(traduz(error.message)); }
        else setStatus('pronto');
        return;
      }

      // Sem token_hash: tenta a sessão que o cliente extrai da URL (#access_token)
      const { data } = await supabase.auth.getSession();
      if (!ativo) return;
      if (data.session) setStatus('pronto');
      else { setStatus('erro'); setError('Link inválido ou expirado. Solicite um novo link de redefinição.'); }
    }
    validar();
    return () => { ativo = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('A senha deve ter ao menos 6 caracteres.'); return; }
    setLoading(true);
    try {
      const { error } = await supabase!.auth.updateUser({ password });
      if (error) throw error;
      setStatus('salvo');
      setTimeout(() => navigate('/dashboard'), 1600);
    } catch (err) {
      setError(err instanceof Error ? traduz(err.message) : 'Não foi possível redefinir a senha.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-6">
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand to-brand-dark text-[#06100C]">
            <KeyRound size={26} />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-ink">Definir nova senha</h1>
          <p className="mt-1.5 text-sm text-body">Escolha uma nova senha para sua conta Climarisk.</p>
        </div>

        {status === 'verificando' && (
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-body">
            <Loader2 size={18} className="animate-spin text-brand" /> Validando seu link…
          </div>
        )}

        {status === 'erro' && (
          <div className="mt-6">
            <div className="flex items-start gap-2 rounded-xl border border-risk-critical/30 bg-red-500/10 px-4 py-3 text-sm text-risk-critical">
              <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
            </div>
            <Link to="/login" className="btn-primary mt-5 w-full">Solicitar novo link</Link>
          </div>
        )}

        {status === 'salvo' && (
          <div className="mt-6 flex items-center gap-2 rounded-xl border border-brand/30 bg-brand-50 px-4 py-3 text-sm text-brand">
            <CheckCircle2 size={16} /> Senha redefinida! Redirecionando…
          </div>
        )}

        {status === 'pronto' && (
          <form onSubmit={submit} noValidate className="mt-6">
            {error && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-risk-critical/30 bg-red-500/10 px-4 py-3 text-sm text-risk-critical">
                <AlertCircle size={16} className="mt-0.5 shrink-0" /> {error}
              </div>
            )}
            <label className="label-mono mb-1.5 block">Nova senha</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type={showPwd ? 'text' : 'password'}
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
            <button type="submit" disabled={loading} className="btn-primary mt-7 w-full">
              {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#06100C]/30 border-t-[#06100C]" /> : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function traduz(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes('expired') || m.includes('invalid') || m.includes('otp')) return 'Link inválido ou expirado. Solicite um novo link de redefinição.';
  if (m.includes('access_denied')) return 'Este link já foi usado ou expirou. Solicite um novo.';
  if (m.includes('should be at least') || m.includes('weak')) return 'A senha deve ter ao menos 6 caracteres.';
  if (m.includes('same password')) return 'A nova senha não pode ser igual à anterior.';
  return 'Não foi possível validar o link. Solicite um novo link de redefinição.';
}
