import { motion } from "framer-motion";

export function GitAgentHero() {
  return (
    <section id="overview" className="pt-10 pb-8 px-0 border-b border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">
            Documentation
          </p>
          <h1 className="text-2xl font-bold font-heading text-foreground mb-2">
            GitAgent
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-4 max-w-lg">
            A universal git-native multimodal always-learning AI agent. Your agent IS a git repo.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href="#quickstart"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline font-body"
            >
              Quick Start →
            </a>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <a
              href="https://github.com/open-gitagent/gitagent"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              GitHub ↗
            </a>
            <span className="text-muted-foreground/30 text-xs">·</span>
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors font-body"
            >
              Product overview ↗
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
