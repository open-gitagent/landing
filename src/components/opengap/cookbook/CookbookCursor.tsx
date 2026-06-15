import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, Terminal, Lightbulb, Split, Play, Archive } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";
import { PartHeader, CollapsibleCode } from "./CookbookShared";

/* ═══════════════════  PART 1 — the Cursor source  ═══════════════════ */

const sourceTree = `code-buddy/                          (Cursor)
└── .cursor/
    └── rules/
        ├── code-buddy.mdc           ← global rule (alwaysApply: true)
        └── review-diff.mdc          ← scoped rule (alwaysApply: false)`;

const srcGlobalRule = `---
description: A small coding assistant for everyday changes.
alwaysApply: true
---

## Identity & Soul

You are a careful coding assistant. You make the smallest change that
solves the problem, and you explain your reasoning before you edit.

## Rules & Constraints

- Read the surrounding code before editing it.
- Never introduce a dependency without flagging it first.
- Always run the tests you can see before declaring a fix done.`;

const srcScopedRule = `---
description: Review a unified diff for correctness bugs.
globs: src/**/*.ts *.tsx
alwaysApply: false
---

# Review a diff

1. Read every changed hunk and its surrounding context.
2. For each hunk, ask: does this introduce a bug, a regression, or
   an unsafe assumption?
3. Report findings as \`severity — file:line — description\`.`;

/* ═══════════════════  PART 2 — run the import  ═══════════════════ */

const importCmd = `opengap import --from cursor ./code-buddy`;

const importOutput = `Importing agent
  Format: cursor
  Source: ./code-buddy
  Found 2 rule(s) in .cursor/rules/
✓ Created SOUL.md (from 1 alwaysApply rule(s))
✓ Created skill: review-diff
✓ Created agent.yaml

Import complete`;

const readsWrites: { from: string; to: string; how: string }[] = [
  {
    from: ".cursor/rules/*.mdc with alwaysApply: true",
    to: "SOUL.md",
    how: "Bodies of all global rules concatenated under a single Soul heading",
  },
  {
    from: ".cursor/rules/*.mdc with alwaysApply: false (or unset)",
    to: "skills/<name>/SKILL.md",
    how: "One skill per rule; description and globs carried into frontmatter",
  },
  {
    from: "(directory name)",
    to: "agent.yaml",
    how: "Generated manifest (name, skill list)",
  },
];

const routingRules: { flag: string; dest: string }[] = [
  { flag: "alwaysApply: true", dest: "SOUL.md" },
  { flag: "alwaysApply: false (or absent)", dest: "skills/<name>/SKILL.md" },
];

/* ═══════════════════  PART 3 — the result  ═══════════════════ */

const outputTree = `code-buddy/                      (OpenGAP)
├── agent.yaml                   ← generated manifest
├── SOUL.md                      ← from the alwaysApply rule
└── skills/
    └── review-diff/
        └── SKILL.md             ← from review-diff.mdc`;

const fullAgentYaml = `spec_version: 0.1.0
name: code-buddy
version: 0.1.0
description: 'Imported from Cursor project: code-buddy'
skills:
  - review-diff`;

const fullSoul = `# Soul — imported from Cursor rules

## Identity & Soul

You are a careful coding assistant. You make the smallest change that
solves the problem, and you explain your reasoning before you edit.

## Rules & Constraints

- Read the surrounding code before editing it.
- Never introduce a dependency without flagging it first.
- Always run the tests you can see before declaring a fix done.`;

const fullSkill = `---
name: review-diff
description: Review a unified diff for correctness bugs.
metadata:
  globs: src/**/*.ts *.tsx
---

# Review a diff

1. Read every changed hunk and its surrounding context.
2. For each hunk, ask: does this introduce a bug, a regression, or
   an unsafe assumption?
3. Report findings as \`severity — file:line — description\`.`;

const validateCmd = `opengap validate`;

const runCmd = `opengap run . --adapter cursor`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookCursor() {
  return (
    <section id="cookbook-cursor" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Cursor → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            Cursor agents live as files already — a <code className="text-primary text-[12px]">.cursor/rules/</code>{" "}
            directory of <code className="text-primary text-[12px]">.mdc</code> rule files (each with YAML frontmatter),
            with <code className="text-primary text-[12px]">.cursorrules</code> and{" "}
            <code className="text-primary text-[12px]">AGENTS.md</code> as older fallbacks. OpenGAP imports them directly.
            Instead of rewriting each file by hand (as you would for a code framework like LangGraph), you run one command
            and <code className="text-primary text-[12px]">opengap import</code> scaffolds the agent for you. This page
            shows exactly what it reads and what it writes.
          </p>
        </motion.div>

        {/* One command callout */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="paper-card p-4 max-w-2xl border-l-2 border-l-primary/40">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground font-heading">One command</span>
            </div>
            <code className="block text-[12px] text-primary font-body">opengap import --from cursor &lt;path&gt;</code>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Cursor project"
          subtitle="The importer prefers .cursor/rules/*.mdc. Each .mdc file carries a YAML frontmatter block (description, globs, alwaysApply) followed by a markdown body. Rules with alwaysApply: true are global; the rest are scoped, glob-targeted rules."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename=".cursor/rules/code-buddy.mdc" caption="global rule (alwaysApply: true)" code={srcGlobalRule} />
          <CollapsibleCode filename=".cursor/rules/review-diff.mdc" caption="scoped rule (alwaysApply: false)" code={srcScopedRule} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="Run the import"
          title="One command scaffolds the agent"
          subtitle="Point the importer at the project. It reads every .mdc rule and writes the OpenGAP equivalents for you."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <CodeBlock code={importCmd} filename="terminal" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <CodeBlock code={importOutput} filename="output" />
        </motion.div>

        {/* What it reads → what it writes */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">What it reads → what it writes</p>
          <div className="rounded-md border border-border overflow-hidden text-[11px]">
            <div className="grid grid-cols-12 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body">
              <span className="col-span-4">Cursor source</span>
              <span className="col-span-3">OpenGAP output</span>
              <span className="col-span-5">How</span>
            </div>
            {readsWrites.map((r, i) => (
              <div key={r.from} className={`grid grid-cols-12 px-3 py-2 gap-3 border-b border-border last:border-0 items-start ${i % 2 ? "bg-muted/20" : ""}`}>
                <code className="col-span-4 text-muted-foreground font-body break-words">{r.from}</code>
                <code className="col-span-3 text-primary font-body flex items-start gap-1.5 min-w-0">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />
                  <span className="break-words">{r.to}</span>
                </code>
                <span className="col-span-5 text-muted-foreground/80 font-body leading-relaxed">{r.how}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How the .mdc rules are routed */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Split className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-heading">How the <code className="text-primary text-[12px]">.mdc</code> rules are routed</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            The importer reads every <code className="text-primary text-[11px]">.mdc</code> file in{" "}
            <code className="text-primary text-[11px]">.cursor/rules/</code> and splits them by the{" "}
            <span className="text-foreground font-medium">{"`alwaysApply`"}</span> flag in their frontmatter — not by
            heading keywords:
          </p>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-body">
            <div className="grid grid-cols-12 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span className="col-span-7">Frontmatter flag</span>
              <span className="col-span-5">Routes to</span>
            </div>
            {routingRules.map((r, i) => (
              <div key={r.flag} className={`grid grid-cols-12 px-3 py-2 gap-3 border-b border-border last:border-0 items-center ${i % 2 ? "bg-muted/20" : ""}`}>
                <code className="col-span-7 text-muted-foreground">{r.flag}</code>
                <code className="col-span-5 text-primary flex items-center gap-1.5 min-w-0">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40" />
                  <span className="break-words">{r.dest}</span>
                </code>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mt-4">
            For a global rule, the body is appended to <code className="text-primary text-[11px]">SOUL.md</code> (multiple
            global rules are concatenated in directory order). For a scoped rule, each becomes{" "}
            <code className="text-primary text-[11px]">skills/&lt;filename&gt;/SKILL.md</code> — the rule's{" "}
            <code className="text-primary text-[11px]">description</code> is copied into the skill's frontmatter, and any{" "}
            <code className="text-primary text-[11px]">globs</code> are preserved under{" "}
            <code className="text-primary text-[11px]">metadata.globs</code> for round-trip fidelity. So in our example:{" "}
            <code className="text-primary text-[11px]">code-buddy.mdc</code> becomes{" "}
            <code className="text-primary text-[11px]">SOUL.md</code>, and{" "}
            <code className="text-primary text-[11px]">review-diff.mdc</code> becomes{" "}
            <code className="text-primary text-[11px]">skills/review-diff/SKILL.md</code>.
          </p>
        </motion.div>

        {/* Tip */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Tip:</span> Routing is driven by{" "}
                <code className="text-primary text-[11px]">alwaysApply</code>. To send a rule to{" "}
                <code className="text-primary text-[11px]">SOUL.md</code> instead of{" "}
                <code className="text-primary text-[11px]">skills/</code>, set{" "}
                <code className="text-primary text-[11px]">alwaysApply: true</code> in its{" "}
                <code className="text-primary text-[11px]">.mdc</code> frontmatter before importing.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Legacy fallback */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <Archive className="w-3.5 h-3.5 text-primary" />
              <h3 className="text-sm font-semibold text-foreground font-heading">Legacy fallback</h3>
            </div>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl">
              No <code className="text-primary text-[11px]">.cursor/rules/</code>? The importer falls back to{" "}
              <code className="text-primary text-[11px]">.cursorrules</code>, then{" "}
              <code className="text-primary text-[11px]">AGENTS.md</code> — the file's contents become{" "}
              <code className="text-primary text-[11px]">SOUL.md</code> (and are preserved as{" "}
              <code className="text-primary text-[11px]">AGENTS.md</code>).
            </p>
          </div>
        </motion.div>

        {/* ══════════════ PART 3 ══════════════ */}
        <PartHeader
          num="3"
          label="The result"
          title="The imported OpenGAP agent"
          subtitle="The finished agent directory the importer wrote. Every file below is the complete output of the command above."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={outputTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Reveal any file to copy its full contents.</p>
        </motion.div>

        <div className="space-y-2 mb-4">
          <CollapsibleCode filename="agent.yaml" code={fullAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" caption="the body of every alwaysApply: true rule" code={fullSoul} reveal />
          <CollapsibleCode filename="skills/review-diff/SKILL.md" caption="the scoped rule, globs preserved" code={fullSkill} reveal />
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">skills/review-diff/SKILL.md</code> — built from{" "}
              <code className="text-primary text-[11px]">review-diff.mdc</code>: the body is copied as-is, the{" "}
              <code className="text-primary text-[11px]">description</code> carries into the skill frontmatter, and{" "}
              <code className="text-primary text-[11px]">globs</code> are preserved under{" "}
              <code className="text-primary text-[11px]">metadata</code>.
            </p>
          </div>
        </motion.div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the imported directory, confirm the manifest and skill frontmatter resolve before you run it.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

        {/* Run */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <Play className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Run it</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            Then run it on any supported runtime:
          </p>
          <CodeBlock code={runCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
