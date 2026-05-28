import { useState } from "react";
import { motion } from "framer-motion";

const dirTree = `~/assistant/                          # Agent root (git repo)
├── agent.yaml                        # Agent manifest
├── SOUL.md                           # Agent identity
├── RULES.md                          # Behavior rules (optional)
├── DUTIES.md                         # Responsibilities (optional)
├── .env                              # API keys (gitignored)
├── workspace/                        # Output directory
├── memory/
│   ├── MEMORY.md                     # Primary memory
│   ├── mood.md                       # Mood tracking
│   ├── photos/                       # Captured moments
│   ├── journal/                      # Session reflections
│   └── archive/                      # Archived entries
├── skills/
│   └── skill-name/
│       └── SKILL.md
├── workflows/                        # SkillFlows + .md workflows
├── schedules/                        # Cron jobs
├── hooks/
│   ├── hooks.yaml
│   └── validate.sh          # example name — any .sh filename works
├── tools/                            # Custom declarative tools
├── plugins/                          # Installed plugins
├── config/
│   ├── default.yaml
│   └── production.yaml
├── knowledge/                        # Knowledge base
├── compliance/                       # Compliance config
└── .gitagent/                        # Internal state (gitignored)
    ├── state.json
    ├── audit.jsonl
    └── learning/`;

const tabs = [
  {
    label: "agent.yaml",
    code: `spec_version: "0.4.0"
name: my-agent
version: 1.0.0
description: An agent that does things

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: ["openai:gpt-4o", "google:gemini-2.0-flash-001"]
  constraints:
    temperature: 0.7
    max_tokens: 4096

tools: [cli, read, write, memory]

runtime:
  max_turns: 50
  timeout: 300

# Optional
extends: "https://github.com/org/base-agent.git"
skills: [code-review, deploy]
delegation:
  mode: auto
compliance:
  risk_level: high
  human_in_the_loop: true
  recordkeeping:
    audit_logging: true`,
  },
  {
    label: "SOUL.md",
    code: `# Soul

## Core Identity
I am a focused, reliable autonomous coding agent.
I analyze, implement, test, and document — with
minimal interruption to the developer.

## Communication Style
Direct and concise. I report what I did and why,
not a running commentary on my process.

## Values & Principles
- Correctness over speed
- Every change is reviewable
- No silent mutations to files I wasn't asked to touch
- Ask before deleting or overwriting

## Domain Expertise
- Software architecture and code quality
- Security review (OWASP Top 10)
- Performance optimization
- Git workflows and code review`,
  },
  {
    label: "RULES.md",
    code: `# Rules

1. **Read before modifying** — always read a file
   before editing it.

2. **No destructive commands** — never run
   \`rm -rf\`, \`git reset --hard\`, or \`DROP TABLE\`
   without explicit confirmation.

3. **No secrets in memory** — never write API keys,
   passwords, or tokens to MEMORY.md.

4. **Stay in scope** — only touch files that are
   directly relevant to the current task.

5. **Report errors honestly** — if something fails,
   report the exact error; do not fabricate results.`,
  },
];

export function GitAgentArchitectureSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="architecture" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            02 — Architecture
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Architecture
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Everything your agent needs, defined in plain files you already know how to manage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Directory tree */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
              Directory Structure
            </h3>
            <div className="code-block sketch-border overflow-x-auto">
              <div className="terminal-header">
                <span className="terminal-dot bg-primary/30" />
                <span className="terminal-dot bg-primary/20" />
                <span className="terminal-dot bg-primary/10" />
                <span className="ml-3 text-xs text-muted-foreground font-body">~/assistant/</span>
              </div>
              <pre className="text-[11px] text-muted-foreground leading-[19px] font-body whitespace-pre">
                <code>{dirTree}</code>
              </pre>
            </div>
          </motion.div>

          {/* Tabbed config files */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
              Core Files
            </h3>
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActive(i)}
                  className={`px-3 py-2 text-xs font-body transition-colors relative ${
                    active === i ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                  {active === i && (
                    <motion.div
                      layoutId="arch-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="code-block rounded-t-none border-t-0 overflow-x-auto">
              <pre className="text-xs text-muted-foreground leading-5 font-body">
                <code>{tabs[active].code}</code>
              </pre>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
