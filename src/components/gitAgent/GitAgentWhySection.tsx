import { motion } from "framer-motion";
import { GitBranch, Brain, ExternalLink, ShieldCheck } from "lucide-react";

const pillars = [
  {
    icon: GitBranch,
    label: "Full Auditability",
    desc: "Every agent decision, memory write, and rule change is a git commit. Know exactly what your agent did, when, and why — full audit trail out of the box, no extra tooling needed.",
  },
  {
    icon: ShieldCheck,
    label: "Compliance & Control",
    desc: "Human-in-the-loop enforcement, risk tiers, and regulatory support (SOX, GLBA, GDPR, FINRA) baked into the agent manifest. Your compliance team can review the config like any code PR.",
  },
  {
    icon: Brain,
    label: "Always Learning",
    desc: "The agent continuously improves from completed tasks, building a library of reusable skills over time. Every learned skill is inspectable, versioned, and reversible — no black-box retraining.",
  },
  {
    icon: ExternalLink,
    label: "No Vendor Lock-in",
    desc: "Built on the OpenGAP open standard. Switch between Claude, OpenAI, Gemini, or any provider by changing one line. Your agent definition lives in git — not a vendor's cloud.",
    link: "/opengap",
    linkLabel: "About OpenGAP →",
  },
];

export function GitAgentWhySection() {
  return (
    <section id="why-gitagent" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            01 — Why GitAgent
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Why GitAgent
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 }}
          className="paper-card p-5 mb-10 border-primary/20"
        >
          <p className="text-sm text-foreground/80 font-body leading-relaxed relative z-10">
            Most agent frameworks scatter configuration across your application and lock your agent inside a framework.{" "}
            <span className="text-foreground font-semibold">GitAgent flips this — your agent IS the git repo.</span>
          </p>
          <p className="text-xs text-muted-foreground font-body leading-relaxed mt-2 relative z-10">
            Identity, memory, rules, tools, and skills are plain files you already know how to manage. Fork it, branch it, diff it, roll it back — everything a developer already does with code, now applied to agents.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {pillars.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="paper-card p-5 group"
            >
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <p.icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-heading font-semibold text-foreground">{p.label}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed font-body relative z-10">
                {p.desc}
              </p>
              {p.link && (
                <a
                  href={p.link}
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-body mt-3 relative z-10"
                >
                  {p.linkLabel}
                </a>
              )}
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
