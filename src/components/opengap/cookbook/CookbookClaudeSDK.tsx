import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `anthropics/anthropic-cookbook/
└── tool_use/
    └── customer_service_agent.ipynb  ← tools, system prompt, agent loop`;

const agentPy = `# customer_service_agent.ipynb — key code cells
import anthropic

client = anthropic.Client()
MODEL_NAME = "claude-opus-4-1"

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

def chatbot_interaction(user_message: str) -> str:
    messages = [{"role": "user", "content": user_message}]
    response = client.messages.create(
        model=MODEL_NAME, max_tokens=4096, system=SYSTEM_PROMPT,
        tools=tools, messages=messages,
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
            model=MODEL_NAME, max_tokens=4096, system=SYSTEM_PROMPT,
            tools=tools, messages=messages,
        )
    return next(b.text for b in response.content if hasattr(b, "text"))`;

const agentYaml = `spec_version: 0.1.0
name: customer-service-agent
version: 0.1.0
description: Customer service agent for an e-commerce platform
model:
  preferred: claude-opus-4-1
tools:
  - get-customer-info
  - get-order-details
  - cancel-order`;

const soulMd = `# Soul

## Core Identity
You are a customer service agent for an e-commerce platform.

## Purpose
Assist customers with their inquiries and issues. Look up customer and
order information, and process cancellations when requested.

## Behavior
- Always be polite and helpful
- Use tools to look up accurate information before responding
- Confirm order details before processing a cancellation`;

const toolGetCustomer = `name: get-customer-info
description: Retrieves customer information based on their customer ID.
input_schema:
  type: object
  properties:
    customer_id:
      type: string
      description: The unique identifier for the customer
  required:
    - customer_id
implementation:
  type: script
  path: tools/get_customer_info.py
  runtime: python3
  timeout: 30`;

const toolGetOrder = `name: get-order-details
description: Retrieves the details of a specific order based on the order ID.
input_schema:
  type: object
  properties:
    order_id:
      type: string
      description: The unique identifier for the order
  required:
    - order_id
implementation:
  type: script
  path: tools/get_order_details.py
  runtime: python3
  timeout: 30`;

const toolCancelOrder = `name: cancel-order
description: Cancels an order based on the provided order ID.
input_schema:
  type: object
  properties:
    order_id:
      type: string
      description: The unique identifier for the order to be cancelled
  required:
    - order_id
implementation:
  type: script
  path: tools/cancel_order.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./customer-service-opengap
opengap info -d ./customer-service-opengap`;

const mapping = [
  ["SYSTEM_PROMPT passed to messages.create(system=...)", "SOUL.md"],
  ["MODEL_NAME ('claude-opus-4-1')", "agent.yaml → model.preferred"],
  ["tools[].name (kebab-case)", "agent.yaml → tools[]"],
  ["tools[].description + input_schema", "tools/<name>.yaml"],
  ["process_tool_call() dispatch function", "stays in framework — tool implementation"],
  ["chatbot_interaction() loop / multi-turn logic", "stays in framework — runtime loop"],
];

const steps = [
  { step: "1", desc: "Copy SYSTEM_PROMPT into SOUL.md. Keep identity, purpose, and behavioral rules together — the Claude SDK has a single flat prompt with no separate rules block." },
  { step: "2", desc: "Take MODEL_NAME → write to agent.yaml → model.preferred (e.g. claude-opus-4-1)." },
  { step: "3", desc: "For each entry in tools[], add a kebab-case name to agent.yaml → tools. get_customer_info → get-customer-info." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool — copy the name (kebab-case), description, and input_schema directly from the tool dict." },
  { step: "5", desc: "The process_tool_call() dispatch and the multi-turn chatbot_interaction() loop stay in the notebook — they are runtime execution, not agent identity." },
  { step: "6", desc: "Run opengap validate to confirm the structure is correct." },
];

export function CookbookClaudeSDK() {
  return (
    <section id="cookbook-claude-sdk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Claude SDK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">anthropics/anthropic-cookbook</code> customer service agent — a multi-turn
            agent with three tools (<code className="text-primary text-xs">get_customer_info</code>, <code className="text-primary text-xs">get_order_details</code>, <code className="text-primary text-xs">cancel_order</code>)
            and a system prompt. The Anthropic SDK has no built-in agent format — everything lives as function arguments.
            Converting to OpenGAP means pulling those values into files.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Claude SDK agent</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">E-commerce customer service with three tools and a multi-turn loop:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={agentPy} filename="customer_service_agent.ipynb" />
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Claude SDK</span><span>OpenGAP</span>
            </div>
            {mapping.map(([from, to], i) => (
              <div key={i} className={`grid grid-cols-2 px-3 py-2 gap-4 border-b border-border last:border-0 ${i % 2 === 0 ? "" : "bg-muted/20"}`}>
                <span className="text-muted-foreground">{from}</span>
                <span className="text-primary">{to}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 3 */}
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
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/get-customer-info.yaml</code>:</p>
              <CodeBlock code={toolGetCustomer} filename="tools/get-customer-info.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/get-order-details.yaml</code>:</p>
              <CodeBlock code={toolGetOrder} filename="tools/get-order-details.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/cancel-order.yaml</code>:</p>
              <CodeBlock code={toolCancelOrder} filename="tools/cancel-order.yaml" />
            </div>
          </div>
        </motion.div>

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Validate</h3>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

        {/* Steps */}
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
