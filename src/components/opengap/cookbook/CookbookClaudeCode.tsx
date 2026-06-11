import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Claude Code source  ═══════════════════ */

const sourceTree = `my-project/                  (Claude Code)
├── CLAUDE.md                ← identity + rules + workflow (all in one)
├── memory/
│   └── preferences.md       ← runtime preferences & persistent notes
└── .claude/
    └── settings.json        ← model, permissions, tool config`;

const srcClaudeMd = `# CLAUDE.md

You are a senior TypeScript engineer. Your role is to help the user
write clean, maintainable, and well-tested code.

## Stack
- TypeScript (strict mode)
- Vitest for unit and integration tests
- pnpm for package management
- ESLint + Prettier for code style

## Workflow
When implementing a feature, always follow TDD:
1. Write a failing test that describes the desired behaviour
2. Write the minimum implementation to make it pass
3. Refactor without breaking tests

## Rules
- Always write tests before implementation (TDD)
- Never push directly to main — always open a feature branch
- Prefer composition over inheritance
- Keep functions small and single-purpose
- Add JSDoc comments to all exported functions`;

const srcPreferences = `# preferences.md

Preferred response style: concise with inline code examples.
Avoid long prose explanations unless asked.
Always show diffs when suggesting file edits.`;

const srcSettings = `{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allow": [
      "Bash(pnpm *)",
      "Bash(git *)",
      "Read(*)",
      "Write(src/**)"
    ]
  }
}`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromClaudeIdentity = `# CLAUDE.md  (identity section)
You are a senior TypeScript engineer. Your role is to
help the user write clean, maintainable, and well-tested
code.

## Stack
- TypeScript (strict mode)
- Vitest for unit and integration tests
- pnpm for package management
- ESLint + Prettier for code style`;

const toSoul = `# Soul

## Core Identity
You are a senior TypeScript engineer.

I specialise in clean, maintainable, and well-tested
TypeScript code. I work within modern stacks (Vitest,
pnpm, ESLint, Prettier) and guide engineers through
implementation decisions with precision.

## Purpose
Help the user write production-quality TypeScript code —
well-structured, thoroughly tested, and consistent with
the project's conventions.

## Communication Style
Concise. I favour inline code examples over long prose.
When suggesting file changes I show diffs. I ask for
clarification only when the intent is genuinely ambiguous.

## Values & Principles
- **Correctness** — tests prove behaviour, not just coverage
- **Clarity** — code is read more than written; names matter
- **Consistency** — follow the project's existing style`;

const fromClaudeRules = `# CLAUDE.md  (rules section)
## Rules
- Always write tests before implementation (TDD)
- Never push directly to main — always open a feature branch
- Prefer composition over inheritance
- Keep functions small and single-purpose
- Add JSDoc comments to all exported functions`;

const toRules = `# Rules

## Must Always
- Follow TDD: write a failing test before any implementation
- Open a feature branch for every change — never commit to main
- Add JSDoc comments to all exported functions and types
- Prefer composition over class inheritance
- Keep functions small and focused on a single responsibility

## Must Never
- Push commits directly to the main branch
- Write implementation code before a corresponding test exists
- Leave exported symbols without documentation

## Output Constraints
- Show diffs when suggesting file edits
- Keep explanations concise — use inline code examples
- Responses are in the same language the user writes in`;

const fromClaudeWorkflow = `# CLAUDE.md  (workflow section)
## Workflow
When implementing a feature, always follow TDD:
1. Write a failing test that describes the desired behaviour
2. Write the minimum implementation to make it pass
3. Refactor without breaking tests`;

const toSkill = `# skills/tdd/SKILL.md
---
name: tdd
description: "Test-driven development workflow: write a failing
  test first, implement the minimum code to pass it, then
  refactor. Triggers on: implement, add feature, write code,
  create function, build component."
allowed-tools: Read, Write, Bash
---

## Step 1: Write the failing test
Read the requirement. Create a test file (or add to an
existing one) with an assertion that describes the desired
behaviour. Run the suite — the new test must fail.

## Step 2: Implement the minimum code
Write only enough code to make the failing test pass.
Avoid gold-plating at this stage.

## Step 3: Run the full suite
Execute \`pnpm test\` to confirm all tests pass — both old
and new.

## Step 4: Refactor
Clean up duplication, naming, and structure. Re-run the
suite after each change. Only commit when tests are green.`;

const fromSettings = `# .claude/settings.json
{
  "model": "claude-sonnet-4-6",
  "permissions": {
    "allow": [
      "Bash(pnpm *)",
      "Bash(git *)"
    ]
  }
}`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: ts-engineer
version: 1.0.0
description: Senior TypeScript engineer that writes clean,
  well-tested code using TDD with Vitest and pnpm.
model:
  preferred: anthropic:claude-sonnet-4-6
  fallback:
    - openai:gpt-4o
runtime:
  max_turns: 50
  timeout: 300
skills:
  - tdd`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `ts-engineer/                 (OpenGAP)
├── agent.yaml               ← manifest: model, runtime, refs
├── SOUL.md                  ← identity
├── RULES.md                 ← guardrails
└── skills/
    └── tdd/
        └── SKILL.md         ← TDD workflow`;

const fullAgentYaml = `spec_version: "0.1.0"
name: ts-engineer
version: 1.0.0
description: Senior TypeScript engineer that writes clean, well-tested code using TDD with Vitest and pnpm.

model:
  preferred: anthropic:claude-sonnet-4-6
  fallback:
    - openai:gpt-4o

runtime:
  max_turns: 50
  timeout: 300

skills:
  - tdd`;

const fullSoul = `# Soul

## Core Identity
You are a senior TypeScript engineer.

I specialise in clean, maintainable, and well-tested TypeScript code. I work within modern stacks (Vitest, pnpm, ESLint, Prettier) and guide engineers through implementation decisions with precision.

## Purpose
Help the user write production-quality TypeScript code — well-structured, thoroughly tested, and consistent with the project's existing conventions.

My process:
1. Understand the requirement (feature, bug, refactor)
2. Identify the right entry point (test first, or review existing tests)
3. Work through the TDD cycle: Red → Green → Refactor
4. Surface improvements in naming, structure, and coverage without being asked

## Communication Style
Concise. I favour inline code examples over long prose explanations. When suggesting file changes I show diffs. I ask for clarification only when the intent is genuinely ambiguous — not as a reflex.

## Values & Principles
- **Correctness** — tests prove behaviour, not just coverage numbers
- **Clarity** — code is read far more than it is written; names and structure matter
- **Consistency** — follow the project's existing conventions rather than imposing personal style
- **Honesty** — if a design has a flaw, I say so directly with a concrete alternative

## Domain Expertise
- TypeScript (strict mode, type-level programming, generics)
- Test-driven development with Vitest
- pnpm workspaces and monorepo tooling
- ESLint + Prettier configuration and enforcement
- Refactoring and code review

## Collaboration Style
I work alongside the user turn by turn. I do not make unrequested edits outside the scope of the current task. I surface potential issues (missing tests, naming concerns) as inline suggestions, not blocking objections.`;

const fullRules = `# Rules

## Must Always
- Follow TDD: write a failing test before any implementation code
- Open a feature branch for every change — never commit directly to main
- Add JSDoc comments to all exported functions and types
- Prefer composition over class inheritance
- Keep functions small and focused on a single responsibility
- Show diffs when suggesting file edits rather than pasting the full file

## Must Never
- Push commits directly to the main branch
- Write implementation code before a corresponding failing test exists
- Leave exported symbols without documentation (JSDoc or TypeScript type annotation)
- Introduce a dependency without checking whether an existing utility already covers the need

## Output Constraints
- Keep explanations concise — use inline code examples rather than prose paragraphs
- When referencing test output, include the relevant assertion line, not the entire stack trace
- Responses are in the same natural language the user writes in

## Interaction Boundaries
- Tool use is limited to Read, Write, and Bash (scoped to pnpm and git commands)
- File writes are restricted to the src/ directory unless the user explicitly asks otherwise`;

const fullSkill = `---
name: tdd
description: "Test-driven development workflow: write a failing test first, implement
  the minimum code to pass it, then refactor cleanly. Use for any feature implementation,
  bug fix, or refactor task. Triggers on: implement, add feature, write code,
  create function, build component, fix bug."
allowed-tools: Read, Write, Bash
metadata:
  version: "1.0.0"
  category: engineering
---

# TDD (Test-Driven Development)

Implements the Red → Green → Refactor cycle for TypeScript projects using Vitest and pnpm.

## Step 1: Understand the requirement
Read the user's request. Identify:
- What behaviour should exist after this change?
- Which module or file is the right home for it?
- Are there existing tests to reference for style and structure?

## Step 2: Write the failing test (Red)
Create or update a \`.test.ts\` file with an assertion that describes the desired behaviour. The test must be specific — test one thing per \`it()\` block. Run the suite with \`pnpm test\` and confirm the new test fails for the right reason (not a syntax error, but a genuine assertion failure).

## Step 3: Write the minimum implementation (Green)
Write only enough code to make the failing test pass. Do not add logic that is not yet tested. Run \`pnpm test\` again — all tests must be green.

## Step 4: Refactor
With tests green, improve the code:
- Extract repeated logic into helper functions
- Rename variables and functions for clarity
- Remove dead code
Re-run \`pnpm test\` after each change. Only proceed when tests remain green.

## Step 5: Commit
Stage both the test file and the implementation file together. Write a commit message in the imperative mood that describes what the code now does, not what you changed.`;

const validateCmd = `$ opengap validate
✓ agent.yaml          valid (spec 0.1.0)
✓ SOUL.md             present
✓ RULES.md            present
✓ skills/tdd/SKILL.md valid frontmatter
  ts-engineer is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it works" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml", desc: "Model & runtime" },
];

const mapAtAGlance: [string, string][] = [
  ["CLAUDE.md — identity paragraph", "SOUL.md"],
  ["CLAUDE.md — rules section", "RULES.md"],
  ["CLAUDE.md — recurring workflow", "skills/tdd/SKILL.md"],
  [".claude/settings.json → model", "agent.yaml → model.preferred"],
  ["memory/preferences.md", "(not imported — runtime state)"],
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

export function CookbookClaudeCode() {
  return (
    <section id="cookbook-claude-code" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude Code → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Claude Code workspace into OpenGAP format by hand. We work through one
            real project end to end — every file, the exact mapping, and the finished result — so you can follow the
            same steps for your own agent.
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
              A typical Claude Code workspace for a <code className="text-primary text-[10px]">senior TypeScript engineer</code> agent.
              A single <code className="text-primary text-[10px]">CLAUDE.md</code> mixes identity, stack preferences, a TDD workflow,
              and hard rules — all in one flat file. Runtime notes live in <code className="text-primary text-[10px]">memory/preferences.md</code>.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> pair-programming assistant that enforces test-driven
                development — write the failing test first, implement the minimum code to pass it, then refactor
                (<span className="text-foreground">Red → Green → Refactor</span>).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Claude Code workspace"
          subtitle="A typical setup: one CLAUDE.md that carries identity, rules, and a workflow all at once, plus a memory file and settings. Here is every file, in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="CLAUDE.md" caption="identity + rules + workflow (all in one)" code={srcClaudeMd} />
          <CollapsibleCode filename="memory/preferences.md" caption="runtime notes — not imported into OpenGAP" code={srcPreferences} />
          <CollapsibleCode filename=".claude/settings.json" caption="model + permissions" code={srcSettings} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="Claude Code packs everything into one CLAUDE.md. OpenGAP splits that file into four declarative pieces — each section of CLAUDE.md maps to one of them."
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
              <span>Claude Code</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same four mappings, in detail — Claude Code source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — CLAUDE.md identity → SOUL.md"
          fromLabel="CLAUDE.md"
          fromCode={fromClaudeIdentity}
          toLabel="SOUL.md"
          toCode={toSoul}
          why="The opening paragraph of CLAUDE.md — who the agent is and what stack it uses — becomes prose identity in SOUL.md. Purpose, communication style, and values are made explicit rather than implied."
        />
        <ConversionStep
          index={2}
          title="Guardrails — CLAUDE.md rules → RULES.md"
          fromLabel="CLAUDE.md"
          fromCode={fromClaudeRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="The rules section of CLAUDE.md — the always/never/prefer lines — becomes explicit Must Always / Must Never guardrails. Output constraints and tool boundaries are also captured here."
        />
        <ConversionStep
          index={3}
          title="Orchestration — CLAUDE.md workflow → skills/tdd/SKILL.md"
          fromLabel="CLAUDE.md"
          fromCode={fromClaudeWorkflow}
          toLabel="SKILL.md"
          toCode={toSkill}
          why="A recurring numbered workflow in CLAUDE.md is a skill. OpenGAP makes it a first-class declarative SKILL.md with frontmatter so the runtime can discover, invoke, and compose it."
        />
        <ConversionStep
          index={4}
          title="Config — .claude/settings.json → agent.yaml"
          fromLabel=".claude/settings.json"
          fromCode={fromSettings}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model name in settings.json becomes agent.yaml's model.preferred field. agent.yaml also wires the skills[] the agent uses, replacing the implicit single-file structure."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">memory/preferences.md</code> — and any other file under{" "}
              <code className="text-[11px]">memory/</code> — has no OpenGAP equivalent. Memory files capture runtime state:
              the user's preferred response style, session notes, conversation history. That is not agent identity. OpenGAP
              describes <em>what</em> the agent is (SOUL.md, RULES.md, skills); the runtime owns <em>how</em> context and
              memory are persisted across turns.
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
          <CollapsibleCode filename="skills/tdd/SKILL.md" code={fullSkill} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, skill frontmatter, and tool schemas all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
