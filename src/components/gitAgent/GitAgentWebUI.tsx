import { motion } from "framer-motion";
import {
  MessageSquare,
  Zap,
  Globe,
  Radio,
  GitBranch,
  Clock,
  Settings,
  Camera,
  Mic,
} from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const webUITabs = [
  {
    icon: MessageSquare,
    label: "Chat",
    desc: "Real-time conversation, voice controls, camera, file system viewer",
  },
  {
    icon: Zap,
    label: "Skills",
    desc: "Browse and install skills from the marketplace",
  },
  {
    icon: Globe,
    label: "Integrations",
    desc: "Connect Composio services (Gmail, Calendar, Slack, GitHub)",
  },
  {
    icon: Radio,
    label: "Communication",
    desc: "Telegram bot setup, WhatsApp connection, phone/SMS webhook",
  },
  {
    icon: GitBranch,
    label: "SkillFlows",
    desc: "Visual workflow builder — chain skills into multi-step flows",
  },
  {
    icon: Clock,
    label: "Scheduler",
    desc: "Create cron jobs — run prompts on a schedule",
  },
  {
    icon: Settings,
    label: "Settings",
    desc: "Model selection, API keys, custom base URL — saves to .env and agent.yaml",
  },
];


const voiceModes = [
  {
    provider: "OpenAI Realtime (default)",
    model: "gpt-realtime-2025-08-28",
    features: [
      "Real-time audio streaming over WebSocket",
      "Supports image input (camera frames)",
    ],
    requires: "OPENAI_API_KEY",
    command: "OPENAI_API_KEY=your_key gitagent --voice --dir ~/assistant",
    badge: "Default",
    badgeColor: "bg-primary/15 text-primary",
  },
  {
    provider: "Gemini Live",
    model: "models/gemini-2.5-flash-native-audio-preview",
    features: ["Alternative voice provider", "Free tier available"],
    requires: "GEMINI_API_KEY",
    command: "GEMINI_API_KEY=your_key gitagent --voice gemini --dir ~/assistant",
    badge: "Free tier",
    badgeColor: "bg-green-500/10 text-green-600",
  },
];

export function GitAgentWebUI() {
  return (
    <section id="webui" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Web UI
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            A full-featured browser interface served at{" "}
            <code className="text-primary font-body text-xs">http://localhost:3333</code>
            {" "}— chat, skills, integrations, and voice all in one place.
          </p>
        </motion.div>

        {/* A. Auth / startup */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
            Starting the Server
          </h3>
          <CodeBlock
            code={`# No auth — open to anyone on the network
gitagent --voice --dir ~/assistant
# opens http://localhost:3333

# With password protection
GITAGENT_PASSWORD=mysecret gitagent --voice --dir ~/assistant

# Custom username (defaults to "admin")
GITAGENT_USERNAME=alice GITAGENT_PASSWORD=mysecret gitagent --voice --dir ~/assistant`}
            filename="terminal"
            className="mb-4"
          />
          <div className="paper-card p-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-3 font-body relative z-10">
              Auth behaviour
            </p>
            <ul className="space-y-1.5 relative z-10">
              {[
                "Port is always 3333 — no env var to change it",
                "All HTTP routes show a login page when GITAGENT_PASSWORD is set",
                "WebSocket connections are rejected without a valid auth cookie",
                "/health always stays open (for load balancers)",
                "Cookie: HttpOnly, SameSite=Strict, 24-hour expiry, SHA-256 token",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-[11px] text-muted-foreground font-body leading-relaxed">
                  <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* B. Web UI Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Interface Tabs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {webUITabs.map((tab, i) => {
              const Icon = tab.icon;
              return (
                <motion.div
                  key={tab.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground font-body">
                      {tab.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-body relative z-10">
                    {tab.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* C. Voice Mode */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Voice Mode
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {voiceModes.map((mode, i) => (
              <motion.div
                key={mode.provider}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-semibold text-foreground font-body">
                        {mode.provider}
                      </span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-body ${mode.badgeColor}`}>
                      {mode.badge}
                    </span>
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1 font-body">
                    Model
                  </p>
                  <code className="text-xs text-primary font-body block mb-3">
                    {mode.model}
                  </code>

                  <ul className="space-y-1 mb-3">
                    {mode.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[11px] text-muted-foreground font-body">
                        <span className="w-1 h-1 rounded-full bg-primary/60 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-1 font-body">
                    Requires
                  </p>
                  <code className="text-[11px] text-foreground/80 font-body block mb-3">
                    {mode.requires}
                  </code>

                  <CodeBlock code={mode.command} filename="terminal" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* D. Camera Features + E. Text-Only Fallback — side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* D. Camera Features */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
            className="paper-card p-4 hover:border-primary/40 transition-colors"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Camera className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="text-xs font-semibold text-foreground font-body">
                  Camera Input
                </span>
              </div>
              <ul className="space-y-2">
                {[
                  "Front/back camera toggle (mobile)",
                  "Captures frames every 2 seconds as JPEG",
                  "Frames injected into conversation as images",
                  'Auto-captures on "memorable moments" (laughter, excitement)',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-[11px] text-muted-foreground font-body"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* E. Text-Only Fallback */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="paper-card p-4 border-primary/20"
          >
            <div className="relative z-10">
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-2 font-body">
                Text-Only Fallback
              </p>
              <p className="text-xs text-foreground font-body font-medium mb-2">
                No voice API key?
              </p>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                GitAgent still starts the web UI server but with voice disabled. Text input routes
                directly to the agent via{" "}
                <code className="text-primary font-body">query()</code>.
              </p>
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-[10px] text-muted-foreground/60 font-body">
                  Web UI runs at{" "}
                  <code className="text-primary font-body">http://localhost:3333</code>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
