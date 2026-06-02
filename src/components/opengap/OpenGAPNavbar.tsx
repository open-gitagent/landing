import { useState, useRef, useEffect } from "react";
import { Menu, X, Search } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { opengapSidebarGroups } from "@/components/opengap/OpenGAPSidebar";

const allItems = opengapSidebarGroups.flatMap((g) =>
  g.items.map((item) => ({ ...item, group: g.label, slug: g.slug }))
);

interface OpenGAPNavbarProps {
  variant?: "overview" | "docs";
}

export function OpenGAPNavbar({ variant = "docs" }: OpenGAPNavbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query
    ? allItems.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.group.toLowerCase().includes(query.toLowerCase())
      )
    : allItems;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 gap-3">
        {/* Left: back + Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body mr-1"
            aria-label="Back to home"
          >
            ←
          </a>
          <a href="/opengap" className="flex items-center">
            <span className="font-heading font-semibold text-sm"><span className="text-primary">Open</span><span className="text-foreground">GAP</span></span>
          </a>
        </div>

        {/* Middle: search — docs variant only, desktop */}
        {variant === "docs" && (
          <div ref={searchRef} className="hidden md:block relative flex-1 max-w-sm mx-4">
            <div className="flex items-center gap-2 sketch-border rounded-md px-3 py-1.5 bg-background">
              <Search className="w-3 h-3 text-muted-foreground/50 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                placeholder="Search…"
                className="text-xs font-body bg-transparent outline-none text-foreground placeholder:text-muted-foreground/40 w-full"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {searchOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden max-h-72 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-xs text-muted-foreground font-body px-3 py-3">No results</p>
                ) : (
                  <ul>
                    {filtered.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`/opengap/${item.id}`}
                          onClick={() => { setSearchOpen(false); setQuery(""); }}
                          className="flex items-center justify-between px-3 py-2 text-xs font-body hover:bg-accent/50 transition-colors"
                        >
                          <span className="text-foreground">{item.label}</span>
                          <span className="text-[10px] text-muted-foreground/50 ml-4 shrink-0">{item.group}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Right — desktop */}
        <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
          <a href="/docs" className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-opacity font-body sketch-border border-primary">
            GitAgent Docs
          </a>
          <a
            href="https://github.com/open-gitagent/opengap"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sketch-border rounded-md px-3 py-1.5 text-foreground hover:bg-accent transition-colors font-body"
          >
            GitHub
          </a>
        </div>

        {/* Mobile right */}
        <div className="md:hidden flex items-center gap-3 ml-auto">
          {variant === "docs" ? (
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Open navigation"
                >
                  {sheetOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 bg-background border-r border-border">
                <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
                  <span className="font-heading font-semibold text-sm"><span className="text-primary">Open</span><span className="text-foreground">GAP</span></span>
                </div>
                <nav className="overflow-y-auto h-[calc(100vh-3.5rem)] py-4 px-3">
                  {opengapSidebarGroups.map((group, groupIndex) => (
                    <div key={group.label} className={groupIndex !== 0 ? "pt-4" : ""}>
                      <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground/40 font-body pb-1 px-2">
                        {group.label}
                      </p>
                      <ul className="space-y-0.5">
                        {group.items.map((s) => (
                          <li key={s.id}>
                            <a
                              href={`/opengap/${s.id}`}
                              onClick={() => setSheetOpen(false)}
                              className="block text-xs font-body py-1.5 px-2 rounded text-muted-foreground hover:bg-accent/40 hover:text-foreground transition-colors"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div className="mt-6 pt-4 border-t border-border px-2">
                    <a
                      href="https://github.com/open-gitagent/opengap"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
                    >
                      GitHub ↗
                    </a>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          ) : (
            <a
              href="https://github.com/open-gitagent/opengap"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sketch-border rounded-md px-3 py-1.5 text-foreground hover:bg-accent transition-colors font-body"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
