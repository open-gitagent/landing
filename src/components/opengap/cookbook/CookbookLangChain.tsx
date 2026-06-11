import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `my-langchain-agent/
├── agent.py       ← AgentExecutor, prompt, model, tools
├── tools.py       ← @tool decorated functions
└── requirements.txt`;

const agentPy = `# agent.py
from langchain.agents import AgentExecutor, create_tool_calling_agent
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from tools import get_order_status, initiate_return

SYSTEM_PROMPT = """You are a customer support agent for an e-commerce platform.
Help customers with order status and return requests.
Always verify the order ID before discussing order details.

Rules:
- Never share one customer's data with another
- Always confirm before initiating a return"""

prompt = ChatPromptTemplate.from_messages([
    ("system", SYSTEM_PROMPT),
    ("human", "{input}"),
    ("placeholder", "{agent_scratchpad}"),
])

model = ChatAnthropic(model="claude-sonnet-4-6")
tools = [get_order_status, initiate_return]

agent = create_tool_calling_agent(model, tools, prompt)
agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)`;

const toolsPy = `# tools.py
from langchain_core.tools import tool

@tool
def get_order_status(order_id: str) -> str:
    """Get the current status of a customer order by order ID."""
    # real impl queries your order database
    return f"Order {order_id} is being processed."

@tool
def initiate_return(order_id: str, reason: str) -> str:
    """Initiate a return request for an order.

    Args:
        order_id: The order to return.
        reason: The reason for the return.
    """
    return f"Return initiated for order {order_id}. Reason: {reason}."`;

const agentYaml = `spec_version: 0.1.0
name: customer-support-agent
version: 0.1.0
description: Customer support agent for an e-commerce platform
model:
  preferred: claude-sonnet-4-6
tools:
  - get-order-status
  - initiate-return`;

const soulMd = `# Soul

## Core Identity
You are a customer support agent for an e-commerce platform.

## Purpose
Help customers with order status and return requests.
Always verify the order ID before discussing order details.`;

const rulesMd = `# Rules

- Never share one customer's data with another
- Always confirm before initiating a return`;

const toolGetOrder = `name: get-order-status
description: Get the current status of a customer order by order ID.
input_schema:
  type: object
  properties:
    order_id:
      type: string
      description: The order ID to look up
  required:
    - order_id
implementation:
  type: script
  path: tools/get_order_status.py
  runtime: python3
  timeout: 30`;

const toolReturn = `name: initiate-return
description: Initiate a return request for an order.
input_schema:
  type: object
  properties:
    order_id:
      type: string
      description: The order to return
    reason:
      type: string
      description: The reason for the return
  required:
    - order_id
    - reason
implementation:
  type: script
  path: tools/initiate_return.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./customer-support-opengap
opengap info -d ./customer-support-opengap`;

const mapping = [
  ["SYSTEM_PROMPT — identity/purpose lines", "SOUL.md"],
  ["SYSTEM_PROMPT — Rules: section", "RULES.md"],
  ["ChatAnthropic(model=...)", "agent.yaml → model.preferred"],
  ["@tool function names (kebab-case)", "agent.yaml → tools[]"],
  ["@tool docstring + typed args", "tools/<name>.yaml description + input_schema"],
  ["Existing tools.py function", "tools/<name>.yaml → implementation.path"],
  ["AgentExecutor + ChatPromptTemplate", "stays in framework — runtime execution loop"],
  ["agent_scratchpad placeholder", "stays in framework — internal reasoning trace"],
];

const steps = [
  { step: "1", desc: "Split SYSTEM_PROMPT by content: who-you-are and purpose lines → SOUL.md. Hard rules (never, always) → RULES.md." },
  { step: "2", desc: "Take the model string from ChatAnthropic(model=...) → write to agent.yaml → model.preferred." },
  { step: "3", desc: "List each @tool function name → add to agent.yaml → tools as kebab-case (get_order_status → get-order-status)." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool — copy the docstring as description, typed args as input_schema, and point implementation.path to the existing Python file." },
  { step: "5", desc: "AgentExecutor, ChatPromptTemplate, and the agent_scratchpad placeholder stay in agent.py — they are LangChain runtime wiring." },
  { step: "6", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookLangChain() {
  return (
    <section id="cookbook-langchain" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">LangChain → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            LangChain agents use <code className="text-primary text-xs">AgentExecutor</code>, a <code className="text-primary text-xs">ChatPromptTemplate</code>,
            and <code className="text-primary text-xs">@tool</code> decorated functions. The system prompt is a plain string
            inside the template. Converting to OpenGAP means pulling the prompt into files and declaring the tools —
            the executor and template stay in your code.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The LangChain project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Customer support agent with two tools:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools.py</code>:</p>
              <CodeBlock code={toolsPy} filename="tools.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">agent.py</code>:</p>
              <CodeBlock code={agentPy} filename="agent.py" />
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>LangChain</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">SOUL.md</code> — identity lines from SYSTEM_PROMPT:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">RULES.md</code> — hard rules from SYSTEM_PROMPT:</p>
              <CodeBlock code={rulesMd} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/get-order-status.yaml</code>:</p>
              <CodeBlock code={toolGetOrder} filename="tools/get-order-status.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/initiate-return.yaml</code>:</p>
              <CodeBlock code={toolReturn} filename="tools/initiate-return.yaml" />
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
