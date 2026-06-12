import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Map as MapIcon,
  Building2,
  ShieldCheck,
  Bell,
  Settings,
  LifeBuoy,
  Search,
  HelpCircle,
  BarChart3,
  Menu,
  X,
  User,
  Sprout,
  MapPin,
  Mail,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { Logo } from './Logo';
import { Toaster, toast } from './Toaster';
import { WelcomeOverlay } from './WelcomeOverlay';
import { Modal } from './Modal';
import { useStore } from '../lib/store';
import { alerts, riskMeta } from '../lib/data';

const nav = [
  { to: '/dashboard', label: 'Painel', icon: LayoutGrid },
  { to: '/map', label: 'Mapa', icon: MapIcon },
  { to: '/properties', label: 'Propriedades', icon: Building2 },
  { to: '/insurance', label: 'Proteção', icon: ShieldCheck },
  { to: '/alerts', label: 'Alertas', icon: Bell },
  { to: '/settings', label: 'Configurações', icon: Settings },
];

const mobileNav = [
  { to: '/dashboard', label: 'Painel', icon: LayoutGrid },
  { to: '/properties', label: 'Áreas', icon: Sprout },
  { to: '/insurance', label: 'Proteção', icon: ShieldCheck },
  { to: '/alerts', label: 'Alertas', icon: Bell, dot: true },
  { to: '/profile', label: 'Perfil', icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [supportOpen, setSupportOpen] = useState(false);
  const [q, setQ] = useState('');
  const { userName, welcome, clearWelcome, properties } = useStore();
  const navigate = useNavigate();

  const matches = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (t.length < 1) return [];
    return properties
      .filter((p) => `${p.name} ${p.culture} ${p.location} ${p.lat},${p.lng}`.toLowerCase().includes(t))
      .slice(0, 6);
  }, [q, properties]);

  function goToProperty(id: string) {
    setQ('');
    navigate(`/properties?p=${id}`);
  }
  const initials = (userName || 'Climarisk User')
    .split(' ')
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-base">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
        <button onClick={() => navigate('/')} className="px-2 text-left">
          <Logo />
        </button>
        <button onClick={() => navigate('/insurance')} className="btn-primary mt-7 w-full">
          <BarChart3 size={16} /> Analisar Risco
        </button>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <NavItem key={n.to} {...n} />
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-line pt-3">
          <button onClick={() => setSupportOpen(true)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-body transition hover:bg-soft hover:text-ink">
            <LifeBuoy size={18} /> Suporte
          </button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-ink/40" />
          <aside className="absolute inset-y-0 left-0 w-72 bg-surface px-4 py-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button onClick={() => setOpen(false)} className="text-muted">
                <X size={20} />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-1">
              {nav.map((n) => (
                <NavItem key={n.to} {...n} onClick={() => setOpen(false)} />
              ))}
              <NavItem to="/profile" label="Perfil" icon={User} onClick={() => setOpen(false)} />
            </nav>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        {/* Topbar desktop */}
        <header className="sticky top-0 z-20 hidden items-center gap-4 border-b border-line bg-surface/80 px-6 py-3.5 backdrop-blur lg:flex">
          <div className="relative max-w-md flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              className="field pl-10"
              placeholder="Buscar propriedades, cultura ou coordenadas…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            {q.trim() && (
              <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-line bg-surface shadow-lift">
                {matches.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-muted">Nenhuma propriedade encontrada.</p>
                ) : (
                  matches.map((p) => (
                    <button key={p.id} onMouseDown={() => goToProperty(p.id)} className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition hover:bg-soft">
                      <MapPin size={15} className="shrink-0 text-brand" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-ink">{p.name}</span>
                        <span className="block truncate text-xs text-muted">{p.culture} · {p.location}</span>
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={() => { setNotifOpen((v) => !v); setUnread(false); }}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body transition hover:text-brand"
            >
              <Bell size={18} />
              {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-critical" />}
            </button>
            <button
              onClick={() => setSupportOpen(true)}
              aria-label="Ajuda e suporte"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-body transition hover:text-brand"
            >
              <HelpCircle size={18} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-[#06100C]">
              {initials}
            </div>
          </div>
        </header>

        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-brand">
            <Menu size={22} />
          </button>
          <img src="/logo-v2.png" alt="Climarisk" className="app-logo h-8 w-auto" />
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setNotifOpen((v) => !v); setUnread(false); }}
              className="relative flex h-9 w-9 items-center justify-center text-brand"
            >
              <Bell size={20} />
              {unread && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-risk-critical" />}
            </button>
          </div>
        </header>

        <main className="px-4 py-6 pb-24 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-line bg-surface/95 px-2 py-2 backdrop-blur lg:hidden">
        {mobileNav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-medium transition ${
                isActive ? 'bg-brand-50 text-brand' : 'text-muted'
              }`
            }
          >
            <span className="relative">
              <n.icon size={20} />
              {n.dot && <span className="absolute -right-1 -top-0.5 h-1.5 w-1.5 rounded-full bg-risk-critical" />}
            </span>
            {n.label}
          </NavLink>
        ))}
      </nav>

      {/* Painel de notificações */}
      {notifOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
          <div className="fixed right-3 top-16 z-50 w-[min(92vw,360px)] animate-fade-up overflow-hidden rounded-2xl border border-line bg-surface shadow-lift lg:right-6 lg:top-16">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <span className="text-sm font-bold text-ink">Notificações</span>
              <button onClick={() => setNotifOpen(false)} className="text-muted hover:text-ink">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[60vh] divide-y divide-line overflow-y-auto">
              {alerts.map((a) => {
                const color = riskMeta[a.level].color;
                return (
                  <button
                    key={a.id}
                    onClick={() => { setNotifOpen(false); navigate('/alerts'); }}
                    className="flex w-full gap-3 px-4 py-3 text-left transition hover:bg-soft"
                  >
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-ink">{a.title}</span>
                      <span className="mt-0.5 line-clamp-2 block text-xs text-body">{a.description}</span>
                      <span className="mt-1 block text-[11px] text-muted">{a.date} · {a.time}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => { setNotifOpen(false); navigate('/alerts'); }}
              className="w-full border-t border-line py-3 text-sm font-semibold text-brand transition hover:bg-soft"
            >
              Ver central de laudos
            </button>
          </div>
        </>
      )}

      <Toaster />
      {welcome && <WelcomeOverlay name={userName} onDone={clearWelcome} />}

      <Modal open={supportOpen} onClose={() => setSupportOpen(false)} title="Suporte Climarisk" subtitle="Estamos com você na safra. Fale com a gente:">
        <div className="space-y-3">
          <SupportRow icon={MessageCircle} label="Chat com especialista" value="Resposta em até 1 dia útil" onClick={() => { setSupportOpen(false); toast('Chat iniciado — um especialista entrará em contato.'); }} />
          <a href="mailto:suporte@climarisk.com.br" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-brand/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand"><Mail size={18} /></span>
            <span><span className="block text-sm font-semibold text-ink">E-mail</span><span className="block text-xs text-muted">suporte@climarisk.com.br</span></span>
          </a>
          <a href="https://wa.me/5577900000000" target="_blank" rel="noopener" className="flex items-center gap-3 rounded-xl border border-line p-3 transition hover:border-brand/40">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand"><Phone size={18} /></span>
            <span><span className="block text-sm font-semibold text-ink">WhatsApp</span><span className="block text-xs text-muted">(77) 90000-0000</span></span>
          </a>
        </div>
      </Modal>
    </div>
  );
}

function SupportRow({ icon: Icon, label, value, onClick }: { icon: typeof Mail; label: string; value: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 rounded-xl border border-line p-3 text-left transition hover:border-brand/40">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand"><Icon size={18} /></span>
      <span><span className="block text-sm font-semibold text-ink">{label}</span><span className="block text-xs text-muted">{value}</span></span>
    </button>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  onClick,
}: {
  to: string;
  label: string;
  icon: typeof LayoutGrid;
  onClick?: () => void;
}) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive ? 'bg-brand text-[#06100C] shadow-soft' : 'text-body hover:bg-soft hover:text-ink'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
