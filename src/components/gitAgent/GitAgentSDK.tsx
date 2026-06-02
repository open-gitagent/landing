import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { track } from "@/lib/analytics";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const tabs = ["query()", "tool()", "buildTool()", "hooks"] as const;
type Tab = (typeof tabs)[number];

const codeMap: Record<Tab, string> = {
  "query()": `import { query } from "@open-gitagent/gitagent";

for await (const msg of query({
  prompt: "Refactor the auth module",
  dir: "/path/to/agent",
  model: "anthropic:claude-sonnet-4-6",
})) {
  switch (msg.type) {
    case "delta":       // streaming text chunk
      process.stdout.write(msg.content); break;
    case "assistant":   // complete response
      console.log(\`\\nTokens: \${msg.usage?.totalTokens}\`); break;
    case "tool_use":    // tool invocation
      console.log(\`Tool: \${msg.toolName}(\${JSON.stringify(msg.args)})\`); break;
    case "tool_result": // tool output
      console.log(\`Result: \${msg.content}\`); break;
    case "system":      // lifecycle events & errors
      console.log(\`[\${msg.subtype}] \${msg.content}\`); break;
  }
}`,
  "tool()": `import { query, tool } from "@open-gitagent/gitagent";

const search = tool(
  "search_docs",
  "Search the documentation",
  {
    properties: {
      query: { type: "string", description: "Search query" },
      limit: { type: "number", description: "Max results" },
    },
    required: ["query"],
  },
  async (args) => {
    const results = await mySearchEngine(args.query, args.limit ?? 10);
    return { text: JSON.stringify(results), details: { count: results.length } };
  },
);

for await (const msg of query({ prompt: "Find auth docs", tools: [search] })) {
  // agent can now call search_docs
}`,
  "buildTool()": `import { buildTool } from "@open-gitagent/gitagent";

const myTool = buildTool({
  name: "search_docs",
  description: "Search documentation",
  parameters: {
    properties: { query: { type: "string" } },
    required: ["query"],
  },
  execute: async (args) => {
    return "Results: ...";
  },
  metadata: {
    isConcurrencySafe: true,   // safe to run in parallel
    isReadOnly: true,           // no side effects
    maxResultSizeChars: 20000,  // truncate large results
  },
});`,
  hooks: `const result = query({
  prompt: "Deploy to production",
  dir: "/path/to/agent",
  hooks: {
    onSessionStart: async (ctx) => ({ action: "allow" }),
    preToolUse: async (ctx) => {
      if (ctx.toolName === "cli" && ctx.args.command.includes("deploy")) {
        return { action: "block", reason: "Manual approval required" };
      }
      return { action: "allow" };
    },
    postToolFailure: async (ctx) => {
      console.error(\`Tool \${ctx.toolName} failed: \${ctx.error}\`);
    },
    preQuery: async (ctx) => {
      console.log(\`Sending prompt to LLM: \${ctx.sessionId}\`);
      return { action: "allow" };
    },
    postResponse: async (ctx) => {
      console.log(\`Session \${ctx.sessionId} responded\`);
    },
    fileChanged: async (ctx) => {
      console.log(\`File changed: \${ctx.path}\`);
    },
    onError: async (ctx) => {
      console.error(\`Error in \${ctx.sessionId}: \${ctx.error}\`);
    },
  },
});`,
};

const queryOptions = [
  { name: "prompt", type: "string | AsyncIterable", desc: "User prompt or multi-turn stream" },
  { name: "dir", type: "string", desc: "Agent directory (default: cwd)" },
  { name: "model", type: "string", desc: '"provider:model-id"' },
  { name: "env", type: "string", desc: "Environment config (config/<env>.yaml)" },
  { name: "systemPrompt", type: "string", desc: "Override discovered system prompt" },
  { name: "systemPromptSuffix", type: "string", desc: "Append to discovered system prompt" },
  { name: "tools", type: "GCToolDefinition[]", desc: "Additional tools" },
  { name: "replaceBuiltinTools", type: "boolean", desc: "Skip cli/read/write/memory" },
  { name: "allowedTools", type: "string[]", desc: "Tool name allowlist" },
  { name: "disallowedTools", type: "string[]", desc: "Tool name denylist" },
  { name: "maxTurns", type: "number", desc: "Max agent turns" },
  { name: "abortController", type: "AbortController", desc: "Cancellation signal" },
  { name: "constraints", type: "object", desc: "temperature, maxTokens, topP, topK" },
  { name: "hooks", type: "object", desc: "onSessionStart, preToolUse, postToolFailure, preQuery, postResponse, fileChanged, onError lifecycle hooks" },
];

const messageTypes = [
  { type: "delta", desc: "Streaming text/thinking chunk", fields: "deltaType, content" },
  { type: "assistant", desc: "Complete LLM response", fields: "content, model, usage, stopReason" },
  { type: "tool_use", desc: "Tool invocation", fields: "toolName, args, toolCallId" },
  { type: "tool_result", desc: "Tool output", fields: "toolName, content, isError, toolCallId" },
  { type: "system", desc: "Lifecycle events", fields: "subtype, content, metadata" },
  { type: "user", desc: "User message (multi-turn)", fields: "content" },
];

export function GitAgentSDK() {
  const [activeTab, setActiveTab] = useState<Tab>("query()");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeMap[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track("gitagent_sdk_code_copied");
  };

  return (
    <section id="sdk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">SDK</h2>
          <p className="text-sm text-muted-foreground font-body">
            Programmatic access to GitAgent via <code className="text-primary text-xs">query()</code>,{" "}
            <code className="text-primary text-xs">tool()</code>, and{" "}
            <code className="text-primary text-xs">buildTool()</code>.
          </p>
        </motion.div>

        {/* A. Tabbed code display */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="code-block sketch-border overflow-hidden">
            {/* Tab bar */}
            <div className="terminal-header flex items-center gap-1 border-b border-border">
              <span className="terminal-dot bg-red-400" />
              <span className="terminal-dot bg-yellow-400" />
              <span className="terminal-dot bg-green-400" />
              <div className="ml-4 flex items-center gap-1 relative flex-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-3 py-1 text-xs font-body rounded transition-colors ${
                      activeTab === tab
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground/70"
                    }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="sdk-tab-indicator"
                        className="absolute inset-0 bg-primary/10 rounded"
                        transition={{ type: "spring", duration: 0.3 }}
                      />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleCopy}
                className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                aria-label="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="overflow-x-auto">
              <motion.pre
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="text-[11px] sm:text-xs text-muted-foreground leading-5 font-body"
              >
                <code>{codeMap[activeTab]}</code>
              </motion.pre>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* B. QueryOptions */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              QueryOptions
            </h3>
            <div className="space-y-1.5">
              {queryOptions.map((opt, i) => (
                <motion.div
                  key={opt.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-2 relative z-10">
                    <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-36">
                      {opt.name}
                    </code>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-muted-foreground/60 font-body">{opt.type}</p>
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{opt.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* C. Message Types */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Message Types
            </h3>
            <div className="space-y-1.5">
              {messageTypes.map((m, i) => (
                <motion.div
                  key={m.type}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-2 relative z-10">
                    <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-24">
                      {m.type}
                    </code>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{m.desc}</p>
                      <p className="text-[10px] text-muted-foreground/60 font-body mt-0.5">{m.fields}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Cost tracking */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Cost Tracking
          </h3>
          <CodeBlock
            code={`const result = query({ prompt: "...", dir: "..." });

for await (const msg of result) { /* handle messages */ }

const costs = result.costs();
console.log(\`Cost: $\${costs.totalCostUsd.toFixed(4)}\`);
console.log(\`Tokens: \${costs.totalInputTokens} in / \${costs.totalOutputTokens} out\`);`}
            filename="app.ts"
          />
        </motion.div>
      </div>
    </section>
  );
}
