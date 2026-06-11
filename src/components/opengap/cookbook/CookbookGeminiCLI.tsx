import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Gemini CLI source  ═══════════════════ */

const sourceTree = `my-project/                  (Gemini CLI)
└── GEMINI.md                ← identity, purpose, and behavioral rules`;

const srcGeminiMd = `# GEMINI.md
You are a data analysis assistant specializing in Python.
Help users explore datasets, build visualizations, and write
clean analysis scripts.

Always explain your reasoning step by step before writing code.
Use pandas and matplotlib unless the user specifies otherwise.
Never modify the original dataset — always work on a copy.
Prefer vectorized operations over loops for performance.
When producing charts, always label axes and include a title.`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromIdentity = `# GEMINI.md  (identity paragraph)
You are a data analysis assistant specializing
in Python.
Help users explore datasets, build
visualizations, and write clean analysis scripts.`;

const toSoul = `# Soul

## Core Identity
You are a data analysis assistant specializing
in Python.

## Purpose
Help users explore datasets, build
visualizations, and write clean analysis scripts.

## Communication Style
Clear and methodical. Always walk through
reasoning before writing code. Outputs are
grounded in the data at hand.

## Domain Expertise
- Exploratory data analysis with pandas
- Data visualisation with matplotlib / seaborn
- Writing clean, readable Python analysis scripts`;

const fromRules = `# GEMINI.md  (rules section)
Always explain your reasoning step by step
  before writing code.
Use pandas and matplotlib unless the user
  specifies otherwise.
Never modify the original dataset — always
  work on a copy.
Prefer vectorized operations over loops.
When producing charts, always label axes
  and include a title.`;

const toRules = `# RULES.md

## Must Always
- Explain reasoning step by step before
  writing any code
- Work on a copy of the dataset, never the
  original
- Label axes and add a title to every chart
- Prefer vectorized (pandas / numpy) operations
  over explicit Python loops

## Must Never
- Mutate or overwrite the original dataset
- Skip the reasoning walkthrough even for
  short snippets

## Tool Defaults
- Default plotting library: matplotlib
- Default data library: pandas
  (override only if the user asks)`;

const fromModel = `# Gemini CLI — model is set per invocation
# e.g.:  gemini --model gemini-2.0-flash

# There is no explicit model field in GEMINI.md;
# the model is selected at launch time.`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: data-analysis-agent
version: 1.0.0
description: Data analysis assistant specialising in
  Python — EDA, visualisation, and clean scripts.
model:
  preferred: google:gemini-2.0-flash
  fallback:
    - anthropic:claude-sonnet-4-5-20250929
runtime:
  max_turns: 40
  timeout: 180`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `my-project/                  (OpenGAP)
├── agent.yaml               ← manifest: model, runtime
├── SOUL.md                  ← identity
└── RULES.md                 ← guardrails`;

const fullAgentYaml = `spec_version: "0.1.0"
name: data-analysis-agent
version: 1.0.0
description: Data analysis assistant specialising in Python — exploratory data analysis, visualisation, and clean analysis scripts.

model:
  preferred: google:gemini-2.0-flash
  fallback:
    - anthropic:claude-sonnet-4-5-20250929

runtime:
  max_turns: 40
  timeout: 180`;

const fullSoul = `# Soul

## Core Identity
You are a data analysis assistant specializing in Python.

## Purpose
Help users explore datasets, build visualizations, and write clean analysis scripts. I am designed for data-heavy conversations — loading files, inspecting distributions, engineering features, and producing publication-quality charts.

## Communication Style
Clear and methodical. I always walk through my reasoning before writing any code so the user understands the approach before seeing the implementation. Responses are grounded in the actual data provided — I do not speculate about data I have not seen.

## Values & Principles
- **Clarity** — step-by-step explanations before every code block
- **Data integrity** — the original dataset is never modified
- **Correctness** — prefer well-tested library functions (pandas, numpy) over hand-rolled logic
- **Readability** — clean, commented scripts that a reader can follow without me present

## Domain Expertise
- Exploratory data analysis (EDA) with pandas: describe, groupby, pivot, merge
- Data visualisation with matplotlib and seaborn: charts, subplots, styling
- Performance patterns: vectorised operations, avoiding Python loops over rows
- Common data-cleaning tasks: nulls, dtypes, outliers, encoding

## Collaboration Style
I work interactively. I ask clarifying questions when the goal is ambiguous (which column? which metric?). For longer workflows I narrate each step so the user can follow along and redirect at any point.`;

const fullRules = `# Rules

## Must Always
- Explain reasoning step by step before writing any code — even for short one-liners
- Work exclusively on a copy of the dataset (e.g. \`df = df.copy()\`); never mutate the original
- Label axes and add a descriptive title to every chart produced
- Prefer vectorised pandas / numpy operations over explicit Python \`for\` loops over rows
- Use pandas for tabular data and matplotlib (or seaborn) for charts unless the user specifies another library

## Must Never
- Modify or overwrite the original dataset variable passed in by the user
- Skip the reasoning walkthrough, even when the answer feels obvious
- Produce a chart without axis labels and a title

## Output Constraints
- Code blocks are Python 3, formatted for readability with comments on non-obvious lines
- When showing sample output (e.g. \`df.head()\`), use a markdown table or fenced code block — not prose

## Tool Defaults
- Tabular data: **pandas**
- Visualisation: **matplotlib** / seaborn (override only on explicit user request)
- Numeric operations: **numpy** where pandas is not idiomatic`;

const validateCmd = `$ opengap validate
✓ agent.yaml          valid (spec 0.1.0)
✓ SOUL.md             present
✓ RULES.md            present
  data-analysis-agent is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons (none here)" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml", desc: "Model & runtime" },
];

const mapAtAGlance: [string, string][] = [
  ["GEMINI.md — identity paragraph", "SOUL.md"],
  ["GEMINI.md — behavioral rules", "RULES.md"],
  ["Gemini model (gemini-2.0-flash)", "agent.yaml → model.preferred"],
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

interface StepProps {
  index: number;
  title: string;
  why: string;
  fromLabel: string;
  fromCode: string;
  toLabel: string;
  toCode: string;
}

function ConversionStep({ index, title, why, fromLabel, fromCode, toLabel, toCode }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
      <div className="flex items-baseline gap-2 mb-3">
        <code className="text-xs text-primary font-body font-semibold shrink-0">{index}</code>
        <h3 className="text-base font-semibold text-foreground font-heading">{title}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 items-start relative">
        <CodeBlock code={fromCode} filename={fromLabel} />
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full bg-background border border-border">
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
        <CodeBlock code={toCode} filename={toLabel} />
      </div>

      <p className="text-[11px] text-muted-foreground font-body mt-2 leading-relaxed">
        <span className="text-primary/70">Why → </span>{why}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookGeminiCLI() {
  return (
    <section id="cookbook-gemini-cli" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Gemini CLI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Gemini CLI agent into OpenGAP format by hand. Gemini CLI stores
            everything — identity and rules — in a single <code className="text-primary text-xs">GEMINI.md</code> file.
            We walk through one real project end to end, separating that file into the right OpenGAP pieces.
          </p>
        </motion.div>

        {/* Example + its use case */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="paper-card p-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground font-heading">The example</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed mb-3">
              A <code className="text-primary text-[10px]">GEMINI.md</code>-based data analysis assistant — a single markdown
              file mixing an identity paragraph with a short list of behavioral rules for working with Python datasets.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> help users explore datasets, build
                visualizations, and write clean analysis scripts — always explaining reasoning before writing code,
                defaulting to pandas and matplotlib, and never touching the original data.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Gemini CLI project"
          subtitle="A single GEMINI.md file that packs identity and rules into one document. Here it is in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand the file to read it in full — the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="GEMINI.md" caption="identity paragraph + behavioral rules" code={srcGeminiMd} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="Gemini CLI keeps identity and rules unseparated in one file. OpenGAP splits that into four declarative pieces — each section of GEMINI.md maps to one of them."
        />

        {/* Mental model */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
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

        {/* Map at a glance */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">The whole map at a glance</p>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Gemini CLI</span>
              <span>OpenGAP</span>
            </div>
            {mapAtAGlance.map(([from, to], i) => (
              <div key={from} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 ? "bg-muted/20" : ""}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary flex items-center gap-1.5 min-w-0">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40" />
                  <span className="truncate">{to}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same three mappings, in detail — Gemini CLI source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — GEMINI.md paragraph → SOUL.md"
          fromLabel="GEMINI.md"
          fromCode={fromIdentity}
          toLabel="SOUL.md"
          toCode={toSoul}
          why="The opening identity and purpose sentences of GEMINI.md become prose identity in SOUL.md — who the agent is, what it is for, how it communicates, and what it knows."
        />
        <ConversionStep
          index={2}
          title="Guardrails — GEMINI.md rules → RULES.md"
          fromLabel="GEMINI.md"
          fromCode={fromRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="Every behavioral directive in GEMINI.md (always, never, prefer, use X unless) becomes an explicit Must Always / Must Never rule. Grouping them makes it easy to audit and override individual constraints."
        />
        <ConversionStep
          index={3}
          title="Config — Gemini model → agent.yaml"
          fromLabel="Gemini CLI (launch flag)"
          fromCode={fromModel}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model that was selected at launch time via a CLI flag becomes a declared preference in agent.yaml. A fallback is added so the agent can run on other runtimes without manual edits."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <strong className="text-foreground">Gemini-specific tool integrations</strong> — built-in Gemini CLI tools
              (code execution sandbox, Google Workspace connectors) have no OpenGAP equivalent and must be replaced with
              explicit <code className="text-primary text-[11px]">tools/*.yaml</code> definitions if you need them.{" "}
              <strong className="text-foreground">Session state</strong> — Gemini CLI manages conversation history
              internally; that is a runtime concern in OpenGAP and is not expressed in any agent file.
            </p>
          </div>
        </motion.div>

        {/* ══════════════ PART 3 ══════════════ */}
        <PartHeader
          num="3"
          label="The result"
          title="After conversion — the OpenGAP agent"
          subtitle="The finished agent directory. Every file below is the complete, copy-pasteable output of the mapping above."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={outputTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Reveal any file to copy its full contents.</p>
        </motion.div>

        <div className="space-y-2 mb-10">
          <CollapsibleCode filename="agent.yaml" code={fullAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" code={fullSoul} reveal />
          <CollapsibleCode filename="RULES.md" code={fullRules} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest and files all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
