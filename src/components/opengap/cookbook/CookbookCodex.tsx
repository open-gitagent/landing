import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Codex source  ═══════════════════ */

const sourceTree = `my-project/                  (Codex)
└── AGENTS.md                ← identity, rules, and tool declarations`;

const srcAgentsMd = `# AGENTS.md
You are a backend API developer specializing in Node.js and Express.
Help users build production-ready REST APIs with proper validation
and error handling.

Always validate inputs using Zod schemas.
Always return consistent JSON error responses.
Never expose stack traces in production error responses.
Never return 200 for an error — use the correct HTTP status code.
Log errors with context (route, method, status) before responding.

## Tools
- run_tests: Run the test suite
- lint_code: Lint the codebase with ESLint`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromIdentity = `# AGENTS.md  (identity paragraph)
You are a backend API developer specializing
in Node.js and Express.
Help users build production-ready REST APIs
with proper validation and error handling.`;

const toSoul = `# Soul

## Core Identity
You are a backend API developer specializing
in Node.js and Express.

## Purpose
Help users build production-ready REST APIs
with proper validation and error handling.

## Communication Style
Direct and precise. I explain trade-offs
before writing code and flag anything that
would be unsafe in production.

## Domain Expertise
- Express.js REST API design
- Input validation with Zod
- Error handling and HTTP status codes
- ESLint-clean, testable Node.js code`;

const fromRules = `# AGENTS.md  (rules section)
Always validate inputs using Zod schemas.
Always return consistent JSON error responses.
Never expose stack traces in production
  error responses.
Never return 200 for an error — use the
  correct HTTP status code.
Log errors with context (route, method,
  status) before responding.`;

const toRules = `# RULES.md

## Must Always
- Validate all request inputs with Zod
  schemas before processing
- Return a consistent JSON error shape:
  { error: { code, message } }
- Use the correct HTTP status code for
  every error response
- Log errors with route, method, and status
  before sending the response

## Must Never
- Expose raw stack traces or internal paths
  in production error responses
- Return HTTP 200 for an error condition`;

const fromTools = `# AGENTS.md  (## Tools section)
## Tools
- run_tests: Run the test suite
- lint_code: Lint the codebase with ESLint`;

const toToolFiles = `# agent.yaml  (tools[] list)
tools:
  - run-tests
  - lint-code

# tools/run-tests.yaml  (the contract)
name: run-tests
description: Run the project test suite.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: run_tests.sh
  runtime: bash
  timeout: 60

# tools/lint-code.yaml
name: lint-code
description: Lint the codebase with ESLint.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: lint_code.sh
  runtime: bash
  timeout: 30`;

const fromModel = `# Codex — model is set via environment or
# API call; AGENTS.md has no model field.
# e.g. OPENAI_MODEL=gpt-4o codex run`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: backend-api-agent
version: 1.0.0
description: Backend API developer for
  production-ready Node.js / Express REST APIs.
model:
  preferred: openai:gpt-4o
  fallback:
    - anthropic:claude-sonnet-4-5-20250929
runtime:
  max_turns: 40
  timeout: 180
tools:
  - run-tests
  - lint-code`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `my-project/                  (OpenGAP)
├── agent.yaml               ← manifest: model, runtime, tool refs
├── SOUL.md                  ← identity
├── RULES.md                 ← guardrails
└── tools/
    ├── run-tests.yaml       ← tool schema
    ├── run_tests.sh         ← tool implementation
    ├── lint-code.yaml       ← tool schema
    └── lint_code.sh         ← tool implementation`;

const fullAgentYaml = `spec_version: "0.1.0"
name: backend-api-agent
version: 1.0.0
description: Backend API developer specializing in Node.js and Express — production-ready REST APIs with proper validation, error handling, and clean code.

model:
  preferred: openai:gpt-4o
  fallback:
    - anthropic:claude-sonnet-4-5-20250929

runtime:
  max_turns: 40
  timeout: 180

tools:
  - run-tests
  - lint-code`;

const fullSoul = `# Soul

## Core Identity
You are a backend API developer specializing in Node.js and Express.

## Purpose
Help users build production-ready REST APIs with proper validation and error handling. I am designed for backend engineering conversations — designing routes, writing middleware, wiring validation, and producing clean, testable code.

## Communication Style
Direct and precise. I explain design trade-offs before writing code and always flag anything that would be unsafe or incorrect in a production environment. Code blocks are complete and runnable, not pseudocode.

## Values & Principles
- **Safety** — inputs are always validated; stack traces are never leaked
- **Consistency** — error shapes and status codes follow a predictable contract
- **Correctness** — HTTP semantics are respected (4xx for client errors, 5xx for server errors)
- **Maintainability** — ESLint-clean code with clear separation of concerns

## Domain Expertise
- Express.js REST API design: routes, middleware, routers
- Input validation with Zod: schema definition, parsing, error formatting
- Error handling patterns: centralised error middleware, structured JSON error responses
- HTTP status codes: 400, 401, 403, 404, 409, 422, 500 and when to use each
- Testing Node.js APIs: Jest, Supertest, test isolation
- ESLint configuration and lint-clean code

## Collaboration Style
I work interactively. I ask clarifying questions when requirements are ambiguous (which framework version? monorepo or single service?). For larger tasks I narrate the approach before writing code so the user can redirect early.`;

const fullRules = `# Rules

## Must Always
- Validate all request inputs with Zod schemas before any processing logic runs
- Return a consistent JSON error shape on every error: \`{ "error": { "code": "...", "message": "..." } }\`
- Use the semantically correct HTTP status code for every response (400 Bad Request, 404 Not Found, 422 Unprocessable Entity, 500 Internal Server Error, etc.)
- Log errors with context — at minimum: route, HTTP method, and response status — before sending the error response
- Run \`lint-code\` on generated code before presenting it to the user when lint tooling is available

## Must Never
- Expose raw stack traces, file paths, or internal error messages in production error responses
- Return HTTP 200 for an error condition — always use an appropriate 4xx or 5xx status
- Skip input validation and trust caller-supplied data directly

## Output Constraints
- Code is Node.js / TypeScript, formatted for readability, with comments on non-obvious lines
- Error middleware is always placed after all route definitions in Express

## Interaction Boundaries
- \`run-tests\` executes the project test suite; results are returned as stdout/stderr
- \`lint-code\` runs ESLint on the codebase; lint errors are returned as structured output`;

const fullRunTestsYaml = `name: run-tests
description: Run the project test suite and return the results. Use after generating or modifying code to verify correctness.
version: 1.0.0

input_schema:
  type: object
  properties: {}
  required: []

output_schema:
  type: object
  properties:
    stdout:
      type: string
      description: Test runner output (pass/fail summary)
    stderr:
      type: string
      description: Error output from the test runner
    exit_code:
      type: integer
      description: 0 = all tests passed, non-zero = failures

implementation:
  type: script
  path: run_tests.sh
  runtime: bash
  timeout: 60

annotations:
  read_only: false
  idempotent: true
  cost: medium`;

const fullRunTestsSh = `#!/usr/bin/env bash
# run_tests.sh — execute the project test suite
# Output: test runner stdout/stderr as JSON on stdout

set -euo pipefail

# Detect test runner (npm test, yarn test, or jest directly)
if [ -f package.json ]; then
  if command -v yarn &>/dev/null && [ -f yarn.lock ]; then
    yarn test --ci 2>&1
  else
    npm test -- --ci 2>&1
  fi
else
  echo '{"error": "No package.json found in working directory"}' >&2
  exit 1
fi`;

const fullLintCodeYaml = `name: lint-code
description: Lint the codebase with ESLint and report any issues. Use to verify generated code is lint-clean before presenting it.
version: 1.0.0

input_schema:
  type: object
  properties: {}
  required: []

output_schema:
  type: object
  properties:
    stdout:
      type: string
      description: ESLint output (file paths and rule violations)
    exit_code:
      type: integer
      description: 0 = no lint errors, 1 = lint errors found

implementation:
  type: script
  path: lint_code.sh
  runtime: bash
  timeout: 30

annotations:
  read_only: true
  idempotent: true
  cost: low`;

const fullLintCodeSh = `#!/usr/bin/env bash
# lint_code.sh — run ESLint on the codebase

set -euo pipefail

if ! command -v npx &>/dev/null; then
  echo '{"error": "npx not found — is Node.js installed?"}' >&2
  exit 1
fi

npx eslint . --ext .js,.ts,.jsx,.tsx 2>&1`;

const validateCmd = `$ opengap validate
✓ agent.yaml               valid (spec 0.1.0)
✓ SOUL.md                  present
✓ RULES.md                 present
✓ tools/run-tests.yaml     schema ok → run_tests.sh
✓ tools/lint-code.yaml     schema ok → lint_code.sh
  backend-api-agent is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons (none here)" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["AGENTS.md — identity paragraph", "SOUL.md"],
  ["AGENTS.md — behavioral rules", "RULES.md"],
  ["AGENTS.md — ## Tools list", "agent.yaml tools[] + tools/<name>.yaml"],
  ["Codex model (env / API)", "agent.yaml → model.preferred"],
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

export function CookbookCodex() {
  return (
    <section id="cookbook-codex" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Codex → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Codex agent into OpenGAP format by hand. Codex stores identity,
            rules, and tool declarations together in a single <code className="text-primary text-xs">AGENTS.md</code> file.
            We walk through one real project end to end — every file, the exact mapping, and the finished result.
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
              An <code className="text-primary text-[10px]">AGENTS.md</code>-based backend API developer — a single markdown
              file with an identity paragraph, behavioral rules, and a{" "}
              <code className="text-primary text-[10px]">## Tools</code> section listing{" "}
              <code className="text-primary text-[10px]">run_tests</code> and{" "}
              <code className="text-primary text-[10px]">lint_code</code>.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> help users build production-ready
                REST APIs in Node.js and Express — validating inputs with Zod, returning consistent JSON errors,
                running the test suite, and linting generated code before handing it back.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Codex project"
          subtitle="A single AGENTS.md file that packs identity, rules, and tool declarations into one document. Here it is in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand the file to read it in full — the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="AGENTS.md" caption="identity + rules + tool declarations" code={srcAgentsMd} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="Codex keeps identity, rules, and tools unseparated in one file. OpenGAP splits that into four declarative pieces — each section of AGENTS.md maps to one of them."
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
              <span>Codex</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same four mappings, in detail — Codex source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — AGENTS.md paragraph → SOUL.md"
          fromLabel="AGENTS.md"
          fromCode={fromIdentity}
          toLabel="SOUL.md"
          toCode={toSoul}
          why="The opening identity and purpose sentences of AGENTS.md become prose identity in SOUL.md — who the agent is, its expertise, and how it communicates."
        />
        <ConversionStep
          index={2}
          title="Guardrails — AGENTS.md rules → RULES.md"
          fromLabel="AGENTS.md"
          fromCode={fromRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="Every behavioral directive (always, never) becomes an explicit Must Always / Must Never rule. Grouping them makes each constraint auditable and independently overridable."
        />
        <ConversionStep
          index={3}
          title="Tools — AGENTS.md ## Tools → tools/*.yaml"
          fromLabel="AGENTS.md"
          fromCode={fromTools}
          toLabel="agent.yaml · tools/*.yaml"
          toCode={toToolFiles}
          why="Each tool name in the ## Tools list becomes a kebab-case entry in agent.yaml's tools[] and a matching tools/<name>.yaml schema file. The name and description in AGENTS.md seed the schema's description field."
        />
        <ConversionStep
          index={4}
          title="Config — Codex model → agent.yaml"
          fromLabel="Codex (env / API)"
          fromCode={fromModel}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model that was selected via environment variable or API parameter becomes a declared preference in agent.yaml. A fallback is added so the agent can run on other runtimes without manual edits."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <strong className="text-foreground">Codex-specific shell execution context</strong> — Codex's built-in
              sandboxed shell environment (network isolation, allowed-commands list, working-directory scope) has no
              direct OpenGAP equivalent. The tools above call shell scripts, but sandbox policy must be configured at
              the runtime / deployment level, not in the agent files. Any{" "}
              <code className="text-primary text-[11px]">allowedDomains</code> or{" "}
              <code className="text-primary text-[11px]">disallowedCommands</code> settings from Codex config
              should be noted as comments in <code className="text-primary text-[11px]">RULES.md</code> for the
              operator to enforce separately.
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
          <CollapsibleCode filename="tools/run-tests.yaml" code={fullRunTestsYaml} reveal />
          <CollapsibleCode filename="tools/run_tests.sh" code={fullRunTestsSh} reveal />
          <CollapsibleCode filename="tools/lint-code.yaml" code={fullLintCodeYaml} reveal />
          <CollapsibleCode filename="tools/lint_code.sh" code={fullLintCodeSh} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, tool schemas, and script paths all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
