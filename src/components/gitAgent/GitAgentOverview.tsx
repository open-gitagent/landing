import { motion } from "framer-motion";

const repoPhilosophyItems = [
  {
    file: "agent.yaml",
    desc: "model, tools, runtime config",
    dot: "bg-primary",
  },
  {
    file: "SOUL.md",
    desc: "personality and identity",
    dot: "bg-primary/70",
  },
  {
    file: "RULES.md",
    desc: "behavioral constraints",
    dot: "bg-foreground/40",
  },
  {
    file: "memory/",
    desc: "git-committed memory with full history",
    dot: "bg-primary/50",
  },
  {
    file: "tools/ + skills/ + hooks/",
    desc: "all version-controlled",
    dot: "bg-foreground/30",
  },
];

const comparisonRows = [
  {
    dimension: "Primary purpose",
    gitagent: "General-purpose AI agent framework",
    openclaw: "General-purpose life/work assistant",
  },
  {
    dimension: "Security model",
    gitagent: "Git-native (all changes tracked, reversible), auditable",
    openclaw:
      "Auth disabled by default, plaintext credentials, vulnerable skill marketplace",
  },
  {
    dimension: "Voice mode",
    gitagent:
      "Real-time bidirectional with OpenAI Realtime API, camera input",
    openclaw: "TTS/STT via ElevenLabs, no real-time bidirectional",
  },
  {
    dimension: "Skills",
    gitagent:
      "Curated marketplace, agent creates its own skills, SkillFlow",
    openclaw: "13,700+ community skills (~20% flagged malicious)",
  },
  {
    dimension: "Memory",
    gitagent: "Structured git-committed memory with RL + archival",
    openclaw: "Markdown diary entries",
  },
  {
    dimension: "Multi-channel",
    gitagent: "Voice UI, Telegram, WhatsApp",
    openclaw: "20+ channels",
  },
  {
    dimension: "Architecture",
    gitagent: "Single focused process, SDK for embedding",
    openclaw: "Gateway + multiple services",
  },
];

export function GitAgentOverview() {
  return (
    <section id="overview" className="py-16 px-0 border-t border-border">
      {/* Brief intro */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-10"
      >
        <h2 className="text-2xl font-heading font-bold text-foreground mb-3">
          Overview
        </h2>
        <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
          GitAgent is a git-native, multimodal <span className="text-foreground font-medium">AI agent harness</span> built in TypeScript. Your agent lives entirely inside a git repository — identity, memory, rules, tools, and skills are all plain files you can read, diff, and roll back.
          Install with one command, configure in plain text, and run it anywhere Node.js runs.
        </p>
      </motion.div>

      {/* Why GitAgent heading */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-8"
      >
        <h3 className="text-lg font-heading font-bold text-foreground mb-1">
          Why GitAgent
        </h3>
        <p className="text-sm text-muted-foreground font-body">
          Agents as repos — your agent IS a git repository.
        </p>
      </motion.div>

      {/* Two-column: repo philosophy + narrower scope note */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        {/* Left: repo philosophy */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="paper-card p-4"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body relative z-10">
            Your agent repo
          </p>
          <ul className="space-y-2 relative z-10">
            {repoPhilosophyItems.map((item) => (
              <li key={item.file} className="flex items-start gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${item.dot}`} />
                <span className="text-xs font-body">
                  <span className="text-foreground font-medium">{item.file}</span>
                  <span className="text-muted-foreground/70"> — {item.desc}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted-foreground/60 font-body italic mt-4 relative z-10">
            Fork an agent. Branch a personality.{" "}
            <code className="text-primary not-italic">git log</code> your agent's memory.{" "}
            <code className="text-primary not-italic">diff</code> its rules. This is agents as repos.
          </p>
        </motion.div>

        {/* Right: scope note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="paper-card p-4"
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body relative z-10">
            Design philosophy
          </p>
          <p className="text-sm text-foreground font-body font-medium mb-3 relative z-10">
            GitAgent is narrower in scope but deeper in execution.
          </p>
          <p className="text-xs text-muted-foreground font-body leading-relaxed relative z-10">
            Rather than being a general-purpose life assistant, GitAgent focuses entirely on
            being the best autonomous coding and project agent possible. Every design decision
            optimizes for reliability, security, and developer trust.
          </p>
          <ul className="mt-4 space-y-1.5 relative z-10">
            {[
              "All agent state is version-controlled",
              "No silent credential storage",
              "Auditable by design",
              "Composable skills via SkillFlow",
            ].map((point) => (
              <li key={point} className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>

      {/* Comparison table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.12 }}
        className="paper-card overflow-hidden mb-6"
      >
        <div className="overflow-x-auto">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_1.2fr_1.2fr] border-b border-border bg-accent/30 px-4 py-2.5 relative z-10">
            {["Dimension", "GitAgent", "OpenClaw"].map((col) => (
              <span
                key={col}
                className={`text-[10px] uppercase tracking-wider font-body text-muted-foreground/60 ${
                  col === "GitAgent" ? "text-primary/70" : ""
                }`}
              >
                {col}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {comparisonRows.map((row, i) => (
            <div
              key={row.dimension}
              className={`grid grid-cols-[1fr_1.2fr_1.2fr] px-4 py-3 gap-3 border-b border-border last:border-b-0 relative z-10 ${
                i % 2 === 0 ? "bg-transparent" : "bg-accent/20"
              }`}
            >
              <span className="text-xs font-body font-semibold text-foreground leading-relaxed">
                {row.dimension}
              </span>
              <span className="text-xs font-body text-foreground leading-relaxed">
                {row.gitagent}
              </span>
              <span className="text-xs font-body text-muted-foreground/70 leading-relaxed">
                {row.openclaw}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
