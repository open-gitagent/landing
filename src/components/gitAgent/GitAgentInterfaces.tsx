import { motion } from "framer-motion";
import { Terminal, Globe, MessageSquare, Code2 } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const sdkCode = `import { query } from "@open-gitagent/gitagent";\n\nfor await (const msg of query({\n  prompt: "Summarise yesterday's tasks",\n  dir: "./my-agent",\n})) {\n  if (msg.type === "assistant") console.log(msg.content);\n}`;

const paItems = [
  {
    icon: Terminal,
    label: "CLI",
    desc: "Interactive terminal REPL — launch an agent session from your shell.",
    href: "/docs/cli",
  },
  {
    icon: Globe,
    label: "Web & Voice",
    desc: "Full browser UI with chat, skills, scheduler, and real-time voice.",
    href: "/docs/webui",
  },
  {
    icon: MessageSquare,
    label: "Messaging",
    desc: "Connect to Telegram, WhatsApp, or phone via Twilio.",
    href: "/docs/messaging",
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

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 p-3 rounded-md border border-primary/30 bg-primary/5"
        >
          <p className="text-xs font-body text-foreground/80 leading-relaxed">
            <span className="font-semibold text-foreground">Building an app?</span>{" "}
            The SDK is the production entry point.{" "}
            <a href="/docs/quickstart/sdk" className="text-primary hover:underline">
              Start with the SDK Quickstart →
            </a>{" "}
            before reading anything else on this page.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* SDK card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="paper-card p-5 flex flex-col gap-4"
          >
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Code2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-heading font-semibold text-foreground">SDK</span>
                  <span className="text-[10px] text-muted-foreground/60 font-body">Embed in Node.js</span>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  The production entry point. Import GitAgent directly into your Node.js application and call query() to send prompts programmatically.
                </p>
              </div>
            </div>
            <div className="relative z-10">
              <CodeBlock code={sdkCode} filename="app.ts" />
            </div>
            <div className="relative z-10 flex items-center gap-3 flex-wrap">
              {[
                { label: "SDK Quickstart", href: "/docs/quickstart/sdk" },
                { label: "Full API", href: "/docs/sdk" },
                { label: "SDK Cookbooks", href: "/docs/sdk/cookbooks/refactor-repo" },
              ].map((link) => (
                <a key={link.href} href={link.href} className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-body">
                  {link.label} →
                </a>
              ))}
            </div>
          </motion.div>

          {/* Personal Assistant card */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.06 }}
            className="paper-card p-5 flex flex-col gap-4"
          >
            <div className="flex items-start gap-3 relative z-10">
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Terminal className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-sm font-heading font-semibold text-foreground">Personal Assistant</span>
                </div>
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Run GitAgent as a local assistant with multiple ways to interact — terminal, browser, or messaging apps.
                </p>
              </div>
            </div>
            <div className="space-y-3 relative z-10">
              {paItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="flex items-start gap-3 p-3 rounded-md border border-border hover:border-primary/30 hover:bg-accent/30 transition-colors group"
                  >
                    <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs font-heading font-semibold text-foreground mb-0.5 group-hover:text-primary transition-colors">{item.label}</p>
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{item.desc}</p>
                    </div>
                  </a>
                );
              })}
            </div>
            <div className="relative z-10">
              <a href="/docs/quickstart/personal-assistant" className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-body">
                Personal Assistant Quick Start →
              </a>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
