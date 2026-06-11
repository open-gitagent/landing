import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full OpenAI Agents SDK source  ═══════════════════ */

const sourceTree = `openai-agents-python/            (OpenAI Agents SDK)
└── examples/
    └── customer_service/
        └── main.py              ← Agent, @function_tool, handoff, Runner
                                   triage_agent → faq_agent · seat_booking_agent`;

const srcMainPy = `# examples/customer_service/main.py (key excerpt)
from agents import Agent, Runner, function_tool, handoff
from agents import RunContextWrapper
from pydantic import BaseModel


class AirlineAgentContext(BaseModel):
    passenger_name: str | None = None
    confirmation_number: str | None = None
    seat_number: str | None = None
    flight_number: str | None = None


@function_tool(
    name_override="faq_lookup_tool",
    description_override="Lookup frequently asked questions about the airline.",
)
async def faq_lookup_tool(question: str) -> str:
    question_lower = question.lower()
    if any(k in question_lower for k in ["bag", "baggage", "luggage"]):
        return "You are allowed to bring one bag on the plane. Under 50 lbs and 22x14x9 in."
    elif any(k in question_lower for k in ["seat", "seats", "seating"]):
        return "There are 120 seats: 22 business class and 98 economy. Exit rows are 4 and 16."
    elif any(k in question_lower for k in ["wifi", "internet"]):
        return "We have free wifi on the plane, join Airline-Wifi"
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
    return f"Updated seat to {new_seat} for confirmation number {confirmation_number}"


faq_agent = Agent[AirlineAgentContext](
    name="FAQ Agent",
    handoff_description="A helpful agent that can answer questions about the airline.",
    instructions="""You are an FAQ agent for an airline customer service system.
If you are speaking to a customer, you were transferred from the triage agent.
Use the faq_lookup_tool to answer the customer's question. Do not rely on your own knowledge.
If you cannot answer the question, transfer back to the triage agent.""",
    tools=[faq_lookup_tool],
)

seat_booking_agent = Agent[AirlineAgentContext](
    name="Seat Booking Agent",
    handoff_description="A helpful agent that can update a seat on a flight.",
    instructions="""You are a seat booking agent for an airline customer service system.
If you are speaking to a customer, you were transferred from the triage agent.
Ask for their confirmation number, ask for their desired seat, then call update_seat.
If the customer asks about anything unrelated, transfer back to the triage agent.""",
    tools=[update_seat],
)

triage_agent = Agent[AirlineAgentContext](
    name="Triage Agent",
    handoff_description="A triage agent that routes customer requests to the right specialist.",
    instructions="You are a helpful triaging agent. Delegate to FAQ or seat booking agents.",
    handoffs=[
        handoff(agent=faq_agent, tool_name_override="transfer_to_faq_agent"),
        handoff(agent=seat_booking_agent, tool_name_override="transfer_to_seat_booking_agent"),
    ],
)


async def main() -> None:
    result = await Runner.run(triage_agent, "What seats are available?")
    print(result.final_output)`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromTriageInstructions = `# main.py — triage_agent.instructions
instructions = "You are a helpful triaging agent. \
Delegate to FAQ or seat booking agents."

# Agent definition
triage_agent = Agent[AirlineAgentContext](
    name="Triage Agent",
    handoff_description="Routes customer requests ...",
    instructions=...,
    handoffs=[handoff(faq_agent, ...), handoff(seat_booking_agent, ...)],
)`;

const toTriageSoul = `# agents/triage-agent/SOUL.md

## Core Identity
I am a helpful triaging agent. I can use my tools
to delegate questions to other appropriate agents.
I am the first point of contact for all airline
customer service inquiries.

## Purpose
Quickly understand the customer's need and route
them to the correct specialist — FAQ agent for
information questions, Seat Booking agent for
seat change requests.`;

const fromHandoffRules = `# main.py — handoff + guardrail wiring
handoffs=[
    handoff(
        agent=faq_agent,
        tool_name_override="transfer_to_faq_agent",
    ),
    handoff(
        agent=seat_booking_agent,
        tool_name_override="transfer_to_seat_booking_agent",
        on_handoff=on_seat_booking_handoff,  # sets flight_number
    ),
]

# RULES: call update_seat only after flight_number is set
assert context.flight_number, "flight_number must be set"`;

const toRulesMd = `# RULES.md

## Must Always
- Run input guardrails before the main agent responds
- When routing via triage, hand off with the correct
  on_handoff callback (populates flight_number)
- Preserve full conversation history across turns
- Respect max_turns limits to prevent infinite loops

## Must Never
- Call update_seat without flight_number set in context
- Allow math homework requests — reply with configured
  refusal message
- Return FAQ answers from general knowledge — always
  use faq-lookup tool`;

const fromTriageHandoffs = `# main.py — handoffs become delegation config
triage_agent = Agent[AirlineAgentContext](
    handoffs=[
        handoff(agent=faq_agent,
                tool_name_override="transfer_to_faq_agent"),
        handoff(agent=seat_booking_agent,
                tool_name_override="transfer_to_seat_booking_agent"),
    ],
)

# delegation mode for triage_agent → router (not auto)
# triage selects one agent per turn, does not run them all`;

const toTriageAgentYaml = `# agents/triage-agent/agent.yaml
spec_version: "0.1.0"
name: triage-agent
version: 1.0.0
model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

agents:
  faq-agent:
    description: Answers FAQ questions about the airline
    delegation:
      mode: explicit
  seat-booking-agent:
    description: Updates seat assignments for reservations
    delegation:
      mode: explicit

delegation:
  mode: router`;

const fromFunctionTools = `# main.py — @function_tool decorators
@function_tool(
    name_override="faq_lookup_tool",
    description_override="Lookup FAQ questions.",
)
async def faq_lookup_tool(question: str) -> str:
    ...

@function_tool
async def update_seat(
    context: RunContextWrapper[AirlineAgentContext],
    confirmation_number: str,
    new_seat: str,
) -> str:
    ...`;

const toToolYamls = `# tools/faq-lookup.yaml
name: faq-lookup
description: Look up answers to FAQ about the airline.
input_schema:
  type: object
  properties:
    question: { type: string }
  required: [question]
implementation:
  type: script
  path: faq-lookup.py
  runtime: python3

# tools/update-seat.yaml
name: update-seat
description: Update seat assignment given confirmation
  number and desired seat.
input_schema:
  type: object
  properties:
    confirmation_number: { type: string }
    new_seat: { type: string }
  required: [confirmation_number, new_seat]
implementation:
  type: script
  path: update-seat.py
  runtime: python3`;

const fromRunnerConfig = `# main.py — Runner + model config
triage_agent = Agent[AirlineAgentContext](
    name="Triage Agent",
    model="gpt-4o",           # ← model selection
    ...
)

await Runner.run(           # ← execution entry point
    triage_agent,
    "What seats are available?",
    max_turns=50,
)`;

const toAgentYamlRoot = `# agent.yaml  (root manifest)
spec_version: "0.1.0"
name: openai-agents-python
version: 1.0.0
model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini
runtime:
  max_turns: 50
  timeout: 300
skills:
  - triage-routing
  - faq-lookup
  - seat-booking
  - input-guardrail-check
  - output-guardrail-check
tools:
  - faq-lookup
  - update-seat`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `openai-agents-python/        (OpenGAP)
├── agent.yaml               ← root manifest
├── SOUL.md                  ← orchestrator identity
├── RULES.md                 ← guardrails & constraints
├── skills/
│   ├── triage-routing/SKILL.md
│   ├── faq-lookup/SKILL.md
│   ├── seat-booking/SKILL.md
│   ├── input-guardrail-check/SKILL.md
│   └── output-guardrail-check/SKILL.md
├── tools/
│   ├── faq-lookup.yaml      ← tool schema
│   ├── faq-lookup.py        ← tool impl
│   ├── update-seat.yaml
│   └── update-seat.py
└── agents/
    ├── triage-agent/
    │   ├── agent.yaml       ← delegation.mode: router
    │   └── SOUL.md
    ├── faq-agent/
    │   ├── agent.yaml
    │   └── SOUL.md
    └── seat-booking-agent/
        ├── agent.yaml
        └── SOUL.md`;

const fullRootAgentYaml = `spec_version: "0.1.0"
name: openai-agents-python
version: 1.0.0
description: Multi-agent orchestration framework supporting agents, tools, guardrails, handoffs, sessions, and tracing — translated from the OpenAI Agents SDK

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

runtime:
  max_turns: 50
  timeout: 300

skills:
  - triage-routing
  - faq-lookup
  - seat-booking
  - input-guardrail-check
  - output-guardrail-check

tools:
  - faq-lookup
  - update-seat

agents:
  triage-agent:
    description: Routes customer service requests to the appropriate specialist agent
    delegation:
      mode: router
  faq-agent:
    description: Answers frequently asked questions about airline policies
    delegation:
      mode: explicit
  seat-booking-agent:
    description: Updates seat assignments for flight reservations
    delegation:
      mode: explicit

delegation:
  mode: auto

tags:
  - multi-agent
  - orchestration
  - openai-agents-sdk
  - customer-service
  - guardrails
  - handoffs`;

const fullSoul = `# Soul

## Core Identity
I am the OpenAI Agents SDK orchestrator — a lightweight yet powerful multi-agent framework capable of coordinating specialized sub-agents to accomplish complex tasks. I embody the patterns and idioms of the OpenAI Agents SDK: \`Agent\` objects with instructions and tools, \`Runner.run()\` for execution, \`handoff()\` for agent-to-agent delegation, \`@function_tool\` / \`@input_guardrail\` / \`@output_guardrail\` decorators, and session-based conversation memory.

My capabilities span:
- **Customer service workflows**: Triage routing → specialist agents (FAQ, seat booking) with bidirectional handoffs
- **Guardrail enforcement**: Input and output guardrails that run in parallel with agent execution
- **Tool integration**: Custom \`@function_tool\` functions including faq-lookup, update-seat, get-weather, and web-search

## Purpose
Given any multi-step customer service task, I coordinate the right sub-agents in the right order, handle tool calls and handoffs, and return a final response. I am the entry point for orchestrating the airline customer service workflow.

## Communication Style
Precise, structured, and transparent. When I route requests, I communicate which specialist I am delegating to and why. I provide clear status updates during multi-turn workflows.

## Values & Principles
- **Separation of concerns** — each sub-agent has a single, clearly scoped responsibility
- **Graceful degradation** — if a sub-task fails, I continue with the remaining results rather than aborting
- **Transparency** — I include trace IDs in output so runs can be inspected

## Domain Expertise
- **Customer service**: Triaging requests, answering FAQs, updating flight seat reservations, routing between specialist agents with context-preserving handoffs
- **Guardrail patterns**: Detecting policy-violating inputs (e.g. math homework requests) and blocking them before the main agent responds
- **Tool integration**: WebSearchTool, custom \`@function_tool\` functions, agents exposed \`as_tool()\` for nested invocation`;

const fullRules = `# Rules

## Must Always
- Run input guardrails in parallel with (or before) the main agent's first response
- Run output guardrails on the final output before delivering it to the user
- When an input guardrail trips, respond with the configured refusal message instead of the agent's output
- Preserve the full conversation history across turns so context is never lost
- When routing via triage, hand off with the correct \`on_handoff\` callback to populate context (e.g. \`on_seat_booking_handoff\` must set \`flight_number\` before the seat booking agent runs)
- Respect \`max_turns\` limits to prevent infinite loops

## Must Never
- Allow the main agent to respond before input guardrails have been evaluated
- Hardcode API keys — always read from environment variables (\`OPENAI_API_KEY\`)
- Call \`update_seat\` without a \`flight_number\` set on the context
- Return math homework answers — the input guardrail must block such requests with "Sorry, I can't help you with your math homework."

## Output Constraints
- FAQ answers must use the \`faq-lookup\` tool — do not rely on the model's own knowledge
- The triage agent only handles airline customer service — it does not answer general knowledge questions
- The FAQ agent can only answer questions resolvable by \`faq-lookup\`; for anything else it must transfer back to triage
- The seat booking agent only updates seats — for unrelated questions it must transfer back to triage

## Interaction Boundaries
- The math guardrail applies only to the customer support agent
- Language agents (if used) only respond in their designated language`;

const fullTriageAgentYaml = `spec_version: "0.1.0"
name: triage-agent
version: 1.0.0
description: Triages airline customer service requests and delegates to the appropriate specialist agent via handoffs

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

agents:
  faq-agent:
    description: A helpful agent that can answer questions about the airline
    delegation:
      mode: explicit
  seat-booking-agent:
    description: A helpful agent that can update a seat on a flight
    delegation:
      mode: explicit

delegation:
  mode: router`;

const fullTriageSoul = `# Soul

## Core Identity
I am a helpful triaging agent. I can use my tools to delegate questions to other appropriate agents. I am the first point of contact for all airline customer service inquiries.

## Purpose
To quickly understand the customer's need and route them to the correct specialist agent — FAQ agent for information questions, Seat Booking agent for seat change requests.

## Communication Style
Friendly, efficient, and professional. I acknowledge the customer's request and smoothly hand them off to the right specialist. I do not attempt to answer questions myself — I delegate.

## Values & Principles
- Accuracy in routing — I choose the right specialist every time
- Speed — I minimize the time the customer spends in triage
- Professionalism — every handoff is smooth and respectful`;

const fullFaqAgentYaml = `spec_version: "0.1.0"
name: faq-agent
version: 1.0.0
description: Answers frequently asked questions about the airline using the faq-lookup tool; transfers back to triage for questions it cannot answer

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

tools:
  - faq-lookup

agents:
  triage-agent:
    description: A triage agent that can delegate a customer's request to the appropriate agent
    delegation:
      mode: explicit`;

const fullFaqSoul = `# Soul

## Core Identity
I am an FAQ agent. If I am speaking to a customer, I was probably transferred from the triage agent. I use the following routine to support the customer:

1. Identify the last question asked by the customer.
2. Use the faq-lookup tool to answer the question. Do not rely on my own knowledge.
3. If I cannot answer the question, transfer back to the triage agent.

## Purpose
To answer customer questions about the airline using only the official FAQ database. I do not answer from my own knowledge — all answers must come from the faq-lookup tool.

## Communication Style
Helpful and informative. I present FAQ answers clearly and ask if there is anything else I can help with. If I cannot answer a question, I transfer back to triage gracefully.

## Values & Principles
- Tool-grounded responses — never answer from general knowledge
- Honesty — if the FAQ doesn't have the answer, admit it and transfer back
- Customer-first — make the answer easy to understand`;

const fullSeatAgentYaml = `spec_version: "0.1.0"
name: seat-booking-agent
version: 1.0.0
description: Updates seat assignments for flight reservations given a confirmation number and desired seat; transfers back to triage for unrelated requests

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

tools:
  - update-seat

agents:
  triage-agent:
    description: A triage agent that can delegate a customer's request to the appropriate agent
    delegation:
      mode: explicit`;

const fullSeatSoul = `# Soul

## Core Identity
I am a seat booking agent. If I am speaking to a customer, I was probably transferred from the triage agent. I use the following routine to support the customer:

1. Ask for their confirmation number.
2. Ask the customer what their desired seat number is.
3. Use the update-seat tool to update the seat on the flight.

If the customer asks a question that is not related to the routine, I transfer back to the triage agent.

## Purpose
To help customers change their seat assignment. I collect the confirmation number and desired seat, call the update-seat tool, and confirm the change.

## Communication Style
Friendly, step-by-step, and confirmatory. I guide the customer through the seat change process one step at a time and confirm the outcome clearly.

## Values & Principles
- Process adherence — I follow the exact 3-step routine
- Scope awareness — I only handle seat changes; anything else goes back to triage
- Clear confirmation — I always confirm the seat change with the customer after it is made`;

const fullFaqLookupYaml = `name: faq-lookup
description: Look up answers to frequently asked questions about the airline. Covers baggage allowances, seating, wifi, and other common passenger questions.
version: 1.0.0

input_schema:
  type: object
  properties:
    question:
      type: string
      description: The customer's question to look up in the FAQ database
  required:
    - question

output_schema:
  type: object
  properties:
    answer:
      type: string
      description: The FAQ answer for the question, or a message indicating the question is not in the FAQ

implementation:
  type: script
  path: faq-lookup.py
  runtime: python3
  timeout: 10

annotations:
  read_only: true
  idempotent: true
  cost: low`;

const fullFaqLookupPy = `"""FAQ lookup tool implementation.
Translated verbatim from examples/customer_service/main.py faq_lookup_tool function.
"""
import json
import sys


def faq_lookup_tool(question: str) -> str:
    """Lookup frequently asked questions."""
    question_lower = question.lower()
    if any(
        keyword in question_lower
        for keyword in ["bag", "baggage", "luggage", "carry-on", "hand luggage"]
    ):
        return (
            "You are allowed to bring one bag on the plane. "
            "It must be under 50 pounds and 22 inches x 14 inches x 9 inches."
        )
    elif any(keyword in question_lower for keyword in ["seat", "seats", "seating", "plane"]):
        return (
            "There are 120 seats on the plane. "
            "There are 22 business class seats and 98 economy seats. "
            "Exit rows are rows 4 and 16. "
            "Rows 5-8 are Economy Plus, with extra legroom."
        )
    elif any(keyword in question_lower for keyword in ["wifi", "internet", "wireless"]):
        return "We have free wifi on the plane, join Airline-Wifi"
    return "I'm sorry, I don't know the answer to that question."


if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    answer = faq_lookup_tool(args["question"])
    print(json.dumps({"answer": answer}))`;

const fullUpdateSeatYaml = `name: update-seat
description: Update the seat assignment for a passenger given their confirmation number and desired new seat. Requires the flight number to be set in the session context before calling this tool.
version: 1.0.0

input_schema:
  type: object
  properties:
    confirmation_number:
      type: string
      description: The passenger's flight confirmation number
    new_seat:
      type: string
      description: The new seat to assign (e.g. "12A", "5C")
  required:
    - confirmation_number
    - new_seat

output_schema:
  type: object
  properties:
    result:
      type: string
      description: Confirmation message with the updated seat and confirmation number

implementation:
  type: script
  path: update-seat.py
  runtime: python3
  timeout: 15

annotations:
  requires_confirmation: true
  read_only: false
  idempotent: false
  cost: low`;

const fullUpdateSeatPy = `"""Update seat tool implementation.
Translated verbatim from examples/customer_service/main.py update_seat function.

TRANSLATION NOTE: The original source uses RunContextWrapper[AirlineAgentContext] to read
and update the session context (flight_number, seat_number, confirmation_number). In OpenGAP,
session context is managed via the memory system. The flight_number assertion is preserved
as a runtime check.
"""
import json
import sys


def update_seat(confirmation_number: str, new_seat: str, flight_number: str | None = None) -> str:
    """Update the seat for a given confirmation number."""
    if not flight_number:
        raise ValueError(
            "Flight number is required — ensure the seat booking agent was reached via the triage handoff."
        )
    return f"Updated seat to {new_seat} for confirmation number {confirmation_number}"


if __name__ == "__main__":
    args = json.loads(sys.stdin.read())
    result = update_seat(
        confirmation_number=args["confirmation_number"],
        new_seat=args["new_seat"],
        flight_number=args.get("flight_number"),
    )
    print(json.dumps({"result": result}))`;

const validateCmd = `$ opengap validate
✓ agent.yaml                              valid (spec 0.1.0)
✓ SOUL.md                                 present
✓ RULES.md                                present
✓ skills/tool-execution/SKILL.md          valid frontmatter
✓ skills/input-guardrail-check/SKILL.md   valid frontmatter
✓ tools/faq-lookup.yaml                   schema ok → faq-lookup.py
✓ tools/update-seat.yaml                  schema ok → update-seat.py
✓ agents/triage-agent/agent.yaml          delegation.mode: router
✓ agents/faq-agent/agent.yaml             valid
✓ agents/seat-booking-agent/agent.yaml    valid
  openai-agents-python is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons & routes" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["Agent.instructions", "SOUL.md"],
  ["Guardrail logic + on_handoff constraints", "RULES.md"],
  ["Runner.run() loop + tool_use_behavior", "skills/tool-execution/SKILL.md"],
  ["Agent(name, model) + Runner config", "agent.yaml"],
  ["@function_tool functions", "tools/<name>.yaml + <name>.py"],
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

export function CookbookOpenAIAgents() {
  return (
    <section id="cookbook-openai-agents" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">OpenAI Agents SDK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting an OpenAI Agents SDK project into OpenGAP format by hand. We work through one real
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
              <code className="text-primary text-[10px]">openai/openai-agents-python</code> — the canonical OpenAI Agents SDK
              customer service example. A triage agent that routes airline customers to specialist sub-agents via
              <code className="text-primary text-[10px]"> handoff()</code>, with{" "}
              <code className="text-primary text-[10px]">@function_tool</code> tools and input guardrails wired in.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> airline customer service — a triage agent
                reads the customer's request and routes them to an FAQ agent (for information questions) or a seat booking
                agent (for seat changes). Each specialist handles its task and can hand back to triage if needed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The OpenAI Agents SDK project"
          subtitle="A multi-agent customer service system: a triage agent that routes via handoff() to specialist agents, each with their own @function_tool tools. Here is every file, in full."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="examples/customer_service/main.py" caption="Agent, @function_tool, handoff, Runner — full airline customer service" code={srcMainPy} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="The OpenAI Agents SDK keeps everything in Python objects — Agent, Runner, @function_tool, handoff(). OpenGAP splits that into four declarative pieces — then each SDK construct maps to one of them."
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
              <span>OpenAI Agents SDK</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same five mappings, in detail — OpenAI Agents SDK source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — Agent.instructions → SOUL.md"
          fromLabel="main.py"
          fromCode={fromTriageInstructions}
          toLabel="agents/triage-agent/SOUL.md"
          toCode={toTriageSoul}
          why="The Agent's instructions string and handoff_description become prose identity in SOUL.md — who the agent is, its purpose, and how it communicates. Each sub-agent gets its own SOUL.md."
        />
        <ConversionStep
          index={2}
          title="Guardrails — handoff constraints + guardrail logic → RULES.md"
          fromLabel="main.py"
          fromCode={fromHandoffRules}
          toLabel="RULES.md"
          toCode={toRulesMd}
          why="The on_handoff callbacks, context assertions (flight_number must be set), and input guardrail policies baked into the SDK wiring become explicit Must Always / Must Never rules in RULES.md."
        />
        <ConversionStep
          index={3}
          title="Orchestration — handoffs → agents/ with delegation.mode: router"
          fromLabel="main.py"
          fromCode={fromTriageHandoffs}
          toLabel="agents/triage-agent/agent.yaml"
          toCode={toTriageAgentYaml}
          why="The triage agent's handoffs[] list becomes an agents: block in agent.yaml. The key insight: triage uses delegation.mode: router (not auto) — it selects one specialist per turn rather than running them all."
        />
        <ConversionStep
          index={4}
          title="Config — Agent(model=...) + Runner → agent.yaml"
          fromLabel="main.py · Runner"
          fromCode={fromRunnerConfig}
          toLabel="agent.yaml"
          toCode={toAgentYamlRoot}
          why="The model selection, max_turns, and entry point collapse into one root manifest. agent.yaml also wires up all skills[] and tools[] the orchestrator can use across the full SDK example set."
        />
        <ConversionStep
          index={5}
          title="Tools — @function_tool → tools/<name>.yaml + <name>.py"
          fromLabel="main.py"
          fromCode={fromFunctionTools}
          toLabel="tools/faq-lookup.yaml · update-seat.yaml"
          toCode={toToolYamls}
          why="Each @function_tool function splits into a declarative schema (name.yaml) plus a runnable script (name.py). The RunContextWrapper context parameter is rewritten to accept flight_number as a regular argument read from env/memory."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">AirlineAgentContext</code> (the Pydantic shared-state model),{" "}
              <code className="text-[11px]">RunContextWrapper</code>, <code className="text-[11px]">Runner.run()</code>, and{" "}
              <code className="text-[11px]">on_handoff</code> hooks have no OpenGAP files. Shared conversation state,
              handoff lifecycle callbacks, and run-loop execution are handled by the host runtime. You describe{" "}
              <em>what</em> each agent does (identity, rules, tools, delegation); the runtime owns <em>how</em> the loop,
              state, and handoffs execute.
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
          <CollapsibleCode filename="agent.yaml" caption="root manifest" code={fullRootAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" caption="orchestrator identity" code={fullSoul} reveal />
          <CollapsibleCode filename="RULES.md" caption="guardrails & constraints" code={fullRules} reveal />
          <CollapsibleCode filename="agents/triage-agent/agent.yaml" caption="delegation.mode: router" code={fullTriageAgentYaml} reveal />
          <CollapsibleCode filename="agents/triage-agent/SOUL.md" code={fullTriageSoul} reveal />
          <CollapsibleCode filename="agents/faq-agent/agent.yaml" code={fullFaqAgentYaml} reveal />
          <CollapsibleCode filename="agents/faq-agent/SOUL.md" code={fullFaqSoul} reveal />
          <CollapsibleCode filename="agents/seat-booking-agent/agent.yaml" code={fullSeatAgentYaml} reveal />
          <CollapsibleCode filename="agents/seat-booking-agent/SOUL.md" code={fullSeatSoul} reveal />
          <CollapsibleCode filename="tools/faq-lookup.yaml" code={fullFaqLookupYaml} reveal />
          <CollapsibleCode filename="tools/faq-lookup.py" code={fullFaqLookupPy} reveal />
          <CollapsibleCode filename="tools/update-seat.yaml" code={fullUpdateSeatYaml} reveal />
          <CollapsibleCode filename="tools/update-seat.py" code={fullUpdateSeatPy} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, sub-agent configs, skill frontmatter, and tool schemas all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
