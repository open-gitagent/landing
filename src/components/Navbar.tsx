import { useState } from "react";
import { motion } from "framer-motion";
import gitagentLogo from "@/assets/gitagent-logo.png";

const navLinks = [
  { label: "Why", href: "#why" },
  { label: "How It Works", href: "#how" },
  { label: "CLI", href: "#cli" },
  { label: "Adapters", href: "#adapters" },
  { label: "Skills", href: "#skills" },
  { label: "Compliance", href: "#compliance" },
  { label: "Quick Start", href: "#quickstart" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
          <img src={gitagentLogo} alt="GitAgent" className="w-5 h-5 rounded-sm" style={{ filter: 'invert(1) sepia(1) saturate(2) hue-rotate(330deg) brightness(0.45)' }} /> gitagent
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground font-body"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://discord.gg/hVZV8Xyjdc"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground font-body"
          >
            Discord
          </a>
          <a
            href="https://github.com/open-gitagent/gitagent"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sketch-border rounded-md px-3 py-1.5 text-foreground transition-colors hover:bg-accent font-body"
          >
            GitHub
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setOpen(!open)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden border-t border-border bg-background px-6 py-4 space-y-3"
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-xs text-muted-foreground hover:text-foreground font-body"
            >
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com/open-gitagent/gitagent"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-foreground font-body"
          >
            GitHub →
          </a>
        </motion.div>
      )}
    </nav>
  );
}
