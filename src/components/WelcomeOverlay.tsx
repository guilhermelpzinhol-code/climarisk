import { useEffect, useState } from 'react';
import { Sprout } from 'lucide-react';

/** Splash animado "Bem-vindo, {nome}" exibido logo após o login. */
export function WelcomeOverlay({ name, onDone }: { name: string; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const firstName = (name || 'Produtor').trim().split(/\s+/)[0];

  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 2000);
    const t2 = setTimeout(onDone, 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[3000] flex items-center justify-center bg-base transition-opacity duration-500 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Glows */}
      <div
        className="pointer-events-none absolute h-[560px] w-[560px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 60%)' }}
      />
      {/* Anéis pulsantes */}
      <span className="welcome-ring absolute h-40 w-40 rounded-full border border-brand/30" />
      <span className="welcome-ring absolute h-40 w-40 rounded-full border border-brand/20" style={{ animationDelay: '0.6s' }} />

      <div className="relative flex flex-col items-center text-center">
        <div className="welcome-pop flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-brand to-brand-dark shadow-lift">
          <Sprout size={44} className="text-[#06100C]" strokeWidth={2.2} />
        </div>
        <p className="welcome-sub mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-brand">Bem-vindo à Climarisk</p>
        <h1 className="welcome-name mt-2 text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Olá, {firstName}
        </h1>
        <p className="welcome-sub2 mt-3 max-w-xs text-sm text-body">
          Preparando seu painel de inteligência climática…
        </p>
        <div className="welcome-bar mt-7 h-1 w-48 overflow-hidden rounded-full bg-line">
          <div className="welcome-bar-fill h-full rounded-full bg-brand" />
        </div>
      </div>
    </div>
  );
}
