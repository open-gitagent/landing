export const sidebarGroups = [
  {
    label: "Getting Started",
    slug: "getting-started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "quickstart", label: "Quick Start" },
      { id: "interfaces", label: "Ways to Interact" },
      { id: "architecture", label: "Architecture" },
    ],
  },
  {
    label: "Interfaces",
    slug: "interfaces",
    items: [
      { id: "cli", label: "CLI" },
      { id: "webui", label: "Web & Voice" },
      { id: "messaging", label: "Messaging" },
      { id: "sdk", label: "SDK" },
    ],
  },
  {
    label: "Configuration",
    slug: "configuration",
    items: [
      { id: "models", label: "Models & Providers" },
      { id: "env", label: "Environment Variables" },
    ],
  },
  {
    label: "Capabilities",
    slug: "capabilities",
    items: [
      { id: "tools", label: "Tools" },
      { id: "skills", label: "Skills" },
      { id: "workflows", label: "Workflows" },
      { id: "hooks", label: "Hooks" },
      { id: "plugins", label: "Plugins" },
    ],
  },
  {
    label: "Data & Integrations",
    slug: "data",
    items: [
      { id: "memory", label: "Memory System" },
      { id: "schedules", label: "Schedules & Cron" },
      { id: "integrations", label: "Integrations" },
    ],
  },
  {
    label: "Enterprise",
    slug: "enterprise",
    items: [
      { id: "compliance", label: "Compliance & Audit" },
      { id: "security", label: "Security" },
    ],
  },
  {
    label: "SDK & Utilities",
    slug: "sdk",
    items: [
      { id: "utilities", label: "Utilities" },
      { id: "telemetry", label: "Telemetry" },
    ],
  },
];

export function GitAgentSidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
          Contents
        </p>
        <nav>
          {sidebarGroups.map((group, groupIndex) => (
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
                        href={`/docs/${s.id}`}
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
