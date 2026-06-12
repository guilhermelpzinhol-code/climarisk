import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Store, Landmark, Bell, MapPin, ShieldCheck, LogOut, ChevronRight, Check, KeyRound } from 'lucide-react';
import { useStore } from '../lib/store';
import { toast } from '../components/Toaster';
import { Modal } from '../components/Modal';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { userName, profile, email, signOut, updateName } = useStore();
  const navigate = useNavigate();
  const initials = (userName || 'Carlos Mendes').split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();

  const [editOpen, setEditOpen] = useState(false);
  const [novoNome, setNovoNome] = useState('');
  const [permOpen, setPermOpen] = useState(false);
  const [secOpen, setSecOpen] = useState(false);
  const [bancoStatus, setBancoStatus] = useState('Pendente');

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  function abrirEdicao() {
    setNovoNome(userName || '');
    setEditOpen(true);
  }
  async function salvarNome() {
    await updateName(novoNome.trim() || userName);
    setEditOpen(false);
    toast('Perfil atualizado com sucesso.');
  }
  async function redefinirSenha() {
    if (supabase && email) {
      await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      toast('Enviamos um link para redefinir sua senha.');
    }
    setSecOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <div className="card overflow-hidden">
        <div className="flex flex-col items-center bg-gradient-to-br from-brand-50 to-lavender p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white shadow-lift">
              {initials}
            </div>
            <button onClick={abrirEdicao} aria-label="Editar perfil" className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-brand text-[#06100C]">
              <Pencil size={12} />
            </button>
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink">{userName || 'Carlos Mendes'}</h1>
          <p className="text-sm text-body">{email || 'sem e-mail'}</p>
          <span className="chip mt-2 bg-brand-100 text-brand-dark capitalize">{profile ?? 'Produtor Rural'}</span>
        </div>
      </div>

      <Section title="Dados Pessoais">
        <Row label="Nome Completo" value={userName || 'Carlos Henrique Mendes'} action="Editar" onAction={abrirEdicao} />
        <Row label="E-mail" value={email || '—'} />
        <Row label="Telefone" value="(77) 98765-4321" action="Editar" onAction={abrirEdicao} />
      </Section>

      <Section title="Conexões de Parceiros">
        <Partner icon={Store} name="AgroTech Insumos" role="Revenda" status="Conectado" />
        <Partner icon={Landmark} name="Banco Rural" role="Instituição Financeira" status={bancoStatus} onAction={() => { setBancoStatus('Reenviado'); toast('Convite reenviado para o Banco Rural.'); }} />
      </Section>

      <Section title="Configurações do App">
        <Toggle icon={Bell} label="Notificações de Risco" desc="Alertas climáticos severos" defaultOn />
        <LinkRow icon={MapPin} label="Permissões de Localização" onClick={() => setPermOpen(true)} />
        <LinkRow icon={ShieldCheck} label="Segurança e Senha" onClick={() => setSecOpen(true)} />
        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-1 py-3 text-sm font-semibold text-risk-critical">
          <LogOut size={18} /> Sair da Conta
        </button>
      </Section>

      <p className="mt-6 text-center text-[11px] text-muted">Versão 2.4.1 (Build 849)</p>

      {/* Editar perfil */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar perfil"
        footer={<><button onClick={() => setEditOpen(false)} className="btn-ghost">Cancelar</button><button onClick={salvarNome} className="btn-primary"><Check size={16} /> Salvar</button></>}
      >
        <label className="label-mono mb-1.5 block">Nome completo</label>
        <input className="field" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Seu nome" />
        <p className="mt-2 text-xs text-muted">O nome é salvo com segurança na sua conta.</p>
      </Modal>

      {/* Permissões */}
      <Modal open={permOpen} onClose={() => setPermOpen(false)} title="Permissões de Localização">
        <div className="space-y-3">
          <Toggle icon={MapPin} label="Acesso à localização" desc="Usar GPS para centralizar o mapa nas suas áreas" defaultOn />
          <Toggle icon={Bell} label="Alertas por proximidade" desc="Avisar quando um risco se aproximar das suas áreas" defaultOn />
        </div>
      </Modal>

      {/* Segurança */}
      <Modal open={secOpen} onClose={() => setSecOpen(false)} title="Segurança e Senha"
        footer={<><button onClick={() => setSecOpen(false)} className="btn-ghost">Fechar</button><button onClick={redefinirSenha} className="btn-primary"><KeyRound size={16} /> Redefinir senha</button></>}
      >
        <p className="text-sm leading-relaxed text-body">
          Para alterar sua senha, enviaremos um link seguro para <strong className="text-ink">{email || 'seu e-mail'}</strong>.
          Você define a nova senha pela página de redefinição.
        </p>
      </Modal>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6">
      <span className="label-mono">{title}</span>
      <div className="card mt-2 divide-y divide-line p-4">{children}</div>
    </div>
  );
}
function Row({ label, value, action, onAction }: { label: string; value: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="font-medium text-ink">{value}</p>
      </div>
      {action && <button onClick={onAction} className="text-sm font-semibold text-brand hover:text-brand-dark">{action}</button>}
    </div>
  );
}
function Partner({ icon: Icon, name, role, status, onAction }: { icon: typeof Store; name: string; role: string; status: string; onAction?: () => void }) {
  const on = status === 'Conectado';
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender text-body"><Icon size={18} /></span>
      <div className="flex-1">
        <p className="font-medium text-ink">{name}</p>
        <p className="text-xs text-muted">{role}</p>
      </div>
      {on ? (
        <span className="chip bg-brand-50 text-brand">{status}</span>
      ) : (
        <button onClick={onAction} className="chip bg-amber-500/15 text-risk-medium hover:bg-amber-500/25">Reenviar</button>
      )}
    </div>
  );
}
function Toggle({ icon: Icon, label, desc, defaultOn }: { icon: typeof Bell; label: string; desc: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(!!defaultOn);
  return (
    <div className="flex items-center gap-3 py-3 first:pt-0">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender text-body"><Icon size={18} /></span>
      <div className="flex-1">
        <p className="font-medium text-ink">{label}</p>
        <p className="text-xs text-muted">{desc}</p>
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        aria-pressed={on}
        className={`flex h-6 w-11 items-center rounded-full p-1 transition ${on ? 'justify-end bg-brand' : 'justify-start bg-line'}`}
      >
        <span className="h-4 w-4 rounded-full bg-surface shadow" />
      </button>
    </div>
  );
}
function LinkRow({ icon: Icon, label, onClick }: { icon: typeof MapPin; label: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 py-3 transition hover:opacity-80">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-lavender text-body"><Icon size={18} /></span>
      <p className="flex-1 text-left font-medium text-ink">{label}</p>
      <ChevronRight size={18} className="text-muted" />
    </button>
  );
}
