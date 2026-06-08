import { motion } from "framer-motion";
import { Terminal, Code2, ArrowRight } from "lucide-react";

const paths = [
  {
    icon: Code2,
    title: "SDK / Embed",
    desc: "Import GitAgent as a Node.js library and call query() from your own application or script.",
    bullets: ["Zero-config repo analysis", "Streaming async iterator", "Composable tools & hooks"],
    href: "/docs/quickstart/sdk",
    cta: "View SDK quickstart",
  },
  {
    icon: Terminal,
    title: "Personal Assistant",
    desc: "Install GitAgent as a global CLI and run it as your daily coding companion — voice, text, or web UI.",
    bullets: ["Interactive install script", "Voice + text interface", "Auto-scaffolds agent.yaml & SOUL.md"],
    href: "/docs/quickstart/personal-assistant",
    cta: "Get started",
  },
];

const comparison = [
  { aspect: "Audience", pa: "End users / developers", sdk: "Application developers" },
  { aspect: "Install", pa: "npm install -g", sdk: "npm install (local dep)" },
  { aspect: "Entry point", pa: "gitagent CLI", sdk: "query() function" },
  { aspect: "Interface", pa: "Voice, Web UI, REPL", sdk: "Streaming async iterator" },
  { aspect: "Agent config", pa: "agent.yaml + SOUL.md", sdk: "Optional — works without" },
];

export function GitAgentQuickStart() {
  return (
    <section id="quickstart" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Quick Start</h2>
          <p className="text-sm text-muted-foreground font-body">
            Two entry points depending on how you want to use GitAgent. Pick the one that matches your goal.
          </p>
        </motion.div>

        {/* Two-card chooser */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {paths.map((p, i) => (
            <motion.a
              key={p.title}
              href={p.href}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="paper-card p-6 hover:border-primary/50 transition-colors group block"
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <p.icon className="w-4 h-4 text-primary" />
                  <p className="text-sm font-semibold text-foreground font-heading">{p.title}</p>
                </div>
                <p className="text-[12px] text-muted-foreground font-body leading-relaxed mb-4">
                  {p.desc}
                </p>
                <ul className="space-y-1 mb-5">
                  {p.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-[11px] text-muted-foreground font-body">
                      <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
                <span className="inline-flex items-center gap-1 text-xs text-primary font-body group-hover:gap-2 transition-all">
                  {p.cta}
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Comparison table */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Which should I use?
          </h3>
          <div className="sketch-border overflow-x-auto rounded-md">
            <table className="w-full text-[11px] font-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium uppercase tracking-widest text-[10px]">Aspect</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium uppercase tracking-widest text-[10px]">SDK / Embed</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium uppercase tracking-widest text-[10px]">Personal Assistant</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.aspect} className={i < comparison.length - 1 ? "border-b border-border/50" : ""}>
                    <td className="px-4 py-2.5 text-muted-foreground/70 font-medium">{row.aspect}</td>
                    <td className="px-4 py-2.5 text-foreground">{row.sdk}</td>
                    <td className="px-4 py-2.5 text-foreground">{row.pa}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
