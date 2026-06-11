import { useState } from 'react';
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
} from 'lucide-react';
import { Logo } from './Logo';
import { useStore } from '../lib/store';

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/map', label: 'Map View', icon: MapIcon },
  { to: '/properties', label: 'Properties', icon: Building2 },
  { to: '/insurance', label: 'Insurance', icon: ShieldCheck },
  { to: '/alerts', label: 'Alerts', icon: Bell },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const mobileNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/properties', label: 'Properties', icon: Sprout },
  { to: '/insurance', label: 'Protection', icon: ShieldCheck },
  { to: '/alerts', label: 'Alerts', icon: Bell, dot: true },
  { to: '/profile', label: 'Profile', icon: User },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { userName } = useStore();
  const navigate = useNavigate();
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
          <BarChart3 size={16} /> Analyze Risk
        </button>
        <nav className="mt-6 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <NavItem key={n.to} {...n} />
          ))}
        </nav>
        <div className="flex flex-col gap-1 border-t border-line pt-3">
          <NavItem to="/profile" label="Support" icon={LifeBuoy} />
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
              <NavItem to="/profile" label="Profile" icon={User} onClick={() => setOpen(false)} />
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
            <input className="field pl-10" placeholder="Buscar coordenadas ou propriedades..." />
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button className="relative text-body hover:text-ink">
              <Bell size={19} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-risk-critical" />
            </button>
            <button className="text-body hover:text-ink">
              <HelpCircle size={19} />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-xs font-semibold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <button onClick={() => setOpen(true)} className="text-brand">
            <Menu size={22} />
          </button>
          <img src="/logo.png" alt="Climarisk" className="h-7 w-auto brightness-0 invert" />
          <button className="relative text-brand">
            <Bell size={20} />
            <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-risk-critical" />
          </button>
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
    </div>
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
          isActive ? 'bg-brand text-white shadow-soft' : 'text-body hover:bg-soft hover:text-ink'
        }`
      }
    >
      <Icon size={18} />
      {label}
    </NavLink>
  );
}
