import { motion } from "framer-motion";
import { Mic, Monitor, Cpu, Brain, Zap, Puzzle, GitBranch, ShieldCheck, Activity } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Compliance & Audit",
    desc: "Built-in risk tiers, human-in-the-loop enforcement, and regulatory support for SOX, GLBA, SOC2, and GDPR. Your compliance team reviews the config like any code PR — no black-box policies.",
  },
  {
    icon: GitBranch,
    title: "SkillFlows",
    desc: "Chain tasks into reliable, repeatable workflows in plain YAML. Approval gates pause execution and wait for sign-off via Telegram or WhatsApp — so humans stay in control of critical steps.",
  },
  {
    icon: Brain,
    title: "Git-Native Memory",
    desc: "The agent remembers context across sessions — and every memory write is a git commit you can audit, diff, or revert. No opaque data stores, no vendor lock-in on your agent's history.",
  },
  {
    icon: Zap,
    title: "Skills & Auto-Learning",
    desc: "Completed tasks are crystallized into reusable skills automatically. The agent builds its own capability library over time — every skill is version-controlled and inspectable.",
  },
  {
    icon: Mic,
    title: "Voice & Camera",
    desc: "Real-time bidirectional voice via OpenAI Realtime API or Gemini Live. Camera input lets your agent see what you see — meet your team on voice, not just text.",
  },
  {
    icon: Cpu,
    title: "12+ LLM Providers",
    desc: "Switch between Anthropic, OpenAI, Google, Groq, Mistral, and more by changing one line. Prevents model vendor lock-in — your agent definition stays yours regardless of who runs the models.",
  },
  {
    icon: Monitor,
    title: "Web UI",
    desc: "Full browser interface at localhost:3333 with tabs for Chat, Skills, Integrations, Communication, SkillFlows, Scheduler, and Settings. No CLI required for day-to-day use.",
  },
  {
    icon: Puzzle,
    title: "Plugin System",
    desc: "Extend with tools, hooks, skills, and memory layers via plugin.yaml. Install from git URLs or local paths — composable by design, auditable by default.",
  },
  {
    icon: Activity,
    title: "OpenTelemetry",
    desc: "Built-in observability — spans, tool execution traces, and session cost in USD. Point it at your existing OTEL collector and it works; leave it unset for zero overhead.",
  },
];

export function GitAgentFeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            05 — Features
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Features
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Production-ready out of the box — auditable for compliance, composable for engineering.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="paper-card p-4 sm:p-5 group"
            >
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <f.icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm font-heading font-semibold text-foreground">{f.title}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-body relative z-10">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
