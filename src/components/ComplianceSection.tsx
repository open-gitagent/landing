import { motion } from "framer-motion";
import { ShieldCheck, AlertTriangle, Lock, Scale } from "lucide-react";

const riskTiers = [
  { tier: "low", label: "Low", desc: "Minimal — standard logging", color: "text-primary", bg: "bg-primary/10" },
  { tier: "standard", label: "Standard", desc: "Audit logging recommended", color: "text-foreground", bg: "bg-accent" },
  { tier: "high", label: "High", desc: "HITL required, audit logging, compliance artifacts", color: "text-primary", bg: "bg-primary/15" },
  { tier: "critical", label: "Critical", desc: "Kill switch, immutable logs, quarterly validation", color: "text-destructive", bg: "bg-destructive/10" },
];

const frameworks = [
  { icon: Scale, name: "FINRA", rules: "Rule 3110, 4511, 2210", checks: "Supervisor assignment, HITL, escalation, retention (6y+), fair/balanced comms" },
  { icon: ShieldCheck, name: "Federal Reserve", rules: "SR 11-7, SR 23-4", checks: "Model inventory, validation cadence, ongoing monitoring, vendor due diligence" },
  { icon: Lock, name: "SEC", rules: "Reg S-P, 17a-4", checks: "Audit logging, PII handling, retention (3y+)" },
  { icon: AlertTriangle, name: "CFPB", rules: "Circular 2022-03", checks: "Bias testing, fair lending analysis" },
];

export function ComplianceSection() {
  return (
    <section id="compliance" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Compliance</h2>
          <p className="text-sm text-muted-foreground font-body">
            First-class regulatory support baked into the manifest. Run{" "}
            <code className="text-primary text-xs">gitagent audit</code> for a full report.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">Risk Tiers</h3>
            <div className="space-y-2">
              {riskTiers.map((t, i) => (
                <motion.div
                  key={t.tier}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 paper-card p-3"
                >
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${t.bg} ${t.color} font-body relative z-10`}>
                    {t.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-body relative z-10">{t.desc}</span>
                </motion.div>
              ))}
            </div>

            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-6 mb-4 font-body">Compliance Artifacts</h3>
            <div className="code-block text-xs text-muted-foreground leading-5 font-body">
              <pre><code>{`compliance/
├── risk-assessment.md
├── regulatory-map.yaml
└── validation-schedule.yaml`}</code></pre>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">Regulatory Frameworks</h3>
            <div className="space-y-3">
              {frameworks.map((f, i) => (
                <motion.div
                  key={f.name}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <f.icon className="w-3.5 h-3.5 text-primary" />
                    <span className="text-sm font-heading font-semibold text-foreground">{f.name}</span>
                    <code className="ml-auto text-[10px] text-muted-foreground/60 font-body">{f.rules}</code>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-body relative z-10">{f.checks}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
