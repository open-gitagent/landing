import { useState } from "react";
import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const directoryTree = `my-agent/
├── agent.yaml          # Model, tools, runtime config
├── SOUL.md             # Agent identity & personality
├── RULES.md            # Behavioral rules & constraints
├── DUTIES.md           # Role-specific responsibilities
├── memory/
│   └── MEMORY.md       # Git-committed agent memory
├── tools/
│   └── *.yaml          # Declarative tool definitions
├── skills/
│   └── <name>/
│       ├── SKILL.md    # Skill instructions (YAML frontmatter)
│       └── scripts/    # Skill scripts
├── workflows/
│   └── *.yaml|*.md     # Multi-step workflow definitions
├── agents/
│   └── <name>/         # Sub-agent definitions
├── plugins/
│   └── <name>/         # Local plugins (plugin.yaml + tools/hooks/skills)
├── hooks/
│   └── hooks.yaml      # Lifecycle hook scripts
├── knowledge/
│   └── index.yaml      # Knowledge base entries
├── config/
│   ├── default.yaml    # Default environment config
│   └── <env>.yaml      # Environment overrides
├── examples/
│   └── *.md            # Few-shot examples
└── compliance/
    └── *.yaml          # Compliance & audit config`;

const identityFiles = [
  {
    name: "SOUL.md",
    desc: "Agent personality, identity, core values",
  },
  {
    name: "RULES.md",
    desc: "Behavioral constraints and rules",
  },
  {
    name: "DUTIES.md",
    desc: "Job responsibilities and tasks",
  },
  {
    name: "AGENTS.md",
    desc: "Sub-agent relationships and delegation rules",
  },
];

const yamlTabs = [
  {
    label: "Minimal",
    code: `spec_version: "0.4.0"
name: my-agent
version: 1.0.0
description: An agent that does things

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: ["openai:gpt-4o"]
  constraints:
    temperature: 0.7
    max_tokens: 4096

tools: [cli, read, write, memory]

runtime:
  max_turns: 50
  timeout: 120`,
  },
  {
    label: "Full (with compliance)",
    code: `spec_version: "0.4.0"
name: my-agent
version: 1.0.0
description: A description of what this agent does

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback:
    - "openai:gpt-4o"
    - "google:gemini-2.0-flash-001"
  constraints:
    temperature: 0.7
    max_tokens: 4096

tools:
  - cli
  - read
  - write
  - memory
  - capture_photo
  - task_tracker
  - skill_learner

skills:
  - code-review
  - deployment

runtime:
  max_turns: 50
  timeout: 300

extends: https://github.com/user/parent-agent.git

dependencies:
  - name: shared-skills
    source: https://github.com/team/shared-skills
    version: main
    mount: deps/shared

agents:
  researcher:
    model: "anthropic:claude-haiku-4-5-20251001"
    tools: [read, cli]

delegation:
  mode: auto

plugins:
  my-plugin:
    enabled: true
    config:
      api_key: "\${MY_PLUGIN_KEY}"

compliance:
  risk_level: high
  human_in_the_loop: true
  data_classification: "confidential"
  regulatory_frameworks: [SOX, GLBA]
  recordkeeping:
    audit_logging: true
    retention_days: 2555
  review:
    required_approvers: 2
    auto_review: false

serve:
  port: 8080
  allowed_tools: [lookup_account, get_policy]
  constraints:
    temperature: 0
    max_tokens: 4000`,
  },
];

export function GitAgentArchitecture() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="architecture" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Agent Directory Structure
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Every agent is a Git repository. These files define its identity, behavior, and capabilities.
          </p>
        </motion.div>

        {/* A. Directory Tree */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Directory Layout
          </h3>
          <CodeBlock code={directoryTree} filename="my-agent/" />
        </motion.div>

        {/* B. Identity Files — 2×2 grid */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Identity Files
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {identityFiles.map((file, i) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-4 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5 relative z-10">
                  <code className="text-xs font-semibold text-primary font-body">
                    {file.name}
                  </code>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-body relative z-10">
                  {file.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* C. Tabbed agent.yaml */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            agent.yaml Schema
          </h3>

          {/* Tabs */}
          <div className="flex border-b border-border mb-0">
            {yamlTabs.map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => setActiveTab(i)}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-body transition-colors relative ${
                  activeTab === i
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
                {activeTab === i && (
                  <motion.div
                    layoutId="agent-yaml-tab"
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code block */}
          <CodeBlock
            code={yamlTabs[activeTab].code}
            filename="agent.yaml"
            className="rounded-tl-none border-t-0"
          />
        </motion.div>
      </div>
    </section>
  );
}
