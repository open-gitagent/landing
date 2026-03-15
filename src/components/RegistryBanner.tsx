export function RegistryBanner() {
  return (
    <div className="fixed top-14 left-0 right-0 z-40 bg-primary text-primary-foreground">
      <a
        href="https://registry.gitagent.sh/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 px-4 py-1.5 text-xs font-body hover:opacity-90 transition-opacity"
      >
        <span className="font-medium bg-primary-foreground/20 text-primary-foreground px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">New</span>
        <span>Agent Registry is live — discover and share community agents</span>
        <span className="font-medium underline underline-offset-2">Browse Registry →</span>
      </a>
    </div>
  );
}
