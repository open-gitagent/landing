import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-project/
├── .cursorrules       ← identity and behavioral rules
└── .cursor/
    └── settings.json  ← model config`;

const cursorRules = `# .cursorrules (example)
You are an expert React and TypeScript developer.
Always use functional components and hooks.
Prefer Tailwind CSS over custom CSS files.
Never use class components.
Always add PropTypes or TypeScript interfaces for props.
Keep components small and focused on a single responsibility.`;

const agentYaml = `spec_version: 0.1.0
name: react-typescript-agent
version: 0.1.0
description: Expert React and TypeScript developer assistant
model:
  preferred: claude-sonnet-4-6`;

const soulMd = `# Soul

## Core Identity
You are an expert React and TypeScript developer.`;

const rulesMd = `# Rules

- Always use functional components and hooks
- Prefer Tailwind CSS over custom CSS files
- Never use class components
- Always add TypeScript interfaces for props
- Keep components small and focused on a single responsibility`;

const mapping = [
  [".cursorrules — identity line", "SOUL.md → Core Identity"],
  [".cursorrules — behavioral rules", "RULES.md"],
  [".cursor/settings.json → model", "agent.yaml → model.preferred"],
];

const steps = [
  { step: "1", desc: "Open .cursorrules. The first line is usually the identity — copy it into SOUL.md under Core Identity." },
  { step: "2", desc: "Extract all rule lines (\"always\", \"never\", \"prefer\") into RULES.md as a bullet list." },
  { step: "3", desc: "Check .cursor/settings.json for a model setting. Write it to agent.yaml → model.preferred." },
  { step: "4", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookCursor() {
  return (
    <section id="cookbook-cursor" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Cursor → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Cursor stores agent behavior in <code className="text-primary text-xs">.cursorrules</code> — a flat file mixing identity and rules.
            Converting to OpenGAP means splitting it into <code className="text-primary text-xs">SOUL.md</code> (who the agent is)
            and <code className="text-primary text-xs">RULES.md</code> (how it behaves).
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Cursor project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Typical Cursor workspace structure:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={cursorRules} filename=".cursorrules" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Cursor</span><span>OpenGAP</span>
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
