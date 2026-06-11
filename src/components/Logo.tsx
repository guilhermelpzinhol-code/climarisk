export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      <img src="/logo.png" alt="Climarisk" className="app-logo h-11 w-auto shrink-0" />
    </div>
  );
}
