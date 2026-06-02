import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const cliFlags = [
  { flag: "--dir <path>",           short: "-d", desc: "Agent directory", default: "current working directory" },
  { flag: "--model <provider:model>", short: "-m", desc: "Override model from agent.yaml", default: "from agent.yaml" },
  { flag: "--prompt \"text\"",       short: "-p", desc: "Run a single prompt (non-interactive)", default: "—" },
  { flag: "--env <name>",           short: "-e", desc: "Load config/<name>.yaml environment overrides", default: "default" },
  { flag: "--voice",                short: "-v", desc: "Start Web UI + voice server at localhost:3333", default: "—" },
  { flag: "--sandbox",              short: "-s", desc: "Run agent inside an E2B cloud VM", default: "false" },
  { flag: "--sandbox-repo <url>",   short: "—",  desc: "Clone a repo into the sandbox", default: "—" },
  { flag: "--sandbox-token <tok>",  short: "—",  desc: "Git token for cloning (falls back to GITHUB_TOKEN / GIT_TOKEN)", default: "—" },
  { flag: "--repo <url>",           short: "—",  desc: "Work on a remote git repo locally", default: "—" },
  { flag: "--pat <token>",          short: "—",  desc: "Personal access token for --repo", default: "—" },
  { flag: "--session <branch>",     short: "—",  desc: "Session branch name for --repo mode", default: "auto-generated" },
];

const replCommands = [
  { cmd: "/quit or /exit", desc: "Exit the session" },
  { cmd: "/memory",        desc: "View the current memory file" },
  { cmd: "/skills",        desc: "List all installed skills" },
  { cmd: "/learned",       desc: "Show learned skills with confidence, usage, and success stats" },
  { cmd: "/tasks",         desc: "Show currently active tasks" },
  { cmd: "/plugins",       desc: "List loaded plugins and what they provide" },
  { cmd: "/skill:<name>",  desc: "Execute a specific skill (e.g. /skill:deploy)" },
];

const pluginCliCode = `gitagent plugin install https://github.com/user/plugin-repo
gitagent plugin install ./local/path --name my-plugin --force
gitagent plugin list --dir ~/assistant
gitagent plugin enable my-plugin --dir ~/assistant
gitagent plugin disable my-plugin --dir ~/assistant
gitagent plugin remove my-plugin --dir ~/assistant
gitagent plugin init my-plugin --dir ~/assistant`;

export function GitAgentCLI() {
  return (
    <section id="cli" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">CLI</h2>
          <p className="text-sm text-muted-foreground font-body">
            The primary way to run GitAgent. Starts an interactive REPL in your terminal.
          </p>
        </motion.div>

        {/* Basic usage */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
            Basic Usage
          </h3>
          <CodeBlock code={`gitagent --dir ~/assistant`} filename="terminal" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: CLI Flags */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              All Flags
            </h3>
            <div className="space-y-1.5">
              {cliFlags.map((row, i) => (
                <motion.div
                  key={row.flag}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-2 relative z-10">
                    <div className="shrink-0 w-48">
                      <code className="text-[11px] text-primary font-body font-semibold">
                        {row.flag}
                      </code>
                      {row.short !== "—" && (
                        <code className="text-[10px] text-muted-foreground/60 font-body ml-1.5">
                          {row.short}
                        </code>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                        {row.desc}
                      </p>
                      <p className="text-[10px] text-muted-foreground/50 font-body mt-0.5">
                        default: {row.default}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: REPL Commands + Plugin CLI */}
          <div className="flex flex-col gap-8">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
                REPL Commands
              </h3>
              <div className="space-y-1.5">
                {replCommands.map((row, i) => (
                  <motion.div
                    key={row.cmd}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="paper-card p-3 hover:border-primary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-20">
                        {row.cmd}
                      </code>
                      <span className="text-muted-foreground/30 text-[11px] font-body shrink-0">—</span>
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                        {row.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
                Plugin CLI
              </h3>
              <CodeBlock code={pluginCliCode} filename="terminal" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
