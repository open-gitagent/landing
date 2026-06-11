import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `openai/openai-agents-python/
└── examples/customer_service/
    └── main.py    ← triage_agent, faq_agent, seat_booking_agent + tools`;

const mainPy = `# examples/customer_service/main.py (key excerpt)
from agents import Agent, function_tool, handoff, Runner
from pydantic import BaseModel

class AirlineAgentContext(BaseModel):
    passenger_name: str | None = None
    confirmation_number: str | None = None
    seat_number: str | None = None
    flight_number: str | None = None

@function_tool(name_override="faq_lookup_tool",
               description_override="Lookup frequently asked questions.")
async def faq_lookup_tool(question: str) -> str:
    question_lower = question.lower()
    if any(k in question_lower for k in ["bag", "baggage", "luggage"]):
        return "One bag allowed, under 50 lbs and 22x14x9 inches."
    elif "seat" in question_lower:
        return "120 seats: 22 business, 98 economy. Exit rows 4 and 16."
    elif "wifi" in question_lower:
        return "Free wifi — join Airline-Wifi"
    return "I'm sorry, I don't know the answer to that question."

@function_tool
async def update_seat(
    context: RunContextWrapper[AirlineAgentContext],
    confirmation_number: str,
    new_seat: str,
) -> str:
    """Update the seat for a given confirmation number."""
    context.context.confirmation_number = confirmation_number
    context.context.seat_number = new_seat
    return f"Updated seat to {new_seat} for {confirmation_number}"

faq_agent = Agent[AirlineAgentContext](
    name="FAQ Agent",
    handoff_description="Answers questions about the airline.",
    instructions="""You are an FAQ agent. Use faq_lookup_tool to answer the customer's
question. If you cannot answer it, transfer back to the triage agent.""",
    tools=[faq_lookup_tool],
)

seat_booking_agent = Agent[AirlineAgentContext](
    name="Seat Booking Agent",
    handoff_description="Updates a seat on a flight.",
    instructions="""You are a seat booking agent. Ask for the confirmation number,
ask for the desired seat, then call update_seat.""",
    tools=[update_seat],
)

triage_agent = Agent[AirlineAgentContext](
    name="Triage Agent",
    handoff_description="Routes customer requests to the appropriate agent.",
    instructions="You are a helpful triaging agent. Delegate to FAQ or seat booking agents.",
    handoffs=[
        handoff(agent=faq_agent, tool_name_override="transfer_to_faq_agent"),
        handoff(agent=seat_booking_agent, tool_name_override="transfer_to_seat_booking_agent"),
    ],
)`;

const agentYaml = `spec_version: 0.1.0
name: triage-agent
version: 0.1.0
description: Routes airline customer requests to the appropriate specialist agent
model:
  preferred: gpt-4o
tools:
  - transfer-to-faq-agent
  - transfer-to-seat-booking-agent
agents:
  faq-agent:
    description: Answers frequently asked questions about the airline
    delegation:
      mode: auto
  seat-booking-agent:
    description: Updates seat assignments for airline passengers
    delegation:
      mode: auto`;

const soulMd = `# Soul

## Core Identity
You are a helpful triaging agent for an airline customer service system.

## Purpose
Evaluate customer requests and delegate to the FAQ agent or seat booking agent
using the appropriate transfer tool.`;

const subFaqYaml = `spec_version: 0.1.0
name: faq-agent
version: 0.1.0
description: Answers frequently asked questions about the airline
model:
  preferred: gpt-4o
tools:
  - faq-lookup-tool`;

const subFaqSoul = `# Soul

## Core Identity
You are an FAQ agent for an airline customer service system.

## Behavior
Use the faq_lookup_tool to answer each question. Do not rely on your own knowledge.
If you cannot answer, transfer back to the triage agent.`;

const subSeatYaml = `spec_version: 0.1.0
name: seat-booking-agent
version: 0.1.0
description: Updates seat assignments for airline passengers
model:
  preferred: gpt-4o
tools:
  - update-seat`;

const toolTransferFaq = `name: transfer-to-faq-agent
description: Transfer the customer to the FAQ agent.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: tools/transfer_to_faq_agent.py
  runtime: python3
  timeout: 30`;

const toolTransferSeat = `name: transfer-to-seat-booking-agent
description: Transfer the customer to the seat booking agent.
input_schema:
  type: object
  properties: {}
implementation:
  type: script
  path: tools/transfer_to_seat_booking_agent.py
  runtime: python3
  timeout: 30`;

const toolFaqLookup = `name: faq-lookup-tool
description: Lookup frequently asked questions about the airline.
input_schema:
  type: object
  properties:
    question:
      type: string
      description: The customer's question
  required:
    - question
implementation:
  type: script
  path: tools/faq_lookup_tool.py
  runtime: python3
  timeout: 30`;

const toolUpdateSeat = `name: update-seat
description: Update the seat for a given confirmation number.
input_schema:
  type: object
  properties:
    confirmation_number:
      type: string
      description: The booking confirmation number
    new_seat:
      type: string
      description: The desired seat assignment
  required:
    - confirmation_number
    - new_seat
implementation:
  type: script
  path: tools/update_seat.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./triage-agent-opengap
opengap info -d ./triage-agent-opengap`;

const mapping = [
  ["Agent.instructions", "SOUL.md"],
  ["Agent.name (kebab-case)", "agent.yaml → name"],
  ["Agent.model", "agent.yaml → model.preferred"],
  ["@function_tool functions (kebab-case names)", "agent.yaml → tools[] + tools/<name>.yaml"],
  ["handoff(agent=X, tool_name_override=Y)", "agent.yaml → tools[] (transfer tools)"],
  ["Each Agent in handoffs list", "agents/<name>/agent.yaml + SOUL.md"],
  ["AirlineAgentContext Pydantic model", "stays in framework — runtime shared state"],
  ["Runner.run() + conversation loop", "stays in framework — execution runner"],
];

const steps = [
  { step: "1", desc: "Identify the root/entry agent (triage_agent). Its instructions → SOUL.md. Its name → agent.yaml name (kebab-case)." },
  { step: "2", desc: "For each handoff, add a transfer tool entry to agent.yaml → tools (e.g. transfer_to_faq_agent → transfer-to-faq-agent) and create a minimal tools/<name>.yaml." },
  { step: "3", desc: "For each agent in handoffs (faq_agent, seat_booking_agent), create agents/<name>/agent.yaml + SOUL.md using the same mapping." },
  { step: "4", desc: "For each @function_tool (faq_lookup_tool, update_seat), add to the relevant sub-agent's tools list and create tools/<name>.yaml." },
  { step: "5", desc: "AirlineAgentContext, RunContextWrapper, on_handoff hooks, and Runner.run() stay in main.py — runtime execution and state." },
  { step: "6", desc: "Run opengap validate on each agent directory to confirm the structure is correct." },
];

export function CookbookOpenAIAgents() {
  return (
    <section id="cookbook-openai-agents" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenAI Agents SDK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">openai/openai-agents-python</code> customer service example — a triage agent
            that routes airline customers to an FAQ agent or a seat booking agent via handoffs.
            Each <code className="text-primary text-xs">Agent</code> maps to its own OpenGAP directory; handoffs become transfer tools.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The OpenAI Agents SDK project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Airline customer service with triage + FAQ + seat booking agents:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={mainPy} filename="examples/customer_service/main.py" />
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>OpenAI Agents SDK</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root: <code className="text-primary text-xs">agent.yaml</code> (triage_agent):</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root: <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/transfer-to-faq-agent.yaml</code>:</p>
              <CodeBlock code={toolTransferFaq} filename="tools/transfer-to-faq-agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/transfer-to-seat-booking-agent.yaml</code>:</p>
              <CodeBlock code={toolTransferSeat} filename="tools/transfer-to-seat-booking-agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/faq-agent/agent.yaml</code>:</p>
              <CodeBlock code={subFaqYaml} filename="agents/faq-agent/agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/faq-agent/SOUL.md</code>:</p>
              <CodeBlock code={subFaqSoul} filename="agents/faq-agent/SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/faq-agent/tools/faq-lookup-tool.yaml</code>:</p>
              <CodeBlock code={toolFaqLookup} filename="agents/faq-agent/tools/faq-lookup-tool.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/seat-booking-agent/agent.yaml</code>:</p>
              <CodeBlock code={subSeatYaml} filename="agents/seat-booking-agent/agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/seat-booking-agent/tools/update-seat.yaml</code>:</p>
              <CodeBlock code={toolUpdateSeat} filename="agents/seat-booking-agent/tools/update-seat.yaml" />
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
