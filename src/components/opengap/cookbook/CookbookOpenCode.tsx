import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full OpenCode source  ═══════════════════ */

const sourceTree = `my-project/                  (OpenCode)
└── .opencode/
    └── config.json          ← model, system prompt, and tool toggles`;

const srcConfigJson = `// .opencode/config.json
{
  "model": "gpt-4o",
  "system": "You are a full-stack developer assistant. Help users build production-ready web applications. Always consider security and performance implications. Prefer simple, readable solutions over clever ones. When writing backend code use Node.js and Express. When writing frontend code use React and TypeScript. Always write tests for new functionality.",
  "tools": {
    "bash":  { "enabled": true },
    "read":  { "enabled": true },
    "write": { "enabled": true }
  }
}`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromSystem = `// .opencode/config.json  (system field)
"system": "You are a full-stack developer
  assistant. Help users build production-ready
  web applications. Always consider security
  and performance implications. Prefer simple,
  readable solutions over clever ones. When
  writing backend code use Node.js and Express.
  When writing frontend code use React and
  TypeScript. Always write tests for new
  functionality."`;

const toSoulAndRules = `# The system field splits in two:
#
#   Who the agent is → SOUL.md
#   What it must do  → RULES.md
#
# Identity sentences  ────────────────
# "You are a full-stack developer assistant."
# "Help users build production-ready apps."
#
# Rule sentences  ────────────────────
# "Always consider security and performance."
# "Prefer simple, readable solutions."
# "Use Node.js / Express for backend."
# "Use React / TypeScript for frontend."
# "Always write tests for new functionality."`;

const fromModel = `// .opencode/config.json  (model field)
"model": "gpt-4o"`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: fullstack-dev-agent
version: 1.0.0
description: Full-stack developer assistant
  for production-ready web applications.
model:
  preferred: openai:gpt-4o
  fallback:
    - anthropic:claude-sonnet-4-5-20250929
runtime:
  max_turns: 50
  timeout: 300`;

const fromToolToggles = `// .opencode/config.json  (tools)
"tools": {
  "bash":  { "enabled": true },
  "read":  { "enabled": true },
  "write": { "enabled": true }
}

// These are built-in OpenCode capabilities —
// not external tool definitions.`;

const toNoToolYaml = `# No tools/*.yaml files are created.
#
# bash, read, and write are runtime
# capabilities provided by the host
# environment, not declarative tools.
#
# Enabled/disabled state is a deployment
# concern — note it in RULES.md if the
# agent must never use one of them:
#
# ## Capability Constraints
# - bash: available (use for build / test)
# - read: available (use to inspect files)
# - write: available (use to emit code)`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `my-project/                  (OpenGAP)
├── agent.yaml               ← manifest: model, runtime
├── SOUL.md                  ← identity
└── RULES.md                 ← guardrails + capability notes`;

const fullAgentYaml = `spec_version: "0.1.0"
name: fullstack-dev-agent
version: 1.0.0
description: Full-stack developer assistant for production-ready web applications — Node.js / Express backend, React / TypeScript frontend, with tests.

model:
  preferred: openai:gpt-4o
  fallback:
    - anthropic:claude-sonnet-4-5-20250929

runtime:
  max_turns: 50
  timeout: 300`;

const fullSoul = `# Soul

## Core Identity
You are a full-stack developer assistant.

## Purpose
Help users build production-ready web applications. I am designed for end-to-end engineering conversations — designing APIs, building React UIs, wiring authentication, writing tests, and reviewing code for security and performance issues.

## Communication Style
Clear and pragmatic. I explain decisions before writing code, flag security or performance concerns early, and default to simple readable solutions rather than clever ones. Code blocks are complete and runnable — not pseudocode.

## Values & Principles
- **Simplicity** — readable solutions that a future reader can understand without the author present
- **Safety** — security implications are called out before writing any auth, input handling, or data access code
- **Performance** — performance trade-offs are noted when they matter; premature optimisation is avoided
- **Correctness** — new functionality ships with tests

## Domain Expertise
- **Backend**: Node.js, Express.js, REST API design, middleware, authentication (JWT, sessions), database access (SQL + ORMs)
- **Frontend**: React, TypeScript, component design, hooks, state management
- **Testing**: Jest, React Testing Library, Supertest for API tests
- **Tooling**: npm/yarn, ESLint, Prettier, build pipelines

## Collaboration Style
I work interactively. For larger tasks I outline the approach first so the user can redirect before I write code. I ask clarifying questions when requirements are ambiguous (which auth strategy? which database?).`;

const fullRules = `# Rules

## Must Always
- Consider security implications before writing any authentication, input handling, or data access code — call them out explicitly
- Prefer simple, readable solutions over clever or terse ones
- Write tests for any new functionality (Jest for unit/integration, React Testing Library for components, Supertest for API routes)
- Use **Node.js and Express** for backend code unless the user specifies a different framework
- Use **React and TypeScript** for frontend code unless the user specifies otherwise

## Must Never
- Write backend input handling without validation (use Zod or a comparable library)
- Expose sensitive data (API keys, secrets, stack traces) in responses or client-side code
- Skip tests for new functionality

## Output Constraints
- Backend code: Node.js / TypeScript, ESLint-clean, with comments on non-obvious lines
- Frontend code: React functional components with TypeScript, typed props
- Test files co-located with the files they test (e.g. \`foo.test.ts\` next to \`foo.ts\`)

## Capability Constraints
The following runtime capabilities are available in this deployment:
- **bash** — use for running build steps, tests, and install commands
- **read** — use to inspect existing files before modifying them
- **write** — use to emit generated or modified files

These are host runtime capabilities, not declarative tool files. Enabling / disabling them is a deployment-level concern.`;

const validateCmd = `$ opengap validate
✓ agent.yaml          valid (spec 0.1.0)
✓ SOUL.md             present
✓ RULES.md            present
  fullstack-dev-agent is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons (none here)" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml", desc: "Model & runtime" },
];

const mapAtAGlance: [string, string][] = [
  ["config.json → system (identity sentences)", "SOUL.md"],
  ["config.json → system (rule sentences)", "RULES.md"],
  ["config.json → model", "agent.yaml → model.preferred"],
  ["config.json → tools (bash/read/write)", "RULES.md capability notes (runtime only)"],
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

export function CookbookOpenCode() {
  return (
    <section id="cookbook-opencode" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenCode → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting an OpenCode agent into OpenGAP format by hand. OpenCode stores
            model, system prompt, and tool toggles together in a single{" "}
            <code className="text-primary text-xs">.opencode/config.json</code> file. We walk through one real
            project end to end — splitting the JSON config into the right OpenGAP pieces.
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
              An <code className="text-primary text-[10px]">.opencode/config.json</code>-based full-stack developer
              assistant — a single JSON file with a <code className="text-primary text-[10px]">model</code>, a{" "}
              <code className="text-primary text-[10px]">system</code> prompt mixing identity and rules, and{" "}
              <code className="text-primary text-[10px]">tools</code> toggles for{" "}
              <code className="text-primary text-[10px]">bash</code>,{" "}
              <code className="text-primary text-[10px]">read</code>, and{" "}
              <code className="text-primary text-[10px]">write</code>.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> help users build production-ready
                web applications — Node.js / Express on the backend, React / TypeScript on the frontend — always
                considering security and performance, preferring readable solutions, and writing tests for new code.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The OpenCode project"
          subtitle="A single config.json that packs model selection, a mixed identity-and-rules system prompt, and built-in tool toggles into one JSON file. Here it is in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand the file to read it in full — the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename=".opencode/config.json" caption="model + system prompt + tool toggles" code={srcConfigJson} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="OpenCode packs everything into one JSON blob. OpenGAP splits that into four declarative pieces — each field of config.json maps to one of them."
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
              <span>OpenCode</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same four mappings, in detail — OpenCode source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — config.json system (identity sentences) → SOUL.md"
          fromLabel=".opencode/config.json"
          fromCode={fromSystem}
          toLabel="SOUL.md · RULES.md (split)"
          toCode={toSoulAndRules}
          why="The system field is a single string that mixes identity ('You are…', 'Help users…') with rules ('Always…', 'Prefer…'). The first step is identifying the split point — identity sentences go to SOUL.md, behavioral directives go to RULES.md."
        />
        <ConversionStep
          index={2}
          title="Config — config.json model → agent.yaml"
          fromLabel=".opencode/config.json"
          fromCode={fromModel}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model field becomes model.preferred in agent.yaml with a provider-qualified identifier. A fallback is added so the agent can run on other runtimes without manual edits."
        />
        <ConversionStep
          index={3}
          title="Tools — config.json tools (built-ins) → RULES.md capability notes"
          fromLabel=".opencode/config.json"
          fromCode={fromToolToggles}
          toLabel="RULES.md (no tool YAML)"
          toCode={toNoToolYaml}
          why="Built-in OpenCode tools (bash, read, write) are runtime capabilities, not declarative tool definitions. They do not need tools/*.yaml files. Their enabled/disabled state is a deployment concern — documented in RULES.md as capability notes for the operator."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <strong className="text-foreground">Built-in tool toggles</strong> —{" "}
              <code className="text-primary text-[11px]">bash</code>,{" "}
              <code className="text-primary text-[11px]">read</code>, and{" "}
              <code className="text-primary text-[11px]">write</code> are host runtime capabilities in OpenCode.
              There is no OpenGAP file that enables or disables them; that is controlled at the deployment or
              runtime layer. If your agent must <em>never</em> use one of them, add a Must Never rule in{" "}
              <code className="text-primary text-[11px]">RULES.md</code> and enforce the restriction at the
              runtime level separately.
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
