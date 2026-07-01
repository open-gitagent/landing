import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const providers = [
  { name: "Anthropic", example: "anthropic:claude-sonnet-4-6", envVar: "ANTHROPIC_API_KEY" },
  { name: "OpenAI", example: "openai:gpt-4o", envVar: "OPENAI_API_KEY" },
  { name: "Google", example: "google:gemini-2.0-flash-001", envVar: "GOOGLE_API_KEY" },
  { name: "Groq", example: "groq:llama-3.3-70b-versatile", envVar: "GROQ_API_KEY" },
  { name: "xAI", example: "xai:grok-2-1212", envVar: "XAI_API_KEY" },
  { name: "Mistral", example: "mistral:mistral-large-latest", envVar: "MISTRAL_API_KEY" },
  { name: "OpenRouter", example: "openrouter:anthropic/claude-3.5-sonnet", envVar: "OPENROUTER_API_KEY" },
  { name: "Cerebras", example: "cerebras:llama3.1-70b", envVar: "CEREBRAS_API_KEY" },
  { name: "DeepSeek", example: "deepseek:deepseek-chat", envVar: "DEEPSEEK_API_KEY" },
  { name: "Amazon Bedrock", example: "amazon-bedrock:anthropic.claude-3-sonnet", envVar: "AWS credentials" },
  { name: "Google Vertex", example: "google-vertex:gemini-2.5-flash", envVar: "GCP ADC" },
  { name: "Azure OpenAI", example: "azure-openai-responses:gpt-4o", envVar: "AZURE_OPENAI_API_KEY" },
];

const resolutionSteps = [
  {
    step: 1,
    label: "Environment config model_override",
    detail: "from config/<env>.yaml",
  },
  {
    step: 2,
    label: "CLI flag --model provider:model-id",
    detail: "passed at runtime",
  },
  {
    step: 3,
    label: "agent.yaml model.preferred",
    detail: "defined in the agent repo",
  },
];

const customEndpointCode = `# Inline URL
gitagent --model "ollama:llama3@http://localhost:11434/v1" --voice --dir ~/assistant

# Environment variable
export GITAGENT_MODEL_BASE_URL=http://localhost:11434/v1
gitagent --model "ollama:llama3" --voice --dir ~/assistant

# In agent.yaml
# model:
#   preferred: "custom:my-model@https://my-proxy.com/v1"`;

const compatibleEndpoints = [
  { name: "Ollama", port: "11434" },
  { name: "LM Studio", port: "1234" },
  { name: "vLLM", port: "8000" },
  { name: "LiteLLM", port: "4000" },
  { name: "Lyzr AI Studio", port: "" },
  { name: "Any OpenAI-compatible proxy", port: "" },
];

const lyzrSdkCode = `import { query } from "@open-gitagent/gitagent";

const result = query({
  prompt: "Hello! What can you help me with?",
  dir: "/path/to/agent",
  model: \`lyzr:\${LYZR_AGENT_ID}@https://agent-prod.studio.lyzr.ai/v4\`,
  constraints: { temperature: 0.7, maxTokens: 2000 },
});
for await (const msg of result) {
  if (msg.type === "assistant") console.log(msg.content);
}`;

const lyzrOptions = [
  { label: "Via installer (easiest)", desc: "Run the interactive installer and select Lyzr when prompted" },
  { label: "Via CLI flag", desc: `gitagent --model "lyzr:<AGENT_ID>@https://agent-prod.studio.lyzr.ai/v4" --dir ~/assistant` },
  { label: "Via SDK", desc: "Use the query() function with a lyzr: model string (see example below)" },
];

export function GitAgentModels() {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  const handleCopyEndpoint = () => {
    navigator.clipboard.writeText(customEndpointCode);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };
  return (
    <section id="models" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Models & Providers
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            12 providers out of the box. Custom endpoints and OpenAI-compatible proxies supported.
          </p>
        </motion.div>

        {/* A. Providers grid — 3 cols on lg */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Supported Providers
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {providers.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-3 sm:p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-2 relative z-10">
                  <span className="text-sm font-heading font-semibold text-foreground">
                    {p.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body">
                    {p.envVar}
                  </span>
                </div>
                <code className="block text-[10px] sm:text-[11px] text-muted-foreground/70 font-body relative z-10 break-all">
                  {p.example}
                </code>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* B. Model resolution order */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Model Resolution Order
          </h3>
          <div className="space-y-2">
            {resolutionSteps.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, x: -4 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="paper-card p-3 flex items-center gap-3"
              >
                <span className="text-xs font-semibold text-primary px-2 py-0.5 rounded bg-primary/10 font-body shrink-0 relative z-10">
                  {s.step}
                </span>
                <div className="relative z-10">
                  <span className="text-xs text-foreground font-semibold font-body">
                    {s.label}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-body ml-2">
                    — {s.detail}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* C. Custom / OpenAI-Compatible Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Custom / OpenAI-Compatible Endpoints
          </h3>
          <div className="code-block sketch-border overflow-x-auto mb-4">
            <div className="terminal-header">
              <span className="terminal-dot bg-primary/30" />
              <span className="terminal-dot bg-primary/20" />
              <span className="terminal-dot bg-primary/10" />
              <span className="ml-3 text-xs text-muted-foreground font-body flex-1">terminal</span>
              <button
                onClick={handleCopyEndpoint}
                className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                aria-label="Copy code"
              >
                {copiedEndpoint ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <pre className="text-[11px] sm:text-xs text-muted-foreground leading-5 font-body">
              {customEndpointCode.split("\n").map((line, i) => (
                <code
                  key={i}
                  className={`block ${
                    line.startsWith("#") ? "text-muted-foreground/50" : "text-primary"
                  }`}
                >
                  {line}
                </code>
              ))}
            </pre>
          </div>
          <div className="flex flex-wrap gap-2">
            {compatibleEndpoints.map((ep) => (
              <span
                key={ep.name}
                className="text-[11px] px-2 py-0.5 rounded bg-accent text-muted-foreground font-body"
              >
                {ep.name}
                {ep.port && (
                  <span className="text-muted-foreground/50 ml-1">:{ep.port}</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>

        {/* D. Lyzr Integration */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="paper-card p-4 sm:p-6 border-primary/30 hover:border-primary/50 transition-colors">
            <div className="relative z-10">
              <h3 className="text-sm font-semibold text-foreground font-heading mb-1">
                Lyzr AI Studio Integration
              </h3>
              <p className="text-[11px] text-muted-foreground font-body mb-5 leading-relaxed">
                Connect to Lyzr's managed agent infrastructure. Your agent runs on Lyzr's servers with full observability.
              </p>

              <div className="space-y-2 mb-6">
                {lyzrOptions.map((opt, i) => (
                  <motion.div
                    key={opt.label}
                    initial={{ opacity: 0, x: -4 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-start gap-2"
                  >
                    <span className="text-[10px] font-semibold text-primary font-body px-1.5 py-0.5 rounded bg-primary/10 shrink-0 mt-0.5">
                      {opt.label}
                    </span>
                    {opt.label === "Via CLI flag" ? (
                      <code className="text-[10px] text-muted-foreground font-body break-all">
                        {opt.desc}
                      </code>
                    ) : (
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                        {opt.desc}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              <CodeBlock code={lyzrSdkCode} filename="sdk-example.ts" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
