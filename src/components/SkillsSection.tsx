import { motion } from "framer-motion";
import { Zap, Search, Download, List, Folder } from "lucide-react";

const discoveryPaths = [
  { path: "<agent>/skills/", source: "Agent-local", priority: 1 },
  { path: "<agent>/.agents/skills/", source: "agentskills.io", priority: 2 },
  { path: "<agent>/.claude/skills/", source: "Claude Code", priority: 3 },
  { path: "<agent>/.github/skills/", source: "GitHub", priority: 4 },
  { path: "~/.agents/skills/", source: "Personal (global)", priority: 5 },
];

const skillCommands = [
  { icon: Search, cmd: "gitagent skills search \"code review\"", desc: "Search SkillsMP or GitHub" },
  { icon: Download, cmd: "gitagent skills install code-review --global", desc: "Install to global or local" },
  { icon: List, cmd: "gitagent skills list", desc: "List discovered skills" },
  { icon: Zap, cmd: "gitagent skills info code-review", desc: "Inspect skill metadata" },
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Skills System</h2>
          <p className="text-sm text-muted-foreground font-body">
            Reusable capability modules following the{" "}
            <a href="https://agentskills.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Agent Skills
            </a>{" "}
            standard.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">SKILL.md Format</h3>
            <div className="code-block text-xs text-muted-foreground leading-5 font-body">
              <pre><code>{`---
name: code-review
description: Thorough code reviews
license: MIT
compatibility: ">=0.1.0"
allowed-tools: Read Edit Grep Glob Bash
metadata:
  author: "Jane Doe"
  version: "1.0.0"
  category: "developer-tools"
---

# Instructions

Review the code for:
1. Security vulnerabilities
2. Performance issues
3. Code style consistency`}</code></pre>
            </div>

            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-6 mb-4 font-body">Discovery Priority</h3>
            <div className="space-y-px">
              {discoveryPaths.map((d) => (
                <div key={d.priority} className="flex items-center gap-3 py-1.5 px-2 rounded hover:bg-accent/30 font-body">
                  <span className="text-[10px] text-primary font-semibold w-4">{d.priority}</span>
                  <Folder className="w-3 h-3 text-muted-foreground/50" />
                  <code className="text-[11px] text-muted-foreground flex-1">{d.path}</code>
                  <span className="text-[10px] text-muted-foreground/60">{d.source}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">Skill CLI</h3>
            <div className="space-y-3">
              {skillCommands.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="paper-card p-3"
                >
                  <div className="flex items-center gap-2 mb-1 relative z-10">
                    <s.icon className="w-3 h-3 text-primary" />
                    <span className="text-[11px] text-muted-foreground font-body">{s.desc}</span>
                  </div>
                  <code className="text-xs text-primary/80 font-body relative z-10">$ {s.cmd}</code>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-6 mb-4 font-body">Registries</h3>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "SkillsMP", desc: "REST API marketplace" },
                { name: "GitHub", desc: "Sparse clone from repos" },
                { name: "Local", desc: "Filesystem path copy" },
              ].map((r) => (
                <div key={r.name} className="paper-card p-3 text-center">
                  <span className="text-xs font-heading font-semibold text-foreground block relative z-10">{r.name}</span>
                  <span className="text-[10px] text-muted-foreground font-body relative z-10">{r.desc}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
