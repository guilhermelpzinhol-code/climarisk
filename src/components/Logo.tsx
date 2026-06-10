export function Logo({ withTagline = true, className = '' }: { withTagline?: boolean; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <img
        src="/logo.png"
        alt="Climarisk"
        className="h-8 w-auto"
        width={92}
        height={32}
        style={{
          filter:
            'brightness(0) saturate(100%) invert(43%) sepia(72%) saturate(560%) hue-rotate(92deg) brightness(93%) contrast(92%)',
        }}
      />
      {withTagline && (
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.18em] text-muted sm:block">
          Agri-Intelligence Prime
        </span>
      )}
    </div>
  );
}
