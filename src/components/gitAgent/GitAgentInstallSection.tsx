import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const installModes = [
  {
    mode: "Voice + Text",
    command: "gitagent --voice",
    desc: "Starts with voice mode and the web UI. Requires OPENAI_API_KEY or GEMINI_API_KEY.",
    tag: "full",
  },
  {
    mode: "Text Only",
    command: "gitagent",
    desc: "Text-only REPL, no voice or web UI. Works with any LLM provider key.",
    tag: "lightweight",
  },
  {
    mode: "Advanced / Custom",
    command: "gitagent --dir ./my-agent",
    desc: "Point to a custom agent.yaml for full control over model, tools, compliance, and identity.",
    tag: "advanced",
  },
];

export function GitAgentInstallSection() {
  return (
    <section id="install" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            07 — Get Started
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Launch & Install
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Install once, then pick the launch mode that fits your workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Left: OpenGAP callout + requirements */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="paper-card p-5"
            >
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="text-xs font-heading font-semibold text-foreground">Built on OpenGAP</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed mb-3 relative z-10">
                GitAgent implements the{" "}
                <span className="text-foreground/80 font-medium">OpenGAP open standard</span> — your agent definition
                is portable, versionable, and exportable to any framework that speaks the protocol.
              </p>
              <a
                href="/opengap"
                className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-body relative z-10"
              >
                <ExternalLink className="w-3 h-3" />
                Learn about OpenGAP →
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 }}
              className="paper-card p-4"
            >
              <p className="text-xs font-heading font-semibold text-foreground mb-3 relative z-10">Requirements</p>
              <div className="space-y-1.5 relative z-10">
                {[
                  { label: "Node.js", value: "≥ 20" },
                  { label: "git", value: "any version" },
                  { label: "npm", value: "included with Node" },
                  { label: "Install", value: "npm install -g @open-gitagent/gitagent" },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3">
                    <span className="text-[10px] text-muted-foreground/60 font-body w-16 shrink-0">{r.label}</span>
                    <code className="text-[11px] text-foreground/80 font-body">{r.value}</code>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <a
                href="/docs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-body sketch-border border-primary"
              >
                Read the Docs
              </a>
              <a
                href="https://github.com/open-gitagent/gitagent"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
              >
                View on GitHub →
              </a>
            </motion.div>
          </div>

          {/* Right: launch modes */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Launch Modes
            </h3>
            <div className="space-y-3">
              {installModes.map((m, i) => (
                <motion.div
                  key={m.mode}
                  initial={{ opacity: 0, x: 4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="paper-card p-4"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <span className="text-xs font-heading font-semibold text-foreground">{m.mode}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-body ml-auto ${
                      m.tag === "recommended"
                        ? "bg-primary/10 text-primary"
                        : "bg-accent text-muted-foreground"
                    }`}>
                      {m.tag}
                    </span>
                  </div>
                  <code className="text-[11px] text-primary font-body block mb-2 relative z-10">
                    $ {m.command}
                  </code>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed relative z-10">
                    {m.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
