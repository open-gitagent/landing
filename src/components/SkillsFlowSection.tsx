import { motion } from "framer-motion";
import { GitFork, Zap, MessageSquare, Wrench, ArrowDown } from "lucide-react";

const features = [
  {
    icon: GitFork,
    title: "Deterministic Execution",
    desc: "Skills run in declared order, not LLM discretion. Every run follows the same path.",
  },
  {
    icon: Zap,
    title: "Data Flow via Templates",
    desc: "Chain outputs to inputs with ${{ steps.X.outputs.Y }} template syntax.",
  },
  {
    icon: MessageSquare,
    title: "Per-Step Prompting",
    desc: "Add extra context per step with the prompt: field — guide the agent without changing the skill.",
  },
  {
    icon: Wrench,
    title: "Mixed Step Types",
    desc: "Combine skill:, agent:, and tool: steps in a single flow for maximum flexibility.",
  },
];

const pipelineSteps = [
  { id: "lint", type: "skill" },
  { id: "review", type: "agent" },
  { id: "test", type: "tool" },
  { id: "report", type: "skill" },
];

const yamlCode = `name: code-review-flow
description: Full code review pipeline
triggers:
  - pull_request

steps:
  lint:
    skill: static-analysis
    inputs:
      path: $\{{ trigger.changed_files }}

  review:
    agent: code-reviewer
    depends_on: [lint]
    prompt: |
      Focus on security and performance.
      Flag any use of eval() or raw SQL.
    inputs:
      findings: $\{{ steps.lint.outputs.issues }}

  test:
    tool: bash
    depends_on: [lint]
    inputs:
      command: "npm test -- --coverage"

  report:
    skill: review-summary
    depends_on: [review, test]
    conditions:
      - $\{{ steps.review.outputs.severity != 'none' }}
    inputs:
      review: $\{{ steps.review.outputs.comments }}
      coverage: $\{{ steps.test.outputs.report }}

error_handling:
  on_failure: notify
  channel: "#eng-reviews"`;

export function SkillsFlowSection() {
  return (
    <section id="skillsflow" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">SkillsFlow</h2>
          <p className="text-sm text-muted-foreground font-body">
            Deterministic, multi-step workflows that chain skills together via YAML in{" "}
            <code className="text-primary/80">workflows/</code>.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left — YAML code block */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="code-block sketch-border">
              <div className="terminal-header">
                <span className="terminal-dot bg-red-400/60" />
                <span className="terminal-dot bg-yellow-400/60" />
                <span className="terminal-dot bg-green-400/60" />
                <span className="ml-2 text-[10px] text-muted-foreground/50 font-body">workflow</span>
              </div>
              <pre className="text-xs text-muted-foreground leading-5 font-body">
                <code>{yamlCode}</code>
              </pre>
            </div>
          </motion.div>

          {/* Right — feature cards + pipeline */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">Key Concepts</h3>
            <div className="space-y-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1 relative z-10">
                    <f.icon className="w-3 h-3 text-primary" />
                    <span className="text-xs font-heading font-semibold text-foreground">{f.title}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body relative z-10">{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-6 mb-4 font-body">Execution Pipeline</h3>
            <div className="flex flex-col items-start gap-0 pl-2">
              {pipelineSteps.map((s, i) => (
                <div key={s.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-center gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <code className="text-xs text-foreground font-body">{s.id}</code>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-body">
                      {s.type}
                    </span>
                  </motion.div>
                  {i < pipelineSteps.length - 1 && (
                    <div className="flex items-center pl-[9px] py-0.5">
                      <ArrowDown className="w-3 h-3 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
