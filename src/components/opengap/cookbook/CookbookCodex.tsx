import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-project/
└── AGENTS.md          ← identity, rules, and tool declarations`;

const agentsMd = `# AGENTS.md (example)
You are a backend API developer specializing in Node.js and Express.
Help users build production-ready REST APIs with proper validation and error handling.

Always validate inputs using Zod schemas.
Always return consistent JSON error responses.
Never expose stack traces in production error responses.

## Tools
- run_tests: Run the test suite
- lint_code: Lint the codebase with ESLint`;

const agentYaml = `spec_version: 0.1.0
name: backend-api-agent
version: 0.1.0
description: Backend API developer specializing in Node.js and Express
model:
  preferred: gpt-4o
tools:
  - run-tests
  - lint-code`;

const soulMd = `# Soul

## Core Identity
You are a backend API developer specializing in Node.js and Express.

## Purpose
Help users build production-ready REST APIs with proper validation and error handling.`;

const rulesMd = `# Rules

- Always validate inputs using Zod schemas
- Always return consistent JSON error responses
- Never expose stack traces in production error responses`;

const toolRunTests = `name: run-tests
description: Run the test suite for the project.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: tools/run_tests.py
  runtime: python3
  timeout: 60`;

const toolLintCode = `name: lint-code
description: Lint the codebase with ESLint and report issues.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: tools/lint_code.py
  runtime: python3
  timeout: 30`;

const mapping = [
  ["AGENTS.md — identity + purpose paragraph", "SOUL.md → Core Identity + Purpose"],
  ["AGENTS.md — behavioral rules", "RULES.md"],
  ["AGENTS.md → Tools section — each tool name (kebab-case)", "agent.yaml → tools[] + tools/<name>.yaml"],
];

const steps = [
  { step: "1", desc: "Open AGENTS.md. Copy the identity and purpose paragraph into SOUL.md." },
  { step: "2", desc: "Extract rule lines into RULES.md as a bullet list." },
  { step: "3", desc: "For each tool listed under ## Tools, add a kebab-case entry to agent.yaml → tools and create tools/<name>.yaml." },
  { step: "4", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookCodex() {
  return (
    <section id="cookbook-codex" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Codex → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Codex stores agent configuration in <code className="text-primary text-xs">AGENTS.md</code> — identity, rules, and tool declarations in one file.
            Converting to OpenGAP means splitting identity into <code className="text-primary text-xs">SOUL.md</code>, rules into
            <code className="text-primary text-xs"> RULES.md</code>, and each tool into its own <code className="text-primary text-xs">tools/&lt;name&gt;.yaml</code>.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Codex project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Typical Codex workspace structure:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={agentsMd} filename="AGENTS.md" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Codex</span><span>OpenGAP</span>
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
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/run-tests.yaml</code>:</p><CodeBlock code={toolRunTests} filename="tools/run-tests.yaml" /></div>
            <div><p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/lint-code.yaml</code>:</p><CodeBlock code={toolLintCode} filename="tools/lint-code.yaml" /></div>
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
