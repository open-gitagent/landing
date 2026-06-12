import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Settings, Cpu, CheckCircle2, ChevronDown, Terminal, Lightbulb, Split, Play } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — the OpenCode source  ═══════════════════ */

const sourceTree = `sql-explainer/                 (OpenCode)
├── AGENTS.md                  ← identity + rules
└── opencode.json              ← model config`;

const srcAgentsMd = `# SQL Explainer

## Identity
You are a database expert. You take a SQL query and explain what it
does in plain language, then flag anything that looks expensive.

## Communication Style
Plain English first, then the technical detail. No jargon dumps.

## Rules
- Explain the query top to bottom in execution order, not text order.
- Always name the tables and the join keys involved.

## Must Never
- Never claim a query is safe to run in production without seeing the
  table sizes.
- Never rewrite the query unless asked.

## Workflow
Parse the query, walk each clause, then summarise the result set and
call out full scans or unbounded joins.`;

const srcOpencodeJson = `{
  "$schema": "https://opencode.ai/config.json",
  "model": "anthropic/claude-sonnet-4-5-20250929"
}`;

/* ═══════════════════  PART 2 — run the import  ═══════════════════ */

const importCmd = `opengap import --from opencode ./sql-explainer`;

const importOutput = `Importing agent
  Format: opencode
  Source: ./sql-explainer
  Found AGENTS.md
  Found opencode.json
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
    from: "opencode.json → model",
    to: "agent.yaml → model.preferred",
    how: "provider/model → provider:model (slash converted to colon prefix)",
  },
  {
    from: "(directory name)",
    to: "agent.yaml",
    how: "Generated manifest (name, version, description, model)",
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
description: "Imported from OpenCode project: sql-explainer"
model:
  preferred: anthropic:claude-sonnet-4-5-20250929`;

const fullSoul = `# Soul

## SQL Explainer


## Identity
You are a database expert. You take a SQL query and explain what it
does in plain language, then flag anything that looks expensive.

## Communication Style
Plain English first, then the technical detail. No jargon dumps.

## Workflow
Parse the query, walk each clause, then summarise the result set and
call out full scans or unbounded joins.`;

const fullRules = `# Rules

## Rules
- Explain the query top to bottom in execution order, not text order.
- Always name the tables and the join keys involved.

## Must Never
- Never claim a query is safe to run in production without seeing the
  table sizes.
- Never rewrite the query unless asked.`;

const validateCmd = `opengap validate`;

const runCmd = `opengap run . --adapter opencode`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Settings, title: "Manifest", file: "agent.yaml", desc: "Generated for you" },
  { icon: Cpu, title: "Model", file: "opencode.json", desc: "Mapped to model.preferred" },
];

function PartHeader({ num, label, title, subtitle }: { num: string; label: string; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 pt-6 border-t border-border first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-primary/70 font-body font-semibold">Part {num}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-body">{label}</span>
      </div>
      <h2 className="text-xl font-bold text-foreground font-heading mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">{subtitle}</p>
    </motion.div>
  );
}

function CollapsibleCode({ filename, caption, code, reveal = false }: { filename: string; caption?: string; code: string; reveal?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 paper-card px-3 py-2.5 text-left hover:bg-accent/20 transition-colors"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">
          <code className="text-[11px] text-primary font-body">{filename}</code>
          {caption && <span className="text-[11px] text-muted-foreground/60 font-body"> — {caption}</span>}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {!open && (
            <span className="text-[10px] text-muted-foreground/40 font-body uppercase tracking-widest">{reveal ? "Reveal" : "View"}</span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <CodeBlock code={code} filename={filename} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookOpenCode() {
  return (
    <section id="cookbook-opencode" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenCode → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            OpenCode agents live as files already — an <code className="text-primary text-[12px]">AGENTS.md</code> plus an
            optional <code className="text-primary text-[12px]">opencode.json</code>. OpenGAP imports them directly. Instead
            of rewriting each file by hand (as you would for a code framework like LangGraph), you run one command and{" "}
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
            <code className="block text-[12px] text-primary font-body">opengap import --from opencode &lt;path&gt;</code>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The OpenCode project"
          subtitle="The importer reads AGENTS.md (the agent's instructions, required) and opencode.json (its config — model, etc., optional). Here is every file it touches."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="AGENTS.md" caption="identity + rules" code={srcAgentsMd} />
          <CollapsibleCode filename="opencode.json" caption="model config" code={srcOpencodeJson} />
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
              <span className="col-span-3">OpenCode source</span>
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

        {/* Required / optional prose */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl">
            <code className="text-primary text-[11px]">AGENTS.md</code> is required — if it is missing the import fails with{" "}
            <code className="text-primary text-[11px]">No AGENTS.md found in source directory</code>.{" "}
            <code className="text-primary text-[11px]">opencode.json</code> is optional; if it is absent (or malformed
            JSON) the importer simply skips it and omits the <code className="text-primary text-[11px]">model</code> block
            from <code className="text-primary text-[11px]">agent.yaml</code>.
          </p>
        </motion.div>

        {/* Mental model — the output buckets */}
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

        {/* How the model is mapped */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-3.5 h-3.5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-heading">How the model is mapped</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-3">
            OpenCode writes its model as <code className="text-primary text-[11px]">"provider/model-id"</code>. The importer
            keeps everything <span className="text-foreground font-medium">after</span> the first{" "}
            <code className="text-primary text-[11px]">/</code> and drops the provider prefix:
          </p>
          <div className="paper-card p-4 border-l-2 border-l-primary/40 max-w-2xl">
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-[12px] font-body">
                <ArrowRight className="w-3 h-3 shrink-0 opacity-40 mt-1 text-primary" />
                <span className="text-muted-foreground">
                  <code className="text-primary text-[11px]">anthropic/claude-sonnet-4-5-20250929</code>{" "}
                  <span className="text-muted-foreground/50">→</span>{" "}
                  <code className="text-primary text-[11px]">claude-sonnet-4-5-20250929</code>
                </span>
              </li>
              <li className="flex items-start gap-2 text-[12px] font-body">
                <ArrowRight className="w-3 h-3 shrink-0 opacity-40 mt-1 text-primary" />
                <span className="text-muted-foreground">
                  A bare value with no <code className="text-primary text-[11px]">/</code> (e.g.{" "}
                  <code className="text-primary text-[11px]">claude-sonnet-4-5-20250929</code>) is used as-is.
                </span>
              </li>
            </ul>
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
            <code className="text-primary text-[11px]">Identity</code>,{" "}
            <code className="text-primary text-[11px]">Communication Style</code>, and{" "}
            <code className="text-primary text-[11px]">Workflow</code> land in{" "}
            <code className="text-primary text-[11px]">SOUL.md</code>;{" "}
            <code className="text-primary text-[11px]">Rules</code> and{" "}
            <code className="text-primary text-[11px]">Must Never</code> land in{" "}
            <code className="text-primary text-[11px]">RULES.md</code> (their titles contain{" "}
            <code className="text-primary text-[11px]">rule</code> / <code className="text-primary text-[11px]">never</code> /{" "}
            <code className="text-primary text-[11px]">must</code>).
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
              <span className="text-foreground font-medium">Note:</span> Unlike the Claude Code importer, the OpenCode
              importer does not emit <code className="text-primary text-[11px]">skills</code> or{" "}
              <code className="text-primary text-[11px]">tools</code> keys in{" "}
              <code className="text-primary text-[11px]">agent.yaml</code> — only{" "}
              <code className="text-primary text-[11px]">spec_version</code>,{" "}
              <code className="text-primary text-[11px]">name</code>,{" "}
              <code className="text-primary text-[11px]">version</code>,{" "}
              <code className="text-primary text-[11px]">description</code>, and (when a model is configured){" "}
              <code className="text-primary text-[11px]">model.preferred</code>.
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
            From the imported directory, confirm the manifest and section files resolve before you run it.
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
