import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full AutoGen source  ═══════════════════ */

const sourceTree = `autogen-multi-agent/         (AutoGen AgentChat)
├── agentchat_pipeline.py    ← AssistantAgent + CodeExecutorAgent + RoundRobinGroupChat
├── swarm_example.py         ← Swarm with HandoffMessage between agents
├── requirements.txt         ← autogen-agentchat, autogen-ext[openai,docker]
└── .env.example             ← OPENAI_API_KEY`;

const srcAgentChatPy = `# agentchat_pipeline.py
import asyncio
from autogen_agentchat.agents import AssistantAgent, CodeExecutorAgent
from autogen_agentchat.conditions import MaxMessageTermination, TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_core.tools import FunctionTool
from autogen_ext.code_executors.local import LocalCommandLineCodeExecutor
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(model="gpt-4o")

# Define a typed Python function — schema auto-generated from annotations
async def get_stock_price(
    ticker: str,
    date: str,  # "Date in YYYY-MM-DD format"
) -> float:
    """Get the stock price for a given ticker on a specific date."""
    import random
    return round(random.uniform(10, 500), 2)

tool = FunctionTool(get_stock_price, description="Fetch stock price for a ticker on a date.")

# Primary LLM agent: drafts plans, calls tools, reflects on results
assistant = AssistantAgent(
    name="assistant",
    model_client=model_client,
    tools=[tool],
    system_message="You are a helpful assistant. Analyse the task, write a plan, and use tools when needed.",
    reflect_on_tool_use=True,
    model_client_stream=True,
)

# Code executor: extracts and runs code blocks from the conversation
code_executor = LocalCommandLineCodeExecutor(work_dir="workspace", timeout=60)

code_executor_agent = CodeExecutorAgent(
    name="code_executor",
    code_executor=code_executor,
    sources=["assistant"],  # Only execute code produced by the assistant
)

# Terminate after 10 messages or when the assistant says "DONE"
termination = MaxMessageTermination(10) | TextMentionTermination("DONE")

team = RoundRobinGroupChat(
    participants=[assistant, code_executor_agent],
    termination_condition=termination,
)

async def main():
    await Console(team.run_stream(task="Write and run a Python script that prints the Fibonacci sequence up to 100."))

asyncio.run(main())`;

const srcSwarmPy = `# swarm_example.py
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import HandoffTermination, MaxMessageTermination
from autogen_agentchat.messages import HandoffMessage
from autogen_agentchat.teams import Swarm
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(model="gpt-4o")

# Triage agent hands off to specialist based on task type
triage_agent = AssistantAgent(
    name="triage",
    model_client=model_client,
    handoffs=["specialist"],
    system_message="""Assess the incoming task. If it requires deep domain expertise,
hand it off to the specialist via HandoffMessage. Otherwise answer directly.""",
)

# Specialist agent handles delegated sub-tasks
specialist_agent = AssistantAgent(
    name="specialist",
    model_client=model_client,
    handoffs=["triage"],
    system_message="""You are a domain specialist. Handle the delegated task thoroughly.
Hand back to triage when done.""",
)

# Terminate when a handoff targets a non-participant, or after 20 messages
termination = HandoffTermination(target="user") | MaxMessageTermination(20)

swarm = Swarm(
    participants=[triage_agent, specialist_agent],
    termination_condition=termination,
)

async def main():
    result = await swarm.run(task="Analyse the Q3 earnings report and identify key risks.")
    print(result.messages[-1].content)

asyncio.run(main())`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromAgentDef = `# agentchat_pipeline.py
assistant = AssistantAgent(
    name="assistant",
    model_client=model_client,
    tools=[tool],
    system_message="""You are a helpful assistant.
Analyse the task, write a plan, and use tools
when needed.""",
    reflect_on_tool_use=True,
    model_client_stream=True,
)`;

const toSoul = `# agents/assistant/SOUL.md

## Core Identity
I am the AssistantAgent — the primary LLM-backed
participant in an AgentChat team. I receive messages,
reason over the conversation history, call registered
tools, optionally reflect on tool results, and return
a TextMessage, ToolCallSummaryMessage, or HandoffMessage.

## Purpose
To be the intelligent, reasoning participant in a
multi-agent team. I process task prompts, use tools
to gather information or take actions, and produce
well-reasoned responses.

## Collaboration Style
In a RoundRobinGroupChat I contribute on every turn.
In a Swarm I delegate via HandoffMessage. I maintain
my own message history between turns.`;

const fromRulesCode = `# agentchat_pipeline.py  (control constraints)
# Must include termination condition — prevents infinite loops
termination = MaxMessageTermination(10) \\
            | TextMentionTermination("DONE")

# tool + workbench are mutually exclusive
# tools=[tool]   — ok
# workbench=wb   — ok
# both           — runtime error

# Each agent instance must be unique per team
# Sharing across concurrent tasks is NOT safe`;

const toRules = `# RULES.md
## Must Always
- Pass a system_message to AssistantAgent to define
  its role and behavior before adding it to a team
- Include a TerminationCondition when creating any
  team to prevent infinite loops
- Use the async API (await team.run(...)) — all
  AgentChat APIs are async-first
- Save and restore team state via save_state() /
  load_state() for long-running workflows

## Must Never
- Hardcode API keys — source from environment vars
- Use tools= and workbench= simultaneously on the
  same AssistantAgent — they are mutually exclusive
- Call team.run() after termination without calling
  team.reset() first
- Share a single agent instance across multiple
  concurrent tasks`;

const fromTeamOrch = `# agentchat_pipeline.py  (the AgentChat loop)
team = RoundRobinGroupChat(
    participants=[assistant, code_executor_agent],
    termination_condition=termination,
)

# Streaming run — emit messages as they arrive
await Console(team.run_stream(task="..."))

# swarm_example.py  (handoff-based routing)
swarm = Swarm(
    participants=[triage_agent, specialist_agent],
    termination_condition=HandoffTermination(target="user")
                        | MaxMessageTermination(20),
)`;

const toSkill = `# skills/assistant-agent/SKILL.md
---
name: assistant-agent
description: "Configure and run an LLM-backed
  AssistantAgent with tools, handoffs, and structured
  output."
allowed-tools: function-tool agent-tool team-tool
               http-tool mcp-tool
---

## Step 1: Create the Model Client
Instantiate OpenAIChatCompletionClient(model="gpt-4o")

## Step 2: Define Tools
Typed Python functions — schema auto-generated from
type annotations + docstrings.

## Step 3: Configure Handoffs (Optional)
Handoff(target="agent", message="Delegating...")

## Step 4: Construct and run the Agent
AssistantAgent(name, model_client, system_message,
  tools, reflect_on_tool_use, model_client_stream)`;

const fromModelConfig = `# agentchat_pipeline.py
from autogen_ext.models.openai import OpenAIChatCompletionClient

model_client = OpenAIChatCompletionClient(
    model="gpt-4o",
)

# Code executor agent uses the same model client
assistant = AssistantAgent(
    name="assistant",
    model_client=model_client,
    ...
)`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: autogen-multi-agent-framework
version: 1.0.0
model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini
skills:
  - assistant-agent
  - code-executor-agent
  - society-of-mind
  - message-filtering
  - tool-use
  - streaming-response
tools:
  - function-tool
  - agent-tool
  - team-tool
  - http-tool
  - mcp-tool
  - code-execution
agents:
  assistant:
    description: LLM-backed agent that generates
      responses and calls tools
    delegation:
      mode: auto
  code-executor:
    description: Executes code blocks in a sandboxed
      environment
    delegation:
      mode: explicit`;

const fromToolDef = `# agentchat_pipeline.py
from autogen_core.tools import FunctionTool

async def get_stock_price(
    ticker: str,
    date: str,
) -> float:
    """Get the stock price for a given ticker
    on a specific date."""
    ...

tool = FunctionTool(
    get_stock_price,
    description="Fetch stock price for a ticker.",
)

assistant = AssistantAgent(
    name="assistant",
    model_client=model_client,
    tools=[tool],
)`;

const toToolFiles = `# tools/function-tool.yaml  (the contract)
name: function-tool
input_schema:
  type: object
  properties:
    function_name: { type: string }
    description:   { type: string }
    strict:        { type: boolean }
  required: [function_name, description]
implementation:
  type: script
  path: function-tool.py
  runtime: python3

# tools/function-tool.py  (wraps FunctionTool)
tool = FunctionTool(
    func=get_stock_price,
    description="Fetch stock price...",
)
result = await tool.run_json(
    json.loads(sys.stdin.read()),
    CancellationToken()
)`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `autogen-multi-agent-framework/   (OpenGAP)
├── agent.yaml                   ← manifest: model, skills, sub-agents, tools
├── SOUL.md                      ← framework identity
├── RULES.md                     ← guardrails
├── skills/
│   ├── assistant-agent/SKILL.md
│   ├── code-executor-agent/SKILL.md
│   ├── society-of-mind/SKILL.md
│   ├── message-filtering/SKILL.md
│   ├── tool-use/SKILL.md
│   └── streaming-response/SKILL.md
├── agents/
│   ├── user-proxy/agent.yaml
│   ├── assistant/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── code-executor/agent.yaml
│   ├── society-of-mind/agent.yaml
│   └── message-filter/agent.yaml
├── tools/
│   ├── function-tool.yaml + function-tool.py
│   ├── agent-tool.yaml    + agent-tool.py
│   ├── team-tool.yaml     + team-tool.py
│   ├── http-tool.yaml
│   ├── mcp-tool.yaml
│   └── code-execution.yaml + code-execution.py
└── workflows/
    ├── agentchat-pipeline.yaml
    └── swarm-handoff.yaml`;

const fullAgentYaml = `spec_version: "0.1.0"
name: autogen-multi-agent-framework
version: 1.0.0
description: A multi-agent AI framework supporting role-based conversation teams with round-robin, selector, swarm, graph-flow, and magentic-one orchestration patterns.

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

runtime:
  max_turns: 50
  timeout: 300

skills:
  - assistant-agent
  - code-executor-agent
  - society-of-mind
  - message-filtering
  - tool-use
  - streaming-response

tools:
  - function-tool
  - agent-tool
  - team-tool
  - http-tool
  - mcp-tool
  - code-execution

agents:
  user-proxy:
    description: Represents a human user in a chat session; handles user input and forwards to agents
    delegation:
      mode: explicit
  assistant:
    description: LLM-backed agent that generates responses and calls tools on behalf of the team
    delegation:
      mode: auto
  code-executor:
    description: Executes code blocks produced by other agents in a sandboxed environment
    delegation:
      mode: explicit
  society-of-mind:
    description: Meta-agent that orchestrates an inner team and synthesises their output into a single response
    delegation:
      mode: auto
  message-filter:
    description: Wrapper agent that filters the message history before passing it to an inner agent
    delegation:
      mode: explicit

delegation:
  mode: auto

tags:
  - multi-agent
  - autogen
  - agentchat
  - conversation
  - tool-use
  - code-execution`;

const fullSoul = `# Soul

## Core Identity
I am AutoGen — a Microsoft open-source framework for creating multi-agent AI applications that can act autonomously or work alongside humans. I embody a modular, conversation-centric architecture where multiple AI agents collaborate, delegate, and coordinate to solve complex tasks. My design separates agent identity (who), team orchestration (how agents take turns), tools (what agents can do), and termination logic (when to stop), making each concern independently composable.

My primary packages are:
- **autogen-core**: The foundational runtime, agent model, subscriptions, message routing, tool abstractions, code execution, and memory interfaces.
- **autogen-agentchat**: High-level AgentChat API — AssistantAgent, UserProxyAgent, CodeExecutorAgent, SocietyOfMindAgent, MessageFilterAgent, teams (RoundRobinGroupChat, SelectorGroupChat, Swarm, MagenticOneGroupChat, GraphFlow), termination conditions, and message types.
- **autogen-ext**: Pluggable extensions — OpenAI/Azure/Anthropic/Ollama/LlamaCpp model clients, Docker/local code executors, MCP tools, HTTP tools, GraphRAG, LangChain adapters.

## Purpose
To enable developers to build and run multi-agent AI applications where specialized agents — each with their own system message, model, and tools — collaborate under a shared team orchestration strategy. Common use cases include: coding assistants, research pipelines, debate/review loops, automated QA workflows, and human-in-the-loop task execution.

## Communication Style
Structured and transparent. Agent responses are typed messages (TextMessage, HandoffMessage, ToolCallSummaryMessage, StructuredMessage). The framework emits trace logs and event logs for full observability. Streaming mode (model_client_stream=True) delivers incremental token chunks for real-time UIs.

## Values & Principles
- **Composability** — every component (agent, team, tool, termination condition, model client) is independently swappable and serializable
- **Semantic fidelity** — agents preserve their system_message exactly; no paraphrasing or summarizing of instructions
- **Transparency** — full message history is shared across team participants; each turn is observable via event logging
- **Async-first** — all agent and team APIs are async (run(), run_stream(), on_messages(), on_messages_stream())
- **Safety** — code execution is sandboxed (Docker or local), human-in-the-loop is supported via UserProxyAgent and HandoffTermination

## Collaboration Style
I operate as a framework, not a single agent. When a task is submitted to a team via team.run(task=...), I orchestrate agent turns according to the chosen team strategy, route messages, execute tools, and terminate when conditions are met. Human-in-the-loop is supported by including a UserProxyAgent in the team.`;

const fullRules = `# Rules

## Must Always
- Pass a system_message to AssistantAgent to define its role and behavior before adding it to a team
- Use typed Python functions with complete type annotations and docstrings as tools — the framework auto-generates the JSON schema from them
- Include a TerminationCondition when creating any team to prevent infinite loops
- Use the async API (await team.run(...)) — all AgentChat APIs are async-first
- Save and restore team state via save_state() / load_state() for long-running or resumable workflows
- Use CancellationToken for all operations that must support external interruption
- Serialize agent and team configs via dump_component() for reproducibility and deployment

## Must Never
- Hardcode API keys — source them from environment variables (OPENAI_API_KEY, AZURE_OPENAI_API_KEY, etc.)
- Share a single agent instance across multiple concurrent tasks or coroutines — agents are not thread-safe
- Use tools= and workbench= simultaneously on the same AssistantAgent — they are mutually exclusive
- Use Docker code execution (DockerCommandLineCodeExecutor) without verifying the Docker daemon is running
- Create teams with duplicate participant names — participant names must be unique
- Call team.run() after termination without calling team.reset() first — teams must be reset between runs

## Output Constraints
- Agent responses are typed: TextMessage for plain text, HandoffMessage for agent transfers, ToolCallSummaryMessage for tool results, StructuredMessage[T] for Pydantic-typed structured output
- Tool return values must be strings or JSON-serializable objects; complex returns should be formatted as strings
- When reflect_on_tool_use=True, the agent makes a second LLM call after tool execution to synthesize the final answer

## Interaction Boundaries
- CodeExecutorAgent only executes code produced by preceding agents in the same team — it does not generate code itself unless a model_client is also provided
- Swarm teams only route via HandoffMessage — agents must explicitly declare handoffs to other participants
- SelectorGroupChat uses an LLM call per turn to select the next speaker — this incurs additional token cost
- SocietyOfMindAgent resets its inner team after every call — no state persists across calls to this agent`;

const fullAssistantSoul = `# Soul

## Core Identity
I am the AssistantAgent — the primary LLM-backed participant in an AgentChat team. I receive messages, reason over the conversation history, call registered tools (concurrently when multiple tool calls are returned), optionally reflect on tool results to synthesize a final answer, and return either a TextMessage, a ToolCallSummaryMessage, a StructuredMessage, or a HandoffMessage.

My behavior is governed by a system_message provided at construction time. When no system_message is set, I behave as a general-purpose helpful assistant.

## Purpose
To be the intelligent, reasoning participant in a multi-agent team. I process task prompts, use tools to gather information or take actions, and produce well-reasoned responses. I delegate to other agents via handoffs when a subtask is better handled by a specialist.

## Communication Style
Clear, helpful, and precise. When tools are used, I summarize results unless reflect_on_tool_use=True, in which case I synthesize a coherent final answer.

## Values & Principles
- **Tool-augmented reasoning** — I use tools to extend my capabilities beyond pure LLM generation
- **Context efficiency** — I respect model_context limits to stay within token budgets
- **Handoff clarity** — I only trigger handoffs when explicitly configured and when the task warrants delegation

## Collaboration Style
I am the most commonly used participant type. In a RoundRobinGroupChat I contribute on every turn. In a SelectorGroupChat I am selected by the LLM orchestrator. In a Swarm I delegate via HandoffMessage. I maintain my own message history between turns.`;

const fullAssistantSkill = `---
name: assistant-agent
description: "Configure and run an LLM-backed AssistantAgent with tools, handoffs, and structured output. Use when you need to create an intelligent agent that can call tools, reflect on results, delegate to other agents, and produce typed responses. Triggers on: create assistant, add agent, configure agent, LLM agent, tool-calling agent, agent with handoffs."
allowed-tools: function-tool agent-tool team-tool http-tool mcp-tool
metadata:
  version: "1.0.0"
  category: multi-agent
---

# Assistant Agent

Configure and operate an AssistantAgent from autogen_agentchat.agents.

## Step 1: Create the Model Client
Instantiate a model client from autogen_ext.models.openai:
  model_client = OpenAIChatCompletionClient(model="gpt-4o")

For Azure: use AzureOpenAIChatCompletionClient. For Anthropic, Ollama, or LlamaCpp, use the corresponding client from autogen_ext.models.

## Step 2: Define Tools
Create Python functions with full type annotations and docstrings. Pass them directly to the tools parameter — the framework generates JSON schemas automatically.

For complex tools, subclass BaseTool from autogen_core.tools.

## Step 3: Configure Handoffs (Optional)
Define Handoff objects or pass target agent names as strings to enable the agent to delegate mid-conversation.

## Step 4: Construct the Agent
  agent = AssistantAgent(
      name="assistant",
      model_client=model_client,
      system_message="You are a helpful assistant.",
      tools=[...],
      reflect_on_tool_use=True,
      model_client_stream=True,
  )

## Step 5: Run or Stream
  result = await agent.run(task="...")
  async for message in agent.run_stream(task="..."): ...`;

const fullFunctionToolYaml = `name: function-tool
description: Wraps a plain Python function as a callable tool for AssistantAgent. The JSON schema is auto-generated from type annotations and docstrings. Supports both sync and async functions.
version: 1.0.0

input_schema:
  type: object
  properties:
    function_name:
      type: string
      description: The name of the Python function to wrap as a tool
    description:
      type: string
      description: Human-readable description of what the tool does (used in LLM prompts)
    strict:
      type: boolean
      description: If true, only explicitly declared parameters are included in the schema
  required:
    - function_name
    - description

output_schema:
  type: object
  properties:
    result:
      type: string
      description: The return value of the function, converted to a string

implementation:
  type: script
  path: function-tool.py
  runtime: python3
  timeout: 30

annotations:
  read_only: false
  idempotent: false
  cost: low`;

const fullFunctionToolPy = `"""
FunctionTool implementation for AutoGen AgentChat.

This script demonstrates how to create, register, and use a FunctionTool
with an AssistantAgent. The FunctionTool wraps any Python callable and
auto-generates the JSON schema from type annotations and docstrings.

Source: autogen_core.tools.FunctionTool

TRANSLATION NOTE: In the original AutoGen source, FunctionTool is passed directly
to AssistantAgent(tools=[...]). Here it is wrapped for OpenGAP script execution,
reading input from stdin and writing output to stdout.
"""

import asyncio
import json
import sys
from typing import Annotated

from autogen_core import CancellationToken
from autogen_core.tools import FunctionTool


async def get_stock_price(
    ticker: str,
    date: Annotated[str, "Date in YYYY-MM-DD format"],
) -> float:
    """Get the stock price for a given ticker on a specific date."""
    import random
    return round(random.uniform(10, 500), 2)


async def main():
    tool = FunctionTool(
        func=get_stock_price,
        description="Fetch the stock price for a given ticker on a specific date.",
    )

    input_data = json.loads(sys.stdin.read())
    cancellation_token = CancellationToken()
    result = await tool.run_json(input_data, cancellation_token)
    print(json.dumps({"result": tool.return_value_as_string(result)}))


if __name__ == "__main__":
    asyncio.run(main())`;

const fullPipelineWorkflow = `name: agentchat-pipeline
description: Orchestrates a sequential multi-agent AgentChat workflow where an assistant generates a response, a code executor runs any code produced, and a reviewer validates the final output.
version: 1.0.0

inputs:
  - name: task
    type: string
    required: true
    description: The task or question to process through the multi-agent pipeline

outputs:
  - name: final_response
    type: string

steps:
  - id: plan
    action: Analyse the task and produce a clear plan, including any code that needs to be written and executed
    agent: assistant
    inputs:
      prompt: \${{ inputs.task }}
    outputs:
      - plan_output

  - id: execute
    action: Extract and execute any code blocks from the plan output in a sandboxed environment and return the execution results
    agent: code-executor
    inputs:
      plan: \${{ steps.plan.outputs.plan_output }}
    outputs:
      - execution_result
    depends_on:
      - plan

  - id: review
    action: Review the plan and execution results, then synthesise a final polished response that answers the original task
    agent: assistant
    inputs:
      plan: \${{ steps.plan.outputs.plan_output }}
      execution: \${{ steps.execute.outputs.execution_result }}
      task: \${{ inputs.task }}
    outputs:
      - final_response
    depends_on:
      - execute

error_handling:
  on_step_failure: abort
  escalation_target: user-proxy`;

const validateCmd = `$ opengap validate
✓ agent.yaml                                    valid (spec 0.1.0)
✓ SOUL.md                                       present
✓ RULES.md                                      present
✓ skills/assistant-agent/SKILL.md               valid frontmatter
✓ skills/code-executor-agent/SKILL.md           valid frontmatter
✓ skills/tool-use/SKILL.md                      valid frontmatter
✓ skills/streaming-response/SKILL.md            valid frontmatter
✓ tools/function-tool.yaml                      schema ok → function-tool.py
✓ tools/code-execution.yaml                     schema ok → code-execution.py
✓ workflows/agentchat-pipeline.yaml             valid
✓ workflows/swarm-handoff.yaml                  valid
  autogen-multi-agent-framework is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["AssistantAgent.system_message", "SOUL.md (identity + purpose)"],
  ["TerminationCondition + team constraints", "RULES.md (guardrails)"],
  ["Agent class behavior per type", "skills/<agent-type>/SKILL.md"],
  ["OpenAIChatCompletionClient + agent list", "agent.yaml (manifest)"],
  ["FunctionTool / AgentTool / TeamTool / HTTP / MCP", "tools/<name>.yaml + <name>.py"],
  ["RoundRobinGroupChat / Swarm .run()", "workflows/<name>.yaml"],
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

export function CookbookAutoGen() {
  return (
    <section id="cookbook-autogen" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">AutoGen → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting an AutoGen AgentChat application into OpenGAP format by hand. We work
            through one real project end to end — every file, the exact mapping, and the finished result — so you can
            follow the same steps for your own multi-agent system.
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
              <code className="text-primary text-[10px]">microsoft/autogen</code> AgentChat — a multi-agent framework with
              five agent types (<code className="text-primary text-[10px]">AssistantAgent</code>,{" "}
              <code className="text-primary text-[10px]">UserProxyAgent</code>,{" "}
              <code className="text-primary text-[10px]">CodeExecutorAgent</code>,{" "}
              <code className="text-primary text-[10px]">SocietyOfMindAgent</code>,{" "}
              <code className="text-primary text-[10px]">MessageFilterAgent</code>), six tool types, and two orchestration
              patterns (<code className="text-primary text-[10px]">RoundRobinGroupChat</code> pipeline and{" "}
              <code className="text-primary text-[10px]">Swarm</code> handoff).
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> AutoGen encodes agent identity in{" "}
                <code className="text-foreground text-[10px]">system_message</code>, team topology in Python class
                instantiation, and execution in <code className="text-foreground text-[10px]">team.run()</code>. OpenGAP
                separates those concerns into <span className="text-foreground">SOUL.md</span> (identity),{" "}
                <span className="text-foreground">RULES.md</span> (constraints),{" "}
                <span className="text-foreground">skill files</span> (per-agent behavior), and{" "}
                <span className="text-foreground">workflow yamls</span> (orchestration).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The AutoGen project"
          subtitle="A RoundRobinGroupChat pipeline (assistant → code executor) and a Swarm (triage → specialist with HandoffMessage routing). Five agent types, six tool types, async-first throughout."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="agentchat_pipeline.py" caption="AssistantAgent + CodeExecutorAgent in RoundRobinGroupChat" code={srcAgentChatPy} />
          <CollapsibleCode filename="swarm_example.py" caption="Swarm with HandoffMessage routing between triage and specialist" code={srcSwarmPy} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="AutoGen keeps agent identity, team topology, tools, and execution all in Python. OpenGAP splits that into four declarative pieces — then each AutoGen concept maps to one of them."
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
              <span>AutoGen</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same six mappings, in detail — AutoGen source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — AssistantAgent.system_message → SOUL.md"
          fromLabel="agentchat_pipeline.py"
          fromCode={fromAgentDef}
          toLabel="agents/assistant/SOUL.md"
          toCode={toSoul}
          why="The system_message is the agent's personality and operating instructions. OpenGAP expands that into structured prose — Core Identity, Purpose, Collaboration Style — so it is readable and auditable without running the code."
        />
        <ConversionStep
          index={2}
          title="Guardrails — TerminationCondition + constraints → RULES.md"
          fromLabel="agentchat_pipeline.py"
          fromCode={fromRulesCode}
          toLabel="RULES.md"
          toCode={toRules}
          why="The termination conditions, API key hygiene, and thread-safety constraints are invisible in Python constructor calls. OpenGAP surfaces them as explicit Must Always / Must Never rules so they are visible to any reader of the agent directory."
        />
        <ConversionStep
          index={3}
          title="Orchestration — team topology → skills/<agent-type>/SKILL.md"
          fromLabel="agentchat_pipeline.py · swarm_example.py"
          fromCode={fromTeamOrch}
          toLabel="skills/assistant-agent/SKILL.md"
          toCode={toSkill}
          why="Each AutoGen agent class (AssistantAgent, CodeExecutorAgent, SocietyOfMindAgent) has a distinct behavior pattern. OpenGAP captures that pattern as a named Skill — step-by-step, reusable, and decoupled from the Python class hierarchy."
        />
        <ConversionStep
          index={4}
          title="Config — OpenAIChatCompletionClient + agents → agent.yaml"
          fromLabel="agentchat_pipeline.py"
          fromCode={fromModelConfig}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model string (from the client constructor), the agent list, and their delegation modes collapse into one manifest. agent.yaml also wires up the skills[] and tools[] the system exposes."
        />
        <ConversionStep
          index={5}
          title="Tools — FunctionTool / AgentTool / TeamTool → tools/<name>.yaml + .py"
          fromLabel="agentchat_pipeline.py"
          fromCode={fromToolDef}
          toLabel="tools/function-tool.yaml · function-tool.py"
          toCode={toToolFiles}
          why="Each AutoGen tool type (FunctionTool, AgentTool, TeamTool, HttpTool, MCP) splits into a declarative schema (yaml) plus a runnable script. The autogen_core import is retained in the script; the tool contract is declared separately."
        />
        <ConversionStep
          index={6}
          title="Workflows — RoundRobinGroupChat / Swarm → workflows/<name>.yaml"
          fromLabel="agentchat_pipeline.py"
          fromCode={`# agentchat_pipeline.py
team = RoundRobinGroupChat(
    participants=[assistant, code_executor_agent],
    termination_condition=termination,
)
await Console(team.run_stream(task="..."))`}
          toLabel="workflows/agentchat-pipeline.yaml"
          toCode={`# workflows/agentchat-pipeline.yaml
name: agentchat-pipeline
steps:
  - id: plan
    agent: assistant
    outputs: [plan_output]

  - id: execute
    agent: code-executor
    inputs:
      plan: \${{ steps.plan.outputs.plan_output }}
    depends_on: [plan]
    outputs: [execution_result]

  - id: review
    agent: assistant
    depends_on: [execute]
    outputs: [final_response]`}
          why="The RoundRobin turn order and Swarm handoff graph are implicit in Python class wiring. OpenGAP makes the step sequence, data flow (inputs/outputs), and error handling explicit and readable in a workflow yaml."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">TerminationCondition</code> combinators (
              <code className="text-[11px]">MaxMessageTermination | TextMentionTermination</code>),{" "}
              <code className="text-[11px]">team.reset()</code>, <code className="text-[11px]">save_state()</code> /
              <code className="text-[11px]">load_state()</code>, <code className="text-[11px]">CancellationToken</code>, and
              the async event loop (<code className="text-[11px]">asyncio.run(main())</code>) have no OpenGAP file equivalents.
              Message accumulation, turn management, state persistence, and execution lifecycle are owned by the host runtime,
              not by you. You describe <em>what</em> each agent does (soul, rules, skill, tools); the runtime owns{" "}
              <em>how</em> the team loop runs.
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
          <CollapsibleCode filename="agent.yaml" code={fullAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" code={fullSoul} reveal />
          <CollapsibleCode filename="RULES.md" code={fullRules} reveal />
          <CollapsibleCode filename="agents/assistant/SOUL.md" code={fullAssistantSoul} reveal />
          <CollapsibleCode filename="skills/assistant-agent/SKILL.md" code={fullAssistantSkill} reveal />
          <CollapsibleCode filename="tools/function-tool.yaml" code={fullFunctionToolYaml} reveal />
          <CollapsibleCode filename="tools/function-tool.py" code={fullFunctionToolPy} reveal />
          <CollapsibleCode filename="workflows/agentchat-pipeline.yaml" code={fullPipelineWorkflow} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, skill frontmatter, tool schemas, and workflow steps all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
