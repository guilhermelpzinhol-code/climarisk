import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

/** Modal acessível: fecha no Esc e no clique fora, trava o scroll e foca ao abrir. */
export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxW = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  maxW?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1500] flex items-end justify-center bg-ink/50 p-4 backdrop-blur-sm sm:items-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        ref={ref}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${maxW} max-h-[90vh] animate-fade-up overflow-y-auto rounded-2xl border border-line bg-surface shadow-lift outline-none`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line p-5">
          <div>
            <h3 className="text-lg font-bold text-ink">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-body">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Fechar" className="text-muted transition hover:text-ink">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-line p-5">{footer}</div>}
      </div>
    </div>
  );
}
