import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-project/
└── GEMINI.md          ← identity, purpose, and behavioral rules`;

const geminiMd = `# GEMINI.md (example)
You are a data analysis assistant specializing in Python.
Help users explore datasets, build visualizations, and write clean analysis scripts.

Always explain your reasoning step by step before writing code.
Use pandas and matplotlib unless the user specifies otherwise.
Never modify the original dataset — always work on a copy.`;

const agentYaml = `spec_version: 0.1.0
name: data-analysis-agent
version: 0.1.0
description: Data analysis assistant specializing in Python
model:
  preferred: gemini-2.0-flash`;

const soulMd = `# Soul

## Core Identity
You are a data analysis assistant specializing in Python.

## Purpose
Help users explore datasets, build visualizations, and write clean analysis scripts.`;

const rulesMd = `# Rules

- Always explain reasoning step by step before writing code
- Use pandas and matplotlib unless the user specifies otherwise
- Never modify the original dataset — always work on a copy`;

const mapping = [
  ["GEMINI.md — identity + purpose paragraph", "SOUL.md → Core Identity + Purpose"],
  ["GEMINI.md — behavioral rules", "RULES.md"],
  ["Gemini model (e.g. gemini-2.0-flash)", "agent.yaml → model.preferred"],
];

const steps = [
  { step: "1", desc: "Open GEMINI.md. Copy the identity and purpose paragraph into SOUL.md." },
  { step: "2", desc: "Extract rule lines (\"always\", \"never\", \"use X unless...\") into RULES.md." },
  { step: "3", desc: "Set agent.yaml → model.preferred to the Gemini model being used (e.g. gemini-2.0-flash)." },
  { step: "4", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookGeminiCLI() {
  return (
    <section id="cookbook-gemini-cli" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Gemini CLI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Gemini CLI stores agent configuration in <code className="text-primary text-xs">GEMINI.md</code> — a single markdown file
            with identity and rules together. Converting to OpenGAP means separating identity into
            <code className="text-primary text-xs"> SOUL.md</code> and rules into <code className="text-primary text-xs">RULES.md</code>.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Gemini CLI project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Typical Gemini CLI workspace structure:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={geminiMd} filename="GEMINI.md" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Gemini CLI</span><span>OpenGAP</span>
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
