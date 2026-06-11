import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full Google ADK source  ═══════════════════ */

const sourceTree = `google/adk-samples/python/agents/travel-concierge/
├── travel_concierge/
│   ├── agent.py                    ← root Agent: orchestrates 6 sub-agents
│   ├── sub_agents/
│   │   ├── inspiration/
│   │   │   ├── agent.py            ← place_agent + poi_agent + inspiration_agent
│   │   │   └── prompt.py           ← INSPIRATION_AGENT_INSTR, PLACE_AGENT_INSTR, …
│   │   ├── planning/
│   │   │   └── agent.py            ← 5 sub-agents: flight-search, seat, hotel, room, itinerary
│   │   ├── booking/
│   │   │   └── agent.py            ← 3 sub-agents: create-reservation, payment-choice, process-payment
│   │   ├── pre_trip/agent.py
│   │   ├── in_trip/agent.py        ← day-of-agent + trip-monitor-agent
│   │   └── post_trip/agent.py
│   ├── tools/
│   │   ├── places.py               ← get_places_toolset() (Google Maps MCP)
│   │   └── memory.py               ← memorize() — stores key/value into session state
│   └── shared_libraries/types.py   ← DestinationIdeas, POISuggestions (Pydantic BaseModel)
└── pyproject.toml`;

const srcAgentPy = `# travel_concierge/agent.py
from google.adk.agents import Agent
from travel_concierge import MODEL          # "gemini-2.0-flash"
from travel_concierge.sub_agents.inspiration.agent import inspiration_agent
from travel_concierge.sub_agents.planning.agent   import planning_agent
from travel_concierge.sub_agents.booking.agent    import booking_agent
from travel_concierge.sub_agents.pre_trip.agent   import pre_trip_agent
from travel_concierge.sub_agents.in_trip.agent    import in_trip_agent
from travel_concierge.sub_agents.post_trip.agent  import post_trip_agent
from travel_concierge.tools.memory import memorize

root_agent = Agent(
    name="travel_concierge",
    model=MODEL,
    instruction=ROOT_AGENT_INSTR,          # ← system prompt
    sub_agents=[
        inspiration_agent,
        planning_agent,
        booking_agent,
        pre_trip_agent,
        in_trip_agent,
        post_trip_agent,
    ],
    before_agent_callback=_load_precreated_itinerary,
)`;

const srcInspirationPy = `# travel_concierge/sub_agents/inspiration/agent.py
from google.adk.agents import Agent
from google.adk.tools.agent_tool import AgentTool
from travel_concierge.tools.places import get_places_toolset
from travel_concierge.sub_agents.inspiration import prompt

place_agent = Agent(
    model=MODEL,
    name="place_agent",
    instruction=prompt.PLACE_AGENT_INSTR,
    description="Suggests destinations given user preferences",
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
    output_key="place",                    # ← stored in session state
)

poi_agent = Agent(
    model=MODEL,
    name="poi_agent",
    description="Suggests activities and points of interest for a destination",
    instruction=prompt.POI_AGENT_INSTR,
    tools=[get_places_toolset()],          # ← Google Maps grounding
    disallow_transfer_to_parent=True,
    disallow_transfer_to_peers=True,
    output_key="poi",
)

inspiration_agent = Agent(
    model=MODEL,
    name="inspiration_agent",
    description="Travel inspiration: inspires users and discovers their next vacation",
    instruction=prompt.INSPIRATION_AGENT_INSTR,
    tools=[AgentTool(agent=place_agent), AgentTool(agent=poi_agent)],
)`;

const srcPromptPy = `# travel_concierge/sub_agents/inspiration/prompt.py (excerpt)
INSPIRATION_AGENT_INSTR = """
You are a travel inspiration agent who helps users find their next dream vacation.
Your role is to help the user identify a destination and activities.

- Call place_agent to recommend destinations given vague ideas.
- Call poi_agent to suggest points of interest once a city is chosen.
- Avoid asking too many questions — when user says "inspire me", call place_agent immediately.
- Transfer to planning_agent once the user wants a detailed itinerary or flights.

Current user:
  <user_profile>{user_profile}</user_profile>
Current time: {_time}
"""

PLACE_AGENT_INSTR = """
Return up to 3 vacation destinations as structured JSON:
{ "places": [{ "name": ..., "country": ..., "image": ...,
               "highlights": ..., "rating": ... }] }
"""`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromAgentInstruction = `# agent.py  (root Agent)
root_agent = Agent(
    name="travel_concierge",
    model=MODEL,                       # "gemini-2.0-flash"
    instruction=ROOT_AGENT_INSTR,      # ← who the agent is
    sub_agents=[...],
    before_agent_callback=_load_precreated_itinerary,
)`;

const toRootSoul = `# SOUL.md
## Core Identity
I am an exclusive travel concierge agent. I help users
discover their dream vacation, plan it, and book flights
and hotels. I coordinate a team of specialized sub-agents
to handle every phase of the travel journey.

## Purpose
Assessment + routing hub:
- Discovery/inspiration  → \`inspiration_agent\`
- Flights/hotels/plan    → \`planning_agent\`
- Bookings + payment     → \`booking_agent\`
- Before departure       → \`pre_trip_agent\`
- During the trip        → \`in_trip_agent\`
- After the trip         → \`post_trip_agent\``;

const fromAgentRules = `# agent.py + prompt.py  (control logic)
# Trip phase logic baked into ROOT_AGENT_INSTR:
if current_time < itinerary_start_date:
    transfer_to(pre_trip_agent)
elif itinerary_start_date <= current_time <= itinerary_end_date:
    transfer_to(in_trip_agent)
elif current_time > itinerary_end_date:
    transfer_to(post_trip_agent)

# Hard routing rules also in instruction:
# "only use available sub-agents and tools"
# "keep responses to a phrase after each tool call"`;

const toRootRules = `# RULES.md
## Must Always
- Delegate to sub-agents — never answer travel queries directly
- Determine trip phase from itinerary dates vs. current time
- Keep responses to a phrase after each sub-agent result
- Inject {user_profile} and {_time} into all delegations

## Must Never
- Answer flights/hotels/booking queries without delegating
- Make booking or payment decisions without booking_agent
- Provide detailed itinerary planning without planning_agent

## Trip Phase Logic
Pre-trip   : current_time < itinerary_start_date
In-trip    : start_date ≤ current_time ≤ end_date
Post-trip  : current_time > itinerary_end_date`;

const fromSubAgents = `# agent.py  (sub_agents list)
root_agent = Agent(
    sub_agents=[
        inspiration_agent,   # ← Agent(name, model, instruction, …)
        planning_agent,
        booking_agent,
        pre_trip_agent,
        in_trip_agent,
        post_trip_agent,
    ],
)`;

const toAgentsDir = `# agent.yaml  (agents: block)
agents:
  inspiration-agent:
    description: Travel inspiration — destinations & POI
    delegation:
      mode: auto
  planning-agent:
    description: Flights, hotels, seat/room selection, itinerary
    delegation:
      mode: auto
  booking-agent:
    description: Bookings, reservations, payment processing
    delegation:
      mode: auto
  pre-trip-agent:
    description: Visa, advisories, packing — before departure
    delegation:
      mode: auto
  in-trip-agent:
    description: Monitoring + logistics during the trip
    delegation:
      mode: auto
  post-trip-agent:
    description: Feedback and preference learning after the trip
    delegation:
      mode: auto`;

const fromBeforeCallback = `# agent.py  (before_agent_callback)
def _load_precreated_itinerary(callback_context):
    """Loads a pre-created itinerary from a scenario file
    and seeds session state before the first agent turn."""
    scenario = os.environ.get(
        "TRAVEL_CONCIERGE_SCENARIO",
        "travel_concierge/profiles/itinerary_empty_default.json"
    )
    with open(scenario) as f:
        state = json.load(f)["state"]
    for k, v in state.items():
        callback_context.state[k] = v

root_agent = Agent(
    before_agent_callback=_load_precreated_itinerary, …)`;

const toSkill = `# skills/load-itinerary/SKILL.md
---
name: load-itinerary
description: "Load a pre-created itinerary and initialize
  session state at the start of a conversation."
---

## Step 1: Check Initialization
If session state key \`_itin_initialized\` is set, skip.

## Step 2: Load Scenario File
Read JSON from TRAVEL_CONCIERGE_SCENARIO env var
(default: itinerary_empty_default.json).

## Step 3: Set Initial State
Populate session state from scenario's \`state\` object;
set _time to now; set _itin_initialized = true.

<!-- NOTE: before_agent_callback has no OpenGAP
     equivalent — this skill fires at session start. -->`;

const fromAgentTools = `# inspiration/agent.py  (AgentTool + FunctionTool)
place_agent = Agent(name="place_agent", …)
poi_agent   = Agent(
    name="poi_agent",
    tools=[get_places_toolset()],      # ← Google Maps MCP
)
inspiration_agent = Agent(
    tools=[
        AgentTool(agent=place_agent),  # ← sub-agent as tool
        AgentTool(agent=poi_agent),
    ],
)`;

const toToolsDir = `# agent.yaml (inspiration-agent sub-agent)
agents:
  place-agent:
    description: Suggests vacation destinations (≤ 3 results)
    delegation:
      mode: explicit
  poi-agent:
    description: Suggests POI / activities (≤ 5 results)
    delegation:
      mode: explicit

tools:
  - google-maps-places

# tools/google-maps-places.yaml
implementation:
  type: mcp_server
  url: https://mapstools.googleapis.com/mcp`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `travel-concierge-agent/          (OpenGAP v4)
├── agent.yaml                   ← manifest: model, agents, skills, delegation
├── SOUL.md                      ← root identity
├── RULES.md                     ← guardrails + trip-phase logic
├── skills/
│   └── load-itinerary/
│       └── SKILL.md             ← replaces before_agent_callback
├── tools/
│   ├── google-maps-places.yaml  ← MCP server binding
│   ├── google-search-grounding.yaml
│   ├── memorize.yaml + memorize.py
│   ├── flight-status-check.yaml + .py
│   ├── event-booking-check.yaml + .py
│   └── weather-impact-check.yaml + .py
└── agents/
    ├── inspiration-agent/
    │   ├── agent.yaml           ← place-agent + poi-agent + google-maps-places
    │   ├── SOUL.md
    │   └── agents/
    │       ├── place-agent/     ← agent.yaml + SOUL.md
    │       └── poi-agent/       ← agent.yaml + SOUL.md
    ├── planning-agent/
    │   ├── agent.yaml           ← 5 sub-agents + memorize tool
    │   ├── SOUL.md
    │   └── agents/
    │       ├── flight-search-agent/
    │       ├── flight-seat-selection-agent/
    │       ├── hotel-search-agent/
    │       ├── hotel-room-selection-agent/
    │       └── itinerary-agent/
    ├── booking-agent/
    │   ├── agent.yaml           ← 3 sub-agents (temperature: 0.0)
    │   ├── SOUL.md
    │   └── agents/
    │       ├── create-reservation-agent/
    │       ├── payment-choice-agent/
    │       └── process-payment-agent/
    ├── pre-trip-agent/
    │   ├── agent.yaml           ← what-to-pack-agent + google-search-grounding
    │   ├── SOUL.md
    │   └── agents/
    │       └── what-to-pack-agent/
    ├── in-trip-agent/
    │   ├── agent.yaml           ← day-of-agent + trip-monitor-agent + memorize
    │   ├── SOUL.md
    │   └── agents/
    │       ├── day-of-agent/
    │       └── trip-monitor-agent/
    └── post-trip-agent/
        ├── agent.yaml           ← memorize tool
        └── SOUL.md`;

const fullRootAgentYaml = `spec_version: "0.1.0"
name: travel-concierge-agent
version: 1.0.0
description: An exclusive travel concierge that helps users discover, plan, book,
  and experience their dream vacations using multiple specialized sub-agents

model:
  preferred: google:gemini-2.0-flash
  fallback:
    - openai:gpt-4o

runtime:
  max_turns: 50
  timeout: 300

skills:
  - load-itinerary

agents:
  inspiration-agent:
    description: Travel inspiration agent who helps users find their next dream vacation destinations, suggest places and points of interest
    delegation:
      mode: auto
  planning-agent:
    description: Travel planning agent who helps users with flight searches, hotel searches, seat and room selection, and full itinerary creation
    delegation:
      mode: auto
  booking-agent:
    description: Booking agent who completes flight, hotel, and activity bookings by handling reservation creation, payment choices, and payment processing
    delegation:
      mode: auto
  pre-trip-agent:
    description: Pre-trip assistant who provides visa requirements, medical requirements, travel advisories, storm monitoring, and packing suggestions before the trip
    delegation:
      mode: auto
  in-trip-agent:
    description: In-trip concierge who monitors bookings, provides logistical transport assistance, and serves as a tour guide during the trip
    delegation:
      mode: auto
  post-trip-agent:
    description: Post-trip assistant who collects user feedback and learns preferences to improve future trip planning
    delegation:
      mode: auto

delegation:
  mode: auto`;

const fullRootSoul = `# Soul

## Core Identity
I am an exclusive travel concierge agent. I help users discover their dream vacation, plan for the vacation, and book flights and hotels. I coordinate a team of specialized sub-agents to handle every phase of the travel journey — from initial inspiration through booking, pre-trip preparation, in-trip support, and post-trip follow-up.

My primary directive is to gather minimal information needed to help the user and then delegate control to the appropriate specialist sub-agent based on what the user needs and the current trip phase.

## Purpose
I serve as the orchestration hub for a complete end-to-end travel concierge experience. I assess the user's needs and the current trip phase, then route appropriately:
- Discovery and inspiration → \`inspiration_agent\`
- Flight and hotel search, itinerary planning → \`planning_agent\`
- Making bookings and processing payments → \`booking_agent\`
- Pre-trip preparation and travel information → \`pre_trip_agent\`
- In-trip logistics, monitoring, and touring → \`in_trip_agent\`
- Post-trip feedback and preference learning → \`post_trip_agent\`

## Communication Style
Concise and focused. After every tool call or delegation, I keep responses limited to a phrase — I show results without lengthy commentary. I gather only minimal information needed to help the user.

## Values & Principles
- **Minimal friction** — gather only what is truly needed to help the user
- **Intelligent delegation** — route to the right sub-agent rather than attempting to handle everything myself
- **Context awareness** — use the user's profile, itinerary, and current time to determine trip phase and personalize responses
- **Deference to specialists** — only the agents and tools are used to fulfill all user requests

## Collaboration Style
**Trip Phase Logic (when a non-empty itinerary exists):**
- If current time is before \`itinerary_start_date\` → \`pre_trip_agent\`
- If current time is between start and end dates → \`in_trip_agent\`
- If current time is after \`itinerary_end_date\` → \`post_trip_agent\`

**Request-Based Routing:**
- General knowledge, vacation inspiration, things to do → \`inspiration_agent\`
- Finding flight deals, seat selection, lodging → \`planning_agent\`
- Ready to make flight booking or process payments → \`booking_agent\`

**Injected context:** \`{user_profile}\`, \`{_time}\`, \`{itinerary}\`, \`{itinerary_start_date}\`, \`{itinerary_end_date}\``;

const fullRootRules = `# Rules

## Must Always
- Use only the available sub-agents and tools to fulfill all user requests — do not attempt to answer without delegating to the appropriate specialist
- Gather minimal information from the user before delegating
- Keep responses limited to a phrase after every tool call or sub-agent result
- Determine trip phase based on the current time relative to \`itinerary_start_date\` and \`itinerary_end_date\` when an itinerary exists
- Inject the user's profile context (\`{user_profile}\`) and current time (\`{_time}\`) into all delegations
- Transfer to \`inspiration_agent\` for general knowledge, vacation inspiration, or things-to-do queries
- Transfer to \`planning_agent\` when the user asks about flight deals, seat selection, or lodging
- Transfer to \`booking_agent\` when the user is ready to make a booking or process payment
- Delegate to \`pre_trip_agent\`, \`in_trip_agent\`, or \`post_trip_agent\` based on the determined trip phase

## Must Never
- Attempt to answer travel-specific queries (flights, hotels, activities, bookings) without delegating to the relevant sub-agent
- Ignore the trip phase logic when an itinerary is present
- Make booking or payment decisions without transferring to \`booking_agent\`
- Provide detailed itinerary planning without delegating to \`planning_agent\`

## Output Constraints
- Responses after tool calls must be brief — a single phrase or short sentence
- Do not provide lengthy commentary on sub-agent results; just surface the key information

## Interaction Boundaries
- Scope is limited to travel concierge services: inspiration, planning, booking, pre-trip, in-trip, and post-trip assistance
- Session state (itinerary, user profile, flight/hotel selections) is maintained across the conversation`;

const fullInspirationAgentYaml = `spec_version: "0.1.0"
name: inspiration-agent
version: 1.0.0
description: A travel inspiration agent who helps users find their next dream vacation destinations, suggests places and points of interest, and serves as a personal local travel guide

model:
  preferred: google:gemini-2.0-flash
  fallback:
    - openai:gpt-4o

agents:
  place-agent:
    description: Suggests vacation destinations given vague user preferences, returning structured destination ideas with name, country, image, highlights, and rating
    delegation:
      mode: explicit
  poi-agent:
    description: Provides points of interests and activities suggestions given a specific city or region, using Google Maps grounding when available
    delegation:
      mode: explicit

delegation:
  mode: explicit

tools:
  - google-maps-places`;

const fullInspirationSoul = `# Soul

## Core Identity
I am a travel inspiration agent who helps users find their next big dream vacation destinations. My role and goal is to help the user identify a destination and a few activities at the destination they are interested in.

## Purpose
I inspire users to discover vacation destinations and activities. I use two specialist sub-agents:
- \`place_agent\` — to recommend general vacation destinations given vague ideas
- \`poi_agent\` — to provide points of interests and activities suggestions once the user has a specific city or region in mind

I avoid asking too many questions. When a user gives instructions like "inspire me" or "suggest some", I go ahead and call \`place_agent\` immediately.

## Communication Style
Enthusiastic and inspiring. Focused on destinations and activities. I do not attempt to plan detailed itineraries — that is \`planning_agent\`'s role.

## Collaboration Style
I transfer the user to \`planning_agent\` once they want a detailed itinerary or flight/hotel searches.

**Injected context:** \`{user_profile}\`, \`{_time}\``;

const fullPlaceAgentYaml = `spec_version: "0.1.0"
name: place-agent
version: 1.0.0
description: Suggests vacation destinations based on user preferences, returning up to 3 structured destination ideas with name, country, image URL, highlights, and rating

model:
  preferred: google:gemini-2.0-flash
  fallback:
    - openai:gpt-4o`;

const fullPlaceSoul = `# Soul

## Core Identity
I am responsible for making suggestions on vacation inspirations and recommendations based on the user's query. I limit the choices to 3 results.

## Purpose
Return vacation destination suggestions as a structured JSON object:

\`\`\`json
{
  "places": [
    {
      "name": "Destination Name",
      "country": "Country Name",
      "image": "verified URL to an image of the destination",
      "highlights": "Short description highlighting key features",
      "rating": "Numerical rating (e.g., 4.5)"
    }
  ]
}
\`\`\`

## Output Constraints
- Always return a JSON object with a \`places\` array
- Limit to 3 destination suggestions
- Must not transfer to parent or peer agents
- Output is stored in session state under the key \`place\``;

const fullBookingAgentYaml = `spec_version: "0.1.0"
name: booking-agent
version: 1.0.0
description: Given an itinerary, completes bookings of items requiring payment by handling reservation creation, payment method selection, and payment processing

model:
  preferred: google:gemini-2.0-flash
  fallback:
    - openai:gpt-4o
  constraints:
    temperature: 0.0

agents:
  create-reservation-agent:
    description: Creates a reservation for a selected item and generates a unique reservation_id
    delegation:
      mode: explicit
  payment-choice-agent:
    description: Shows users available payment choices (Apple Pay, Google Pay, Credit Card) and waits for selection
    delegation:
      mode: explicit
  process-payment-agent:
    description: Executes the payment for a booked item using the chosen payment method and returns a final order ID
    delegation:
      mode: explicit

delegation:
  mode: explicit`;

const fullSkill = `---
name: load-itinerary
description: "Load a pre-created itinerary and initialize session state at the start of a conversation. Triggers on: session start, before_agent_callback, initialize state, load scenario."
metadata:
  version: "1.0.0"
  category: session-management
---

# Load Itinerary

This skill initializes the session state at the start of each conversation by loading a pre-created itinerary from a scenario file.

## Step 1: Check Initialization
Check if the session state key \`_itin_initialized\` is already set. If it is, skip initialization.

## Step 2: Load Scenario File
Read the scenario JSON file specified by the \`TRAVEL_CONCIERGE_SCENARIO\` environment variable. If not set, default to \`travel_concierge/profiles/itinerary_empty_default.json\`.

## Step 3: Set Initial State
Populate the session state with all keys from the scenario's \`state\` object:
- Set \`_time\` to the current datetime (if not already set)
- Set \`_itin_initialized\` to \`true\`
- If the scenario contains a non-empty \`itinerary\`, also set \`itinerary_start_date\`, \`itinerary_end_date\`, \`itinerary_datetime\`

<!-- TRANSLATION NOTE: In the source Google ADK implementation, this was a before_agent_callback
(_load_precreated_itinerary) attached to root_agent. OpenGAP does not have a before_agent_callback
hook; this skill is invoked at session start instead. The behavior is equivalent. -->`;

const fullGoogleMapsYaml = `name: google-maps-places
description: Search for places using Google Maps Grounding Lite MCP server. Returns place details including name, address, latitude, longitude, place_id, photos URL, and map URL.
version: 1.0.0

input_schema:
  type: object
  properties:
    place_name:
      type: string
      description: Name or address of the place to search for
  required:
    - place_name

output_schema:
  type: object
  properties:
    id:
      type: string
      description: Google Maps place_id
    name:
      type: string
    address:
      type: string
    lat:
      type: number
    long:
      type: number
    photosUrl:
      type: string
    placeUrl:
      type: string

implementation:
  type: mcp_server
  url: https://mapstools.googleapis.com/mcp
  timeout: 30

annotations:
  read_only: true
  idempotent: true
  cost: low`;

const fullMemorizeYaml = `name: memorize
description: Memorize pieces of information into session state, one key-value pair at a time. Used by agents to persist user selections, trip metadata, and preferences across the conversation.
version: 1.0.0

input_schema:
  type: object
  properties:
    key:
      type: string
      description: The label indexing the memory to store (e.g. origin, destination, outbound_flight_selection)
    value:
      type: string
      description: The information to be stored
  required:
    - key
    - value

output_schema:
  type: object
  properties:
    status:
      type: string
      description: Confirmation message e.g. 'Stored "key": "value"'

implementation:
  type: script
  path: memorize.py
  runtime: python3
  timeout: 10

annotations:
  read_only: false
  idempotent: true
  cost: low`;

const validateCmd = `$ opengap validate
✓ agent.yaml              valid (spec 0.1.0)
✓ SOUL.md                 present
✓ RULES.md                present
✓ skills/load-itinerary/SKILL.md        valid frontmatter
✓ agents/inspiration-agent/agent.yaml   valid — 2 sub-agents
✓ agents/planning-agent/agent.yaml      valid — 5 sub-agents
✓ agents/booking-agent/agent.yaml       valid — 3 sub-agents
✓ agents/pre-trip-agent/agent.yaml      valid — 1 sub-agent
✓ agents/in-trip-agent/agent.yaml       valid — 2 sub-agents
✓ agents/post-trip-agent/agent.yaml     valid
✓ tools/google-maps-places.yaml         schema ok (mcp_server)
✓ tools/memorize.yaml                   schema ok → memorize.py
  travel-concierge-agent is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who each agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "Before-agent hooks" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model, agents & tools" },
];

const mapAtAGlance: [string, string][] = [
  ["Agent(instruction=...)", "SOUL.md"],
  ["Agent(sub_agents=[...])", "agent.yaml → agents:"],
  ["Control logic in Agent instruction", "RULES.md"],
  ["before_agent_callback", "skills/load-itinerary/SKILL.md"],
  ["AgentTool(agent=X)", "agents/<name>/ sub-directory"],
  ["get_places_toolset() / FunctionTool", "tools/<name>.yaml"],
  ["Agent(model=MODEL)", "agent.yaml → model.preferred"],
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

export function CookbookGoogleADK() {
  return (
    <section id="cookbook-google-adk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Google ADK → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a Google ADK multi-agent system into OpenGAP format by hand. We work through one
            real project end to end — every file, the exact mapping, and the finished result — so you can follow the same
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
              <code className="text-primary text-[10px]">google/adk-samples — travel-concierge</code> — the canonical Google ADK
              multi-agent starter. A root agent that orchestrates six specialized sub-agents, each with their own
              sub-agents, across the full trip lifecycle. Model:{" "}
              <code className="text-primary text-[10px]">gemini-2.0-flash</code>.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> end-to-end travel concierge — inspire a destination,
                plan flights and hotels, complete bookings with payment, prepare before departure, assist during the trip, and
                collect feedback afterward. Three levels of nesting: root → phase agents → specialist leaf agents.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The Google ADK project"
          subtitle="A multi-agent travel concierge: a root Agent that delegates to six sub-agents, each of which owns further nested agents. Here is the structure and the key source files."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2 mb-10">
          <CollapsibleCode filename="travel_concierge/agent.py" caption="root agent — 6 sub-agents + before_agent_callback" code={srcAgentPy} />
          <CollapsibleCode filename="sub_agents/inspiration/agent.py" caption="place_agent + poi_agent + inspiration_agent (AgentTool pattern)" code={srcInspirationPy} />
          <CollapsibleCode filename="sub_agents/inspiration/prompt.py" caption="instruction constants — become each agent's SOUL.md" code={srcPromptPy} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="Google ADK keeps everything in Python Agent() constructors. OpenGAP splits each agent into four declarative pieces — the same four buckets regardless of nesting depth."
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
              <span>Google ADK</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same five mappings, in detail — Google ADK source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — Agent(instruction=...) → SOUL.md"
          fromLabel="agent.py"
          fromCode={fromAgentInstruction}
          toLabel="SOUL.md"
          toCode={toRootSoul}
          why="The Agent instruction string and its described behavior become prose identity in SOUL.md — who the agent is, its purpose, routing logic, and communication style. This applies at every nesting level: each Agent() gets its own SOUL.md."
        />
        <ConversionStep
          index={2}
          title="Guardrails — control logic in instruction → RULES.md"
          fromLabel="agent.py + prompt.py"
          fromCode={fromAgentRules}
          toLabel="RULES.md"
          toCode={toRootRules}
          why="The routing rules and constraints baked into the instruction string — trip-phase logic, must-delegate rules, output format constraints — become explicit Must Always / Must Never rules in RULES.md."
        />
        <ConversionStep
          index={3}
          title="Orchestration — before_agent_callback → skills/load-itinerary/SKILL.md"
          fromLabel="agent.py"
          fromCode={fromBeforeCallback}
          toLabel="SKILL.md"
          toCode={toSkill}
          why="Google ADK's before_agent_callback — a Python function that fires before every agent turn — has no direct OpenGAP equivalent. It becomes a Skill that runs at session start, preserving identical behavior: load the scenario file, seed session state, and prevent re-initialization."
        />
        <ConversionStep
          index={4}
          title="Sub-agents — Agent(sub_agents=[...]) → agent.yaml agents:"
          fromLabel="agent.py"
          fromCode={fromSubAgents}
          toLabel="agent.yaml"
          toCode={toAgentsDir}
          why="Each Agent in sub_agents[] becomes an entry in the parent's agent.yaml agents: block, plus its own agents/<name>/ directory with agent.yaml and SOUL.md. The nesting is recursive — booking-agent's create-reservation-agent works the same way, three levels deep."
        />
        <ConversionStep
          index={5}
          title="Tools — AgentTool + get_places_toolset() → agents/ + tools/"
          fromLabel="inspiration/agent.py"
          fromCode={fromAgentTools}
          toLabel="inspiration-agent/agent.yaml · tools/"
          toCode={toToolsDir}
          why="AgentTool(agent=X) — sub-agents used as tools — map to a nested agents/<name>/ directory under the parent. FunctionTools and toolsets (like Google Maps MCP) map to tools/<name>.yaml with an mcp_server or script implementation type."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed mb-2">
              <code className="text-primary text-[11px]">shared_libraries/types.py</code> — the{" "}
              <code className="text-[11px]">DestinationIdeas</code> and{" "}
              <code className="text-[11px]">POISuggestions</code> Pydantic <code className="text-[11px]">BaseModel</code> output
              schemas — has no OpenGAP file. These structured output shapes are described in prose inside each agent's SOUL.md
              under an "Output Constraints" section rather than as typed Python classes.
            </p>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed mb-2">
              <code className="text-primary text-[11px]">SessionService</code> and{" "}
              <code className="text-[11px]">Runner</code> — the ADK session management and agent execution scaffolding — are
              entirely handled by the OpenGAP host runtime. You describe <em>what</em> each agent does; the runtime owns
              session lifecycle, turn execution, and context injection.
            </p>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">output_key="place"</code> /{" "}
              <code className="text-[11px]">output_key="poi"</code> on leaf agents — ADK's mechanism for auto-storing
              agent output into session state — is replaced by explicit{" "}
              <code className="text-[11px]">memorize</code> tool calls or noted in SOUL.md output constraints. The
              session state key names are preserved as documentation.
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
          <CollapsibleCode filename="agent.yaml" caption="root manifest — 6 sub-agents, load-itinerary skill" code={fullRootAgentYaml} reveal />
          <CollapsibleCode filename="SOUL.md" caption="root agent identity + routing logic" code={fullRootSoul} reveal />
          <CollapsibleCode filename="RULES.md" caption="trip-phase rules + hard delegation guardrails" code={fullRootRules} reveal />
          <CollapsibleCode filename="skills/load-itinerary/SKILL.md" caption="replaces before_agent_callback — session init" code={fullSkill} reveal />
          <CollapsibleCode filename="agents/inspiration-agent/agent.yaml" caption="place-agent + poi-agent + google-maps-places" code={fullInspirationAgentYaml} reveal />
          <CollapsibleCode filename="agents/inspiration-agent/SOUL.md" caption="from INSPIRATION_AGENT_INSTR" code={fullInspirationSoul} reveal />
          <CollapsibleCode filename="agents/inspiration-agent/agents/place-agent/agent.yaml" caption="leaf agent — no sub-agents, no tools" code={fullPlaceAgentYaml} reveal />
          <CollapsibleCode filename="agents/inspiration-agent/agents/place-agent/SOUL.md" caption="from PLACE_AGENT_INSTR — structured JSON output" code={fullPlaceSoul} reveal />
          <CollapsibleCode filename="agents/booking-agent/agent.yaml" caption="3 sub-agents, temperature: 0.0 for deterministic booking" code={fullBookingAgentYaml} reveal />
          <CollapsibleCode filename="tools/google-maps-places.yaml" caption="MCP server binding — replaces get_places_toolset()" code={fullGoogleMapsYaml} reveal />
          <CollapsibleCode filename="tools/memorize.yaml" caption="session state persistence — replaces ToolContext.state" code={fullMemorizeYaml} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm every
            manifest, skill frontmatter, nested agent, and tool schema resolves — including the three levels of nesting —
            before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
