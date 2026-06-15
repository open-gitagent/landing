import { motion } from "framer-motion";
import { ArrowRight, FileText, Shield, Settings, CheckCircle2, Terminal, Lightbulb, Split, Play } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";
import { PartHeader, CollapsibleCode } from "./CookbookShared";

/* ═══════════════════  PART 1 — the Codex source  ═══════════════════ */

const sourceTree = `sql-explainer/                 (Codex CLI)
├── AGENTS.md                  ← identity + rules
└── codex.json                 ← model config`;

const srcAgentsMd = `# SQL Explainer

## Identity
You are a database expert who explains SQL queries in plain English.
You translate dense queries into a step-by-step walkthrough.

## Communication Style
Calm and precise. Explain joins and subqueries before aggregates.

## Rules
- Explain the query exactly as written; do not rewrite it.
- Name every table and column the query touches.

## Always
- Always state which rows the query returns at the end.`;

const srcCodexJson = `{
  "model": "o3"
}`;

/* ═══════════════════  PART 2 — run the import  ═══════════════════ */

const importCmd = `opengap import --from codex ./sql-explainer`;

const importOutput = `Importing agent
  Format: codex
  Source: ./sql-explainer
  Found AGENTS.md
  Found codex.json
✓ Created agent.yaml
✓ Created SOUL.md
✓ Created RULES.md

Import complete`;

const readsWrites: { from: string; to: string; how: string }[] = [
  {
    from: "AGENTS.md",
    to: "SOUL.md + RULES.md",
    how: "Split by heading, each section routed by its title (see below)",
  },
  {
    from: "codex.json",
    to: "agent.yaml model.preferred",
    how: "The model string is mapped with an openai: provider prefix",
  },
  {
    from: "(directory name)",
    to: "agent.yaml",
    how: "Generated manifest (name, version, description)",
  },
];

const routingRules: { keywords: string; dest: string }[] = [
  { keywords: "rule · constraint · never · always · must · compliance", dest: "RULES.md" },
  { keywords: "anything else (the default)", dest: "SOUL.md" },
  { keywords: "no headings at all → whole file", dest: "SOUL.md" },
];

/* ═══════════════════  PART 3 — the result  ═══════════════════ */

const outputTree = `sql-explainer/                 (OpenGAP)
├── agent.yaml                 ← generated manifest
├── SOUL.md                    ← identity sections
└── RULES.md                   ← rule sections`;

const fullAgentYaml = `spec_version: "0.1.0"
name: sql-explainer
version: "0.1.0"
description: "Imported from Codex CLI project: sql-explainer"
model:
  preferred: openai:o3`;

const fullSoul = `# Soul

## SQL Explainer


## Identity
You are a database expert who explains SQL queries in plain English.
You translate dense queries into a step-by-step walkthrough.

## Communication Style
Calm and precise. Explain joins and subqueries before aggregates.`;

const fullRules = `# Rules

## Rules
- Explain the query exactly as written; do not rewrite it.
- Name every table and column the query touches.

## Always
- Always state which rows the query returns at the end.`;

const validateCmd = `opengap validate`;

const runCmd = `opengap run . --adapter codex`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Settings, title: "Manifest", file: "agent.yaml", desc: "Name, version, model" },
];

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookCodex() {
  return (
    <section id="cookbook-codex" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Codex → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A Codex CLI agent lives as files already — an <code className="text-primary text-[12px]">AGENTS.md</code> plus an
            optional <code className="text-primary text-[12px]">codex.json</code> config. OpenGAP imports them directly.
            Instead of rewriting each file by hand (as you would for a code framework like LangGraph), you run one command
            and <code className="text-primary text-[12px]">opengap import</code> scaffolds the agent for you. This page shows
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
            <code className="block text-[12px] text-primary font-body">opengap import --from codex &lt;path&gt;</code>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Codex CLI project"
          subtitle="The importer reads AGENTS.md (the agent's instructions, required) and codex.json (its model config, optional). Here is every file it touches."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="AGENTS.md" caption="identity + rules" code={srcAgentsMd} />
          <CollapsibleCode filename="codex.json" caption="model config" code={srcCodexJson} />
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
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">What it reads → what it writes</p>
          <div className="rounded-md border border-border overflow-hidden text-[11px]">
            <div className="grid grid-cols-12 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body">
              <span className="col-span-3">Codex source</span>
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

        {/* Required / optional note */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl">
            <code className="text-primary text-[11px]">AGENTS.md</code> is required — if it is missing the import aborts with{" "}
            <code className="text-primary text-[11px]">No AGENTS.md found in source directory</code>.{" "}
            <code className="text-primary text-[11px]">codex.json</code> is optional; if it is absent or malformed it is
            silently skipped and no <code className="text-primary text-[11px]">model</code> is written.
          </p>
        </motion.div>

        {/* Mental model — the output buckets */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

        {/* How AGENTS.md is split */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Split className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-heading">How AGENTS.md is split</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            The importer breaks <code className="text-primary text-[11px]">AGENTS.md</code> into sections at every{" "}
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
            So in our example: <code className="text-primary text-[11px]">SQL Explainer</code>,{" "}
            <code className="text-primary text-[11px]">Identity</code>, and{" "}
            <code className="text-primary text-[11px]">Communication Style</code> land in{" "}
            <code className="text-primary text-[11px]">SOUL.md</code>;{" "}
            <code className="text-primary text-[11px]">Rules</code> and{" "}
            <code className="text-primary text-[11px]">Always</code> land in{" "}
            <code className="text-primary text-[11px]">RULES.md</code>.{" "}
            <code className="text-primary text-[11px]">RULES.md</code> is only written when at least one section matches a
            rule keyword.
          </p>
        </motion.div>

        {/* Tip */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Tip:</span> Routing is keyword-based. To steer a section,
                give its heading a matching keyword in <code className="text-primary text-[11px]">AGENTS.md</code> before
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
              The <code className="text-primary text-[11px]">model</code> block appears only when{" "}
              <code className="text-primary text-[11px]">codex.json</code> supplies a model. With no{" "}
              <code className="text-primary text-[11px]">codex.json</code>, the manifest stops at the{" "}
              <code className="text-primary text-[11px]">description</code> line. Codex imports do not generate{" "}
              <code className="text-primary text-[11px]">skills</code> or <code className="text-primary text-[11px]">tools</code> keys.
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
            From the imported directory, confirm the manifest and the split instruction files resolve before you run it.
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
