import { motion } from "framer-motion";
import { Mic, Monitor } from "lucide-react";

const voiceAdapters = [
  {
    name: "OpenAI Realtime",
    model: "gpt-realtime-2025-08-28",
    tag: "default",
    requires: "OPENAI_API_KEY",
  },
  {
    name: "Gemini Live",
    model: "gemini-2.0-flash",
    tag: "free tier",
    requires: "GEMINI_API_KEY",
  },
];

const webUiTabs = [
  { name: "Chat", desc: "Voice controls, camera, agent vitals, file system viewer" },
  { name: "Skills", desc: "Browse and install skills from the marketplace" },
  { name: "Integrations", desc: "Connect Composio services (Gmail, Calendar, Slack, GitHub)" },
  { name: "Communication", desc: "Telegram bot setup, WhatsApp connection, phone/SMS webhook" },
  { name: "SkillFlows", desc: "Visual workflow builder — chain skills into multi-step flows" },
  { name: "Scheduler", desc: "Create cron jobs — run prompts on a recurring schedule" },
  { name: "Settings", desc: "Model selection, API keys, custom base URL — saves to .env and agent.yaml" },
];


export function GitAgentVoiceSection() {
  return (
    <section id="voice-webui" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            04 — Voice & Web UI
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Voice Mode & Web UI
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Real-time voice, camera, and a full browser interface at{" "}
            <code className="text-primary text-xs">http://localhost:3333</code>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: voice adapters */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body flex items-center gap-2">
              <Mic className="w-3 h-3" /> Voice Adapters
            </h3>
            <div className="space-y-3">
              {voiceAdapters.map((v, i) => (
                <motion.div
                  key={v.name}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="paper-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <span className="text-sm font-heading font-semibold text-foreground">{v.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body ml-auto">
                      {v.tag}
                    </span>
                  </div>
                  <div className="space-y-1 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground/60 font-body w-12">Model</span>
                      <code className="text-[11px] text-primary font-body">{v.model}</code>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground/60 font-body w-12">Requires</span>
                      <code className="text-[11px] text-foreground/70 font-body">{v.requires}</code>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Right: Web UI tabs */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body flex items-center gap-2">
              <Monitor className="w-3 h-3" /> Web UI Tabs
            </h3>
            <div className="space-y-2">
              {webUiTabs.map((tab, i) => (
                <motion.div
                  key={tab.name}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-start gap-3 paper-card p-3"
                >
                  <span className="text-xs font-heading font-semibold text-foreground w-28 shrink-0 relative z-10">
                    {tab.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-body leading-relaxed relative z-10">
                    {tab.desc}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
