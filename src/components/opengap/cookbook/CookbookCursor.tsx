import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Cursor source  ═══════════════════ */

const sourceTree = `my-project/                  (Cursor)
├── .cursorrules             ← identity + rules (single flat file)
└── .cursor/
    └── settings.json        ← model and editor config`;

const srcCursorRules = `# .cursorrules

You are an expert React and TypeScript developer. Your role is to
help build modern, accessible, and maintainable web applications.

Always use functional components and React hooks — never class components.
Prefer Tailwind CSS for styling; avoid custom CSS files unless unavoidable.
Always define TypeScript interfaces for component props.
Keep components small and focused on a single responsibility.
Co-locate tests with components: Button.tsx → Button.test.tsx.
Use React Query for server state; Zustand for client state.
Never use \`any\` — always type explicitly or use \`unknown\`.
Prefer named exports over default exports for components.`;

const srcSettings = `{
  "cursor.general.enableShadowWorkspace": true,
  "cursor.chat.model": "claude-sonnet-4-6",
  "cursor.chat.customApiKey": "",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromCursorIdentity = `# .cursorrules  (opening — identity)
You are an expert React and TypeScript developer.
Your role is to help build modern, accessible, and
maintainable web applications.`;

const toSoul = `# Soul

## Core Identity
You are an expert React and TypeScript developer.

I specialise in building modern, accessible, and
maintainable web applications with React, TypeScript,
and Tailwind CSS.

## Purpose
Help the user design and implement React components and
application features that are well-typed, accessible,
and easy to maintain.

## Communication Style
Direct. I show code over prose. When suggesting component
changes I prefer showing the updated JSX rather than
describing what to change. I flag accessibility issues
as they arise, not as a separate audit step.

## Values & Principles
- **Type safety** — explicit types everywhere; no \`any\`
- **Accessibility** — ARIA roles and semantic HTML by default
- **Simplicity** — small, focused components over large ones`;

const fromCursorRules = `# .cursorrules  (rule lines)
Always use functional components and React hooks —
  never class components.
Prefer Tailwind CSS for styling.
Always define TypeScript interfaces for component props.
Keep components small and focused on a single responsibility.
Co-locate tests with components: Button.tsx → Button.test.tsx.
Use React Query for server state; Zustand for client state.
Never use \`any\` — always type explicitly or use \`unknown\`.
Prefer named exports over default exports.`;

const toRules = `# Rules

## Must Always
- Use functional components and React hooks — never class components
- Define a TypeScript interface for every component's props
- Co-locate test files with components: \`Button.tsx\` → \`Button.test.tsx\`
- Use named exports for components (not default exports)
- Add ARIA roles and labels to interactive elements
- Use React Query for server state and Zustand for client state

## Must Never
- Write class components
- Use the \`any\` type — use explicit types or \`unknown\` instead
- Add custom CSS files when Tailwind classes cover the same need
- Place tests in a separate \`__tests__\` directory away from the source

## Output Constraints
- Show updated JSX/TSX directly rather than describing changes in prose
- Flag accessibility issues inline, not as a separate pass
- Responses are in the same language the user writes in`;

const fromCursorSkillHint = `# .cursorrules  (implicit component workflow)
Keep components small and focused on a single responsibility.
Co-locate tests with components: Button.tsx → Button.test.tsx.
Prefer named exports over default exports for components.`;

const toSkill = `# skills/react-component/SKILL.md
---
name: react-component
description: "Scaffold a React + TypeScript component following
  project conventions: typed props interface, Tailwind styling,
  co-located test, named export. Triggers on: create component,
  add component, new component, build UI, make a button/card/modal."
allowed-tools: Read, Write
---

## Step 1: Define the props interface
Create a \`<Name>Props\` TypeScript interface. Every prop must
have an explicit type — no \`any\`, no optional props without
a clear default.

## Step 2: Write the component
Use a functional component with the props interface. Style
with Tailwind classes. Add ARIA roles and labels for any
interactive element.

## Step 3: Add the named export
Export the component by name at the bottom of the file:
\`export { <Name> };\`

## Step 4: Create the co-located test
Create \`<Name>.test.tsx\` in the same directory. Write at
least one test that renders the component and asserts its
visible output.`;

const fromSettings = `# .cursor/settings.json
{
  "cursor.chat.model": "claude-sonnet-4-6",
  "editor.formatOnSave": true
}`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: react-ts-developer
version: 1.0.0
description: Expert React and TypeScript developer that builds
  modern, accessible, and maintainable web applications.
model:
  preferred: anthropic:claude-sonnet-4-6
  fallback:
    - openai:gpt-4o
runtime:
  max_turns: 50
  timeout: 300
skills:
  - react-component`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `react-ts-developer/          (OpenGAP)
├── agent.yaml               ← manifest: model, runtime, refs
├── SOUL.md                  ← identity
├── RULES.md                 ← guardrails
└── skills/
    └── react-component/
        └── SKILL.md         ← component scaffolding workflow`;

const fullAgentYaml = `spec_version: "0.1.0"
name: react-ts-developer
version: 1.0.0
description: Expert React and TypeScript developer that builds modern, accessible, and maintainable web applications.

model:
  preferred: anthropic:claude-sonnet-4-6
  fallback:
    - openai:gpt-4o

runtime:
  max_turns: 50
  timeout: 300

skills:
  - react-component`;

const fullSoul = `# Soul

## Core Identity
You are an expert React and TypeScript developer.

I specialise in building modern, accessible, and maintainable web applications with React, TypeScript, and Tailwind CSS.

## Purpose
Help the user design and implement React components and application features that are well-typed, accessible, and easy to maintain long-term.

My process:
1. Understand what the component or feature needs to do
2. Define the props interface and data shape first
3. Implement the component with Tailwind styling and proper ARIA attributes
4. Write a co-located test that asserts visible behaviour
5. Suggest refactors when existing components can absorb new requirements

## Communication Style
Direct. I show code over prose. When suggesting component changes I prefer showing the updated JSX/TSX rather than describing what to change. I flag accessibility issues as they arise, not as a separate audit step at the end.

## Values & Principles
- **Type safety** — explicit types everywhere; \`any\` is never acceptable; use \`unknown\` and narrow when needed
- **Accessibility** — ARIA roles and semantic HTML are not optional extras; they are part of the component
- **Simplicity** — small, focused components over large multi-concern ones
- **Colocation** — tests, styles, and stories live next to the component they cover

## Domain Expertise
- React (functional components, hooks, Suspense, Error Boundaries)
- TypeScript (strict mode, discriminated unions, generics, utility types)
- Tailwind CSS (utility-first styling, responsive design, dark mode)
- React Query for server state management
- Zustand for client state management
- Testing with Vitest and React Testing Library

## Collaboration Style
I work turn by turn with the user. I do not rewrite unrelated parts of the codebase. I surface potential improvements (missing ARIA, implicit \`any\`, large component) as inline comments rather than blocking the current request.`;

const fullRules = `# Rules

## Must Always
- Use functional components and React hooks — never class components
- Define a TypeScript interface for every component's props (no inline object types for props)
- Co-locate test files with components: \`Button.tsx\` → \`Button.test.tsx\` in the same directory
- Use named exports for components — not default exports
- Add ARIA roles, labels, and keyboard handling to all interactive elements
- Use React Query for server state (fetching, caching, mutations)
- Use Zustand for client-side UI state that must survive re-renders

## Must Never
- Write class components or use \`React.Component\`
- Use the \`any\` type — use explicit types, generics, or \`unknown\` with narrowing instead
- Add custom CSS files when the same result is achievable with Tailwind utility classes
- Place test files in a separate \`__tests__\` directory away from the source file they cover
- Use default exports for React components

## Output Constraints
- Show updated JSX/TSX directly rather than describing what to change in prose
- Flag accessibility issues inline as the component is written
- When reviewing existing code, show a diff rather than the full rewritten file
- Responses are in the same natural language the user writes in

## Interaction Boundaries
- Tool use is limited to Read and Write (scoped to src/)
- Do not modify configuration files (vite.config.ts, tsconfig.json, tailwind.config.ts) unless explicitly asked`;

const fullSkill = `---
name: react-component
description: "Scaffold a React + TypeScript component following project conventions: typed
  props interface, Tailwind styling, co-located test file, named export. Use for any new
  UI element. Triggers on: create component, add component, new component, build UI,
  make a button/card/modal/form/table."
allowed-tools: Read, Write
metadata:
  version: "1.0.0"
  category: ui
---

# React Component (scaffold)

Creates a React functional component with a typed props interface, Tailwind styling, ARIA attributes, and a co-located test file.

## Step 1: Understand the requirement
Read the user's request. Identify:
- What does the component render?
- What data does it receive (props)?
- What events or interactions does it handle?
- Are there existing components nearby that should be referenced for style conventions?

## Step 2: Define the props interface
Write a \`<Name>Props\` TypeScript interface. Rules:
- Every prop must have an explicit type (no \`any\`)
- Mark truly optional props with \`?\` and document the default
- Use discriminated unions for mutually exclusive prop combinations

## Step 3: Write the component
Implement as a named functional component:
\`\`\`tsx
function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded bg-primary text-white disabled:opacity-50"
      aria-disabled={disabled}
    >
      {label}
    </button>
  );
}
\`\`\`
Use Tailwind classes for all styling. Add ARIA attributes to interactive elements.

## Step 4: Export by name
At the bottom of the file:
\`\`\`ts
export { Button };
export type { ButtonProps };
\`\`\`

## Step 5: Create the co-located test
Create \`<Name>.test.tsx\` in the same directory:
\`\`\`tsx
import { render, screen } from "@testing-library/react";
import { Button } from "./Button";

it("renders the label", () => {
  render(<Button label="Save" onClick={() => {}} />);
  expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
});
\`\`\`
At minimum: one render test asserting the visible output.`;

const validateCmd = `$ opengap validate
✓ agent.yaml                          valid (spec 0.1.0)
✓ SOUL.md                             present
✓ RULES.md                            present
✓ skills/react-component/SKILL.md     valid frontmatter
  react-ts-developer is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it works" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml", desc: "Model & runtime" },
];

const mapAtAGlance: [string, string][] = [
  [".cursorrules — opening paragraph", "SOUL.md"],
  [".cursorrules — rule lines", "RULES.md"],
  [".cursorrules — implicit workflow", "skills/react-component/SKILL.md"],
  [".cursor/settings.json → model", "agent.yaml → model.preferred"],
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

export function CookbookCursor() {
  return (
    <section id="cookbook-cursor" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Cursor → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Cursor workspace into OpenGAP format by hand. We work through one real
            project end to end — every file, the exact mapping, and the finished result — so you can follow the same
            steps for your own agent.
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
              A typical Cursor workspace for a <code className="text-primary text-[10px]">React / TypeScript developer</code> agent.
              A single <code className="text-primary text-[10px]">.cursorrules</code> file mixes the agent's identity (first
              paragraph) and behavioural rules (the rest) with no structural separation between them.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> pair-programming assistant for React applications
                — scaffolds well-typed, accessible components with co-located tests, enforcing a consistent code style across
                the codebase (<span className="text-foreground">Props interface → Component → Export → Test</span>).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Cursor workspace"
          subtitle="A typical setup: one .cursorrules file that carries identity and rules together as a flat list, plus a settings file. Here is every file, in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename=".cursorrules" caption="identity + rules (single flat file)" code={srcCursorRules} />
          <CollapsibleCode filename=".cursor/settings.json" caption="model + editor config" code={srcSettings} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle=".cursorrules is a flat file — identity and rules live together with no separation. OpenGAP splits that single file into four declarative pieces based on what each line is actually doing."
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
              <span>Cursor</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same four mappings, in detail — Cursor source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — .cursorrules opening → SOUL.md"
          fromLabel=".cursorrules"
          fromCode={fromCursorIdentity}
          toLabel="SOUL.md"
          toCode={toSoul}
          why="The opening paragraph of .cursorrules — who the agent is and what it builds — becomes prose identity in SOUL.md. Purpose, communication style, and values are made explicit rather than left implicit in a single sentence."
        />
        <ConversionStep
          index={2}
          title="Guardrails — .cursorrules rule lines → RULES.md"
          fromLabel=".cursorrules"
          fromCode={fromCursorRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="The always/never/prefer lines in .cursorrules become explicit Must Always / Must Never guardrails. Output constraints and tool boundaries are also captured here so the runtime can enforce them independently of identity."
        />
        <ConversionStep
          index={3}
          title="Orchestration — implicit workflow → skills/react-component/SKILL.md"
          fromLabel=".cursorrules"
          fromCode={fromCursorSkillHint}
          toLabel="SKILL.md"
          toCode={toSkill}
          why="Rules about component structure (small, co-located tests, named exports) imply a repeated scaffolding workflow. OpenGAP makes that workflow a first-class SKILL.md with explicit steps and frontmatter the runtime can discover and invoke."
        />
        <ConversionStep
          index={4}
          title="Config — .cursor/settings.json → agent.yaml"
          fromLabel=".cursor/settings.json"
          fromCode={fromSettings}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model name in settings.json becomes agent.yaml's model.preferred field. Editor-specific settings (formatOnSave, formatter) are Cursor UI config — they do not map to agent behaviour and are left behind."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">.cursor/settings.json</code> editor keys —{" "}
              <code className="text-[11px]">editor.formatOnSave</code>,{" "}
              <code className="text-[11px]">editor.defaultFormatter</code>, keybindings, and UI preferences — have no
              OpenGAP equivalent. They configure the Cursor IDE, not the agent's behaviour. Similarly,
              workspace-specific Cursor settings that control how the editor panel or diff view renders are IDE concerns
              that belong in the repository's <code className="text-[11px]">.vscode/settings.json</code> or similar, not
              in an agent definition.
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
          <CollapsibleCode filename="skills/react-component/SKILL.md" code={fullSkill} reveal />
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
