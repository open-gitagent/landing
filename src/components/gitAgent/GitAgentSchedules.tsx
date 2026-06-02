import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const repeatScheduleYaml = `# schedules/daily-standup.yaml (repeat)
id: daily-standup
prompt: "Summarize git commits from the last 24 hours and list open tasks"
cron: "0 9 * * 1-5"
mode: repeat
enabled: true`;

const onceScheduleYaml = `# schedules/quarterly-review.yaml (one-time)
id: quarterly-review
prompt: "Generate Q1 performance report"
mode: once
runAt: "2026-04-01T09:00:00Z"
enabled: true`;

const cronPatterns = [
  { pattern: "0 9 * * 1-5", desc: "Weekdays at 9 AM" },
  { pattern: "0 9 * * 1", desc: "Every Monday at 9 AM" },
  { pattern: "0 9 1 * *", desc: "First of month at 9 AM" },
  { pattern: "0 9 1 */3 *", desc: "Quarterly" },
  { pattern: "*/30 * * * *", desc: "Every 30 minutes" },
  { pattern: "0 0 * * *", desc: "Daily at midnight" },
];

export function GitAgentSchedules() {
  return (
    <section id="schedules" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Schedules</h2>
          <p className="text-sm text-muted-foreground font-body">
            Automate agent runs on a cron schedule or as one-time tasks.
          </p>
        </motion.div>

        {/* A. Modes */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Schedule Modes
          </h3>
          <div className="space-y-1.5">
            {[
              { mode: "repeat", how: "cron expression", when: "Run on a recurring schedule (daily, weekly, etc.)" },
              { mode: "once", how: "runAt ISO datetime", when: "Run exactly one time at a specific date/time" },
            ].map((row) => (
              <div key={row.mode} className="paper-card px-3 py-2 flex items-center gap-3">
                <code className="text-xs font-semibold text-primary font-body w-16 shrink-0 relative z-10">{row.mode}</code>
                <span className="text-[11px] text-muted-foreground/60 font-body w-36 shrink-0 relative z-10">{row.how}</span>
                <span className="text-[11px] text-muted-foreground font-body relative z-10">{row.when}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground/60 font-body mt-2">
            Default is <code className="text-primary text-[10px]">repeat</code> if <code className="text-primary text-[10px]">mode</code> is not specified.
          </p>
        </motion.div>

        {/* B. Schedule definitions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Schedule Definitions
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <CodeBlock code={repeatScheduleYaml} filename="daily-standup.yaml" />
            <CodeBlock code={onceScheduleYaml} filename="quarterly-review.yaml" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* B. Cron Patterns */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Common Cron Patterns
            </h3>
            <div className="space-y-1.5">
              {cronPatterns.map((row, i) => (
                <motion.div
                  key={row.pattern}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 relative z-10">
                    <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-32">
                      {row.pattern}
                    </code>
                    <span className="text-muted-foreground/40 text-[11px] font-body shrink-0">|</span>
                    <span className="text-[11px] text-muted-foreground font-body">{row.desc}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* C. UI Management card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Web UI Management
            </h3>
            <div className="paper-card p-4 hover:border-primary/40 transition-colors">
              <p className="text-sm text-foreground font-body leading-relaxed mb-4 relative z-10">
                The Scheduler tab in the web UI lets you manage schedules without editing YAML files. Schedule files live in <code className="text-primary text-[10px]">schedules/</code> — version-controlled alongside everything else.
              </p>
              <div className="space-y-2 relative z-10">
                {[
                  "Create new schedules with a visual form",
                  "Edit existing schedule prompts and timing",
                  "Enable or disable schedules with a toggle",
                  "Trigger a schedule immediately for testing",
                  "Delete schedules you no longer need",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-primary text-xs mt-0.5 shrink-0">—</span>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
