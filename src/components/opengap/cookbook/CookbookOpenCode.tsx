import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-project/
└── .opencode/
    └── config.json    ← model, system prompt, and tool config`;

const configJson = `// .opencode/config.json (example)
{
  "model": "gpt-4o",
  "system": "You are a full-stack developer assistant. Help users build production-ready applications. Always consider security and performance. Prefer simple, readable solutions over clever ones.",
  "tools": {
    "bash": { "enabled": true },
    "read": { "enabled": true },
    "write": { "enabled": true }
  }
}`;

const agentYaml = `spec_version: 0.1.0
name: fullstack-dev-agent
version: 0.1.0
description: Full-stack developer assistant for production-ready applications
model:
  preferred: gpt-4o`;

const soulMd = `# Soul

## Core Identity
You are a full-stack developer assistant.

## Purpose
Help users build production-ready applications.`;

const rulesMd = `# Rules

- Always consider security and performance
- Prefer simple, readable solutions over clever ones`;

const mapping = [
  [".opencode/config.json → system", "SOUL.md + RULES.md"],
  [".opencode/config.json → model", "agent.yaml → model.preferred"],
  [".opencode/config.json → tools", "agent.yaml → tools[] (built-in tools stay in runtime)"],
];

const steps = [
  { step: "1", desc: "Open .opencode/config.json. Read the system field — it contains both identity and rules mixed together." },
  { step: "2", desc: "Split the system prompt: who the agent is and what it does → SOUL.md. Behavioral constraints → RULES.md." },
  { step: "3", desc: "Copy the model value from config.json → agent.yaml → model.preferred." },
  { step: "4", desc: "Built-in tools (bash, read, write) are runtime capabilities — they don't need tool YAML files." },
  { step: "5", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookOpenCode() {
  return (
    <section id="cookbook-opencode" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenCode → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            OpenCode stores agent configuration in <code className="text-primary text-xs">.opencode/config.json</code> — model, system prompt,
            and tool toggles in a single JSON file. Converting to OpenGAP means extracting the system prompt
            into <code className="text-primary text-xs">SOUL.md</code> and <code className="text-primary text-xs">RULES.md</code>, and
            the model into <code className="text-primary text-xs">agent.yaml</code>.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The OpenCode project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Typical OpenCode workspace structure:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={configJson} filename=".opencode/config.json" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>OpenCode</span><span>OpenGAP</span>
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
