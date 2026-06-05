import { motion } from "framer-motion";
import { Terminal, Globe, MessageSquare, Code2 } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const interfaces = [
  {
    icon: Terminal,
    label: "CLI",
    tagline: "Terminal REPL",
    desc: "The primary way to run GitAgent. Launch an interactive session pointed at your agent repo.",
    code: `gitagent --dir ~/assistant`,
    filename: "terminal",
    href: "/docs/cli",
  },
  {
    icon: Globe,
    label: "Web & Voice",
    tagline: "Browser UI + microphone",
    desc: "Start with the --voice flag to open a full browser interface at localhost:3333 — chat, skills, integrations, scheduler, and real-time voice.",
    code: `gitagent --voice\n# opens localhost:3333`,
    filename: "terminal",
    href: "/docs/webui",
  },
  {
    icon: MessageSquare,
    label: "Messaging",
    tagline: "Telegram · WhatsApp · Phone",
    desc: "Connect your agent to Telegram or WhatsApp by setting the relevant env vars. Twilio adds phone (SMS/voice call) support.",
    code: `TELEGRAM_BOT_TOKEN=your_token gitagent\n# WhatsApp: scan QR once in Web UI → auto-reconnects via .gitagent/whatsapp-auth/\n# Twilio: configure webhook URL in Twilio Console → your-server/api/phone/webhook`,
    filename: ".env / terminal",
    href: "/docs/messaging",
  },
  {
    icon: Code2,
    label: "SDK",
    tagline: "Embed in Node.js",
    desc: "Import GitAgent directly into your application. Use query() to send a prompt and get a response programmatically.",
    code: `import { query } from "@open-gitagent/gitagent";\n\nfor await (const msg of query({\n  prompt: "Summarise yesterday's tasks",\n  dir: "./my-agent",\n})) {\n  if (msg.type === "assistant") console.log(msg.content);\n}`,
    filename: "app.ts",
    href: "/docs/sdk",
  },
];

export function GitAgentInterfaces() {
  return (
    <section id="interfaces" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            03 — Interfaces
          </span>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Ways to Interact
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            GitAgent meets you where you work — terminal, browser, chat app, or embedded in your own code.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {interfaces.map((iface, i) => {
            const Icon = iface.icon;
            return (
              <motion.div
                key={iface.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="paper-card p-5 flex flex-col gap-4"
              >
                <div className="flex items-start gap-3 relative z-10">
                  <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm font-heading font-semibold text-foreground">{iface.label}</span>
                      <span className="text-[10px] text-muted-foreground/60 font-body">{iface.tagline}</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-body leading-relaxed">{iface.desc}</p>
                  </div>
                </div>
                <div className="relative z-10">
                  <CodeBlock code={iface.code} filename={iface.filename} />
                </div>
                <div className="relative z-10">
                  <a
                    href={iface.href}
                    className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-body"
                  >
                    View docs →
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
