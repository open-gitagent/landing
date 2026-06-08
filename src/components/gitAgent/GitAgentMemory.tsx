import { motion } from "framer-motion";
import { SmilePlus, Camera, BookOpen, Brain } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const layersYaml = `# memory/memory.yaml
layers:
  - name: working
    path: memory/MEMORY.md
    max_lines: 1000
    format: markdown
  - name: technical
    path: memory/technical.md
    max_lines: 500
    format: markdown

archive_policy:
  max_entries: 500
  compress_after: 30d`;

const memoryTree = `memory/
├── MEMORY.md          # Primary memory (versioned)
├── mood.md            # Per-session mood log
├── photos/            # Camera captures
│   └── 2025-08-28-moment.jpg
├── journal/           # Session reflections
│   └── 2025-08-28.md
└── archive/           # Auto-archived old entries
    └── 2025-07-archive.md`;

const memoryCommandsCode = `# View current memory in REPL
/memory

# Full git history of every memory write
git log --oneline memory/MEMORY.md

# Diff what changed last session
git diff HEAD~1 memory/MEMORY.md

# Undo a specific memory commit
git revert a3f2e91

# Read yesterday's mood log
git show HEAD:memory/mood.md

# Save something to memory via SDK
query({ prompt: "Remember that the API base URL is https://api.example.com", dir: "./my-agent" })`;

const additionalFeatures = [
  {
    icon: SmilePlus,
    label: "Mood Log",
    path: "memory/mood.md",
    desc: "Session mood tracking (happy, frustrated, curious, excited, calm)",
  },
  {
    icon: Camera,
    label: "Photos",
    path: "memory/photos/",
    desc: "Captured memorable moments with INDEX.md",
  },
  {
    icon: BookOpen,
    label: "Journal",
    path: "memory/journal/<date>.md",
    desc: "Auto-generated session reflections",
  },
  {
    icon: Brain,
    label: "Learning",
    path: ".gitagent/learning/",
    desc: "Task history and learned skills (JSON)",
  },
];

export function GitAgentMemory() {
  return (
    <section id="memory" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Memory</h2>
          <p className="text-sm text-muted-foreground font-body">
            Every memory write is a git commit. That means you can diff what changed last session, revert a bad memory write, or audit the full history — with standard git commands.
          </p>
        </motion.div>

        {/* A. Overview card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="paper-card p-4 hover:border-primary/40 transition-colors">
            <p className="text-sm text-foreground font-body leading-relaxed relative z-10">
              <code className="text-primary text-xs font-body">memory/MEMORY.md</code> is the primary file. It's loaded automatically into every conversation.
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* B. Directory tree */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Directory Structure
            </h3>
            <CodeBlock code={memoryTree} filename="~/assistant/memory/" className="mb-3" />
          </motion.div>

          {/* C. Memory Layers config */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Memory Layers
            </h3>
            <CodeBlock code={layersYaml} filename="memory/memory.yaml" className="mb-3" />
            <p className="text-[11px] text-muted-foreground font-body">
              When a layer exceeds <code className="text-primary text-[10px]">max_lines</code>, old entries are
              auto-archived to{" "}
              <code className="text-primary text-[10px]">memory/archive/&lt;YYYY-MM&gt;.md</code>
            </p>
          </motion.div>
        </div>

        {/* C. Additional Memory Features */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-1 font-body">
            Other Memory Files
          </h3>
          <p className="text-[11px] text-muted-foreground font-body mb-4">GitAgent also writes to a few other files automatically:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {additionalFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="text-xs font-semibold text-foreground font-body">{f.label}</span>
                  </div>
                  <code className="text-[10px] text-primary font-body block mb-2 relative z-10">{f.path}</code>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed relative z-10">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* E. Memory commands */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Memory Commands
          </h3>
          <CodeBlock code={memoryCommandsCode} filename="terminal" />
        </motion.div>

        {/* F. Rolling Back Memory */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Rolling Back Memory
          </h3>
          <CodeBlock
            code={`git revert HEAD                          # undo last memory write
git revert HEAD~3..HEAD                  # undo last 3 writes
git checkout a3f2e91 -- memory/MEMORY.md # restore to specific point
git commit -m "Restore memory to known good state"`}
            filename="terminal"
            className="mb-3"
          />
          <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
            Use <code className="text-primary text-[10px]">git revert</code> rather than{" "}
            <code className="text-primary text-[10px]">git reset --hard</code> — revert preserves the audit trail while reset destroys it.
          </p>
        </motion.div>

        {/* G. Browsing the Archive */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Browsing the Archive
          </h3>
          <CodeBlock
            code={`ls memory/archive/
cat memory/archive/2025-07-archive.md
git log -p memory/ | grep "search term"`}
            filename="terminal"
          />
        </motion.div>
      </div>
    </section>
  );
}
