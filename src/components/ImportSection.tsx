import { motion, AnimatePresence } from "framer-motion";
import { Download, FolderOpen, Code2, ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";

interface AgentEntry {
  label: string;
  desc: string;
  cmd: string;
  cookbookId?: string;
  before: string;
  after: string;
}

const fsAgents: AgentEntry[] = [
  {
    label: "Claude Code",
    desc: "Reads CLAUDE.md, memory/, and .claude/ config — imports identity, skills, and rules.",
    cmd: "$ opengap import -f claude-code",
    cookbookId: "cookbook-claude-code",
    before: `my-project/
├── CLAUDE.md
├── memory/
│   └── preferences.md
└── .claude/
    └── settings.json`,
    after: `my-agent/
├── agent.yaml
├── SOUL.md
├── RULES.md
└── skills/
    └── tdd/SKILL.md`,
  },
  {
    label: "Cursor",
    desc: "Reads .cursorrules and workspace settings — imports agent rules and behavior.",
    cmd: "$ opengap import -f cursor",
    cookbookId: "cookbook-cursor",
    before: `my-project/
├── .cursorrules
└── .cursor/
    └── settings.json`,
    after: `my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md`,
  },
  {
    label: "Gemini CLI",
    desc: "Reads GEMINI.md and system instructions — imports identity and tool config.",
    cmd: "$ opengap import -f gemini",
    cookbookId: "cookbook-gemini-cli",
    before: `my-project/
└── GEMINI.md`,
    after: `my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md`,
  },
  {
    label: "Codex",
    desc: "Reads AGENTS.md and codex config — imports agent identity and tool stubs.",
    cmd: "$ opengap import -f codex",
    cookbookId: "cookbook-codex",
    before: `my-project/
└── AGENTS.md`,
    after: `my-agent/
├── agent.yaml
├── SOUL.md
├── RULES.md
└── tools/
    ├── run-tests.yaml
    └── lint-code.yaml`,
  },
  {
    label: "OpenCode",
    desc: "Reads opencode config and system prompt — imports identity and tool definitions.",
    cmd: "$ opengap import -f opencode",
    cookbookId: "cookbook-opencode",
    before: `my-project/
└── .opencode/
    └── config.json`,
    after: `my-agent/
├── agent.yaml
├── SOUL.md
└── RULES.md`,
  },
];

const codeFrameworks: AgentEntry[] = [
  {
    label: "LangGraph",
    desc: "Translates StateGraph nodes, edges, and tools into OpenGAP agents and tool YAMLs.",
    cmd: "$ opengap import -f langgraph",
    cookbookId: "cookbook-langgraph",
    before: `langgraph-project/
├── graph.py
├── nodes/
│   ├── researcher.py
│   └── writer.py
└── tools/
    ├── search_web.py
    └── write_report.py`,
    after: `react-agent/
├── agent.yaml
├── SOUL.md
├── RULES.md
├── tools/
│   ├── search-web.yaml
│   └── write-report.yaml
└── agents/
    ├── researcher/agent.yaml
    └── writer/agent.yaml`,
  },
  {
    label: "CrewAI",
    desc: "Maps Crew, Agent roles/goals, and Task definitions to agents/ and workflows/.",
    cmd: "$ opengap import -f crewai",
    cookbookId: "cookbook-crewai",
    before: `crewai-project/
├── crew.py
├── agents/
│   ├── analyst.py
│   └── writer.py
├── tasks/
│   └── research_tasks.py
└── tools/
    └── yahoo_finance.py`,
    after: `example-crewai/
├── agent.yaml
├── SOUL.md
├── agents/
│   ├── financial-analyst/agent.yaml
│   └── communications-specialist/agent.yaml
├── tools/
│   ├── yahoo-finance-news.yaml
│   └── google-jobs.yaml
└── workflows/
    └── financial-analysis.yaml`,
  },
  {
    label: "AutoGen",
    desc: "Converts ConversableAgent teams, tools, and group chats into OpenGAP agents.",
    cmd: "$ opengap import -f autogen",
    cookbookId: "cookbook-autogen",
    before: `autogen-project/
├── team.py
├── agents/
│   ├── assistant.py
│   └── user_proxy.py
└── tools/
    └── code_execution.py`,
    after: `autogen/
├── agent.yaml
├── SOUL.md
├── agents/
│   ├── assistant/agent.yaml
│   ├── user-proxy/agent.yaml
│   └── code-executor/agent.yaml
├── tools/
│   ├── code-execution.yaml
│   └── function-tool.yaml
└── workflows/
    └── agentchat-pipeline.yaml`,
  },
  {
    label: "OpenAI Agents SDK",
    desc: "Maps Agent, handoffs, and @function_tool to agent.yaml, agents/, and tools/.",
    cmd: "$ opengap import -f openai-agents",
    cookbookId: "cookbook-openai-agents",
    before: `openai-agents-project/
├── main.py
└── tools/
    ├── faq_lookup.py
    └── update_seat.py`,
    after: `openai-agents/
├── agent.yaml
├── SOUL.md
├── agents/
│   ├── faq-agent/agent.yaml
│   └── seat-booking-agent/agent.yaml
└── tools/
    ├── faq-lookup.yaml
    └── update-seat.yaml`,
  },
  {
    label: "Claude SDK",
    desc: "Converts Anthropic SDK agents — tools[], SYSTEM_PROMPT, and multi-turn loops into OpenGAP format.",
    cmd: "$ opengap import -f claude-sdk",
    cookbookId: "cookbook-claude-sdk",
    before: `anthropic-project/
├── agent.py
└── tools/
    ├── get_customer_info.py
    ├── get_order_details.py
    └── cancel_order.py`,
    after: `anthropic-agent/
├── agent.yaml
├── SOUL.md
└── tools/
    ├── get-customer-info.yaml
    ├── get-order-details.yaml
    └── cancel-order.yaml`,
  },
  {
    label: "Google ADK",
    desc: "Converts Agent, sub_agents, and AgentTool hierarchies into nested OpenGAP dirs.",
    cmd: "$ opengap import -f google-adk",
    cookbookId: "cookbook-google-adk",
    before: `adk-project/
├── agent.py
└── sub_agents/
    ├── inspiration/
    │   ├── agent.py
    │   └── prompt.py
    ├── planning/agent.py
    └── booking/agent.py`,
    after: `adk-samples/
├── agent.yaml
├── SOUL.md
└── agents/
    ├── inspiration-agent/
    │   ├── agent.yaml
    │   └── agents/poi-agent/agent.yaml
    ├── planning-agent/agent.yaml
    └── booking-agent/agent.yaml`,
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-muted-foreground/40 hover:text-foreground transition-colors"
      aria-label="Copy"
    >
      {copied ? <Check className="w-3 h-3 text-primary" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function AgentCard({ entry, index }: { entry: AgentEntry; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04 }}
      className="paper-card overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-accent/20 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <span className="text-sm font-heading font-semibold text-foreground">{entry.label}</span>
            <p className="text-xs text-muted-foreground font-body">{entry.desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <code className="hidden sm:block text-[10px] text-primary font-body">{entry.cmd}</code>
          <CopyButton text={entry.cmd.replace(/^\$ /, '')} />
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-3 border-t border-border pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">Before</p>
                <pre className="text-[10px] font-mono text-muted-foreground bg-muted/30 rounded-md border border-border p-3 overflow-x-auto leading-relaxed whitespace-pre">{entry.before}</pre>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-primary/60 font-body mb-2">After (OpenGAP)</p>
                <pre className="text-[10px] font-mono text-primary/80 bg-primary/5 rounded-md border border-primary/20 p-3 overflow-x-auto leading-relaxed whitespace-pre">{entry.after}</pre>
                {entry.cookbookId && (
                  <a
                    href={`/opengap/${entry.cookbookId}`}
                    className="inline-block mt-2 text-[10px] text-primary font-body hover:underline"
                  >
                    View full conversion cookbook →
                  </a>
                )}
              </div>
            </div>
            <div className="px-4 pb-3">
              <code className="sm:hidden text-[10px] text-primary font-body">{entry.cmd}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function ImportSection() {
  return (
    <section id="import" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <Download className="w-4 h-4 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Import Any Agent into OpenGAP</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-8 max-w-lg font-body">
            Two paths to bring your existing agents into OpenGAP format.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="paper-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <FolderOpen className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground font-heading">1 — File System Agents</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Agents that live as config files (Claude Code, Cursor, Gemini CLI, Codex, OpenCode).
                <br /><code className="text-primary text-[10px]">opengap import</code> reads their files directly and outputs OpenGAP format.
              </p>
            </div>
            <div className="paper-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-foreground font-heading">2 — Code-Based Frameworks</span>
              </div>
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Agents defined in code (LangGraph, CrewAI, AutoGen, etc.).
                <br />Follow the cookbook to manually map your framework's concepts to OpenGAP files.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Path 1 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-4">
            <FolderOpen className="w-3.5 h-3.5 text-primary/60" />
            <h3 className="text-sm font-semibold text-foreground font-heading">1 — File System Agents</h3>
          </div>
          <div className="space-y-2">
            {fsAgents.map((e, i) => <AgentCard key={e.label} entry={e} index={i} />)}
          </div>
        </motion.div>

        {/* Path 2 */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-3.5 h-3.5 text-primary/60" />
            <h3 className="text-sm font-semibold text-foreground font-heading">2 — Code-Based Frameworks</h3>
          </div>
          <div className="space-y-2">
            {codeFrameworks.map((e, i) => <AgentCard key={e.label} entry={e} index={i} />)}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
