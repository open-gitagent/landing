import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

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
            09 — Get Started
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Choose your path
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Pick the mode that fits how you want to use GitAgent.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* SDK — primary */}
          <motion.a
            href="/docs/quickstart/sdk"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="paper-card p-6 flex flex-col gap-4 hover:border-primary/60 transition-colors group"
          >
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">
                SDK
              </span>
              <h3 className="text-base font-heading font-bold text-foreground mt-1 mb-2">
                Build with AI Agents
              </h3>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Integrate agents into your app, automate workflows, and run agents from code.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-xs text-primary font-body font-medium relative z-10">
              SDK Quick Start
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.a>

          {/* Personal Assistant */}
          <motion.a
            href="/docs/quickstart/personal-assistant"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="paper-card p-6 flex flex-col gap-4 hover:border-primary/40 transition-colors group"
          >
            <div className="relative z-10">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body">
                Personal Assistant
              </span>
              <h3 className="text-base font-heading font-bold text-foreground mt-1 mb-2">
                Run as Personal Agent Locally
              </h3>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Run a local AI agent with memory, voice, and web UI.
              </p>
            </div>
            <div className="mt-auto flex items-center gap-1.5 text-xs text-muted-foreground font-body group-hover:text-foreground transition-colors relative z-10">
              Personal Assistant Quick Start
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </motion.a>
        </div>
      </div>
    </section>
  );
}
