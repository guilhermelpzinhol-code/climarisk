import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Store, Landmark, Bell, MapPin, ShieldCheck, LogOut, ChevronRight } from 'lucide-react';
import { useStore } from '../lib/store';
import { toast } from '../components/Toaster';

export default function Profile() {
  const { userName, profile, email, signOut } = useStore();
  const navigate = useNavigate();
  const initials = (userName || 'Carlos Mendes').split(' ').slice(0, 2).map((s) => s[0]).join('').toUpperCase();

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <div className="card overflow-hidden">
        <div className="flex flex-col items-center bg-gradient-to-br from-brand-50 to-lavender p-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand text-2xl font-bold text-white shadow-lift">
              {initials}
            </div>
            <span className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand text-white">
              <Pencil size={12} />
            </span>
          </div>
          <h1 className="mt-4 text-xl font-bold text-ink">{userName || 'Carlos Mendes'}</h1>
          <p className="text-sm text-body">{email || 'sem e-mail'}</p>
          <span className="chip mt-2 bg-brand-100 text-brand-dark capitalize">{profile ?? 'Produtor Rural'}</span>
        </div>
      </div>

      <Section title="Dados Pessoais">
        <Row label="Nome Completo" value={userName || 'Carlos Henrique Mendes'} />
        <Row label="CPF" value="***.456.789-**" />
        <Row label="Telefone" value="(77) 98765-4321" action="Editar" onAction={() => toast('Edição de cadastro disponível na versão completa.')} />
      </Section>

      <Section title="Conexões de Parceiros">
        <Partner icon={Store} name="AgroTech Insumos" role="Revenda" status="Conectado" />
        <Partner icon={Landmark} name="Banco Rural" role="Instituição Financeira" status="Pendente" onAction={() => toast('Convite reenviado para o Banco Rural.')} />
      </Section>

      <Section title="Configurações do App">
        <Toggle icon={Bell} label="Notificações de Risco" desc="Alertas climáticos severos" defaultOn />
        <LinkRow icon={MapPin} label="Permissões de Localização" onClick={() => toast('Permissões de localização: concedidas.')} />
        <LinkRow icon={ShieldCheck} label="Segurança e Senha" onClick={() => toast('Central de segurança em breve.')} />
        <button onClick={handleLogout} className="flex w-full items-center gap-3 px-1 py-3 text-sm font-semibold text-risk-critical">
          <LogOut size={18} /> Sair da Conta
        </button>
      </Section>

      <p className="mt-6 text-center font-mono text-[11px] text-muted">Versão 2.4.1 (Build 849)</p>
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
