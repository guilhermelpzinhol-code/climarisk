export function Logo({ withTagline = true, className = '' }: { withTagline?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img src="/logo.png" alt="Climarisk" className="h-11 w-auto shrink-0" />
      {withTagline && (
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:block">
          Agri-Intelligence Prime
        </span>
      )}
    </div>
  );
}
