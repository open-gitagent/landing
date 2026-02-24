import { motion } from "framer-motion";
import { Play, Copy } from "lucide-react";
import { useState } from "react";

const runCommand = `gitagent run -r "https://github.com/shreyaskapale/shreyas-agent" -a claude`;

const exports = [
  { label: "Claude Code", desc: "Export to CLAUDE.md with skills, model hints, and compliance.", cmd: "$ gitagent export -f claude-code" },
  { label: "OpenAI Agents SDK", desc: "Generate Python code with Agent(), Tool stubs, and type mappings.", cmd: "$ gitagent export -f openai" },
  { label: "CrewAI", desc: "YAML crew config with role/goal extraction and sub-agent mapping.", cmd: "$ gitagent export -f crewai" },
  { label: "OpenClaw", desc: "Workspace with config JSON, AGENTS.md, tools, and skills.", cmd: "$ gitagent export -f openclaw" },
  { label: "Nanobot", desc: "Config JSON + system prompt for Nanobot runtime.", cmd: "$ gitagent export -f nanobot" },
  { label: "Lyzr Studio", desc: "API payload with provider mapping and credential IDs.", cmd: "$ gitagent export -f lyzr" },
  { label: "GitHub Models", desc: "Chat completions payload with model namespace mapping.", cmd: "$ gitagent export -f github" },
  { label: "System Prompt", desc: "Single concatenated markdown for any LLM.", cmd: "$ gitagent export -f system-prompt" },
];

export function ExportSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(runCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="export" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        {/* Run from Git */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Run from Git</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6 max-w-lg font-body">
            Clone any agent repo and run it instantly. One command — no setup, no config files to copy.
          </p>

          <div className="code-block sketch-border border-primary/30 relative group">
            <div className="terminal-header">
              <span className="terminal-dot bg-primary/40" />
              <span className="terminal-dot bg-primary/30" />
              <span className="terminal-dot bg-primary/20" />
              <span className="ml-3 text-xs text-muted-foreground font-body">terminal</span>
              <button
                onClick={handleCopy}
                className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors"
                aria-label="Copy command"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-sm leading-7 font-body">
              <span className="text-primary">$ </span>
              <span className="text-foreground font-medium">gitagent run</span>
              <span className="text-muted-foreground"> -r </span>
              <span className="text-primary/70">"https://github.com/shreyaskapale/shreyas-agent"</span>
              <span className="text-muted-foreground"> -a </span>
              <span className="text-foreground font-medium">claude</span>
            </div>

            <div className="mt-3 pt-3 border-t border-border space-y-1">
              <div className="text-[11px] text-muted-foreground/60 font-body">
                <span className="text-muted-foreground/40">→</span> Clones the repo (cached at <code className="text-muted-foreground/50">~/.gitagent/cache/</code>)
              </div>
              <div className="text-[11px] text-muted-foreground/60 font-body">
                <span className="text-muted-foreground/40">→</span> Reads <code className="text-muted-foreground/50">agent.yaml</code> + <code className="text-muted-foreground/50">SOUL.md</code> + skills
              </div>
              <div className="text-[11px] text-muted-foreground/60 font-body">
                <span className="text-muted-foreground/40">→</span> Launches Claude Code with the agent's full identity
              </div>
            </div>

            {copied && (
              <motion.span
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-3 right-3 text-[10px] text-primary font-body"
              >
                Copied!
              </motion.span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { flag: "-b develop", desc: "specific branch" },
              { flag: "--refresh", desc: "force re-clone" },
              { flag: "-p \"Review my code\"", desc: "one-shot prompt" },
              { flag: "-a git", desc: "auto-detect adapter" },
            ].map((f) => (
              <span key={f.flag} className="inline-flex items-center gap-1.5 text-[10px] sketch-border rounded px-2 py-1 text-muted-foreground font-body">
                <code className="text-primary/80">{f.flag}</code>
                <span className="text-muted-foreground/50">—</span>
                {f.desc}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Export section */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Export Anywhere</h2>
          <p className="text-sm text-muted-foreground font-body">
            One agent definition. Every framework.
          </p>
        </motion.div>

        <div className="space-y-2">
          {exports.map((e, i) => (
            <motion.div
              key={e.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 paper-card p-4"
            >
              <div className="relative z-10">
                <span className="text-sm font-heading font-semibold text-foreground">{e.label}</span>
                <p className="text-xs text-muted-foreground mt-0.5 font-body">{e.desc}</p>
              </div>
              <code className="text-xs text-primary shrink-0 font-body relative z-10">{e.cmd}</code>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
