import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { track } from "@/lib/analytics";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const tabs = ["query()", "tool()", "buildTool()", "hooks"] as const;
type Tab = (typeof tabs)[number];

const codeMap: Record<Tab, string> = {
  "query()": `import { query } from "@open-gitagent/opengap";

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
  "tool()": `import { query, tool } from "@open-gitagent/opengap";

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
  "buildTool()": `import { buildTool } from "@open-gitagent/opengap";

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

const pathWithRepo = `import { query } from "@open-gitagent/opengap";

for await (const msg of query({
  repo: "https://github.com/open-gitagent/opengap",
  prompt: "Summarise the open pull requests",
})) {
  if (msg.type === "assistant") console.log(msg.content);
}`;

const pathWithoutRepo = `import { query } from "@open-gitagent/opengap";

for await (const msg of query({
  prompt: "Refactor the auth module in src/auth.ts",
  model: "anthropic:claude-sonnet-4-6",
  dir: "./my-project",
})) {
  if (msg.type === "assistant") console.log(msg.content);
}`;

const queryOptions = [
  { name: "prompt", type: "string | AsyncIterable", desc: "User prompt or multi-turn stream", required: true },
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
  { name: "repo", type: "object", desc: "Work on a remote git repo — clone, run agent, auto-commit changes to session branch" },
  { name: "sandbox", type: "SandboxOptions | boolean", desc: "Run agent inside an E2B cloud VM (true uses defaults)" },
  { name: "sessionId", type: "string", desc: "Tag or resume a specific session" },
] as const;

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

        {/* Starting points */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
            Pick your starting point
          </h3>
          <p className="text-[12px] text-muted-foreground font-body mb-4 leading-relaxed">
            Two paths — both use the same <code className="text-primary text-xs">query()</code> function.
            Full API reference below.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="paper-card p-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-foreground font-body">Path 1 — With an OpenGAP repo URL</p>
              <CodeBlock code={pathWithRepo} filename="index.ts" className="flex-1" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                GitAgent clones the repo, reads <code className="text-primary text-xs">agent.yaml</code> +{" "}
                <code className="text-primary text-xs">SOUL.md</code> + skills. Zero config — the repo is your agent.
              </p>
            </div>
            <div className="paper-card p-4 flex flex-col gap-3">
              <p className="text-xs font-semibold text-foreground font-body">Path 2 — Without a repo</p>
              <CodeBlock code={pathWithoutRepo} filename="index.ts" className="flex-1" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Pure SDK — point at an existing directory. No agent repo needed. Ideal for embedding in an app you already have.
              </p>
            </div>
          </div>
        </motion.div>

        {/* A. API Reference heading + Tabbed code display */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            API Reference
          </h3>
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

        {/* B. QueryOptions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">QueryOptions</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Parameters accepted by <code className="text-primary text-xs">query()</code></p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {queryOptions.map((opt, i) => (
              <motion.div
                key={opt.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.02 }}
                className="paper-card p-3 hover:border-primary/40 transition-colors h-full"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <code className="text-[11px] text-primary font-body font-semibold">{opt.name}</code>
                    {"required" in opt && opt.required && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-primary/15 text-primary font-body font-medium tracking-wide">required</span>
                    )}
                    <span className="text-[10px] text-muted-foreground/50 font-body">{opt.type}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{opt.desc}</p>
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
          className="mb-8 pt-8 border-t border-border"
        >
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Message Types</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Emitted by the <code className="text-primary text-xs">query()</code> async iterator</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {messageTypes.map((m, i) => (
              <motion.div
                key={m.type}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-3 hover:border-primary/40 transition-colors h-full"
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <code className="text-[11px] text-primary font-body font-semibold">{m.type}</code>
                    <span className="text-[10px] text-muted-foreground/50 font-body">{m.fields}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{m.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

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

        {/* SDK Cookbooks */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 pt-8 border-t border-border"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1 font-body">SDK Cookbooks</h3>
          <p className="text-[11px] text-muted-foreground font-body mb-4 leading-relaxed">
            Production-ready examples showing <code className="text-primary text-xs">query()</code> and <code className="text-primary text-xs">buildTool()</code> in real scenarios.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {[
              { label: "Refactor a Repo", desc: "Clone a repo and apply AI-driven refactors with auto-commit", href: "/docs/sdk/cookbooks/refactor-repo" },
              { label: "Summarize Emails", desc: "Fetch Gmail via custom tool and produce a prioritized digest", href: "/docs/sdk/cookbooks/summarize-emails" },
              { label: "Code Review PR", desc: "Review a git diff across security, correctness, and performance", href: "/docs/sdk/cookbooks/code-review" },
              { label: "Custom Tool", desc: "Build Jira + Slack tools with buildTool() and wire them to an agent", href: "/docs/sdk/cookbooks/custom-tool" },
              { label: "Multi-Agent Handoff", desc: "Chain an auditor agent into a GitHub issue writer agent", href: "/docs/sdk/cookbooks/multi-agent-handoff" },
              { label: "Scheduled Cron", desc: "Run a standup digest agent every weekday at 9 AM via node-cron", href: "/docs/sdk/cookbooks/scheduled-cron" },
            ].map((item, i) => (
              <motion.a
                key={item.href}
                href={item.href}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-3 hover:border-primary/40 transition-colors block group"
              >
                <div className="relative z-10">
                  <p className="text-[11px] font-semibold text-foreground font-body mb-1 group-hover:text-primary transition-colors">{item.label} →</p>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
