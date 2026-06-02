import { motion } from "framer-motion";
import { Terminal, FileText, FilePlus, Brain, Camera, ListChecks, BookOpen } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const builtinTools = [
  {
    icon: Terminal,
    name: "cli",
    desc: "Execute shell commands",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: FileText,
    name: "read",
    desc: "Read file contents with pagination",
    concurrent: true,
    readOnly: true,
  },
  {
    icon: FilePlus,
    name: "write",
    desc: "Create/write files (auto-creates dirs)",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: FileText,
    name: "edit",
    desc: "Edit existing file contents (find and replace)",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: Brain,
    name: "memory",
    desc: "Load/save git-committed memory (auto-archives)",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: Camera,
    name: "capture_photo",
    desc: "Capture camera frame as photo",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: ListChecks,
    name: "task_tracker",
    desc: "Track task progress, search skills",
    concurrent: false,
    readOnly: false,
  },
  {
    icon: BookOpen,
    name: "skill_learner",
    desc: "Save/evaluate learned skills with confidence",
    concurrent: false,
    readOnly: false,
  },
];

const toolDetails = [
  {
    name: "cli",
    rows: [
      { key: "Timeout", value: "120s (configurable)" },
      { key: "Output", value: "stdout + stderr (truncated to ~100 KB)" },
    ],
  },
  {
    name: "read",
    rows: [
      { key: "Encoding", value: "utf-8 (binary files return a placeholder message)" },
      { key: "Partial reads", value: "line offsets (offset = start line, limit = number of lines)" },
    ],
  },
  {
    name: "write",
    rows: [
      { key: "Directories", value: "Auto-creates parent directories" },
    ],
  },
  {
    name: "memory",
    rows: [
      { key: "load", value: "Returns MEMORY.md contents" },
      { key: "save", value: "Appends + git commits" },
      { key: "Archive", value: "Auto-archives when max_lines exceeded to memory/archive/<YYYY-MM>.md" },
    ],
  },
];

const declarativeYaml = `# tools/lookup-account.yaml
name: lookup-account
description: Look up account details by customer ID
input_schema:
  properties:
    customer_id:
      type: string
      description: The customer ID
  required: [customer_id]
implementation:
  script: scripts/lookup.sh
  runtime: sh`;

export function GitAgentTools() {
  return (
    <section id="tools" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Tools
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            Built-in tools ship with every GitAgent install. Declarative tools let you expose any script as a typed tool.
          </p>
        </motion.div>

        {/* A. Built-in Tools */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Built-in Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {builtinTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <code className="text-xs font-semibold text-foreground font-body">
                      {tool.name}
                    </code>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed font-body mb-3 relative z-10">
                    {tool.desc}
                  </p>
                  <div className="flex flex-wrap gap-1.5 relative z-10">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-body ${
                        tool.concurrent
                          ? "bg-green-500/10 text-green-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tool.concurrent ? "concurrent safe" : "not concurrent"}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-body ${
                        tool.readOnly
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {tool.readOnly ? "read-only" : "not read-only"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* B. Tool Details */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Tool Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {toolDetails.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-4 hover:border-primary/40 transition-colors"
              >
                <code className="text-xs font-semibold text-primary font-body mb-3 block relative z-10">
                  {tool.name}
                </code>
                <dl className="space-y-1.5 relative z-10">
                  {tool.rows.map((row) => (
                    <div key={row.key} className="flex flex-col gap-0.5">
                      <dt className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-body">
                        {row.key}
                      </dt>
                      <dd className="text-[11px] text-foreground/80 font-body leading-relaxed">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* C. Declarative Tools */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Declarative Tools
          </h3>
          <CodeBlock code={declarativeYaml} filename="tools/lookup-account.yaml" className="mb-3" />
          <p className="text-[11px] text-muted-foreground font-body">
            The script receives JSON args on stdin and outputs plain text on stdout.
          </p>
        </motion.div>

        {/* D. Tool Allowlists and Denylists */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Tool Allowlists and Denylists
          </h3>
          <CodeBlock
            code={`// SDK — allowlist or denylist per query
for await (const msg of query({
  prompt: "...",
  allowedTools: ["read", "cli"],
  disallowedTools: ["write"],
})) { /* ... */ }`}
            filename="sdk-tools.ts"
          />
        </motion.div>
      </div>
    </section>
  );
}
