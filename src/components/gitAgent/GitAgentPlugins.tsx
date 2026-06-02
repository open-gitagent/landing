import { motion } from "framer-motion";
import { Wrench, Zap, MessageSquare, GitBranch, Database } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const manifestYaml = `id: my-plugin
name: My Plugin
version: 1.0.0
description: What this plugin does
author: Your Name
license: MIT
engine: ">=1.0.0"

provides:
  tools: true
  skills: true
  prompt: prompt.md
  hooks:
    pre_tool_use:
      - script: hooks/validate.sh   # any filename — hooks.yaml points to it`;

const structureCode = `plugins/my-plugin/
  plugin.yaml          # manifest
  prompt.md            # appended to system prompt
  tools/
    my-tool.yaml       # declarative tools
  skills/
    my-skill/
      SKILL.md
  hooks/
    validate.sh        # example — any filename, referenced from hooks.yaml`;

const managementCode = `# Install from git URL
gitagent plugin install https://github.com/user/plugin
# Install from local path
gitagent plugin install ./path/to/plugin
# List all plugins
gitagent plugin list
# Enable / disable
gitagent plugin enable my-plugin
gitagent plugin disable my-plugin
# Remove
gitagent plugin remove my-plugin
# Scaffold new plugin
gitagent plugin init my-plugin`;

const agentYamlConfig = `plugins:
  my-plugin:
    enabled: true
    config:
      api_key: "your-api-key"
      timeout: 30`;

const sdkCode = `import type { GitagentPluginApi } from "@open-gitagent/gitagent";

export function register(api: GitagentPluginApi) {
  api.registerTool(myTool);
  api.registerHook("pre_tool_use", async (ctx) => ({ action: "allow" }));
  api.addPrompt("Additional context for the agent...");
}`;

const provisions = [
  { icon: Wrench, label: "Tools", desc: "Expose new typed tools to the agent" },
  { icon: Zap, label: "Skills", desc: "Add reusable skill definitions" },
  { icon: MessageSquare, label: "System Prompt Injection", desc: "Append context via prompt.md" },
  { icon: GitBranch, label: "Lifecycle Hooks", desc: "React to tool use and session events" },
  { icon: Database, label: "Memory Layers", desc: "Add scoped memory files" },
];

export function GitAgentPlugins() {
  return (
    <section id="plugins" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Plugin System</h2>
          <p className="text-sm text-muted-foreground font-body">
            Extend GitAgent with installable plugins that provide tools, skills, hooks, and memory layers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* A. Plugin Manifest */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Plugin Manifest
            </h3>
            <CodeBlock code={manifestYaml} filename="plugin.yaml" />
          </motion.div>

          {/* B. Plugin Structure */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Plugin Structure
            </h3>
            <CodeBlock code={structureCode} filename="directory layout" className="mb-6" />

            {/* D. agent.yaml plugin config */}
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              agent.yaml Plugin Config
            </h3>
            <CodeBlock code={agentYamlConfig} filename="agent.yaml" />
          </motion.div>
        </div>

        {/* C. Plugin Management CLI */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Plugin Management CLI
          </h3>
          <CodeBlock code={managementCode} filename="terminal" />
        </motion.div>

        {/* E. Programmatic Plugin (SDK) */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Programmatic Plugin (SDK)
          </h3>
          <CodeBlock code={sdkCode} filename="plugin.ts" />
        </motion.div>

        {/* F. What plugins can provide */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            What Plugins Can Provide
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {provisions.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary mb-2 relative z-10" />
                  <p className="text-xs font-semibold text-foreground font-body mb-1 relative z-10">{p.label}</p>
                  <p className="text-[10px] text-muted-foreground font-body leading-relaxed relative z-10">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
