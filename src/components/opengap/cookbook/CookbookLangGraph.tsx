import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `langchain-ai/react-agent/
├── src/react_agent/
│   ├── graph.py        ← StateGraph: nodes, edges, routing
│   ├── tools.py        ← TOOLS list (Tavily search)
│   ├── prompts.py      ← SYSTEM_PROMPT string
│   ├── state.py        ← State, InputState TypedDicts
│   └── configuration.py← model + max_search_results config
└── langgraph.json      ← graph entry point for Studio`;

const promptsPy = `# src/react_agent/prompts.py
"""Default prompts used by the agent."""

SYSTEM_PROMPT = """You are a helpful AI assistant.

System time: {system_time}"""`;

const graphPy = `# src/react_agent/graph.py (key excerpt)
from react_agent.prompts import SYSTEM_PROMPT
from react_agent.tools import TOOLS
from react_agent.utils import load_chat_model

async def call_model(state: State, runtime: Runtime[Context]):
    model = load_chat_model(runtime.context.model).bind_tools(TOOLS)
    system_message = runtime.context.system_prompt.format(
        system_time=datetime.now(tz=UTC).isoformat()
    )
    response = await model.ainvoke(
        [{"role": "system", "content": system_message}, *state.messages]
    )
    return {"messages": [response]}

builder = StateGraph(State, input_schema=InputState, context_schema=Context)
builder.add_node(call_model)
builder.add_node("tools", ToolNode(TOOLS))
builder.add_edge("__start__", "call_model")

def route_model_output(state: State):
    last = state.messages[-1]
    return "__end__" if not last.tool_calls else "tools"

builder.add_conditional_edges("call_model", route_model_output)
builder.add_edge("tools", "call_model")
graph = builder.compile(name="ReAct Agent")`;

const toolsPy = `# src/react_agent/tools.py
from langchain_community.tools.tavily_search import TavilySearchResults
from langgraph.runtime import Runtime
from react_agent.context import Context

async def search(query: str, runtime: Runtime[Context]) -> list[dict]:
    """Search the web using Tavily."""
    max_results = runtime.context.max_search_results
    wrapped = TavilySearchResults(max_results=max_results)
    return await wrapped.ainvoke({"query": query})

TOOLS = [search]`;

const agentYaml = `spec_version: 0.1.0
name: react-agent
version: 0.1.0
description: ReAct agent that searches the web to answer questions accurately
model:
  preferred: claude-sonnet-4-6
tools:
  - search`;

const soulMd = `# Soul

## Core Identity
You are a helpful AI assistant.`;

const toolYaml = `name: search
description: Search the web using Tavily for up-to-date information.
input_schema:
  type: object
  properties:
    query:
      type: string
      description: The search query
  required:
    - query
implementation:
  type: script
  path: tools/search.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./react-agent-opengap
opengap info -d ./react-agent-opengap`;

const mapping = [
  ["SYSTEM_PROMPT in prompts.py", "SOUL.md"],
  ["runtime.context.model (from configuration.py)", "agent.yaml → model.preferred"],
  ["TOOLS list — function names", "agent.yaml → tools[]"],
  ["Each tool function + docstring + typed args", "tools/<name>.yaml"],
  ["implementation.path → existing tools.py function", "tools/<name>.yaml → implementation.path"],
  ["StateGraph nodes + edges in graph.py", "stays in framework — runtime orchestration"],
];

const steps = [
  { step: "1", desc: "Copy SYSTEM_PROMPT from prompts.py into SOUL.md." },
  { step: "2", desc: "Take the model name from configuration.py → write to agent.yaml → model.preferred." },
  { step: "3", desc: "For each function in the TOOLS list, add a kebab-case name to agent.yaml → tools (search stays search, web_search becomes web-search)." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool — use the docstring as description, typed parameters as input_schema, and point implementation.path to your existing tool file." },
  { step: "5", desc: "StateGraph, ToolNode, routing logic, and State TypedDicts stay in graph.py — they are runtime execution wiring with no OpenGAP equivalent." },
  { step: "6", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookLangGraph() {
  return (
    <section id="cookbook-langgraph" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">LangGraph → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">langchain-ai/react-agent</code> — the official LangGraph ReAct agent template.
            The agent identity lives in <code className="text-primary text-xs">prompts.py</code>, tools are exported from <code className="text-primary text-xs">tools.py</code>,
            and the graph wiring in <code className="text-primary text-xs">graph.py</code> stays in the framework.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The LangGraph project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">ReAct agent with Tavily web search, designed for LangGraph Studio:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">prompts.py</code>:</p>
              <CodeBlock code={promptsPy} filename="src/react_agent/prompts.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools.py</code>:</p>
              <CodeBlock code={toolsPy} filename="src/react_agent/tools.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">graph.py</code> excerpt:</p>
              <CodeBlock code={graphPy} filename="src/react_agent/graph.py" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>LangGraph (react-agent)</span><span>OpenGAP</span>
            </div>
            {mapping.map(([from, to], i) => (
              <div key={i} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary">{to}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Create the OpenGAP files</h3>
          <div className="space-y-5 mt-4">
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code> — from SYSTEM_PROMPT:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/search.yaml</code> — the <code className="text-primary text-xs">implementation.path</code> points to your existing tool file:</p>
              <CodeBlock code={toolYaml} filename="tools/search.yaml" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Validate</h3>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">What happens step by step</h3>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} className="paper-card p-3 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3 relative z-10">
                  <code className="text-[11px] text-primary font-body font-semibold shrink-0 w-8">{s.step}</code>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
