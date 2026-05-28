import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const hookEvents = [
  {
    event: "on_session_start",
    when: "Before agent runs",
    canBlock: true,
    canModify: false,
  },
  {
    event: "pre_tool_use",
    when: "Before each tool call",
    canBlock: true,
    canModify: true,
  },
  {
    event: "post_tool_failure",
    when: "After a tool errors",
    canBlock: false,
    canModify: false,
  },
  {
    event: "pre_query",
    when: "Before LLM call",
    canBlock: true,
    canModify: false,
  },
  {
    event: "post_response",
    when: "After LLM responds",
    canBlock: false,
    canModify: false,
  },
  {
    event: "file_changed",
    when: "After file write",
    canBlock: false,
    canModify: false,
  },
  {
    event: "on_error",
    when: "On agent error",
    canBlock: false,
    canModify: false,
  },
];

const hooksYaml = `hooks:
  on_session_start:
    - script:check-auth.sh
      description: "Verify user authorization"

  pre_tool_use:
    - script:validate-command.sh
      description: "Block dangerous CLI commands"

  post_tool_failure:
    - script:notify-error.sh

  post_response:
    - script:log-response.sh

  pre_query:
    - script:rate-limit.sh

  file_changed:
    - script:track-changes.sh

  on_error:
    - script:incident-report.sh`;

const hookInput = `{
  "event": "pre_tool_use",
  "session_id": "uuid",
  "tool": "cli",
  "args": {"command": "rm -rf /"}
}`;

const hookOutput = `{"action": "allow"}
{"action": "block", "reason": "Destructive command blocked"}
{"action": "modify", "args": {"command": "echo safe"}}`;

const sdkHooks = `for await (const msg of query({
  prompt: "Deploy the service",
  hooks: {
    preToolUse: async (ctx) => {
      if (ctx.toolName === "cli" && ctx.args.command?.includes("rm -rf"))
        return { action: "block", reason: "Destructive command blocked" };
      if (ctx.toolName === "write" && !ctx.args.path.startsWith("/safe/"))
        return { action: "modify", args: { ...ctx.args, path: \`/safe/\${ctx.args.path}\` } };
      return { action: "allow" };
    },
    onError: async (ctx) => {
      console.error(\`Agent error: \${ctx.error}\`);
    },
  },
})) { /* ... */ }`;

function YesBadge() {
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded font-body bg-green-50 text-green-600 border border-green-200/60">
      Yes
    </span>
  );
}

function NoBadge() {
  return (
    <span className="text-[10px] px-1.5 py-0.5 rounded font-body bg-muted text-muted-foreground">
      No
    </span>
  );
}

export function GitAgentHooks() {
  return (
    <section id="hooks" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Hooks
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            Lifecycle hooks let you intercept, block, or modify agent behavior at every stage —
            via shell scripts or programmatic SDK callbacks.
          </p>
        </motion.div>

        {/* A. Hook Events */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Hook Events
          </h3>

          {/* Table header */}
          <div className="paper-card overflow-hidden">
            <div className="overflow-x-auto -mx-2 px-2">
              <div className="grid grid-cols-[1.5fr_1.5fr_80px_90px] border-b border-border bg-accent/30 px-4 py-2.5 relative z-10">
                {["Event", "When", "Can Block", "Can Modify"].map((col) => (
                  <span
                    key={col}
                    className="text-[10px] uppercase tracking-wider font-body text-muted-foreground/60"
                  >
                    {col}
                  </span>
                ))}
              </div>

              {hookEvents.map((row, i) => (
                <motion.div
                  key={row.event}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className={`grid grid-cols-[1.5fr_1.5fr_80px_90px] px-4 py-3 gap-2 border-b border-border last:border-b-0 relative z-10 items-center ${
                    i % 2 === 0 ? "bg-transparent" : "bg-accent/20"
                  }`}
                >
                  <code className="text-[11px] font-body text-primary break-all">
                    {row.event}
                  </code>
                  <span className="text-[11px] font-body text-foreground/80 leading-relaxed">
                    {row.when}
                  </span>
                  {row.canBlock ? <YesBadge /> : <NoBadge />}
                  {row.canModify ? <YesBadge /> : <NoBadge />}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* B. hooks.yaml config */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            hooks.yaml Config
          </h3>
          <CodeBlock code={hooksYaml} filename="hooks/hooks.yaml" />
        </motion.div>

        {/* C. Hook Script Format — two code-blocks side by side */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Hook Script Format
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Input */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-body">
                stdin (JSON input)
              </p>
              <CodeBlock code={hookInput} filename="json" />
            </div>

            {/* Output */}
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-body">
                stdout (output options)
              </p>
              <CodeBlock code={hookOutput} filename="json" />
            </div>
          </div>
        </motion.div>

        {/* D. Programmatic Hooks (SDK) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Programmatic Hooks (SDK)
          </h3>
          <CodeBlock code={sdkHooks} filename="sdk-hooks.ts" />
        </motion.div>
      </div>
    </section>
  );
}
