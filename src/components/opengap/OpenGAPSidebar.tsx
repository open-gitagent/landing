export const opengapSidebarGroups = [
  {
    label: "Getting Started",
    slug: "getting-started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quick Start" },
    ],
  },
  {
    label: "Concepts",
    slug: "concepts",
    items: [
      { id: "why", label: "Why OpenGAP" },
      { id: "how-it-works", label: "How It Works" },
      { id: "patterns", label: "Agent Patterns" },
    ],
  },
  {
    label: "Features",
    slug: "features",
    items: [
      { id: "cli", label: "CLI" },
      { id: "export", label: "Export" },
      { id: "adapters", label: "Adapters" },
    ],
  },
  {
    label: "Skills",
    slug: "skills",
    items: [
      { id: "skills", label: "Skills" },
      { id: "skillflow", label: "SkillFlow" },
    ],
  },
  {
    label: "Enterprise",
    slug: "enterprise",
    items: [
      { id: "compliance", label: "Compliance" },
      { id: "faq", label: "FAQ" },
    ],
  },
];

export function OpenGAPSidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 pt-14">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
          Contents
        </p>
        <nav>
          {opengapSidebarGroups.map((group, groupIndex) => (
            <div key={group.label} className={groupIndex !== 0 ? "pt-4" : ""}>
              <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 font-body pb-1 px-2">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((s) => {
                  const isActive = activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={`/opengap/${s.id}`}
                        className={`block text-xs font-body py-1 px-2 rounded transition-colors ${
                          isActive
                            ? "text-primary font-medium bg-primary/5"
                            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                        }`}
                      >
                        {s.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
