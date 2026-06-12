import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";

export interface SidebarSubItem {
  id: string;
  label: string;
}

export interface SidebarSubGroup {
  label: string;
  items: SidebarSubItem[];
}

export interface SidebarItem {
  id: string;
  label: string;
  childGroups?: SidebarSubGroup[];
}

export interface SidebarGroup {
  label: string;
  slug: string;
  items: SidebarItem[];
}

export const opengapSidebarGroups: SidebarGroup[] = [
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
    ],
  },
  {
    label: "Features",
    slug: "features",
    items: [
      { id: "cli", label: "CLI" },
      {
        id: "import",
        label: "Import",
        childGroups: [
          {
            label: "File System Agents",
            items: [
              { id: "cookbook-claude-code", label: "Claude Code" },
              { id: "cookbook-cursor", label: "Cursor" },
              { id: "cookbook-gemini-cli", label: "Gemini CLI" },
              { id: "cookbook-codex", label: "Codex" },
              { id: "cookbook-opencode", label: "OpenCode" },
            ],
          },
          {
            label: "Code-Based Frameworks",
            items: [
              { id: "cookbook-framework-translator", label: "Framework Conversion" },
            ],
          },
        ],
      },
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

// Flattened, in display order — parents followed by their children.
// Used for prev/next navigation, active-label lookup, and search.
export const opengapAllItems: SidebarSubItem[] = opengapSidebarGroups.flatMap((g) =>
  g.items.flatMap((item) =>
    item.childGroups
      ? [{ id: item.id, label: item.label }, ...item.childGroups.flatMap((cg) => cg.items)]
      : [{ id: item.id, label: item.label }]
  )
);

function SidebarLeaf({ item, activeSection }: { item: SidebarSubItem; activeSection: string }) {
  const isActive = activeSection === item.id;
  return (
    <li>
      <a
        href={`/opengap/${item.id}`}
        className={`block text-xs font-body py-1 px-2 rounded transition-colors ${
          isActive
            ? "text-primary font-medium bg-primary/5"
            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
        }`}
      >
        {item.label}
      </a>
    </li>
  );
}

function SidebarParent({ item, activeSection }: { item: SidebarItem; activeSection: string }) {
  const childIds = item.childGroups?.flatMap((cg) => cg.items.map((c) => c.id)) ?? [];
  const inSubtree = activeSection === item.id || childIds.includes(activeSection);
  const isActive = activeSection === item.id;
  const [expanded, setExpanded] = useState(inSubtree);

  // Auto-expand whenever the user navigates into this subtree.
  useEffect(() => {
    if (inSubtree) setExpanded(true);
  }, [inSubtree]);

  return (
    <li>
      <div className="flex items-center">
        <a
          href={`/opengap/${item.id}`}
          className={`flex-1 block text-xs font-body py-1 px-2 rounded transition-colors ${
            isActive
              ? "text-primary font-medium bg-primary/5"
              : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
          }`}
        >
          {item.label}
        </a>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="p-1 text-muted-foreground/40 hover:text-foreground transition-colors"
          aria-label={`Toggle ${item.label} cookbooks`}
          aria-expanded={expanded}
        >
          <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? "rotate-90" : ""}`} />
        </button>
      </div>
      {expanded && item.childGroups && (
        <div className="ml-3 mt-1 border-l border-border pl-2 space-y-2">
          {item.childGroups.map((cg) => (
            <div key={cg.label}>
              <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground/40 font-body pb-0.5 px-2">
                {cg.label}
              </p>
              <ul className="space-y-0.5">
                {cg.items.map((c) => (
                  <SidebarLeaf key={c.id} item={c} activeSection={activeSection} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </li>
  );
}

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
                {group.items.map((s) =>
                  s.childGroups ? (
                    <SidebarParent key={s.id} item={s} activeSection={activeSection} />
                  ) : (
                    <SidebarLeaf key={s.id} item={s} activeSection={activeSection} />
                  )
                )}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
