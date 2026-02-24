import { motion } from "framer-motion";
import { Terminal, Play, FileCheck, Info, Download, Upload, Package, ShieldCheck, Zap, Rocket } from "lucide-react";

const commands = [
  { name: "init", icon: Rocket, desc: "Scaffold a new agent repo", usage: "gitagent init --template <minimal|standard|full>", detail: "Templates: minimal (2 files), standard (skills + tools), full (compliance + hooks + memory)" },
  { name: "validate", icon: FileCheck, desc: "Validate agent against spec", usage: "gitagent validate --compliance", detail: "JSON schema validation, skill checks, and optional regulatory compliance audit" },
  { name: "run", icon: Play, desc: "Run agent with any adapter", usage: "gitagent run -a <adapter> -p \"prompt\"", detail: "Adapters: claude, openai, crewai, openclaw, nanobot, lyzr, github, git (auto-detect)" },
  { name: "export", icon: Download, desc: "Export to another framework", usage: "gitagent export --format <format> -o output", detail: "Formats: system-prompt, claude-code, openai, crewai, openclaw, nanobot, lyzr, github" },
  { name: "import", icon: Upload, desc: "Import from Claude, Cursor, CrewAI", usage: "gitagent import --from <format> <path>", detail: "Convert existing agent configs into gitagent format" },
  { name: "install", icon: Package, desc: "Resolve git-based dependencies", usage: "gitagent install", detail: "Shallow-clones dependencies at specified versions into mount paths" },
  { name: "skills", icon: Zap, desc: "Search, install, list, inspect skills", usage: "gitagent skills search \"code review\"", detail: "Registries: SkillsMP marketplace, GitHub repos, local filesystem" },
  { name: "audit", icon: ShieldCheck, desc: "Generate compliance audit report", usage: "gitagent audit", detail: "FINRA 3110, SEC 17a-4, SR 11-7, CFPB checks with pass/fail/warn indicators" },
  { name: "info", icon: Info, desc: "Display agent summary", usage: "gitagent info", detail: "Shows config, model, skills, tools, compliance, and SOUL.md preview" },
  { name: "lyzr", icon: Terminal, desc: "Create, update, and run on Lyzr Studio", usage: "gitagent lyzr run -r <repo> -p \"Hello\"", detail: "One command: clone → create agent on Lyzr → chat. Saves agent ID for reuse" },
];

export function CLISection() {
  return (
    <section id="cli" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">CLI Commands</h2>
          <p className="text-sm text-muted-foreground font-body">
            Everything you need to build, validate, run, and ship agents.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-3">
          {commands.map((cmd, i) => (
            <motion.div
              key={cmd.name}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="paper-card p-4 group hover:border-primary/40 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <cmd.icon className="w-3.5 h-3.5 text-primary" />
                <code className="text-xs font-semibold text-foreground font-body">{cmd.name}</code>
                <span className="text-[10px] text-muted-foreground ml-auto font-body">{cmd.desc}</span>
              </div>
              <code className="block text-[11px] text-primary/80 mb-1.5 font-body relative z-10">$ {cmd.usage}</code>
              <p className="text-[11px] text-muted-foreground/70 leading-relaxed font-body relative z-10">{cmd.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
