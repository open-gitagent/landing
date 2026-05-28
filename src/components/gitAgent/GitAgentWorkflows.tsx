import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Clock, Users, ListOrdered, MessageSquare } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const basicWorkflow = `# workflows/cleanup.md
---
name: cleanup
description: Clean up temporary files
---

# Cleanup Workflow
Remove temp files and rebuild.`;

const skillFlowYaml = `# workflows/data-pipeline.yaml
name: data-pipeline
description: Process data through validation, transformation, and storage
steps:
  - skill: validate-input
    prompt: "Validate the CSV data format"

  - skill: __approval_gate__
    prompt: "Data validation complete. Approve to continue?"
    channel: telegram

  - skill: transform-data
    prompt: "Transform to required schema"

  - skill: save-to-database
    prompt: "Store results"`;

const skillFlowFeatures = [
  {
    icon: ListOrdered,
    title: "Deterministic Execution",
    desc: "Skills run in declared order, not LLM discretion",
  },
  {
    icon: ShieldCheck,
    title: "Approval Gates",
    desc: "Pause and require human approval via Telegram/WhatsApp",
  },
  {
    icon: ArrowRight,
    title: "Multi-step",
    desc: "Chain multiple skills into a single automated pipeline",
  },
  {
    icon: MessageSquare,
    title: "Prompt Override",
    desc: "Add per-step instructions with the prompt: field",
  },
];

export function GitAgentWorkflows() {
  return (
    <section id="workflows" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Workflows
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            Two workflow formats — human-readable Markdown procedures and executable YAML
            SkillFlows with built-in approval gates.
          </p>
        </motion.div>

        {/* A + B. Basic Workflow + SkillFlow — side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
          {/* A. Basic Workflow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.0 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
              Basic Workflow
            </p>
            <CodeBlock code={basicWorkflow} filename="workflows/cleanup.md" />
            <p className="text-[10px] text-muted-foreground/70 font-body italic mt-2">
              Reference workflow (.md) — human-readable procedure, agent follows as instructions
            </p>
          </motion.div>

          {/* B. SkillFlow */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
              SkillFlow (executable YAML)
            </p>
            <CodeBlock code={skillFlowYaml} filename="workflows/data-pipeline.yaml" />
            <p className="text-[10px] text-muted-foreground/70 font-body italic mt-2">
              SkillFlow (.yaml) — deterministic, multi-step, executable pipeline
            </p>
          </motion.div>
        </div>

        {/* C. Approval Gates */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="paper-card p-4 mb-10 border-primary/25"
          style={{ boxShadow: "2px 3px 0px hsl(var(--primary) / 0.15)" }}
        >
          <div className="flex items-start gap-3 relative z-10">
            <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-foreground font-body mb-2">
                Approval Gates
              </p>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Steps with{" "}
                <code className="text-primary font-body text-[11px]">skill: __approval_gate__</code>
                {" "}pause execution and send an approval request via the specified channel (
                <code className="text-primary font-body text-[11px]">telegram</code> or{" "}
                <code className="text-primary font-body text-[11px]">whatsapp</code>). The user has 5
                minutes to approve or the step times out. Useful for data-modifying operations,
                deployments, or any critical path requiring human sign-off.{" "}
                <span className="text-muted-foreground/60">Note: if neither Telegram nor WhatsApp is configured, the gate auto-approves and execution continues.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* D. SkillFlow Features */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            SkillFlow Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {skillFlowFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="relative z-10">
                    <Icon className="w-3.5 h-3.5 text-primary mb-2" />
                    <p className="text-xs font-semibold text-foreground font-body mb-1">
                      {feat.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
