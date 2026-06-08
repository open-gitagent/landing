import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const riskLevels = [
  { level: "low", label: "Low", desc: "Minimal — standard logging", color: "text-green-600", bg: "bg-green-500/10" },
  { level: "medium", label: "Medium", desc: "Audit logging recommended", color: "text-yellow-600", bg: "bg-yellow-500/10" },
  {
    level: "high",
    label: "High",
    desc: "HITL required, audit logging, compliance artifacts",
    color: "text-orange-600",
    bg: "bg-orange-500/10",
  },
  {
    level: "critical",
    label: "Critical",
    desc: "Kill switch required, immutable logs, quarterly validation — prints a compliance error at startup if audit_logging missing (execution still continues)",
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
];

const complianceYaml = `compliance:
  risk_level: critical          # low | medium | high | critical
  human_in_the_loop: true
  data_classification: "PCI-DSS"
  regulatory_frameworks: [SOX, GLBA, OCC]
  recordkeeping:
    audit_logging: true
    retention_days: 2555        # 7 years for banking
  review:
    required_approvers: 2
    auto_review: false`;

const validationRules = [
  {
    rule: "high_risk_hitl",
    condition: "High/critical risk without human_in_the_loop",
    severity: "warning",
  },
  {
    rule: "critical_audit",
    condition: "Critical risk without audit_logging",
    severity: "error",
  },
  {
    rule: "regulatory_recordkeeping",
    condition: "Regulatory frameworks without recordkeeping",
    severity: "warning",
  },
  {
    rule: "high_risk_review",
    condition: "High/critical risk without review config",
    severity: "warning",
  },
  {
    rule: "audit_retention",
    condition: "Audit logging without retention_days",
    severity: "warning",
  },
];

const auditLogJson = `{"timestamp":"2026-01-15T14:23:45Z","session_id":"uuid","event":"session_start"}
{"timestamp":"2026-01-15T14:23:46Z","session_id":"uuid","event":"tool_use","tool":"cli","args":{"command":"ls"}}
{"timestamp":"2026-01-15T14:23:47Z","session_id":"uuid","event":"tool_result","tool":"cli","result":"file.txt"}
{"timestamp":"2026-01-15T14:23:48Z","session_id":"uuid","event":"response"}
{"timestamp":"2026-01-15T14:23:49Z","session_id":"uuid","event":"session_end"}`;

export function GitAgentCompliance() {
  return (
    <section id="compliance" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Compliance</h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            If your agent handles sensitive data — financial records, PII, regulated workflows — GitAgent can enforce audit logging, human-in-the-loop approval, and regulatory recordkeeping automatically.
          </p>
          <p className="text-sm text-muted-foreground font-body">
            Set <code className="text-primary text-xs">risk_level</code> in <code className="text-primary text-xs">agent.yaml</code> and GitAgent validates your config at startup. Missing a required setting? It prints a warning before the agent runs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* A. Risk Levels */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Risk Levels
            </h3>
            <div className="space-y-2">
              {riskLevels.map((r, i) => (
                <motion.div
                  key={r.level}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded font-body shrink-0 ${r.bg} ${r.color}`}>
                      {r.label}
                    </span>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{r.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* B. Compliance config */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Compliance Config (agent.yaml)
            </h3>
            <CodeBlock code={complianceYaml} filename="agent.yaml" />
          </motion.div>
        </div>

        {/* C. Validation Rules */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1 font-body">
            What gets validated at startup
          </h3>
          <p className="text-[11px] text-muted-foreground font-body mb-4">GitAgent checks your compliance config when the agent loads and warns you about gaps before any session starts.</p>
          <div className="overflow-x-auto">
            <div className="space-y-1.5">
              {validationRules.map((r, i) => (
                <motion.div
                  key={r.rule}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-44">
                      {r.rule}
                    </code>
                    <span className="text-[11px] text-muted-foreground font-body flex-1">{r.condition}</span>
                    <span
                      className={`text-[10px] font-semibold font-body px-2 py-0.5 rounded shrink-0 ${
                        r.severity === "error"
                          ? "text-destructive bg-destructive/10"
                          : "text-yellow-600 bg-yellow-500/10"
                      }`}
                    >
                      {r.severity}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* D. Regulatory Frameworks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Supported Regulatory Frameworks
          </h3>
          <div className="space-y-1.5">
            {[
              { name: "SOX", desc: "Sarbanes-Oxley financial recordkeeping" },
              { name: "GLBA", desc: "Gramm-Leach-Bliley Act financial privacy" },
              { name: "OCC", desc: "Office of the Comptroller of the Currency" },
              { name: "GDPR", desc: "General Data Protection Regulation" },
              { name: "SOC2", desc: "Service Organization Control 2" },
              { name: "FINRA", desc: "Financial Industry Regulatory Authority" },
            ].map((f, i) => (
              <motion.div
                key={f.name}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card px-3 py-2 flex items-center gap-3"
              >
                <code className="text-xs font-semibold text-primary font-body w-16 shrink-0 relative z-10">{f.name}</code>
                <span className="text-[11px] text-muted-foreground font-body relative z-10">{f.desc}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* E. Audit Log format */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Audit Log Format
          </h3>
          <CodeBlock code={auditLogJson} filename=".gitagent/audit.jsonl" className="mb-3" />
          <p className="text-[11px] text-muted-foreground font-body">
            Logged to{" "}
            <code className="text-primary text-[10px]">.gitagent/audit.jsonl</code> when{" "}
            <code className="text-primary text-[10px]">audit_logging: true</code>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
