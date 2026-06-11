import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `google/adk-samples/python/agents/travel-concierge/
├── travel_concierge/
│   ├── agent.py                    ← root agent (coordinates sub-agents)
│   ├── sub_agents/
│   │   ├── inspiration/
│   │   │   ├── agent.py            ← place_agent + poi_agent + inspiration_agent
│   │   │   └── prompt.py           ← INSPIRATION_AGENT_INSTR
│   │   ├── planning/agent.py
│   │   ├── booking/agent.py
│   │   └── ...
│   ├── tools/places.py             ← Google Maps toolset
│   └── shared_libraries/types.py   ← DestinationIdeas, POISuggestions schemas
└── pyproject.toml`;

const agentPy = `# travel_concierge/agent.py
from google.adk.agents import Agent
from travel_concierge import MODEL
from travel_concierge.sub_agents.inspiration.agent import inspiration_agent
from travel_concierge.sub_agents.planning.agent import planning_agent
from travel_concierge.sub_agents.booking.agent import booking_agent

root_agent = Agent(
    name="travel_concierge",
    model=MODEL,   # e.g. "gemini-2.0-flash"
    instruction="A Travel Concierge using the services of multiple sub-agents",
    sub_agents=[
        inspiration_agent,
        planning_agent,
        booking_agent,
        # + pre_trip, in_trip, post_trip
    ],
)`;

const inspirationPy = `# travel_concierge/sub_agents/inspiration/agent.py
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from travel_concierge.tools.places import get_places_toolset
from travel_concierge.sub_agents.inspiration import prompt

place_agent = Agent(
    model=MODEL,
    name="place_agent",
    instruction=prompt.PLACE_AGENT_INSTR,
    description="Suggests destinations given user preferences",
)

poi_agent = Agent(
    model=MODEL,
    name="poi_agent",
    description="Suggests activities and points of interest for a destination",
    instruction=prompt.POI_AGENT_INSTR,
    tools=[get_places_toolset()],   # Google Maps grounding
)

inspiration_agent = Agent(
    model=MODEL,
    name="inspiration_agent",
    description="Travel inspiration: inspires users and discovers their next vacation",
    instruction=prompt.INSPIRATION_AGENT_INSTR,
    tools=[AgentTool(agent=place_agent), AgentTool(agent=poi_agent)],
)`;

const promptPy = `# travel_concierge/sub_agents/inspiration/prompt.py (excerpt)
INSPIRATION_AGENT_INSTR = """
You are a travel inspiration agent who helps users find their next dream vacation.
Your role is to help the user identify a destination and activities they're interested in.

- Call place_agent to recommend vacation destinations given vague ideas.
- Call poi_agent to suggest points of interest once the user has a specific city in mind.
- Avoid asking too many questions — when user says "inspire me", call place_agent immediately.
- Transfer to planning_agent once the user wants a detailed itinerary or flight/hotel deals.

Current user:
  <user_profile>{user_profile}</user_profile>
Current time: {_time}
"""`;

const agentYaml = `spec_version: 0.1.0
name: travel-concierge
version: 0.1.0
description: A travel concierge that coordinates specialized sub-agents across the full trip lifecycle
model:
  preferred: gemini-2.0-flash
agents:
  inspiration-agent:
    description: Inspires users and discovers their next vacation destination
    delegation:
      mode: auto
  planning-agent:
    description: Creates detailed itineraries and schedules
    delegation:
      mode: auto
  booking-agent:
    description: Books flights and hotels
    delegation:
      mode: auto
  pre-trip-agent:
    description: Prepares travellers before departure
    delegation:
      mode: auto
  in-trip-agent:
    description: Provides real-time support during the trip
    delegation:
      mode: auto
  post-trip-agent:
    description: Handles post-trip feedback and follow-up
    delegation:
      mode: auto`;

const soulMd = `# Soul

## Core Identity
A Travel Concierge that coordinates multiple specialized sub-agents.

## Purpose
Help users plan their entire trip — from initial inspiration and destination
discovery through booking, pre-trip preparation, and in-trip support.

## Behavior
- Delegate to specialist sub-agents rather than handling tasks directly
- Hand off to inspiration_agent for destination ideas
- Hand off to planning_agent for itineraries and schedules
- Hand off to booking_agent for flights and hotels`;

const subInspirationYaml = `spec_version: 0.1.0
name: inspiration-agent
version: 0.1.0
description: Travel inspiration — inspires users and discovers their next vacation destination
model:
  preferred: gemini-2.0-flash
tools:
  - place-agent
  - poi-agent
  - google-places`;

const subInspirationSoul = `# Soul

## Core Identity
You are a travel inspiration agent who helps users find their next dream vacation.

## Purpose
Help the user identify a destination and activities they're interested in.

## Behavior
- Call place_agent to recommend vacation destinations given vague ideas
- Call poi_agent to suggest points of interest once a city is selected
- When user says "inspire me", act immediately — don't ask questions first
- Transfer to planning_agent once user wants a detailed itinerary`;

const toolPlaceAgent = `name: place-agent
description: Suggests vacation destinations given user preferences and vague ideas.
input_schema:
  type: object
  properties:
    inspiration_query:
      type: string
      description: User preferences or vague idea for a destination
  required:
    - inspiration_query
implementation:
  type: script
  path: tools/place_agent.py
  runtime: python3
  timeout: 30`;

const toolPoiAgent = `name: poi-agent
description: Suggests activities and points of interest for a specific destination.
input_schema:
  type: object
  properties:
    destination:
      type: string
      description: The city or destination to find activities for
  required:
    - destination
implementation:
  type: script
  path: tools/poi_agent.py
  runtime: python3
  timeout: 30`;

const toolGooglePlaces = `name: google-places
description: Search Google Maps for places, attractions, and local businesses near a location.
input_schema:
  type: object
  properties:
    query:
      type: string
      description: Search query for places or attractions
    location:
      type: string
      description: The city or area to search within
  required:
    - query
    - location
implementation:
  type: script
  path: tools/google_places.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./travel-concierge-opengap
opengap info -d ./travel-concierge-opengap`;

const mapping = [
  ["Agent(instruction=...)", "SOUL.md"],
  ["Agent(name=...) — kebab-case", "agent.yaml → name"],
  ["Agent(model=...) e.g. gemini-2.0-flash", "agent.yaml → model.preferred"],
  ["Agent(description=...)", "agent.yaml → description"],
  ["Agent(sub_agents=[...]) — each sub-agent", "agents/<name>/agent.yaml + SOUL.md"],
  ["AgentTool(agent=X) — delegated sub-agents as tools", "agent.yaml → tools[] + tools/<name>.yaml"],
  ["FunctionTool / get_places_toolset()", "tools/<name>.yaml"],
  ["prompt.py instruction constants", "sub-agent SOUL.md"],
];

const steps = [
  { step: "1", desc: "Start with the root agent. Copy Agent(instruction=...) into SOUL.md. Use Agent(name=...) as agent.yaml → name (kebab-case)." },
  { step: "2", desc: "Take Agent(model=...) (the MODEL constant, e.g. gemini-2.0-flash) → write to agent.yaml → model.preferred." },
  { step: "3", desc: "For each Agent in sub_agents=[], create a directory agents/<name>/ with its own agent.yaml and SOUL.md using the same mapping." },
  { step: "4", desc: "For each AgentTool(agent=X) used as a tool inside a sub-agent, add a kebab-case entry to that agent's tools[] and create tools/<name>.yaml." },
  { step: "5", desc: "For each FunctionTool or toolset (e.g. Google Maps grounding), create tools/<name>.yaml with description and input_schema." },
  { step: "6", desc: "Prompt constants in prompt.py become each sub-agent's SOUL.md. Template variables like {user_profile} can be noted in SOUL.md comments." },
];

export function CookbookGoogleADK() {
  return (
    <section id="cookbook-google-adk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Google ADK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">google/adk-samples</code> travel concierge — a root agent that coordinates
            six specialized sub-agents (inspiration, planning, booking, pre-trip, in-trip, post-trip).
            Each <code className="text-primary text-xs">Agent</code> maps to its own OpenGAP directory;
            <code className="text-primary text-xs">AgentTool</code> sub-agents become tool entries.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The Google ADK project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Multi-agent travel concierge with sub-agents across the trip lifecycle:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">travel_concierge/agent.py</code> — root agent:</p>
              <CodeBlock code={agentPy} filename="travel_concierge/agent.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">sub_agents/inspiration/agent.py</code> — example sub-agent:</p>
              <CodeBlock code={inspirationPy} filename="sub_agents/inspiration/agent.py" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">sub_agents/inspiration/prompt.py</code>:</p>
              <CodeBlock code={promptPy} filename="sub_agents/inspiration/prompt.py" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>Google ADK</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root: <code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root: <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/inspiration-agent/agent.yaml</code>:</p>
              <CodeBlock code={subInspirationYaml} filename="agents/inspiration-agent/agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/inspiration-agent/SOUL.md</code> — from prompt.py:</p>
              <CodeBlock code={subInspirationSoul} filename="agents/inspiration-agent/SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent tool: <code className="text-primary text-xs">agents/inspiration-agent/tools/place-agent.yaml</code> — AgentTool mapped to tool YAML:</p>
              <CodeBlock code={toolPlaceAgent} filename="agents/inspiration-agent/tools/place-agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent tool: <code className="text-primary text-xs">agents/inspiration-agent/tools/poi-agent.yaml</code>:</p>
              <CodeBlock code={toolPoiAgent} filename="agents/inspiration-agent/tools/poi-agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent tool: <code className="text-primary text-xs">agents/inspiration-agent/tools/google-places.yaml</code> — from get_places_toolset():</p>
              <CodeBlock code={toolGooglePlaces} filename="agents/inspiration-agent/tools/google-places.yaml" />
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
