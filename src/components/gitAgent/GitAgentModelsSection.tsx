import { motion } from "framer-motion";

const providers = [
  { name: "Anthropic", format: "anthropic:<model>", envKey: "ANTHROPIC_API_KEY" },
  { name: "OpenAI", format: "openai:<model>", envKey: "OPENAI_API_KEY" },
  { name: "Google", format: "google:<model>", envKey: "GEMINI_API_KEY" },
  { name: "Groq", format: "groq:<model>", envKey: "GROQ_API_KEY" },
  { name: "xAI", format: "xai:<model>", envKey: "XAI_API_KEY" },
  { name: "Mistral", format: "mistral:<model>", envKey: "MISTRAL_API_KEY" },
  { name: "OpenRouter", format: "openrouter:<model>", envKey: "OPENROUTER_API_KEY" },
  { name: "Cerebras", format: "cerebras:<model>", envKey: "CEREBRAS_API_KEY" },
  { name: "DeepSeek", format: "deepseek:<model>", envKey: "DEEPSEEK_API_KEY" },
  { name: "AWS Bedrock", format: "amazon-bedrock:<model>", envKey: "AWS_ACCESS_KEY_ID" },
  { name: "Google Vertex", format: "google-vertex:<model>", envKey: "GOOGLE_APPLICATION_CREDENTIALS" },
  { name: "Azure OpenAI", format: "azure-openai-responses:<deployment>", envKey: "AZURE_OPENAI_API_KEY" },
];

export function GitAgentModelsSection() {
  return (
    <section id="models" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            06 — Models
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            12+ Model Providers
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Switch providers by changing one env var. Any OpenAI-compatible endpoint works too.
          </p>
        </motion.div>

        <div className="space-y-1.5">
          {providers.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, x: -4 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="paper-card px-3 py-2 flex items-center gap-3"
            >
              <span className="text-xs font-heading font-semibold text-foreground w-28 shrink-0 relative z-10">
                {p.name}
              </span>
              <code className="text-[10px] text-primary font-body flex-1 relative z-10">
                {p.format}
              </code>
              <code className="text-[10px] text-muted-foreground/60 font-body hidden sm:block relative z-10">
                {p.envKey}
              </code>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
