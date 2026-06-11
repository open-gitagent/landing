import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `autogen-agentchat two-agent reflection pattern
├── primary_agent   ← AssistantAgent: drafts and refines responses
└── critic_agent    ← AssistantAgent: provides feedback until satisfied`;

const agentPy = `# Based on microsoft/autogen AgentChat teams tutorial
import asyncio
from autogen_agentchat.agents import AssistantAgent
from autogen_agentchat.conditions import TextMentionTermination
from autogen_agentchat.teams import RoundRobinGroupChat
from autogen_agentchat.ui import Console
from autogen_ext.models.openai import OpenAIChatCompletionClient

# Define a tool for the primary agent
async def web_search(query: str) -> str:
    """Find information on the web about a given topic."""
    # real impl calls a search API
    return f"Search results for: {query}"

model_client = OpenAIChatCompletionClient(
    model="gpt-4o-2024-08-06",
)

# Primary agent drafts responses using tools
primary_agent = AssistantAgent(
    name="primary",
    model_client=model_client,
    tools=[web_search],
    system_message="""You are a helpful research assistant.
Search the web to find accurate, up-to-date information before answering.
Cite your sources. Revise your response based on the critic's feedback.""",
)

# Critic agent reviews and provides feedback
critic_agent = AssistantAgent(
    name="critic",
    model_client=model_client,
    system_message="""You are a constructive critic. Review the primary agent's response for:
- Factual accuracy and source quality
- Completeness and clarity
- Any missing context or caveats

Respond with 'APPROVE' once the response meets the quality bar.""",
)

# Stop when critic approves
termination = TextMentionTermination("APPROVE")
team = RoundRobinGroupChat(
    [primary_agent, critic_agent],
    termination_condition=termination,
)

async def main():
    await Console(team.run_stream(
        task="What are the key differences between LangGraph and AutoGen?"
    ))

asyncio.run(main())`;

const agentYaml = `spec_version: 0.1.0
name: primary
version: 0.1.0
description: Research assistant that searches the web and refines responses based on feedback
model:
  preferred: gpt-4o-2024-08-06
tools:
  - web-search
agents:
  critic:
    description: Reviews research responses for accuracy, completeness, and clarity
    delegation:
      mode: auto`;

const soulMd = `# Soul

## Core Identity
You are a helpful research assistant.

## Purpose
Find accurate, up-to-date information by searching the web before answering.
Revise your response based on the critic's feedback.`;

const rulesMd = `# Rules

- Always search before answering factual questions
- Always cite sources
- Never fabricate URLs or citations`;

const subCriticYaml = `spec_version: 0.1.0
name: critic
version: 0.1.0
description: Reviews research responses for accuracy, completeness, and clarity
model:
  preferred: gpt-4o-2024-08-06`;

const subCriticSoul = `# Soul

## Core Identity
You are a constructive critic reviewing research responses.

## Review Criteria
- Factual accuracy and source quality
- Completeness and clarity
- Missing context or caveats

## Behavior
Respond with 'APPROVE' once the response meets the quality bar.`;

const toolWebSearch = `name: web-search
description: Find information on the web about a given topic.
input_schema:
  type: object
  properties:
    query:
      type: string
      description: The search topic or question
  required:
    - query
implementation:
  type: script
  path: tools/web_search.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./primary-agent-opengap
opengap info -d ./primary-agent-opengap`;

const mapping = [
  ["AssistantAgent.system_message", "SOUL.md (split into identity vs rules by content)"],
  ["AssistantAgent.name (kebab-case)", "agent.yaml → name"],
  ["model_client model string", "agent.yaml → model.preferred"],
  ["AssistantAgent.tools=[web_search] (function names)", "agent.yaml → tools[] + tools/<name>.yaml"],
  ["Each tool function docstring + typed args", "tools/<name>.yaml description + input_schema"],
  ["Second agent (critic_agent)", "agents/critic/agent.yaml + SOUL.md"],
  ["RoundRobinGroupChat / team setup", "stays in framework — runtime orchestration"],
  ["TextMentionTermination condition", "stays in framework — loop control"],
];

const steps = [
  { step: "1", desc: "Take system_message from the primary AssistantAgent → SOUL.md. Split behavioral rules (search before answering, cite sources) from hard constraints (never fabricate) into RULES.md." },
  { step: "2", desc: "Take the model string from OpenAIChatCompletionClient(model=...) → write to agent.yaml → model.preferred." },
  { step: "3", desc: "For each function in AssistantAgent.tools=[], add a kebab-case name to agent.yaml → tools (web_search → web-search)." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool — use the function docstring as description, typed parameters as input_schema." },
  { step: "5", desc: "For the critic agent, create agents/critic/agent.yaml and SOUL.md using the same mapping. No tools needed since critic has no tools." },
  { step: "6", desc: "RoundRobinGroupChat, TextMentionTermination, and team.run_stream() stay in the Python file — they are runtime orchestration with no OpenGAP equivalent." },
];

export function CookbookAutoGen() {
  return (
    <section id="cookbook-autogen" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">AutoGen → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">microsoft/autogen</code> AgentChat — a two-agent reflection pattern
            with a primary research agent and a critic agent in a <code className="text-primary text-xs">RoundRobinGroupChat</code>.
            Each <code className="text-primary text-xs">AssistantAgent</code> maps to its own OpenGAP directory;
            the team setup and termination condition stay in the framework.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The AutoGen project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Two-agent reflection: primary agent with web search + critic agent for quality control:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={agentPy} filename="main.py" />
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>AutoGen</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2">Primary agent: <code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Primary agent: <code className="text-primary text-xs">SOUL.md</code> — identity from system_message:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Primary agent: <code className="text-primary text-xs">RULES.md</code> — hard constraints from system_message:</p>
              <CodeBlock code={rulesMd} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/web-search.yaml</code>:</p>
              <CodeBlock code={toolWebSearch} filename="tools/web-search.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Critic: <code className="text-primary text-xs">agents/critic/agent.yaml</code>:</p>
              <CodeBlock code={subCriticYaml} filename="agents/critic/agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Critic: <code className="text-primary text-xs">agents/critic/SOUL.md</code>:</p>
              <CodeBlock code={subCriticSoul} filename="agents/critic/SOUL.md" />
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
