import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check, BookOpen, Github, ArrowRight, Folder, FileText, Brain, Settings, Zap, Wrench, Database, GitFork, ShieldCheck } from "lucide-react";
import { track } from "@/lib/analytics";

const INSTALL_CMD = `npm install -g @open-gitagent/gitagent`;

type TreeItem = { name: string; indent: number; icon: React.ReactNode; tag?: string };

const tree: TreeItem[] = [
  { name: "~/assistant/", indent: 0, icon: <Folder className="w-3 h-3 text-primary" /> },
  { name: "agent.yaml", indent: 1, icon: <Settings className="w-3 h-3 text-primary" />, tag: "manifest" },
  { name: "SOUL.md", indent: 1, icon: <Brain className="w-3 h-3 text-primary" />, tag: "identity" },
  { name: "RULES.md", indent: 1, icon: <FileText className="w-3 h-3 text-muted-foreground" /> },
  { name: "memory/", indent: 1, icon: <Database className="w-3 h-3 text-primary" /> },
  { name: "MEMORY.md", indent: 2, icon: <FileText className="w-3 h-3 text-muted-foreground" /> },
  { name: "skills/", indent: 1, icon: <Zap className="w-3 h-3 text-foreground" /> },
  { name: "tools/", indent: 1, icon: <Wrench className="w-3 h-3 text-primary" /> },
  { name: "hooks/", indent: 1, icon: <GitFork className="w-3 h-3 text-foreground" /> },
  { name: "workflows/", indent: 1, icon: <ArrowRight className="w-3 h-3 text-foreground" /> },
  { name: "compliance/", indent: 1, icon: <ShieldCheck className="w-3 h-3 text-primary" /> },
];

export function GitAgentHeroSection() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    track("gitagent_install_copied");
  };

  return (
    <section className="relative pt-20 pb-20 px-6">
      <div className="flame-bg" />
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left */}
          <div>
            {/* OpenGAP badge */}
            <motion.a
              href="/opengap"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1 text-xs text-muted-foreground mb-4 hover:text-foreground transition-colors font-body"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-primary font-medium">OpenGAP</span>
              <span className="text-muted-foreground/50">—</span>
              <span className="text-muted-foreground/70">compliant</span>
              <span className="text-primary text-[10px]">↗</span>
            </motion.a>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground leading-tight tracking-tight mb-3"
            >
              <span className="text-primary">Git</span>Agent
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.34 }}
              className="text-base text-foreground/80 font-body font-medium mb-1"
            >
              A git-native agent harness — identity, memory, rules, and skills live as plain files in a repo.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.42 }}
              className="text-sm text-muted-foreground font-body mb-6 leading-relaxed"
            >
              Full audit trail, human-in-the-loop controls, and zero vendor lock-in. Your agent config is code — version-controlled, reviewable, and reversible.
            </motion.p>

            {/* Meta badges */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.52 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {[
                { label: "node ≥ 20", dot: "bg-green-500" },
                { label: "Agent Harness", dot: null },
                { label: "MIT License", dot: null },
                { label: "TypeScript 5.7", dot: null },
                { label: "v1.5.0", dot: null },
              ].map((b) => (
                <span
                  key={b.label}
                  className="sketch-border rounded-full px-2.5 py-1 text-[10px] font-body inline-flex items-center gap-1.5 text-muted-foreground"
                >
                  {b.dot && <span className={`w-1.5 h-1.5 rounded-full ${b.dot}`} />}
                  {b.label}
                </span>
              ))}
            </motion.div>

            {/* Creator credit */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.56 }}
              className="text-[11px] text-muted-foreground/60 font-body -mt-6 mb-8"
            >
              Created &amp; maintained by <a href="https://github.com/shreyaskapale" target="_blank" rel="noopener noreferrer author" className="text-foreground/80 font-medium hover:text-primary transition-colors">Shreyas Kapale</a> <a href="https://lyzr.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@ Lyzr Research Labs</a>
            </motion.p>

            {/* SDK — primary */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.62 }}
              className="mb-3"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">SDK — Build with AI Agents</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body mb-1.5 leading-relaxed">
                Integrate agents into your app, automate workflows, run agents from code.
              </p>
              <div className="code-block sketch-border border-primary/40">
                <div className="terminal-header">
                  <span className="terminal-dot bg-primary/30" />
                  <span className="terminal-dot bg-primary/20" />
                  <span className="terminal-dot bg-primary/10" />
                  <span className="ml-auto text-[10px] text-muted-foreground font-body">bash</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground/80 font-body flex-1 break-all leading-relaxed">
                    <span className="text-primary mr-1.5">$</span>
                    <span className="text-foreground/90">{INSTALL_CMD}</span>
                  </span>
                  <button
                    onClick={handleCopy}
                    className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 ml-2"
                    aria-label="Copy install command"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-primary" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Personal Assistant — secondary */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.72 }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body">Personal Assistant</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body mb-1.5 leading-relaxed">
                Run a local AI agent with memory, voice, and web UI.
              </p>
              <div className="code-block sketch-border">
                <div className="terminal-header">
                  <span className="terminal-dot bg-primary/30" />
                  <span className="terminal-dot bg-primary/20" />
                  <span className="terminal-dot bg-primary/10" />
                  <span className="ml-auto text-[10px] text-muted-foreground font-body">bash</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground/80 font-body flex-1 break-all leading-relaxed">
                    <span className="text-primary mr-1.5">$</span>
                    curl -fsSL https://raw.githubusercontent.com/open-gitagent/gitagent/main/install.sh | bash
                  </span>
                  <button
                    onClick={() => { navigator.clipboard.writeText("curl -fsSL https://raw.githubusercontent.com/open-gitagent/gitagent/main/install.sh | bash"); }}
                    className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0 ml-2"
                    aria-label="Copy curl command"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.78 }}
              className="flex items-center gap-3 flex-wrap"
            >
              <a
                href="#install"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-md hover:opacity-90 transition-opacity font-body sketch-border border-primary"
              >
                Get Started
              </a>
              <a
                href="/docs"
                className="inline-flex items-center gap-2 sketch-border text-xs font-medium text-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors font-body"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Read Docs
              </a>
              <a
                href="https://github.com/open-gitagent/gitagent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border text-xs font-medium text-muted-foreground px-4 py-2 rounded-md hover:bg-accent transition-colors font-body"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </motion.div>
          </div>

          {/* Right — directory tree + agents-as-repos */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, delay: 0.45 }}
            className=""
          >
            <div className="code-block sketch-border">
              <div className="terminal-header">
                <span className="terminal-dot bg-primary/30" />
                <span className="terminal-dot bg-primary/20" />
                <span className="terminal-dot bg-primary/10" />
                <span className="ml-3 text-xs text-muted-foreground font-body">your agent repo</span>
              </div>

              <div className="font-body text-[12px] leading-[22px]">
                {tree.map((item, i) => (
                  <motion.div
                    key={`${item.name}-${i}`}
                    initial={{ opacity: 0, x: -3 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.04 }}
                    className="flex items-center gap-1.5 hover:bg-accent/30 rounded-sm -mx-1 px-1"
                    style={{ paddingLeft: `${item.indent * 16 + 4}px` }}
                  >
                    <span className="shrink-0">{item.icon}</span>
                    <span className={item.indent === 0 ? "text-foreground font-semibold" : item.indent === 2 ? "text-muted-foreground" : "text-foreground/80"}>
                      {item.name}
                    </span>
                    {item.tag && (
                      <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                        {item.tag}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-border space-y-1">
                {[
                  { cmd: "git fork org/base-agent", desc: "inherit personality + rules" },
                  { cmd: "git checkout -b feature/research-mode", desc: "experiment safely" },
                  { cmd: "git log memory/MEMORY.md", desc: "audit memory history" },
                  { cmd: "git diff SOUL.md", desc: "track personality changes" },
                  { cmd: "git revert HEAD~3", desc: "undo last 3 agent changes" },
                  { cmd: "git checkout v1.2.0", desc: "roll back to stable agent" },
                ].map((line) => (
                  <div key={line.cmd} className="text-[11px] font-body">
                    <span className="text-primary">$ </span>
                    <span className="text-foreground/80">{line.cmd}</span>
                    <span className="text-muted-foreground/50 ml-2"># {line.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
