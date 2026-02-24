export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div>
            <span className="font-heading text-sm font-semibold text-foreground mb-3 block">
              <span className="text-primary">✦</span> gitagent
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed font-body">
              An open standard for AI agent definitions.
            </p>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Docs</span>
            <div className="space-y-2">
              {["Specification", "Getting Started", "CLI Reference", "Schema Reference"].map((l) => (
                <a key={l} href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Examples</span>
            <div className="space-y-2">
              {["Minimal", "Standard", "Full (Compliance)", "Skills"].map((l) => (
                <a key={l} href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                  {l}
                </a>
              ))}
            </div>
          </div>

          <div>
            <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Community</span>
            <div className="space-y-2">
              {["GitHub", "Discussions", "Contributing", "License"].map((l) => (
                <a key={l} href="#" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="line-glow w-full mb-6" />

        <p className="text-xs text-muted-foreground text-center font-body">
          gitagent is an open standard. MIT License.
        </p>
        <p className="text-[10px] text-muted-foreground/50 text-center font-body mt-2">
          Open Standard created by Shreyas Kapale
        </p>
      </div>
    </footer>
  );
}
