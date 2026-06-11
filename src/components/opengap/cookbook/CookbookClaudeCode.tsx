import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-project/
├── CLAUDE.md          ← identity, purpose, and rules
├── memory/
│   └── preferences.md ← persistent memory
└── .claude/
    └── settings.json  ← model and tool config`;

const claudeMd = `# CLAUDE.md (example)
You are a senior TypeScript engineer. Help the user write clean,
well-tested code using Vitest and pnpm.

Always write tests before implementation (TDD).
Never push directly to main — always use a feature branch.
Prefer composition over inheritance.`;

const agentYaml = `spec_version: 0.1.0
name: my-engineer-agent
version: 0.1.0
description: Senior TypeScript engineer assistant
model:
  preferred: claude-sonnet-4-6`;

const soulMd = `# Soul

## Core Identity
You are a senior TypeScript engineer.

## Purpose
Help the user write clean, well-tested code using Vitest and pnpm.`;

const rulesMd = `# Rules

- Always write tests before implementation (TDD)
- Never push directly to main — always use a feature branch
- Prefer composition over inheritance`;

const skillMd = `# TDD Skill

## What this skill does
Enforces test-driven development — write the test first,
then the implementation.

## Steps
1. Write a failing test for the desired behavior
2. Write the minimum code to make it pass
3. Refactor without breaking the test`;

const mapping = [
  ["CLAUDE.md — identity paragraph", "SOUL.md → Core Identity + Purpose"],
  ["CLAUDE.md — behavioral rules", "RULES.md"],
  ["CLAUDE.md — recurring workflows", "skills/<name>/SKILL.md"],
  ["memory/preferences.md", "agent context (not imported — runtime state)"],
  [".claude/settings.json → model", "agent.yaml → model.preferred"],
];

const steps = [
  { step: "1", desc: "Open CLAUDE.md. Copy the identity paragraph (who you are, what you do) into SOUL.md under Core Identity and Purpose." },
  { step: "2", desc: "Extract behavioral rules (\"always\", \"never\", \"prefer\") from CLAUDE.md into RULES.md as a bullet list." },
  { step: "3", desc: "If CLAUDE.md describes a recurring workflow (TDD, PR review, etc.), create a skills/<name>/SKILL.md for it." },
  { step: "4", desc: "Read .claude/settings.json for the model name and write it to agent.yaml → model.preferred." },
  { step: "5", desc: "memory/ files are runtime state — they don't map to OpenGAP files. Leave them in place." },
];

export function CookbookClaudeCode() {
  return (
    <section id="cookbook-claude-code" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude Code → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Claude Code stores agent identity in <code className="text-primary text-xs">CLAUDE.md</code> and runtime memory in <code className="text-primary text-xs">memory/</code>.
            Converting to OpenGAP means splitting CLAUDE.md into <code className="text-primary text-xs">SOUL.md</code> (identity),
            <code className="text-primary text-xs"> RULES.md</code> (behavior), and optionally <code className="text-primary text-xs">skills/</code> for recurring workflows.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Claude Code project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Typical Claude Code workspace structure:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={claudeMd} filename="CLAUDE.md" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Claude Code</span><span>OpenGAP</span>
            </div>
            {mapping.map(([from, to], i) => (
              <div key={i} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary">{to}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Create the OpenGAP files</h3>
          <div className="space-y-5 mt-4">
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">agent.yaml</code>:</p><CodeBlock code={agentYaml} filename="agent.yaml" /></div>
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code>:</p><CodeBlock code={soulMd} filename="SOUL.md" /></div>
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">RULES.md</code>:</p><CodeBlock code={rulesMd} filename="RULES.md" /></div>
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">skills/tdd/SKILL.md</code>:</p><CodeBlock code={skillMd} filename="skills/tdd/SKILL.md" /></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">What happens step by step</h3>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="paper-card p-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3 relative z-10">
                  <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-8">{s.step}</code>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
