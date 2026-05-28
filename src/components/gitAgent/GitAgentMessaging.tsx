import { motion } from "framer-motion";
import { Send, Smartphone, Phone } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

export function GitAgentMessaging() {
  return (
    <section id="messaging" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Messaging</h2>
          <p className="text-sm text-muted-foreground font-body">
            Connect your agent to Telegram, WhatsApp, and phone — all through the same running instance.
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">

          {/* Telegram */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="paper-card p-5"
          >
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Send className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-heading font-semibold text-foreground">Telegram</span>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4 relative z-10">
              Set <code className="text-primary font-body">TELEGRAM_BOT_TOKEN</code> and the agent automatically becomes a Telegram bot. No extra config needed.
            </p>
            <div className="relative z-10">
              <CodeBlock
                code={`TELEGRAM_BOT_TOKEN=your_token gitagent --voice --dir ~/assistant`}
                filename="terminal"
              />
            </div>
          </motion.div>

          {/* WhatsApp */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="paper-card p-5"
          >
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="text-sm font-heading font-semibold text-foreground">WhatsApp</span>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4 relative z-10">
              WhatsApp has no env var toggle. Set it up once through the Web UI — credentials persist automatically after that.
            </p>
            <ol className="space-y-2 mb-4 relative z-10">
              {[
                <>Start <code className="text-primary font-body text-xs">gitagent --voice</code></>,
                <>Open <code className="text-primary font-body text-xs">localhost:3333</code> → go to <strong className="text-foreground font-medium">Integrations</strong> → scan the QR code</>,
                <>Credentials are saved to <code className="text-primary font-body text-xs">.gitagent/whatsapp-auth/creds.json</code></>,
                <>On every subsequent start, WhatsApp auto-reconnects if that file exists</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-body leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Phone (Twilio) */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="paper-card p-5"
          >
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-heading font-semibold text-foreground">Phone</span>
                <span className="text-[10px] text-muted-foreground/60 font-body">via Twilio</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4 relative z-10">
              GitAgent does not read <code className="text-primary font-body">TWILIO_ACCOUNT_SID</code> or <code className="text-primary font-body">TWILIO_AUTH_TOKEN</code>. Setup is done entirely in the Twilio Console.
            </p>
            <ol className="space-y-2 mb-4 relative z-10">
              {[
                <>Start <code className="text-primary font-body text-xs">gitagent --voice</code></>,
                <>In the Twilio Console, set your webhook URL to your server's phone endpoint</>,
                <>Incoming calls are routed to the agent automatically</>,
              ].map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-xs text-muted-foreground font-body leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-primary/10 text-primary text-[10px] flex items-center justify-center shrink-0 mt-0.5 font-medium">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="relative z-10">
              <CodeBlock
                code={`# Webhook URL to set in Twilio Console:\nhttps://your-server/api/phone/webhook`}
                filename="Twilio Console"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
