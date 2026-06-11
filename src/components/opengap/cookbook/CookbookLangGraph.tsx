import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full LangGraph source  ═══════════════════ */

const sourceTree = `react-agent-main/            (LangGraph)
├── langgraph.json           ← graph entry point
├── pyproject.toml           ← dependencies
└── src/react_agent/
    ├── graph.py             ← StateGraph: nodes, edges, routing
    ├── tools.py             ← TOOLS list (Tavily search)
    ├── prompts.py           ← SYSTEM_PROMPT
    ├── context.py           ← model + max_search_results
    └── state.py             ← State / InputState (runtime)`;

const srcPrompts = `"""Default prompts used by the agent."""

SYSTEM_PROMPT = """You are a helpful AI assistant.

System time: {system_time}"""`;

const srcContext = `"""Define the configurable parameters for the agent."""

from __future__ import annotations

import os
from dataclasses import dataclass, field, fields
from typing import Annotated

from . import prompts


@dataclass(kw_only=True)
class Context:
    """The context for the agent."""

    system_prompt: str = field(
        default=prompts.SYSTEM_PROMPT,
        metadata={"description": "The system prompt to use for the agent's interactions."},
    )

    model: Annotated[str, {"__template_metadata__": {"kind": "llm"}}] = field(
        default="anthropic/claude-sonnet-4-5-20250929",
        metadata={"description": "The language model. Form: provider/model-name."},
    )

    max_search_results: int = field(
        default=10,
        metadata={"description": "Max search results to return per query."},
    )

    def __post_init__(self) -> None:
        """Fetch env vars for attributes that were not passed as args."""
        for f in fields(self):
            if not f.init:
                continue
            if getattr(self, f.name) == f.default:
                setattr(self, f.name, os.environ.get(f.name.upper(), f.default))`;

const srcTools = `"""Example tools — a basic Tavily search function."""

from typing import Any, Callable, List, Optional, cast

from langchain_tavily import TavilySearch
from langgraph.runtime import get_runtime

from react_agent.context import Context


async def search(query: str) -> Optional[dict[str, Any]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is
    designed to provide comprehensive, accurate, and trusted results. It's
    particularly useful for answering questions about current events.
    """
    runtime = get_runtime(Context)
    wrapped = TavilySearch(max_results=runtime.context.max_search_results)
    return cast(dict[str, Any], await wrapped.ainvoke({"query": query}))


TOOLS: List[Callable[..., Any]] = [search]`;

const srcState = `"""Define the state structures for the agent."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence

from langchain_core.messages import AnyMessage
from langgraph.graph import add_messages
from langgraph.managed import IsLastStep
from typing_extensions import Annotated


@dataclass
class InputState:
    """A narrower interface to the outside world."""

    messages: Annotated[Sequence[AnyMessage], add_messages] = field(
        default_factory=list
    )
    # The \`add_messages\` reducer merges new messages with existing ones,
    # updating by ID to maintain an "append-only" state.


@dataclass
class State(InputState):
    """The complete state of the agent."""

    is_last_step: IsLastStep = field(default=False)
    # A 'managed' variable, controlled by the state machine — set to True when
    # the step count reaches recursion_limit - 1.`;

const srcGraph = `"""Define a custom Reasoning and Action agent."""

from datetime import UTC, datetime
from typing import Dict, List, Literal, cast

from langchain_core.messages import AIMessage
from langgraph.graph import StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.runtime import Runtime

from react_agent.context import Context
from react_agent.state import InputState, State
from react_agent.tools import TOOLS
from react_agent.utils import load_chat_model


async def call_model(
    state: State, runtime: Runtime[Context]
) -> Dict[str, List[AIMessage]]:
    """Call the LLM powering our agent."""
    # Initialize the model with tool binding.
    model = load_chat_model(runtime.context.model).bind_tools(TOOLS)

    # Format the system prompt with the current time.
    system_message = runtime.context.system_prompt.format(
        system_time=datetime.now(tz=UTC).isoformat()
    )

    response = cast(
        AIMessage,
        await model.ainvoke(
            [{"role": "system", "content": system_message}, *state.messages]
        ),
    )

    # Handle the case where it's the last step but the model still wants a tool.
    if state.is_last_step and response.tool_calls:
        return {"messages": [AIMessage(
            id=response.id,
            content="Sorry, I could not find an answer to your question in the "
                    "specified number of steps.",
        )]}

    return {"messages": [response]}


# Build the graph
builder = StateGraph(State, input_schema=InputState, context_schema=Context)

# The two nodes we cycle between
builder.add_node(call_model)
builder.add_node("tools", ToolNode(TOOLS))

# Entrypoint
builder.add_edge("__start__", "call_model")


def route_model_output(state: State) -> Literal["__end__", "tools"]:
    """Route to tools if the last message has tool calls, else finish."""
    last_message = state.messages[-1]
    if not isinstance(last_message, AIMessage):
        raise ValueError(f"Expected AIMessage, got {type(last_message).__name__}")
    if not last_message.tool_calls:
        return "__end__"
    return "tools"


# After call_model, branch on route_model_output
builder.add_conditional_edges("call_model", route_model_output)

# After tools, always loop back to the model
builder.add_edge("tools", "call_model")

# Compile into an executable graph
graph = builder.compile(name="ReAct Agent")`;

const srcLanggraphJson = `{
  "$schema": "https://langgra.ph/schema.json",
  "dependencies": ["."],
  "graphs": {
    "agent": "./src/react_agent/graph.py:graph"
  },
  "env": ".env"
}`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromPrompts = `# prompts.py
SYSTEM_PROMPT = """You are a helpful AI assistant.

System time: {system_time}"""`;

const toSoul = `# Soul

## Core Identity
You are a helpful AI assistant.

I am a ReAct (Reasoning and Action) agent. I work by
iteratively reasoning about user queries and executing
actions — thinking step by step, choosing the right
tools, observing results, and continuing until I can
provide a complete and accurate answer.

## Purpose
Given a user query, I reason about what information or
actions are needed, execute appropriate tools, observe
results, and repeat until I can deliver a final answer.`;

const fromGraphRules = `# graph.py  (control logic)
system_message = runtime.context.system_prompt.format(
    system_time=datetime.now(tz=UTC).isoformat()   # ← time-stamp each turn
)

if state.is_last_step and response.tool_calls:       # ← step-limit guard
    return {"messages": [AIMessage(
        id=response.id,
        content="Sorry, I could not find an answer to "
                "your question in the specified number of steps.",
    )]}`;

const toRules = `# RULES.md
## Must Always
- Append the current system time (ISO 8601, UTC) to the
  system prompt at the start of each turn
- Continue the Reason → Act → Observe loop until a final
  answer is reached or the step limit is hit
- Return tool call results to the model before responding

## Must Never
- Fabricate search results or pretend to call a tool
- Exceed the configured max reasoning steps; if the limit
  is reached mid-tool-call, respond with: "Sorry, I could
  not find an answer ... in the specified number of steps."
- Ignore tool errors — always surface them to the model`;

const fromGraphLoop = `# graph.py  (the ReAct loop)
builder = StateGraph(State, context_schema=Context)

builder.add_node(call_model)
builder.add_node("tools", ToolNode(TOOLS))
builder.add_edge("__start__", "call_model")

def route_model_output(state) -> Literal["__end__", "tools"]:
    last = state.messages[-1]
    if not last.tool_calls:      # no tool call → done
        return "__end__"
    return "tools"               # else run the tool

builder.add_conditional_edges("call_model", route_model_output)
builder.add_edge("tools", "call_model")   # loop back`;

const toSkill = `# skills/reason-and-act/SKILL.md
---
name: reason-and-act
description: "Core ReAct reasoning loop: reason about a
  user query, decide on an action, execute it, observe
  the result, and repeat until a final answer is ready."
allowed-tools: search
---

## Step 1: Reason   → what's asked? what's missing?
## Step 2: Act      → call search if more info is needed
## Step 3: Observe  → enough to answer, or search again?
## Step 4: Respond  → compose the grounded final answer`;

const fromContext = `# context.py + langgraph.json
model: str = field(
    default="anthropic/claude-sonnet-4-5-20250929",
)
max_search_results: int = field(default=10)
# recursion_limit / step cap → runtime

# langgraph.json
"graphs": { "agent": "./src/react_agent/graph.py:graph" }`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: react-agent
version: 1.0.0
description: A ReAct (Reasoning and Action) agent that iteratively
  reasons about user queries and executes tool actions.
model:
  preferred: anthropic:claude-sonnet-4-5-20250929
  fallback:
    - openai:gpt-4o
runtime:
  max_turns: 50
  timeout: 300
skills:
  - reason-and-act
tools:
  - search`;

const fromTools = `# tools.py
from langchain_tavily import TavilySearch

async def search(query: str) -> Optional[dict[str, Any]]:
    """Search for general web results."""
    runtime = get_runtime(Context)
    wrapped = TavilySearch(
        max_results=runtime.context.max_search_results)
    return await wrapped.ainvoke({"query": query})

TOOLS: List[Callable[..., Any]] = [search]`;

const toToolFiles = `# tools/search.yaml  (the contract)
name: search
input_schema:
  type: object
  properties:
    query: { type: string }
  required: [query]
implementation:
  type: script
  path: search.py
  runtime: python3

# tools/search.py  (the impl — reads stdin, writes stdout)
if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    print(json.dumps(search(data.get("query", ""))))`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `react-agent/                 (OpenGAP)
├── agent.yaml               ← manifest: model, runtime, refs
├── SOUL.md                  ← identity
├── RULES.md                 ← guardrails
├── skills/
│   └── reason-and-act/
│       └── SKILL.md         ← the ReAct loop
└── tools/
    ├── search.yaml          ← tool schema
    └── search.py            ← tool implementation`;

const fullAgentYaml = `spec_version: "0.1.0"
name: react-agent
version: 1.0.0
description: A ReAct (Reasoning and Action) agent that iteratively reasons about user queries and executes tool actions to provide accurate answers.

model:
  preferred: anthropic:claude-sonnet-4-5-20250929
  fallback:
    - openai:gpt-4o

runtime:
  max_turns: 50
  timeout: 300

skills:
  - reason-and-act

tools:
  - search`;

const fullSoul = `# Soul

## Core Identity
You are a helpful AI assistant.

I am a ReAct (Reasoning and Action) agent. I work by iteratively reasoning about user queries and executing actions — thinking through problems step by step, choosing the right tools, observing results, and continuing until I can provide a complete and accurate answer.

## Purpose
Given a user query, I reason about what information or actions are needed, execute appropriate tools, observe results, and repeat until I can deliver a final answer. I am designed for complex problem-solving tasks that may require multiple rounds of information gathering.

My process:
1. Take a user **query** as input
2. Reason about the query and decide on an action
3. Execute the chosen action using available tools
4. Observe the result of the action
5. Repeat steps 2–4 until I can provide a final answer

## Communication Style
Clear, helpful, and direct. I provide well-structured responses grounded in the information I have gathered. When I cannot find an answer within the allowed steps, I say so honestly.

## Values & Principles
- **Accuracy** — I search for and verify information before answering
- **Transparency** — I am clear about what I found and how I reached my conclusions
- **Completeness** — I iterate until I have a thorough answer, not just the first result
- **Honesty** — If I cannot find an answer within the allotted steps, I say so rather than guessing

## Domain Expertise
- General web research and information retrieval
- Answering questions about current events (via Tavily search)
- Multi-step reasoning and tool use
- ReAct loop reasoning: Thought → Action → Observation cycles

## Collaboration Style
I work autonomously through my ReAct loop without requiring confirmation for individual tool calls. I surface my final answer directly. If I exhaust the maximum number of reasoning steps without finding an answer, I inform the user honestly rather than fabricating a response.

## Configuration
The following aspects of my behavior can be customized at runtime:
- **system_prompt**: Override my instructions entirely (default: "You are a helpful AI assistant.")
- **model**: The underlying language model to use (default: anthropic/claude-sonnet-4-5-20250929, format: provider/model-name)
- **max_search_results**: Maximum number of Tavily search results to return per query (default: 10)`;

const fullRules = `# Rules

## Must Always
- Append the current system time (ISO 8601, UTC) to the system prompt at the start of each turn
- Continue the Reason → Act → Observe loop until a final answer is reached or the step limit is hit
- Return tool call results to the model before producing a final response
- Use the \`search\` tool to look up current information rather than relying solely on training data

## Must Never
- Fabricate search results or pretend to have executed a tool call
- Exceed the configured maximum number of reasoning steps (recursion limit); if the limit is reached while a tool call is still pending, respond with: "Sorry, I could not find an answer to your question in the specified number of steps."
- Ignore tool errors — always surface them back to the model so it can reason about them

## Output Constraints
- Final responses are in natural language prose unless the user explicitly asks for a specific format
- When the step limit is reached mid-tool-call, return the fallback message verbatim: "Sorry, I could not find an answer to your question in the specified number of steps."

## Interaction Boundaries
- Search queries are passed to the Tavily search engine; the number of results returned is bounded by \`max_search_results\` (default: 10)
- Model selection is constrained to providers supported by LangChain's \`init_chat_model\` (anthropic, openai, etc.)`;

const fullSkill = `---
name: reason-and-act
description: "Core ReAct reasoning loop: reason about a user query, decide on an action,
  execute it using available tools, observe the result, and repeat until a final answer
  can be given. Use for any user question that may require web search or multi-step
  reasoning. Triggers on: any user query, question, research request, look up, find,
  search, tell me about, what is, how does."
allowed-tools: search
metadata:
  version: "1.0.0"
  category: reasoning
---

# Reason and Act (ReAct Loop)

Implements the ReAct (Reasoning and Action) pattern: iteratively reason about the user's query, choose and execute tools, observe results, and continue until a complete answer is ready.

## Step 1: Reason
Read the user's query and any prior conversation messages. Think through:
- What is being asked?
- What information is already available in context?
- What additional information is needed?
- Which tool (if any) should be called next?

## Step 2: Act
If additional information is needed, call the \`search\` tool with a precise search query derived from the user's request. The tool returns up to \`max_search_results\` web results (title, URL, snippet).

If sufficient information is already available, skip to Step 4.

## Step 3: Observe
Read the tool results. Assess:
- Did the search return relevant information?
- Is the answer now complete, or is another search needed?
- Are there follow-up queries that would improve the answer?

If another iteration is needed, return to Step 1 with the updated context.

## Step 4: Respond
Once enough information has been gathered, compose a clear, accurate final answer for the user. Ground the answer in the search results collected.

## Step Limit Handling
If the maximum number of reasoning steps is reached while a tool call is still pending, do not fabricate a response. Return the following message verbatim:
> "Sorry, I could not find an answer to your question in the specified number of steps."`;

const fullToolYaml = `name: search
description: Search for general web results using the Tavily search engine. Particularly useful for answering questions about current events. Returns comprehensive, accurate, and trusted results.
version: 1.0.0

input_schema:
  type: object
  properties:
    query:
      type: string
      description: The search query string to look up on the web
  required:
    - query

output_schema:
  type: object
  properties:
    results:
      type: array
      description: List of search results from Tavily
      items:
        type: object
        properties:
          title:
            type: string
            description: Title of the search result
          url:
            type: string
            description: URL of the search result
          content:
            type: string
            description: Snippet or content excerpt from the result

implementation:
  type: script
  path: search.py
  runtime: python3
  timeout: 30

annotations:
  read_only: true
  idempotent: true
  cost: low`;

const fullToolPy = `"""Search tool implementation using Tavily search engine.

This tool performs a web search using the Tavily search engine, which is designed
to provide comprehensive, accurate, and trusted results. It is particularly useful
for answering questions about current events.

Environment variables required:
  TAVILY_API_KEY: Your Tavily API key (https://app.tavily.com/sign-in)

Optional environment variables:
  MAX_SEARCH_RESULTS: Maximum number of results to return (default: 10)
"""

import json
import os
import sys
from typing import Any, Optional

# TRANSLATION NOTE: Original used langchain_tavily.TavilySearch via LangGraph runtime context
# for max_results. Here MAX_SEARCH_RESULTS is read from environment variable with default of 10.


def search(query: str) -> Optional[dict[str, Any]]:
    """Search for general web results.

    This function performs a search using the Tavily search engine, which is designed
    to provide comprehensive, accurate, and trusted results. It's particularly useful
    for answering questions about current events.

    Args:
        query: The search query string.

    Returns:
        A dictionary containing search results from Tavily.
    """
    try:
        from tavily import TavilyClient
    except ImportError:
        raise ImportError(
            "tavily-python is required. Install it with: pip install tavily-python"
        )

    api_key = os.environ.get("TAVILY_API_KEY")
    if not api_key:
        raise ValueError("TAVILY_API_KEY environment variable is not set")

    max_results = int(os.environ.get("MAX_SEARCH_RESULTS", "10"))

    client = TavilyClient(api_key=api_key)
    response = client.search(query=query, max_results=max_results)
    return response


if __name__ == "__main__":
    # Entry point for OpenGAP script execution
    # Reads JSON input from stdin: {"query": "..."}
    input_data = json.loads(sys.stdin.read())
    query = input_data.get("query", "")
    result = search(query)
    print(json.dumps(result))`;

const validateCmd = `$ opengap validate
✓ agent.yaml          valid (spec 0.1.0)
✓ SOUL.md             present
✓ RULES.md            present
✓ skills/reason-and-act/SKILL.md   valid frontmatter
✓ tools/search.yaml   schema ok → search.py
  react-agent is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["prompts.py", "SOUL.md"],
  ["graph.py control logic", "RULES.md"],
  ["graph.py StateGraph loop", "skills/reason-and-act/SKILL.md"],
  ["context.py + langgraph.json", "agent.yaml"],
  ["tools.py", "tools/search.yaml + search.py"],
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

export function CookbookLangGraph() {
  return (
    <section id="cookbook-langgraph" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">LangGraph → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a LangGraph agent into OpenGAP format by hand. We work through one real
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
              <code className="text-primary text-[10px]">langchain-ai/react-agent</code> — the canonical LangGraph
              ReAct starter. A single graph that cycles between an LLM node and a tool node, with the
              <code className="text-primary text-[10px]"> Tavily</code> web-search tool wired in.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> answer user questions — especially about
                current events — by reasoning step by step: decide what to look up, search the web, observe the results,
                and repeat until it can give a grounded answer
                (<span className="text-foreground">Reason → Act → Observe → Respond</span>).
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The LangGraph project"
          subtitle="A standard ReAct agent: a StateGraph that loops between an LLM node and a tool node. Here is every file, in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="prompts.py" caption="the system prompt" code={srcPrompts} />
          <CollapsibleCode filename="context.py" caption="model + tunable parameters" code={srcContext} />
          <CollapsibleCode filename="tools.py" caption="the Tavily search tool + TOOLS list" code={srcTools} />
          <CollapsibleCode filename="state.py" caption="message state + step tracking (runtime-managed)" code={srcState} />
          <CollapsibleCode filename="graph.py" caption="the StateGraph — nodes, conditional routing, the ReAct loop" code={srcGraph} />
          <CollapsibleCode filename="langgraph.json" caption="the graph entry point" code={srcLanggraphJson} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="LangGraph keeps everything in one Python graph. OpenGAP splits that single agent into four declarative pieces — then each source file maps to one of them."
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
              <span>LangGraph</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same five mappings, in detail — LangGraph source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — prompts.py → SOUL.md"
          fromLabel="prompts.py"
          fromCode={fromPrompts}
          toLabel="SOUL.md"
          toCode={toSoul}
          why="The SYSTEM_PROMPT and the agent's described behavior become prose identity in SOUL.md — who the agent is, its purpose, and how it communicates."
        />
        <ConversionStep
          index={2}
          title="Guardrails — graph.py logic → RULES.md"
          fromLabel="graph.py"
          fromCode={fromGraphRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="The control logic baked into the graph — time-stamping the prompt, the step-limit fallback message, surfacing tool errors — becomes explicit Must Always / Must Never rules."
        />
        <ConversionStep
          index={3}
          title="Orchestration — StateGraph → skills/reason-and-act/SKILL.md"
          fromLabel="graph.py"
          fromCode={fromGraphLoop}
          toLabel="SKILL.md"
          toCode={toSkill}
          why="The StateGraph nodes, conditional edge, and tool loop are the ReAct pattern. OpenGAP expresses that loop declaratively as a Skill (Reason → Act → Observe → Respond) instead of graph wiring."
        />
        <ConversionStep
          index={4}
          title="Config — context.py + langgraph.json → agent.yaml"
          fromLabel="context.py · langgraph.json"
          fromCode={fromContext}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model default, step/recursion limit, and entry point collapse into one manifest. agent.yaml also wires up the skills[] and tools[] the agent can use."
        />
        <ConversionStep
          index={5}
          title="Tools — tools.py → tools/search.yaml + search.py"
          fromLabel="tools.py"
          fromCode={fromTools}
          toLabel="tools/search.yaml · search.py"
          toCode={toToolFiles}
          why="Each function in the TOOLS list splits into a declarative schema (search.yaml) plus a runnable script (search.py). The LangChain/runtime calls are rewritten to read input from stdin and config from env vars."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">state.py</code> — <code className="text-[11px]">State</code>,{" "}
              <code className="text-[11px]">InputState</code>, <code className="text-[11px]">IsLastStep</code> and the{" "}
              <code className="text-[11px]">add_messages</code> reducer — has no OpenGAP file. Message accumulation, the
              step counter, and graph execution are handled by the host runtime, not by you. You describe{" "}
              <em>what</em> the agent does (identity, rules, skill, tools); the runtime owns <em>how</em> the loop runs.
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
          <CollapsibleCode filename="skills/reason-and-act/SKILL.md" code={fullSkill} reveal />
          <CollapsibleCode filename="tools/search.yaml" code={fullToolYaml} reveal />
          <CollapsibleCode filename="tools/search.py" code={fullToolPy} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, skill frontmatter, and tool schemas all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
