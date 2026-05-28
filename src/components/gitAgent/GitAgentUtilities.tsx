import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const compactionCode = `import {
  estimateTokens,
  estimateMessageTokens,
  needsCompaction,
  truncateToolResults,
  buildCompactPrompt
} from "@open-gitagent/gitagent";

// Estimate tokens in a string
const tokens = estimateTokens("Hello world");  // ~3

// Check if compaction needed (triggers at 75% of context window)
// tokenEstimate is also returned and useful for logging
const { needed, ratio, tokenEstimate } = needsCompaction(messages, 200000);
if (needed) console.log(\`Context at \${(ratio * 100).toFixed(0)}% — compaction needed\`);

// Truncate oversized tool results (keeps first + last half)
const trimmed = truncateToolResults(messages, 10000);

// Build a summarization prompt for the LLM
const prompt = buildCompactPrompt(messages);`;

const costTrackingCode = `import { query } from "@open-gitagent/gitagent";

const result = query({ prompt: "...", dir: "..." });

for await (const msg of result) { /* ... */ }

const costs = result.costs();
// {
//   startTime: 1716825600000,
//   totalCostUsd: 0.05,
//   totalInputTokens: 5000,
//   totalOutputTokens: 2000,
//   totalRequests: 3,
//   modelUsage: {
//     "anthropic:claude-sonnet-4-6": {
//       inputTokens: 5000,
//       outputTokens: 2000,
//       cacheReadTokens: 0,
//       cacheWriteTokens: 0,
//       totalTokens: 7000,
//       requests: 3,
//       costUsd: 0.05
//     }
//   }
// }
console.log(\`Session cost: $\${costs.totalCostUsd.toFixed(4)}\`);`;

const compactionUtils = [
  { name: "estimateTokens", desc: "Fast approximation: chars/4" },
  { name: "needsCompaction", desc: "Triggers at 75% of model context window" },
  { name: "truncateToolResults", desc: "Keeps first and last half of large results" },
  { name: "buildCompactPrompt", desc: "Generates a prompt asking the LLM to summarize the conversation" },
];

const otelEnvVars = [
  { key: "OTEL_EXPORTER_OTLP_ENDPOINT", desc: "OTLP/HTTP collector URL (e.g. http://localhost:4318). When set, telemetry is auto-enabled.", default: "unset = off" },
  { key: "GITAGENT_OTEL_ENABLED", desc: "Set to false to force-disable telemetry even when endpoint is set.", default: "auto" },
  { key: "OTEL_SERVICE_NAME", desc: "service.name resource attribute.", default: "gitagent" },
  { key: "OTEL_SERVICE_VERSION", desc: "service.version resource attribute.", default: "unset" },
  { key: "OTEL_EXPORTER_OTLP_HEADERS", desc: "Comma-separated key=value pairs, no quotes (e.g. Authorization=Bearer xyz,x-tenant=abc).", default: "unset" },
  { key: "OTEL_TRACES_EXPORTER", desc: "Set to console to print spans to stdout — no collector needed.", default: "unset" },
];

const otelSpans = [
  { name: "gitagent.agent.session", kind: "INTERNAL", attrs: "gitagent.entry, gitagent.cost_usd, gitagent.session.duration_ms" },
  { name: "gitagent.tool.execute", kind: "INTERNAL", attrs: "tool.name, tool.call_id, tool.status, tool.error_message" },
  { name: "gen_ai.chat", kind: "CLIENT", attrs: "gen_ai.system, gen_ai.request.model, gen_ai.usage.input_tokens, gen_ai.usage.output_tokens, gitagent.cost_usd" },
  { name: "HTTP …", kind: "CLIENT", attrs: "URL, status code, duration (auto via instrumentation-undici)" },
];

const otelMetrics = [
  { name: "gitagent.tool.calls", type: "counter", desc: "Tool executions, labelled by tool.name" },
  { name: "gitagent.tool.duration_ms", type: "histogram", desc: "Tool execution duration" },
  { name: "gitagent.session.duration_ms", type: "histogram", desc: "Session duration" },
  { name: "gitagent.session.cost_usd", type: "counter", desc: "Cumulative session cost in USD" },
  { name: "gen_ai.client.token.usage", type: "counter", desc: "Token usage by model and token type" },
  { name: "gen_ai.client.operation.duration", type: "histogram", desc: "LLM call duration" },
];

const jaegerSnippet = `docker run -d --name jaeger \\
  -p 16686:16686 -p 4318:4318 \\
  jaegertracing/all-in-one:latest

OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318 gitagent
# Open http://localhost:16686`;

export function GitAgentUtilities() {
  return (
    <section id="utilities" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Utilities</h2>
          <p className="text-sm text-muted-foreground font-body">
            Context compaction helpers and cost tracking for programmatic use.
          </p>
        </motion.div>

        {/* A. Context Compaction */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Context Compaction
          </h3>
          <CodeBlock code={compactionCode} filename="compaction.ts" className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {compactionUtils.map((u, i) => (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-3 hover:border-primary/40 transition-colors"
              >
                <code className="text-[11px] text-primary font-body font-semibold block mb-1.5 relative z-10">
                  {u.name}
                </code>
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed relative z-10">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* B. Cost Tracking */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Cost Tracking
          </h3>
          <CodeBlock code={costTrackingCode} filename="cost-tracking.ts" />
        </motion.div>
      </div>
    </section>
  );
}

export function GitAgentTelemetry() {
  return (
    <section id="telemetry" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground font-heading">OpenTelemetry</h2>
          </div>
          <p className="text-sm text-muted-foreground font-body">
            Set <code className="text-primary text-xs">OTEL_EXPORTER_OTLP_ENDPOINT</code> and telemetry is on. Leave unset for zero overhead.
          </p>
        </motion.div>

        <div className="space-y-10">
          {/* Env vars */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Environment Variables
            </h3>
            <div className="space-y-1.5">
              {otelEnvVars.map((v, i) => (
                <motion.div
                  key={v.key}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-56 leading-relaxed">
                      {v.key}
                    </code>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{v.desc}</p>
                      <p className="text-[10px] text-muted-foreground/50 font-body mt-0.5">default: {v.default}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Spans */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
                Spans Emitted
              </h3>
              <div className="space-y-1.5">
                {otelSpans.map((s, i) => (
                  <motion.div
                    key={s.name}
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="paper-card p-3"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-[11px] text-primary font-body font-semibold">{s.name}</code>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-body">{s.kind}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-body leading-relaxed">{s.attrs}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Metrics */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
            >
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
                Metrics Emitted
              </h3>
              <div className="space-y-1.5">
                {otelMetrics.map((m, i) => (
                  <motion.div
                    key={m.name}
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="paper-card p-3"
                  >
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-[11px] text-primary font-body font-semibold">{m.name}</code>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body">{m.type}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground/70 font-body">{m.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Jaeger quickstart */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Jaeger Quickstart
            </h3>
            <CodeBlock code={jaegerSnippet} filename="terminal" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
