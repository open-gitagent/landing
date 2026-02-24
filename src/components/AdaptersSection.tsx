import { motion } from "framer-motion";

const adapters = [
  { name: "Claude Code", adapter: "claude", mode: "Interactive / one-shot", requires: "Claude Code CLI", features: ["Append system prompt", "Sub-agents", "Hook mapping", "Permission modes"] },
  { name: "OpenAI Agents SDK", adapter: "openai", mode: "One-shot", requires: "OPENAI_API_KEY, Python 3", features: ["Auto-generated Python code", "Tool function stubs", "Type mappings"] },
  { name: "CrewAI", adapter: "crewai", mode: "One-shot", requires: "CrewAI CLI", features: ["YAML config export", "Role/goal extraction", "Sub-agent mapping"] },
  { name: "OpenClaw", adapter: "openclaw", mode: "One-shot", requires: "ANTHROPIC_API_KEY, OpenClaw CLI", features: ["Auto-provision auth", "Workspace generation", "HITL → thinking=high"] },
  { name: "Nanobot", adapter: "nanobot", mode: "Interactive / one-shot", requires: "ANTHROPIC_API_KEY, Nanobot CLI", features: ["Auto-provision auth", "Config + system prompt", "Environment variables"] },
  { name: "Lyzr Studio", adapter: "lyzr", mode: "One-shot", requires: "LYZR_API_KEY", features: ["REST API deployment", "Agent ID persistence", "Provider auto-mapping"] },
  { name: "GitHub Models", adapter: "github", mode: "One-shot (streaming)", requires: "GITHUB_TOKEN (models:read)", features: ["Model namespace mapping", "Streaming responses", "Multi-provider support"] },
  { name: "Git (Auto-Detect)", adapter: "git", mode: "Auto", requires: "Depends on detected adapter", features: [".gitagent_adapter hint", "Model-based detection", "File-based fallback"] },
];

export function AdaptersSection() {
  return (
    <section id="adapters" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Adapters & Runners</h2>
          <p className="text-sm text-muted-foreground font-body">
            One agent definition. Eight runtime targets.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {adapters.map((a, i) => (
            <motion.div
              key={a.adapter}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="paper-card p-3 sm:p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 relative z-10">
                <span className="text-sm font-heading font-semibold text-foreground">{a.name}</span>
                <code className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body">
                  {a.adapter}
                </code>
              </div>

              <div className="space-y-1.5 mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider w-10 font-body">Mode</span>
                  <span className="text-[11px] text-muted-foreground font-body">{a.mode}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wider w-10 shrink-0 pt-0.5 font-body">Req</span>
                  <span className="text-[11px] text-muted-foreground font-body">{a.requires}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 relative z-10">
                {a.features.map((f) => (
                  <span
                    key={f}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-body"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
