import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastItem {
  id: number;
  msg: string;
}

/** Dispara um toast de qualquer lugar do app. */
export function toast(msg: string) {
  window.dispatchEvent(new CustomEvent('climarisk:toast', { detail: msg }));
}

export function Toaster() {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    function onToast(e: Event) {
      const msg = (e as CustomEvent<string>).detail;
      const id = Date.now() + Math.random();
      setItems((prev) => [...prev, { id, msg }]);
      setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 3200);
    }
    window.addEventListener('climarisk:toast', onToast);
    return () => window.removeEventListener('climarisk:toast', onToast);
  }, []);

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[2000] flex -translate-x-1/2 flex-col items-center gap-2 lg:bottom-6 lg:left-auto lg:right-6 lg:translate-x-0 lg:items-end">
      {items.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex animate-fade-up items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 shadow-lift"
        >
          <CheckCircle2 size={18} className="text-brand" />
          <span className="text-sm font-medium text-ink">{t.msg}</span>
          <button
            onClick={() => setItems((prev) => prev.filter((x) => x.id !== t.id))}
            className="text-muted hover:text-ink"
          >
            <X size={15} />
          </button>
        </div>
      ))}
    </div>
  );
}
