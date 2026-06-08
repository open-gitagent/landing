import { motion } from "framer-motion";
import { Archive, Camera, BookOpen, Zap } from "lucide-react";

const memoryFeatures = [
  {
    icon: Archive,
    title: "Auto-Archiving",
    desc: "When a layer exceeds max_lines, oldest entries are moved to memory/archive/<YYYY-MM>.md — keeping MEMORY.md fast without losing history.",
    color: "text-blue-500",
  },
  {
    icon: BookOpen,
    title: "Mood & Journal",
    desc: "Per-session mood log (mood.md) and voice session reflection journal in memory/journal/ — both committed to git.",
    color: "text-orange-500",
  },
  {
    icon: Camera,
    title: "Photos & Moments",
    desc: "Voice mode captures webcam frames during memorable moments and stores them in memory/photos/ with a git commit.",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Learning",
    desc: "Completed tasks are crystallized into reusable skills in .gitagent/learning/ — the agent improves over time.",
    color: "text-primary",
  },
];

export function GitAgentMemorySection() {
  return (
    <section id="memory" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <span className="text-[10px] text-muted-foreground/40 font-body tracking-widest uppercase mb-1 block">
            07 — Memory
          </span>
          <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
            Git-Native Memory
          </h2>
          <p className="text-sm text-muted-foreground font-body max-w-lg">
            Every memory write is a git commit. Memory lives in plain Markdown files — readable, diffable, and rollback-able at any time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {memoryFeatures.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="paper-card p-4"
            >
              <div className="flex items-center gap-2 mb-2 relative z-10">
                <f.icon className={`w-4 h-4 ${f.color} shrink-0`} />
                <span className="text-sm font-heading font-semibold text-foreground">{f.title}</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed relative z-10">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
