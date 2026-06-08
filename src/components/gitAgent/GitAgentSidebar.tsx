export const sidebarGroups = [
  {
    label: "Getting Started",
    slug: "getting-started",
    items: [
      { id: "overview", label: "Overview" },
      { id: "interfaces", label: "Ways to Interact" },
      { id: "architecture", label: "Architecture" },
    ],
  },
  {
    label: "SDK",
    slug: "sdk",
    items: [
      { id: "quickstart/sdk", label: "Quick Start" },
      { id: "sdk", label: "SDK Reference" },
      { id: "utilities", label: "Utilities" },
      { id: "telemetry", label: "Telemetry" },
      { id: "cookbooks-divider", label: "SDK Cookbooks", divider: true },
      { id: "sdk/cookbooks/refactor-repo", label: "Refactor a Repo", depth: 1 },
      { id: "sdk/cookbooks/summarize-emails", label: "Summarize Emails", depth: 1 },
      { id: "sdk/cookbooks/code-review", label: "Code Review PR", depth: 1 },
      { id: "sdk/cookbooks/custom-tool", label: "Custom Tool", depth: 1 },
      { id: "sdk/cookbooks/multi-agent-handoff", label: "Multi-Agent Handoff", depth: 1 },
      { id: "sdk/cookbooks/scheduled-cron", label: "Scheduled Cron", depth: 1 },
    ],
  },
  {
    label: "Personal Assistant",
    slug: "personal-assistant",
    items: [
      { id: "quickstart/personal-assistant", label: "Quick Start" },
      { id: "cli", label: "CLI" },
      { id: "webui", label: "Web & Voice" },
      { id: "messaging", label: "Messaging" },
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
];

export function GitAgentSidebar({ activeSection }: { activeSection: string }) {
  return (
    <aside className="hidden lg:block w-56 shrink-0 border-r border-border">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pr-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-track]:bg-transparent">
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
                  if ("divider" in s && s.divider) {
                    return (
                      <li key={s.id} className="pt-3 pb-0.5 px-2">
                        <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 font-body">
                          {s.label}
                        </p>
                      </li>
                    );
                  }
                  const isActive = "href" in s && s.href
                    ? s.href === `/docs/${activeSection}`
                    : activeSection === s.id;
                  return (
                    <li key={s.id}>
                      <a
                        href={"href" in s && s.href ? s.href : `/docs/${s.id}`}
                        className={`block font-body py-1 px-2 rounded transition-colors ${"depth" in s && s.depth ? "pl-5 text-[11px]" : "text-xs"} ${
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
