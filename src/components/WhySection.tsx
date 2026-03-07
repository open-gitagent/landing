import { motion } from "framer-motion";
import { GitBranch, Blocks, ShieldCheck, Puzzle } from "lucide-react";
import { type LucideIcon } from "lucide-react";

const features: { label: string; desc: string; icon: LucideIcon }[] = [
  {
    label: "Git-Native",
    desc: "Version control, branching, diffing, and collaboration built in. Your agent definition is just files in a repo.",
    icon: GitBranch,
  },
  {
    label: "Framework-Agnostic",
    desc: "Works with Claude Code, OpenAI, CrewAI, LangChain, and more. Define once, export anywhere.",
    icon: Blocks,
  },
  {
    label: "Compliance-Ready",
    desc: "First-class FINRA, SEC, and Federal Reserve support. Audit logging, supervision, and model risk management.",
    icon: ShieldCheck,
  },
  {
    label: "Composable",
    desc: "Skills, tools, sub-agents, and workflows. Agents can extend, depend on, and delegate to each other.",
    icon: Puzzle,
  },
];

export function WhySection() {
  return (
    <section id="why" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Why GitAgent: The Git-Native AI Agent Standard</h2>
          <p className="text-sm text-muted-foreground max-w-lg font-body">
            Everything your agent needs, defined in files you already know how to manage.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="paper-card p-6 group"
            >
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <f.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-heading font-semibold text-foreground">{f.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-body relative z-10">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
