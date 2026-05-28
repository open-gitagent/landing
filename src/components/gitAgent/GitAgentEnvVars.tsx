import { useState } from "react";
import { motion } from "framer-motion";

const envVars = [
  { name: "ANTHROPIC_API_KEY", default: "—", desc: "API key for Anthropic Claude models" },
  { name: "OPENAI_API_KEY", default: "—", desc: "API key for OpenAI models (also used for Lyzr)" },
  { name: "GOOGLE_API_KEY", default: "—", desc: "API key for the google: text model provider" },
  { name: "GEMINI_API_KEY", default: "—", desc: "API key for Gemini Live voice mode" },
  { name: "GROQ_API_KEY", default: "—", desc: "API key for Groq" },
  { name: "XAI_API_KEY", default: "—", desc: "API key for xAI Grok models" },
  { name: "MISTRAL_API_KEY", default: "—", desc: "API key for Mistral models" },
  { name: "OPENROUTER_API_KEY", default: "—", desc: "API key for OpenRouter (multi-provider proxy)" },
  { name: "CEREBRAS_API_KEY", default: "—", desc: "API key for Cerebras" },
  { name: "DEEPSEEK_API_KEY", default: "—", desc: "API key for DeepSeek" },
  { name: "LYZR_API_KEY", default: "—", desc: "Lyzr AI Studio API key" },
  { name: "GITHUB_TOKEN", default: "—", desc: "GitHub PAT for --repo mode (also falls back to GIT_TOKEN)" },
  { name: "GIT_TOKEN", default: "—", desc: "Alternative PAT fallback for --repo mode" },
  { name: "E2B_API_KEY", default: "—", desc: "API token read by the E2B SDK when using --sandbox" },
  { name: "COMPOSIO_API_KEY", default: "—", desc: "Composio integrations API key" },
  { name: "TELEGRAM_BOT_TOKEN", default: "—", desc: "Telegram bot token from @BotFather" },
  { name: "GITAGENT_MODEL_BASE_URL", default: "—", desc: "Custom OpenAI-compatible base URL" },
  { name: "GITAGENT_PASSWORD", default: "—", desc: "Password for web UI authentication" },
];

export function GitAgentEnvVars() {
  const [filter, setFilter] = useState("");

  const filtered = envVars.filter(
    (v) =>
      v.name.toLowerCase().includes(filter.toLowerCase()) ||
      v.desc.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <section id="env" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Environment Variables</h2>
          <p className="text-sm text-muted-foreground font-body">
            All supported environment variables and their defaults.
          </p>
        </motion.div>

        {/* Search input */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-5"
        >
          <input
            type="text"
            placeholder="Search env vars..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-border rounded px-3 py-2 text-sm font-body w-full bg-background text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors"
          />
        </motion.div>

        {/* Env var list */}
        <div className="space-y-1.5">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground font-body py-4 text-center">
              No environment variables match your search.
            </p>
          )}
          {filtered.map((v, i) => (
            <motion.div
              key={v.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="paper-card p-3 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start gap-3 relative z-10">
                <code className="text-xs text-primary font-body font-semibold shrink-0 w-48">
                  {v.name}
                </code>
                <span
                  className={`text-[10px] font-body shrink-0 px-1.5 py-0.5 rounded mt-0.5 ${
                    v.default === "—"
                      ? "bg-muted text-muted-foreground/60"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {v.default}
                </span>
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed flex-1">
                  {v.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
