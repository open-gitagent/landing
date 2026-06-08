import { motion } from "framer-motion";
import { Plug, MessageCircle, Phone, Smartphone } from "lucide-react";

const integrations = [
  {
    icon: Plug,
    name: "Composio",
    tag: "200+ apps",
    requirement: "COMPOSIO_API_KEY",
    color: "text-blue-500",
    desc: "Connect Gmail, Google Calendar, Slack, GitHub, Notion, Jira, and 200+ more services via the Composio toolkit. One key unlocks everything.",
    features: ["Gmail & Calendar", "Slack & GitHub", "Notion & Jira", "CRM & payment tools"],
    setup: `COMPOSIO_API_KEY=your_key
# That's it — no agent.yaml changes needed.
# Connect services in the Web UI Integrations tab.`,
  },
  {
    icon: MessageCircle,
    name: "Telegram",
    tag: "BotFather",
    requirement: "TELEGRAM_BOT_TOKEN",
    color: "text-primary",
    desc: "Create a bot via BotFather, add the token, and your agent is instantly reachable from Telegram — text, voice messages, and file sharing.",
    features: ["Text & voice messages", "File sharing", "Group chat support", "Webhook or polling"],
    setup: `TELEGRAM_BOT_TOKEN=your_token
# That's it — no agent.yaml changes needed.
# Configure allowed users via TELEGRAM_ALLOWED_USERS.`,
  },
  {
    icon: Smartphone,
    name: "WhatsApp",
    tag: "Baileys QR",
    requirement: "QR scan (no API key)",
    color: "text-green-500",
    desc: "Uses the Baileys library for direct WhatsApp connection. Scan a QR code from the Web UI Communication tab — no Meta API account needed.",
    features: ["QR-based pairing", "No Meta API required", "Text & media", "Multi-device support"],
    setup: `# No API key required
# Go to Web UI → Communication tab
# Scan QR code with WhatsApp`,
  },
  {
    icon: Phone,
    name: "Phone / SMS",
    tag: "Twilio",
    requirement: "Twilio phone number + webhook URL",
    color: "text-orange-500",
    desc: "Twilio webhook integration for inbound SMS and voice calls. Configure the webhook URL to your running agent and it handles phone interactions.",
    features: ["Inbound SMS", "Voice call handling", "Webhook-based", "Twilio phone number"],
    setup: `# In Twilio console:
# Phone Numbers → your number → Messaging
# Webhook URL: https://your-server:3333/api/phone/webhook`,
  },
];

export function GitAgentIntegrationsSection() {
  return (
    <section id="integrations" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            08 — Integrations
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Integrations
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Connect external services and reach your agent across every channel.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {integrations.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="paper-card p-5 group"
            >
              {/* Header */}
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <item.icon className={`w-4 h-4 ${item.color} shrink-0`} />
                <span className="text-sm font-heading font-semibold text-foreground">{item.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-body ml-auto">
                  {item.tag}
                </span>
              </div>

              {/* Requirement */}
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <span className="text-[10px] text-muted-foreground/60 font-body w-16 shrink-0">Requires</span>
                <code className="text-[10px] text-foreground/70 font-body">{item.requirement}</code>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground font-body leading-relaxed mb-3 relative z-10">
                {item.desc}
              </p>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1 mb-4 relative z-10">
                {item.features.map((f) => (
                  <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground font-body">
                    {f}
                  </span>
                ))}
              </div>

              {/* Setup snippet */}
              <div className="rounded border border-border bg-background/50 p-2.5 relative z-10">
                <pre className="text-[10px] text-muted-foreground font-body whitespace-pre-wrap leading-4">
                  <code>{item.setup}</code>
                </pre>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
