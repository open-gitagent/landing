import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Claude SDK source  ═══════════════════ */

const sourceTree = `anthropics/anthropic-cookbook/     (Claude SDK)
└── tool_use/
    └── customer_service_agent.ipynb   ← tools[], SYSTEM_PROMPT, messages.create() loop`;

const srcNotebook = `# customer_service_agent.ipynb — key code cells
import anthropic

client = anthropic.Anthropic()
MODEL_NAME = "claude-opus-4-8"

tools = [
    {
        "name": "get_customer_info",
        "description": "Retrieves customer information based on their customer ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": {
                    "type": "string",
                    "description": "The unique identifier for the customer.",
                }
            },
            "required": ["customer_id"],
        },
    },
    {
        "name": "get_order_details",
        "description": "Retrieves the details of a specific order based on the order ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The unique identifier for the order.",
                }
            },
            "required": ["order_id"],
        },
    },
    {
        "name": "cancel_order",
        "description": "Cancels an order based on the provided order ID.",
        "input_schema": {
            "type": "object",
            "properties": {
                "order_id": {
                    "type": "string",
                    "description": "The unique identifier for the order to be cancelled.",
                }
            },
            "required": ["order_id"],
        },
    },
]

SYSTEM_PROMPT = """You are a customer service agent for an e-commerce platform.
Your role is to assist customers with their inquiries and issues.
You have access to tools to look up customer and order information,
and to process cancellations. Always be polite and helpful."""


def process_tool_call(tool_name: str, tool_input: dict) -> str:
    if tool_name == "get_customer_info":
        return get_customer_info(tool_input["customer_id"])
    elif tool_name == "get_order_details":
        return get_order_details(tool_input["order_id"])
    elif tool_name == "cancel_order":
        return cancel_order(tool_input["order_id"])


def chatbot_interaction(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    response = client.messages.create(
        model=MODEL_NAME,
        max_tokens=4096,
        system=SYSTEM_PROMPT,
        tools=tools,
        messages=messages,
    )
    while response.stop_reason == "tool_use":
        tool_use = next(b for b in response.content if b.type == "tool_use")
        tool_result = process_tool_call(tool_use.name, tool_use.input)
        messages = [
            {"role": "user", "content": user_message},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [
                {"type": "tool_result", "tool_use_id": tool_use.id, "content": str(tool_result)}
            ]},
        ]
        response = client.messages.create(
            model=MODEL_NAME,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            tools=tools,
            messages=messages,
        )
    return next(b.text for b in response.content if hasattr(b, "text"))`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromSystemPrompt = `# customer_service_agent.ipynb
SYSTEM_PROMPT = """You are a customer service agent
for an e-commerce platform.
Your role is to assist customers with their
inquiries and issues.
You have access to tools to look up customer and
order information, and to process cancellations.
Always be polite and helpful."""`;

const toSoulMd = `# SOUL.md

## Core Identity
I am the Anthropic Cookbook agent — a collection of
Claude-powered agent patterns demonstrating how to
build sophisticated AI agents using the Claude
Agent SDK.

## Purpose
Assist customers with their inquiries and issues.
Look up customer and order information, and process
cancellations when requested.

## Communication Style
Polite, helpful, and direct. Always use tools to
look up accurate information before responding.`;

const fromSystemPromptRules = `# customer_service_agent.ipynb — implicit rules
# From SYSTEM_PROMPT:
"Always be polite and helpful."

# From chatbot_interaction loop:
while response.stop_reason == "tool_use":
    tool_result = process_tool_call(...)
    # ← must call tool before responding

# No guardrail logic — SDK has no built-in guardrails`;

const toRulesMd = `# RULES.md

## Must Always
- Be polite and helpful in every response
- Call tools to look up accurate information
  before responding to the user
- Use the most specific tool available for each
  customer request

## Must Never
- Respond with information that has not been
  verified via a tool call
- Reveal internal tool names or raw API errors
  to the customer
- Echo or log customer account details`;

const fromToolsLoop = `# customer_service_agent.ipynb
# The tool loop — run tool, append result, re-invoke
while response.stop_reason == "tool_use":
    tool_use = next(
        b for b in response.content
        if b.type == "tool_use"
    )
    tool_result = process_tool_call(
        tool_use.name, tool_use.input
    )
    messages.append(...)
    response = client.messages.create(...)`;

const toSkillMd = `# skills/delegate-subagent/SKILL.md
---
name: delegate-subagent
description: "Decompose a complex research query into
  subtasks and delegate to specialized subagents for
  parallel execution."
---

## Step 1: Classify Query Type
## Step 2: Plan Research
## Step 3: Write Subagent Instructions
## Step 4: Deploy in Parallel
## Step 5: Synthesize
## Step 6: Write Final Report`;

const fromModelConfig = `# customer_service_agent.ipynb
MODEL_NAME = "claude-opus-4-8"

# Passed to every messages.create() call:
response = client.messages.create(
    model=MODEL_NAME,
    max_tokens=4096,
    system=SYSTEM_PROMPT,
    tools=tools,
    messages=messages,
)`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: anthropic-cookbook
version: 1.0.0
model:
  preferred: anthropic:claude-opus-4-8
  fallback:
    - claude-sonnet-4-6
runtime:
  max_turns: 50
  timeout: 300
skills:
  - web-search
  - read-file
  - run-shell
  - delegate-subagent
tools:
  - read-config-file
  - edit-config-file
  - run-shell-command
  - get-container-logs
  - financial-forecast
  - talent-scorer
  - decision-matrix`;

const fromToolsDicts = `# customer_service_agent.ipynb — tools list
tools = [
    {
        "name": "get_customer_info",
        "description": "Retrieves customer information ...",
        "input_schema": {
            "type": "object",
            "properties": {
                "customer_id": { "type": "string" }
            },
            "required": ["customer_id"],
        },
    },
    # ... get_order_details, cancel_order
]`;

const toToolYamls = `# tools/read-config-file.yaml
name: read-config-file
description: Read a configuration file from the project.
input_schema:
  type: object
  properties:
    path:
      type: string
      description: Relative path (must be in config/)
  required: [path]
implementation:
  type: script
  path: read-config-file.py
  runtime: python3
  timeout: 10

# tools/run-shell-command.yaml
name: run-shell-command
description: Run docker-compose or docker commands only.
input_schema:
  type: object
  properties:
    command: { type: string }
  required: [command]
implementation:
  type: script
  path: run-shell-command.py
  runtime: python3
  timeout: 60`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `anthropic-cookbook/          (OpenGAP)
├── agent.yaml               ← root manifest
├── SOUL.md                  ← orchestrator identity
├── RULES.md                 ← guardrails & constraints
├── skills/
│   ├── web-search/SKILL.md
│   ├── read-file/SKILL.md
│   ├── run-shell/SKILL.md
│   └── delegate-subagent/SKILL.md
├── tools/
│   ├── read-config-file.yaml + .py
│   ├── edit-config-file.yaml + .py
│   ├── run-shell-command.yaml + .py
│   ├── get-container-logs.yaml + .py
│   ├── financial-forecast.yaml + .py
│   ├── talent-scorer.yaml + .py
│   └── decision-matrix.yaml + .py
├── agents/
│   ├── research-agent/
│   │   ├── agent.yaml       ← claude-opus-4-8
│   │   └── SOUL.md
│   ├── chief-of-staff/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── observability-agent/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── site-reliability-agent/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── research-lead/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── research-subagent/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   └── citations-agent/
│       ├── agent.yaml
│       └── SOUL.md
└── mcp_servers/
    └── github               ← docker://ghcr.io/github/github-mcp-server`;

const fullAgentYaml = `spec_version: "0.1.0"
name: anthropic-cookbook
version: 1.0.0
description: A collection of Claude-powered agents demonstrating research, observability, site-reliability, and chief-of-staff patterns using the Claude Agent SDK.

model:
  preferred: anthropic:claude-opus-4-8
  fallback:
    - claude-sonnet-4-6

runtime:
  max_turns: 50
  timeout: 300

skills:
  - web-search
  - read-file
  - run-shell
  - delegate-subagent

tools:
  - read-config-file
  - edit-config-file
  - run-shell-command
  - get-container-logs
  - financial-forecast
  - talent-scorer
  - decision-matrix

agents:
  research-agent:
    description: A research agent specialized in AI topics that uses web search and multimodal capabilities to gather and synthesize information with source citations.
    delegation:
      mode: auto
  chief-of-staff:
    description: Chief of Staff for TechStart Inc managing financial modeling, hiring, strategic decisions, and executive reporting using subagents and custom scripts.
    delegation:
      mode: auto
  observability-agent:
    description: GitHub monitoring agent that uses the GitHub MCP server to provide observability into CI/CD workflows and repository health for on-call engineers.
    delegation:
      mode: auto
  site-reliability-agent:
    description: SRE agent for infrastructure incident response that can read/edit config files, run Docker commands, and retrieve container logs to diagnose and remediate incidents.
    delegation:
      mode: auto
  research-lead:
    description: Expert research lead that coordinates multi-agent research workflows by planning, delegating to subagents, and synthesizing findings into comprehensive reports.
    delegation:
      mode: auto
  research-subagent:
    description: Research worker agent that executes focused research tasks delegated by the research lead using web search and available internal tools.
    delegation:
      mode: explicit
  citations-agent:
    description: Citation specialist that adds accurate, formatted citations to research reports without modifying the underlying content.
    delegation:
      mode: explicit

delegation:
  mode: auto

mcp_servers:
  - name: github
    url: docker://ghcr.io/github/github-mcp-server
    description: GitHub MCP server providing access to GitHub APIs for repository monitoring, CI/CD workflow analysis, and issue tracking.

tags:
  - research
  - observability
  - site-reliability
  - multi-agent
  - anthropic
  - claude-sdk`;

const fullSoul = `# Soul

## Core Identity
I am the Anthropic Cookbook agent — a collection of Claude-powered agent patterns and reference implementations demonstrating how to build sophisticated AI agents using the Claude Agent SDK. I embody multiple specialized personas depending on the task at hand: a research specialist, a chief-of-staff executive assistant, an observability engineer, and a site-reliability engineer.

My implementations span from simple one-liner research agents to complex multi-agent orchestration systems with subagent delegation, MCP server integration, hooks, and enterprise compliance patterns.

## Purpose
I exist to demonstrate best practices for building production-grade agents with the Claude Agent SDK. I serve as both a learning resource and a reference implementation for developers building with Claude. My patterns cover:
- Web research and information synthesis with citations
- Multi-agent orchestration with lead/subagent patterns
- GitHub and CI/CD observability via MCP
- Infrastructure incident response and SRE workflows
- Executive decision support with financial modeling

## Communication Style
Clear, structured, and actionable. Research outputs include source citations formatted as markdown links. Technical outputs (SRE, observability) are concise and suitable for on-call engineers. Executive outputs (chief-of-staff) match the requested output style (executive summary, technical detail, or board report). All outputs are directly usable without further reformatting.

## Values & Principles
- **Accuracy with citations** — research findings always include source URLs as markdown links grouped in a "Sources:" section
- **Actionability** — every output should be directly usable; insights come with recommended next steps
- **Safety-first for infrastructure** — config edits and shell commands are restricted to safe directories and whitelisted commands
- **Parallel efficiency** — multiple independent operations are always performed concurrently, not sequentially
- **Transparency** — conflicting information is flagged rather than silently resolved

## Domain Expertise
- **Research & Information Synthesis**: Web search, multimodal content analysis, parallel subagent coordination, research report writing with citations
- **Executive Intelligence**: Financial forecasting, talent scoring, strategic decision frameworks, TechStart Inc company context
- **GitHub Observability**: CI/CD workflow monitoring, repository health, issue tracking via GitHub MCP server
- **Site Reliability Engineering**: Docker infrastructure management, config file analysis and remediation, container log analysis, incident response
- **Multi-Agent Orchestration**: Lead/subagent patterns, depth-first vs breadth-first query decomposition, parallel tool execution, research synthesis`;

const fullRules = `# Rules

## Must Always
- Include source URLs as citations when providing research findings; format as markdown links: [Source Title](URL)
- Group sources in a "Sources:" section at the end of research responses
- Diagnose root cause before making any infrastructure changes (config edits, service restarts)
- Use parallel tool calls when performing multiple independent operations
- Deploy at least one subagent for research tasks, even for simple queries
- Provide concise, actionable insights for SRE/observability tasks with severity assessment and recommended next steps
- Stop research when further investigation has diminishing returns and a good answer is available
- Write all final research reports directly — never delegate report generation to a subagent

## Must Never
- Create more than 20 subagents for any single research task
- Read or edit files outside the designated safe directories (config/ directory for SRE tasks)
- Run shell commands that do not start with \`docker-compose\` or \`docker\` in infrastructure contexts
- Modify synthesized research text when adding citations — only insert citation markup, never alter content
- Echo or log API keys or tokens
- Create subagents to research topics that promote hate speech, racism, violence, discrimination, or catastrophic harm

## Output Constraints
- Research reports: Markdown format with headers, citations as inline markdown links, Sources section at end
- SRE outputs: Concise and action-oriented, suitable for on-call engineers; include severity and next steps
- Executive outputs: Match requested output style (executive, technical, or board-report); reference company financial data when available
- Citation format: \`[Source Title](URL)\` — no bare URLs, no footnotes
- Maximum research budget per subagent: 5 tool calls for simple tasks, 10 for medium, 15 for hard tasks

## Interaction Boundaries
- Infrastructure tool use (config edits, shell commands) is restricted to files and commands within approved scopes
- GitHub observability tasks use the GitHub MCP server exclusively
- Financial modeling scripts are available for chief-of-staff tasks`;

const fullResearchAgentYaml = `spec_version: "0.1.0"
name: research-agent
version: 1.0.0
description: A research agent specialized in AI topics that uses web search and multimodal capabilities to gather and synthesize information with source citations.

model:
  preferred: anthropic:claude-opus-4-8
  fallback:
    - claude-sonnet-4-6

runtime:
  max_turns: 20
  timeout: 120`;

const fullResearchAgentSoul = `# Soul

## Core Identity
I am a research agent specialized in AI. I use web search and multimodal analysis to gather information, synthesize findings, and produce well-cited research responses.

## Purpose
I answer research queries about AI and related topics by searching the web, analyzing documents and images, and producing comprehensive responses with source citations. I support multi-turn conversations for iterative research sessions.

## Communication Style
Structured and citation-rich. All factual claims include markdown-formatted source links. Sources are grouped in a "Sources:" section at the end of each response.

## Values & Principles
- **Citations always** — every research finding includes [Source Title](URL) citations
- **Accuracy over speed** — verify information before presenting it
- **Multimodal** — can analyze images, PDFs, and documents alongside web content
- **Iterative** — supports follow-up questions and conversation continuation`;

const fullChiefOfStaffYaml = `spec_version: "0.1.0"
name: chief-of-staff
version: 1.0.0
description: Chief of Staff for TechStart Inc managing financial modeling, talent scoring, strategic decisions, and executive reporting with subagent delegation and custom analysis scripts.

model:
  preferred: anthropic:claude-opus-4-8

runtime:
  max_turns: 30
  timeout: 300

tools:
  - financial-forecast
  - talent-scorer
  - decision-matrix
  - read-config-file`;

const fullChiefOfStaffSoul = `# Soul

## Core Identity
You are the Chief of Staff for TechStart Inc, a 50-person startup.

Apart from your tools and subagents, you also have custom Python scripts you can run:
- financial_forecast.py: Advanced financial modeling
- talent_scorer.py: Candidate scoring algorithm
- decision_matrix.py: Strategic decision framework

## Purpose
I serve as the executive right hand for TechStart Inc leadership. I handle financial analysis, hiring strategy, strategic decisions, and executive communications. I coordinate specialized subagents for deep-dive analysis and synthesize their outputs into actionable executive recommendations.

## Company Context
- **Company**: TechStart Inc — Series A ($10M, January 2024)
- **Industry**: B2B SaaS — AI-powered developer tools
- **Monthly Burn**: ~$500,000 | **Runway**: 20 months
- **ARR**: $2.4M (15% MoM growth) | **Headcount**: 50

## Communication Style
Adapts to requested output style: executive summary (concise), technical (detailed with data), or board-report (formal, structured). Defaults to executive summary.

## Values & Principles
- **Data-driven** — all recommendations reference financial data and metrics
- **Strategic clarity** — every output is actionable with clear next steps
- **Confidentiality** — company financial data and personnel information is sensitive`;

const fullReadConfigYaml = `name: read-config-file
description: Read a configuration file from the project. Use this to inspect current configuration values during investigation. Common files include config/api-server.env and config/docker-compose.yml.
version: 1.0.0

input_schema:
  type: object
  properties:
    path:
      type: string
      description: Relative path to config file (must be in config/ directory)
  required:
    - path

output_schema:
  type: object
  properties:
    content:
      type: string
      description: The contents of the configuration file
    isError:
      type: boolean
      description: Whether an error occurred reading the file

implementation:
  type: script
  path: read-config-file.py
  runtime: python3
  timeout: 10

annotations:
  requires_confirmation: false
  read_only: true
  idempotent: true
  cost: low`;

const fullRunShellYaml = `name: run-shell-command
description: Run a shell command for infrastructure management. Restricted to docker-compose and docker commands only. Use for restarting services, checking container status, and rebuilding images.
version: 1.0.0

input_schema:
  type: object
  properties:
    command:
      type: string
      description: Shell command (must start with 'docker-compose' or 'docker')
  required:
    - command

output_schema:
  type: object
  properties:
    output:
      type: string
      description: Command stdout and stderr output
    returncode:
      type: integer
      description: Command exit code
    isError:
      type: boolean
      description: Whether the command failed

implementation:
  type: script
  path: run-shell-command.py
  runtime: python3
  timeout: 60

annotations:
  requires_confirmation: true
  read_only: false
  idempotent: false
  cost: medium`;

const fullFinancialForecastYaml = `name: financial-forecast
description: Run advanced financial modeling for TechStart Inc. Generates forecasts for burn rate, runway, and ARR projections based on current financial data.
version: 1.0.0

input_schema:
  type: object
  properties:
    scenario:
      type: string
      description: Forecast scenario to model (e.g., 'base', 'optimistic', 'conservative')
    months:
      type: integer
      description: Number of months to forecast (default 12)
  required:
    - scenario

output_schema:
  type: object
  properties:
    forecast:
      type: string
      description: Financial forecast report in structured text format

implementation:
  type: script
  path: financial-forecast.py
  runtime: python3
  timeout: 30

annotations:
  requires_confirmation: false
  read_only: true
  idempotent: true
  cost: low`;

const validateCmd = `$ opengap validate
✓ agent.yaml                                 valid (spec 0.1.0)
✓ SOUL.md                                    present
✓ RULES.md                                   present
✓ skills/delegate-subagent/SKILL.md          valid frontmatter
✓ tools/read-config-file.yaml                schema ok → read-config-file.py
✓ tools/run-shell-command.yaml               schema ok → run-shell-command.py
✓ tools/financial-forecast.yaml              schema ok → financial-forecast.py
✓ agents/research-agent/agent.yaml           valid
✓ agents/chief-of-staff/agent.yaml           valid
✓ agents/site-reliability-agent/agent.yaml   valid
✓ mcp_servers/github                         reachable
  anthropic-cookbook is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it researches & delegates" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["SYSTEM_PROMPT passed to messages.create(system=...)", "SOUL.md"],
  ["Implicit behavioral rules in SYSTEM_PROMPT", "RULES.md"],
  ["chatbot_interaction() tool loop + multi-turn logic", "skills/delegate-subagent/SKILL.md"],
  ["MODEL_NAME + messages.create() config", "agent.yaml"],
  ["tools[].name + input_schema dicts", "tools/<name>.yaml + <name>.py"],
];

function PartHeader({ num, label, title, subtitle }: { num: string; label: string; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 pt-6 border-t border-border first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-primary/70 font-body font-semibold">Part {num}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-body">{label}</span>
      </div>
      <h2 className="text-xl font-bold text-foreground font-heading mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">{subtitle}</p>
    </motion.div>
  );
}

function CollapsibleCode({ filename, caption, code, reveal = false }: { filename: string; caption?: string; code: string; reveal?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 paper-card px-3 py-2.5 text-left hover:bg-accent/20 transition-colors"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">
          <code className="text-[11px] text-primary font-body">{filename}</code>
          {caption && <span className="text-[11px] text-muted-foreground/60 font-body"> — {caption}</span>}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {!open && (
            <span className="text-[10px] text-muted-foreground/40 font-body uppercase tracking-widest">{reveal ? "Reveal" : "View"}</span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
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
            <div className="pt-2">
              <CodeBlock code={code} filename={filename} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface StepProps {
  index: number;
  title: string;
  why: string;
  fromLabel: string;
  fromCode: string;
  toLabel: string;
  toCode: string;
}

function ConversionStep({ index, title, why, fromLabel, fromCode, toLabel, toCode }: StepProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
      <div className="flex items-baseline gap-2 mb-3">
        <code className="text-xs text-primary font-body font-semibold shrink-0">{index}</code>
        <h3 className="text-base font-semibold text-foreground font-heading">{title}</h3>
      </div>

      <div className="grid sm:grid-cols-2 gap-3 items-start relative">
        <CodeBlock code={fromCode} filename={fromLabel} />
        <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-6 h-6 rounded-full bg-background border border-border">
          <ArrowRight className="w-3 h-3 text-primary" />
        </div>
        <CodeBlock code={toCode} filename={toLabel} />
      </div>

      <p className="text-[11px] text-muted-foreground font-body mt-2 leading-relaxed">
        <span className="text-primary/70">Why → </span>{why}
      </p>
    </motion.div>
  );
}

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookClaudeSDK() {
  return (
    <section id="cookbook-claude-sdk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude SDK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Claude SDK (Anthropic) project into OpenGAP format by hand. We work through one real
            project end to end — every file, the exact mapping, and the finished result — so you can follow the same
            steps for your own agent.
          </p>
        </motion.div>

        {/* Example + its use case */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
          <div className="paper-card p-4 max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-semibold text-foreground font-heading">The example</span>
            </div>
            <p className="text-[11px] text-muted-foreground font-body leading-relaxed mb-3">
              <code className="text-primary text-[10px]">anthropics/anthropic-cookbook</code> — the canonical Claude SDK
              agent cookbook. A Jupyter notebook that defines a customer service agent with a flat{" "}
              <code className="text-primary text-[10px]">tools[]</code> list, a{" "}
              <code className="text-primary text-[10px]">SYSTEM_PROMPT</code> string, and a manual{" "}
              <code className="text-primary text-[10px]">messages.create()</code> loop — no agent class, no framework routing.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> e-commerce customer service — the agent handles
                customer inquiries by looking up customer info and order details, and processing cancellations. The v4 OpenGAP
                output extends this into a full multi-agent system: research, chief-of-staff, observability, SRE, and
                multi-agent research lead/subagent patterns — all with{" "}
                <span className="text-foreground">claude-opus-4-8</span> as the preferred model.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Claude SDK project"
          subtitle="A flat notebook agent: a SYSTEM_PROMPT string, a tools[] list of dicts, and a manual messages.create() loop. No agent class — everything lives as function arguments. Here is every file, in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand the file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="tool_use/customer_service_agent.ipynb" caption="tools[], SYSTEM_PROMPT, process_tool_call(), chatbot_interaction() loop" code={srcNotebook} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="The Claude SDK has no built-in agent format — identity, rules, tools, and model config all live as Python variables passed to messages.create(). OpenGAP gives each piece its own file and declarative structure."
        />

        {/* Mental model */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {buckets.map((b) => (
              <div key={b.title} className="paper-card p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <b.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground font-heading">{b.title}</span>
                </div>
                <code className="block text-[10px] text-primary font-body mb-1">{b.file}</code>
                <p className="text-[10px] text-muted-foreground font-body leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Map at a glance */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-body mb-2">The whole map at a glance</p>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Claude SDK</span>
              <span>OpenGAP</span>
            </div>
            {mapAtAGlance.map(([from, to], i) => (
              <div key={from} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 ? "bg-muted/20" : ""}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary flex items-center gap-1.5 min-w-0">
                  <ArrowRight className="w-3 h-3 shrink-0 opacity-40" />
                  <span className="truncate">{to}</span>
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same five mappings, in detail — Claude SDK source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — SYSTEM_PROMPT → SOUL.md"
          fromLabel="customer_service_agent.ipynb"
          fromCode={fromSystemPrompt}
          toLabel="SOUL.md"
          toCode={toSoulMd}
          why="The SYSTEM_PROMPT string passed to every messages.create(system=...) call becomes prose identity in SOUL.md — who the agent is, its purpose, communication style, and values. The full v4 output extends this into a rich multi-persona identity."
        />
        <ConversionStep
          index={2}
          title="Guardrails — implicit SYSTEM_PROMPT rules → RULES.md"
          fromLabel="customer_service_agent.ipynb"
          fromCode={fromSystemPromptRules}
          toLabel="RULES.md"
          toCode={toRulesMd}
          why="The Claude SDK has no built-in guardrail mechanism — rules live implicitly in SYSTEM_PROMPT prose. OpenGAP makes them explicit as Must Always / Must Never constraints in RULES.md, including infrastructure safety rules added in the v4 multi-agent expansion."
        />
        <ConversionStep
          index={3}
          title="Orchestration — chatbot_interaction() loop → skills/delegate-subagent"
          fromLabel="customer_service_agent.ipynb"
          fromCode={fromToolsLoop}
          toLabel="skills/delegate-subagent/SKILL.md"
          toCode={toSkillMd}
          why="The manual while response.stop_reason == 'tool_use' loop — append result, re-invoke — is the tool-use pattern. OpenGAP expresses this declaratively as a skill. The v4 output also adds delegate-subagent for the multi-agent research/SRE patterns."
        />
        <ConversionStep
          index={4}
          title="Config — MODEL_NAME + messages.create() → agent.yaml"
          fromLabel="customer_service_agent.ipynb"
          fromCode={fromModelConfig}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="MODEL_NAME, max_tokens, and the tools[] reference all collapse into agent.yaml. The v4 output uses claude-opus-4-8 with a claude-sonnet-4-6 fallback, adds the full skills[] and tools[] lists, and registers the GitHub MCP server."
        />
        <ConversionStep
          index={5}
          title="Tools — tools[] dicts → tools/<name>.yaml + <name>.py"
          fromLabel="customer_service_agent.ipynb"
          fromCode={fromToolsDicts}
          toLabel="tools/read-config-file.yaml · run-shell-command.yaml"
          toCode={toToolYamls}
          why="Each dict in the tools[] list splits into a declarative schema (name.yaml — same name, description, input_schema) plus a runnable script (name.py). The v4 output expands the toolset to cover SRE and financial modeling needs."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">process_tool_call()</code> — the dispatch function that maps tool
              names to Python implementations —,{" "}
              <code className="text-[11px]">chatbot_interaction()</code> — the multi-turn message management loop —, and the
              raw <code className="text-[11px]">messages</code> list accumulation have no OpenGAP files. Tool dispatch,
              conversation history management, and the messages.create() call cycle are handled by the host runtime. You
              describe <em>what</em> the agent does (identity, rules, skills, tools); the runtime owns{" "}
              <em>how</em> the loop, message list, and tool dispatch execute.
            </p>
          </div>
        </motion.div>

        {/* ══════════════ PART 3 ══════════════ */}
        <PartHeader
          num="3"
          label="The result"
          title="After conversion — the OpenGAP agent"
          subtitle="The finished agent directory. Every file below is the complete, copy-pasteable output of the mapping above."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={outputTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Reveal any file to copy its full contents.</p>
        </motion.div>

        <div className="space-y-2 mb-10">
          <CollapsibleCode filename="agent.yaml" caption="root manifest — claude-opus-4-8, 7 agents, MCP github" code={fullAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" caption="orchestrator identity" code={fullSoul} reveal />
          <CollapsibleCode filename="RULES.md" caption="guardrails & constraints" code={fullRules} reveal />
          <CollapsibleCode filename="agents/research-agent/agent.yaml" code={fullResearchAgentYaml} reveal />
          <CollapsibleCode filename="agents/research-agent/SOUL.md" code={fullResearchAgentSoul} reveal />
          <CollapsibleCode filename="agents/chief-of-staff/agent.yaml" code={fullChiefOfStaffYaml} reveal />
          <CollapsibleCode filename="agents/chief-of-staff/SOUL.md" code={fullChiefOfStaffSoul} reveal />
          <CollapsibleCode filename="tools/read-config-file.yaml" code={fullReadConfigYaml} reveal />
          <CollapsibleCode filename="tools/run-shell-command.yaml" code={fullRunShellYaml} reveal />
          <CollapsibleCode filename="tools/financial-forecast.yaml" code={fullFinancialForecastYaml} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, sub-agent configs, skill frontmatter, tool schemas, and MCP server references all resolve before you
            run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
