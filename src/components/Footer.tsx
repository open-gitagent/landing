const OPENGAP_REPO = "https://github.com/open-gitagent/opengap";
const GITAGENT_REPO = "https://github.com/open-gitagent/gitagent";

interface FooterProps {
  variant?: "opengap" | "gitagent";
}

export function Footer({ variant = "opengap" }: FooterProps) {
  const REPO = variant === "gitagent" ? GITAGENT_REPO : OPENGAP_REPO;

  const docsLinks = [
    { label: "Specification", href: `${REPO}/blob/main/spec/SPECIFICATION.md` },
    { label: "Getting Started", href: `${REPO}#readme` },
    { label: "Protocol Reference", href: `${REPO}#cli-commands` },
    { label: "Schema Reference", href: `${REPO}/blob/main/spec/SPECIFICATION.md` },
  ];

  const examplesLinks = [
    { label: "Minimal", href: `${REPO}/tree/main/examples/minimal` },
    { label: "Standard", href: `${REPO}/tree/main/examples/standard` },
    { label: "Full (Compliance)", href: `${REPO}/tree/main/examples/full` },
    { label: "Skills", href: `${REPO}/tree/main/examples/standard/skills` },
  ];

  const gitAgentStartLinks = [
    { label: "Install", href: `${REPO}#install` },
    { label: "Documentation", href: "/docs" },
    { label: "GitHub", href: REPO },
  ];

  return (
    <footer className="border-t border-border py-12 px-6">
      <div className="mx-auto max-w-6xl">
        {variant === "gitagent" ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12">
            <div>
              <span className="font-heading text-sm font-semibold text-foreground mb-3 block">
                <span className="text-primary">✦</span> gitagent
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">
                A git-native AI agent harness.
              </p>
            </div>

            <div>
              <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Getting Started</span>
              <div className="space-y-2">
                {gitAgentStartLinks.map((l) => (
                  <a key={l.label} href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Community</span>
              <div className="space-y-2">
                <a href={REPO} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">GitHub</a>
                <a href="https://discord.gg/hVZV8Xyjdc" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Discord</a>
                <a href={`${REPO}/discussions`} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Discussions</a>
                <a href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Contributing</a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-12">
            <div>
              <span className="font-heading text-sm font-semibold text-foreground mb-3 block">
                <span className="text-primary">✦</span> opengap
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">
                An open standard for AI agent definitions.
              </p>
            </div>

            <div>
              <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Docs</span>
              <div className="space-y-2">
                {docsLinks.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Examples</span>
              <div className="space-y-2">
                {examplesLinks.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">
                    {l.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs font-heading font-semibold text-foreground mb-3 block">Community</span>
              <div className="space-y-2">
                <a href={REPO} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">GitHub</a>
                <a href="https://discord.gg/hVZV8Xyjdc" target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Discord</a>
                <a href={`${REPO}/discussions`} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Discussions</a>
                <a href={`${REPO}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="block text-xs text-muted-foreground hover:text-foreground transition-colors font-body">Contributing</a>
              </div>
            </div>
          </div>
        )}

        <div className="line-glow w-full mb-6" />

        <p className="text-xs text-muted-foreground text-center font-body">
          {variant === "gitagent" ? "gitagent is open source. MIT License." : "opengap is an open standard. MIT License."}
        </p>
        <p className="text-[10px] text-muted-foreground/50 text-center font-body mt-2">
          Open Standard created &amp; maintained by <a href="https://github.com/shreyaskapale" target="_blank" rel="noopener noreferrer author" className="hover:text-foreground transition-colors">Shreyas Kapale</a> @ <a href="https://lyzr.ai" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Lyzr Research Labs</a>
        </p>
      </div>
    </footer>
  );
}
