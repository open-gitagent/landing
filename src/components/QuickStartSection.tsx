import { motion } from "framer-motion";

const steps = [
  "$ npm install -g gitagent               # Install the CLI",
  "$ gitagent init --template standard     # Scaffold an agent",
  "$ gitagent validate                     # Check it's valid",
  "$ gitagent run -d ./my-agent            # Run with Claude Code",
  "$ gitagent run -a github -p \"Review\"    # Run with GitHub Models",
  "$ gitagent export --format openai       # Export for OpenAI SDK",
  "$ gitagent run -r <repo> -a claude      # Run with Claude Code",
];

export function QuickStartSection() {
  return (
    <section id="quickstart" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Quick Start</h2>
          <p className="text-sm text-muted-foreground font-body">
            Seven commands from install to deploy.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="code-block sketch-border overflow-x-auto">
            <div className="terminal-header">
              <span className="terminal-dot bg-primary/30" />
              <span className="terminal-dot bg-primary/20" />
              <span className="terminal-dot bg-primary/10" />
              <span className="ml-3 text-xs text-muted-foreground font-body">terminal</span>
            </div>

            <div className="space-y-1">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-[10px] sm:text-xs text-muted-foreground leading-5 sm:leading-6 font-body"
                >
                  <span className="text-primary">
                    {s.split("#")[0]}
                  </span>
                  {s.includes("#") && (
                    <span className="text-muted-foreground/50">
                      # {s.split("#")[1]}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
