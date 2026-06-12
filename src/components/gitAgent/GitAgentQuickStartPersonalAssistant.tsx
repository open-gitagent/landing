import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const installMethods = [
  {
    title: "Interactive installer (recommended)",
    code: `curl -fsSL "https://raw.githubusercontent.com/open-gitagent/gitagent/main/install.sh?$(date +%s)" | bash`,
    desc: "Installs globally via npm, walks through API key setup, launches web UI at http://localhost:3333",
  },
  {
    title: "Manual install",
    code: `npm install -g @open-gitagent/opengap
mkdir ~/assistant && cd ~/assistant && git init
gitagent --voice --dir .`,
    desc: "",
  },
];

const setupModes = [
  {
    name: "Install with LYZR",
    desc: "Easiest — uses Lyzr AI Studio cloud",
    keys: "LYZR_API_KEY",
  },
  {
    name: "Voice + Text",
    desc: "Real-time voice + text chat",
    keys: "OPENAI_API_KEY (or GEMINI_API_KEY for --voice gemini)",
  },
  {
    name: "Text Only",
    desc: "Terminal REPL, no voice or web UI",
    keys: "ANTHROPIC_API_KEY",
  },
  {
    name: "Advanced Setup",
    desc: "Choose voice adapter, model, port, integrations",
    keys: "varies",
  },
];

const quickExamples = [
  {
    comment: "# Single-shot query",
    code: `gitagent --dir ~/my-project "Build a REST API for user management"`,
  },
  {
    comment: "# With voice UI",
    code: `gitagent --voice --dir ~/assistant`,
  },
  {
    comment: "# Local repo mode — clone, fix, commit to session branch",
    code: `gitagent --repo https://github.com/org/repo --pat ghp_xxx "Fix the login bug"`,
  },
];

export function GitAgentQuickStartPersonalAssistant() {
  return (
    <section id="quickstart-personal-assistant" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2"
        >
          <p className="text-xs text-muted-foreground/50 font-body mb-1">
            <a href="/docs/quickstart" className="hover:text-muted-foreground transition-colors">Quick Start</a>
            {" / "}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Personal Assistant
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Install GitAgent as a global CLI and run it as your daily coding companion — voice, text, or web UI.
          </p>
        </motion.div>

        {/* Videos */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 mb-10 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-foreground font-body">Web UI</p>
            <video
              src="/videos/webuivideo.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full rounded-md sketch-border"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold text-foreground font-body">CLI / Terminal</p>
            <video
              src="/videos/clivideo.mp4"
              autoPlay
              muted
              loop
              playsInline
              controls
              className="w-full rounded-md sketch-border"
            />
          </div>
        </motion.div>

        {/* A. Install methods */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 mt-8"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Installation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {installMethods.map((method, i) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="flex flex-col gap-3"
              >
                <p className="text-xs font-semibold text-foreground font-body">
                  {method.title}
                </p>
                <CodeBlock code={method.code} filename="terminal" className="flex-1" />
                {method.desc && (
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                    {method.desc}
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* B. Setup Modes — 2×2 grid */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Setup Modes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {setupModes.map((mode, i) => (
              <motion.div
                key={mode.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="relative z-10">
                  <p className="text-sm font-semibold text-foreground font-heading mb-1">
                    {mode.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground font-body mb-2 leading-relaxed">
                    {mode.desc}
                  </p>
                  <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-body">
                    {mode.keys}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* C. First run note */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="paper-card p-4 border-primary/30 hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-3 relative z-10">
              <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-semibold">Auto-scaffold on first run: </span>
                <code className="text-primary text-xs font-body">
                  gitagent --dir ~/my-project 'Explain this project'
                </code>{" "}
                auto-creates <code className="text-primary text-xs font-body">agent.yaml</code>,{" "}
                <code className="text-primary text-xs font-body">SOUL.md</code>, and{" "}
                <code className="text-primary text-xs font-body">memory/</code> in the target directory.
              </p>
            </div>
          </div>
        </motion.div>

        {/* D. Quick examples */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Quick Examples
          </h3>
          <div className="code-block sketch-border overflow-x-auto">
            <div className="terminal-header">
              <span className="terminal-dot bg-primary/30" />
              <span className="terminal-dot bg-primary/20" />
              <span className="terminal-dot bg-primary/10" />
              <span className="ml-3 text-xs text-muted-foreground font-body">
                terminal
              </span>
            </div>
            <div className="space-y-3">
              {quickExamples.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="space-y-0.5"
                >
                  <div className="text-[11px] sm:text-xs text-muted-foreground/50 font-body leading-5">
                    {ex.comment}
                  </div>
                  <div className="text-[11px] sm:text-xs text-primary font-body leading-5">
                    {ex.code}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
