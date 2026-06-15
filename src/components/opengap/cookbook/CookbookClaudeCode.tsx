import { motion } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, Terminal, Package, Lightbulb, Split, Play } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";
import { PartHeader, CollapsibleCode } from "./CookbookShared";

/* ═══════════════════  PART 1 — the Claude Code source  ═══════════════════ */

const sourceTree = `my-code-reviewer/              (Claude Code)
├── CLAUDE.md                  ← identity + rules
└── .claude/
    └── skills/
        └── review-diff/
            └── review-diff.md ← a skill`;

const srcClaudeMd = `# Code Reviewer

## Identity
You are a senior code reviewer. You read diffs and surface real
correctness bugs, not style nits.

## Communication Style
Terse and direct. Lead with the most severe issue. Cite file:line.

## Rules
- Review only the changed lines and their immediate context.
- Group findings by severity: blocker, warning, nit.

## Must Never
- Never approve a change you could not fully read.
- Never invent line numbers or file paths.

## Workflow
Read the diff, reason about each hunk, then report findings grouped
by severity with a one-line summary at the top.`;

const srcSkill = `---
name: review-diff
description: Review a unified diff for correctness bugs.
---

# Review a diff

1. Read every changed hunk and its surrounding context.
2. For each hunk, ask: does this introduce a bug, a regression, or
   an unsafe assumption?
3. Report findings as \`severity — file:line — description\`.`;

/* ═══════════════════  PART 2 — run the import  ═══════════════════ */

const importCmd = `opengap import --from claude ./my-code-reviewer`;

const importOutput = `Importing agent
  Format: claude
  Source: ./my-code-reviewer
✓ Imported skill: review-diff
✓ Created agent.yaml
✓ Created SOUL.md
✓ Created RULES.md

Import complete`;

const readsWrites: { from: string; to: string; how: string }[] = [
  {
    from: "CLAUDE.md",
    to: "SOUL.md + RULES.md",
    how: "Split by heading, each section routed by its title (see below)",
  },
  {
    from: ".claude/skills/<name>/",
    to: "skills/<name>/SKILL.md (+ other files)",
    how: "Copied as-is; <name>.md is renamed to SKILL.md",
  },
  {
    from: "(directory name)",
    to: "agent.yaml",
    how: "Generated manifest (name, model, skill list)",
  },
];

const routingRules: { keywords: string; dest: string }[] = [
  { keywords: "identity · personality · style · about", dest: "SOUL.md" },
  { keywords: "rule · constraint · never · always · must", dest: "RULES.md" },
  { keywords: "anything else (the default)", dest: "SOUL.md" },
  { keywords: "no headings at all → whole file", dest: "SOUL.md" },
];

/* ═══════════════════  PART 3 — the result  ═══════════════════ */

const outputTree = `my-code-reviewer/              (OpenGAP)
├── agent.yaml                 ← generated manifest
├── SOUL.md                    ← identity sections
├── RULES.md                   ← rule sections
└── skills/
    └── review-diff/
        └── SKILL.md           ← copied + renamed from review-diff.md`;

const fullAgentYaml = `spec_version: "0.1.0"
name: my-code-reviewer
version: "0.1.0"
description: "Imported from Claude Code project: my-code-reviewer"
skills:
  - review-diff`;

const fullSoul = `# Soul

## Identity
You are a senior code reviewer. You read diffs and surface real
correctness bugs, not style nits.

## Communication Style
Terse and direct. Lead with the most severe issue. Cite file:line.

## Workflow
Read the diff, reason about each hunk, then report findings grouped
by severity with a one-line summary at the top.`;

const fullRules = `# Rules

## Rules
- Review only the changed lines and their immediate context.
- Group findings by severity: blocker, warning, nit.

## Must Never
- Never approve a change you could not fully read.
- Never invent line numbers or file paths.`;

const validateCmd = `opengap validate`;

const runCmd = `opengap run . --adapter claude`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Skills", file: "skills/", desc: "Copied as-is" },
  { icon: Settings, title: "Manifest", file: "agent.yaml", desc: "Generated for you" },
];

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookClaudeCode() {
  return (
    <section id="cookbook-claude-code" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude Code → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            Claude Code agents live as files already — a <code className="text-primary text-[12px]">CLAUDE.md</code> plus a{" "}
            <code className="text-primary text-[12px]">.claude/</code> directory. OpenGAP imports them directly. Instead of
            rewriting each file by hand (as you would for a code framework like LangGraph), you run one command and{" "}
            <code className="text-primary text-[12px]">opengap import</code> scaffolds the agent for you. This page shows
            exactly what it reads and what it writes.
          </p>
        </motion.div>

        {/* One command callout */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="paper-card p-4 max-w-2xl border-l-2 border-l-primary/40">
            <div className="flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground font-heading">One command</span>
            </div>
            <code className="block text-[12px] text-primary font-body">opengap import --from claude &lt;path&gt;</code>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Claude Code project"
          subtitle="The importer reads CLAUDE.md (the agent's instructions) and .claude/skills/ (its skills). Here is every file it touches."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="CLAUDE.md" caption="identity + rules" code={srcClaudeMd} />
          <CollapsibleCode filename=".claude/skills/review-diff/review-diff.md" caption="a skill" code={srcSkill} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="Run the import"
          title="One command scaffolds the agent"
          subtitle="Point the importer at the project. It reads each source file and writes the OpenGAP equivalents for you."
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
              <span className="col-span-3">Claude Code source</span>
              <span className="col-span-4">OpenGAP output</span>
              <span className="col-span-5">How</span>
            </div>
            {readsWrites.map((r, i) => (
              <div key={r.from} className={`grid grid-cols-12 px-3 py-2 gap-3 border-b border-border last:border-0 items-start ${i % 2 ? "bg-muted/20" : ""}`}>
                <code className="col-span-3 text-muted-foreground font-body break-words">{r.from}</code>
                <code className="col-span-4 text-primary font-body flex items-start gap-1.5 min-w-0">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40 mt-0.5" />
                  <span className="break-words">{r.to}</span>
                </code>
                <span className="col-span-5 text-muted-foreground/80 font-body leading-relaxed">{r.how}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Mental model — the four output buckets */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {buckets.map((b) => (
              <div key={b.title} className="paper-card p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <b.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground font-heading">{b.title}</span>
                </div>
                <code className="block text-[10px] text-primary font-body mb-1">{b.file}</code>
                <p className="text-[10px] text-muted-foreground font-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* How CLAUDE.md is split */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Split className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-heading">How CLAUDE.md is split</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            The importer breaks <code className="text-primary text-[11px]">CLAUDE.md</code> into sections at every{" "}
            <code className="text-primary text-[11px]">#</code>, <code className="text-primary text-[11px]">##</code>, or{" "}
            <code className="text-primary text-[11px]">###</code> heading, then routes each section by{" "}
            <span className="text-foreground font-medium">keywords in its title</span>:
          </p>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-body">
            <div className="grid grid-cols-12 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span className="col-span-8">Title contains</span>
              <span className="col-span-4">Routes to</span>
            </div>
            {routingRules.map((r, i) => (
              <div key={r.keywords} className={`grid grid-cols-12 px-3 py-2 gap-3 border-b border-border last:border-0 items-center ${i % 2 ? "bg-muted/20" : ""}`}>
                <span className="col-span-8 text-muted-foreground">{r.keywords}</span>
                <code className="col-span-4 text-primary flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40" />
                  {r.dest}
                </code>
              </div>
            ))}
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mt-4">
            So in our example: <code className="text-primary text-[11px]">Identity</code>,{" "}
            <code className="text-primary text-[11px]">Communication Style</code>, and{" "}
            <code className="text-primary text-[11px]">Workflow</code> land in{" "}
            <code className="text-primary text-[11px]">SOUL.md</code>;{" "}
            <code className="text-primary text-[11px]">Rules</code> and{" "}
            <code className="text-primary text-[11px]">Must Never</code> land in{" "}
            <code className="text-primary text-[11px]">RULES.md</code>.
          </p>
        </motion.div>

        {/* Tip */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Tip:</span> Routing is keyword-based. To steer a section,
                give its heading a matching keyword in <code className="text-primary text-[11px]">CLAUDE.md</code> before
                importing — e.g. rename <code className="text-primary text-[11px]">## Guidelines</code> to{" "}
                <code className="text-primary text-[11px]">## Rules</code> so it lands in{" "}
                <code className="text-primary text-[11px]">RULES.md</code>.
              </p>
            </div>
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
          <CollapsibleCode filename="SOUL.md" code={fullSoul} reveal />
          <CollapsibleCode filename="RULES.md" code={fullRules} reveal />
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">skills/review-diff/SKILL.md</code> — copied verbatim from{" "}
              <code className="text-primary text-[11px]">review-diff.md</code>, only the filename changes.
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
            From the imported directory, confirm the manifest, skill frontmatter, and any tool schemas resolve before you run it.
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
