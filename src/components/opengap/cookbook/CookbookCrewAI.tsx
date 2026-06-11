import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const projectStructure = `stephenc222/example-crewai/
├── financial_analysis.py  ← Crew, Agent, Task definitions
├── requirements.txt
└── .env.example`;

const financialPy = `# financial_analysis.py
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
from crewai import Agent, Task, Crew
from dotenv import load_dotenv

load_dotenv()

yahoo_finance_news_tool = YahooFinanceNewsTool()

financial_analyst = Agent(
    role='Financial Analyst',
    goal='Analyze current financial news to identify market trends and investment opportunities',
    backstory="""You are an experienced financial analyst adept at interpreting
market data and news to forecast financial trends and advise on investment strategies.""",
    verbose=True,
    allow_delegation=False,
    tools=[yahoo_finance_news_tool],
)

communications_specialist = Agent(
    role='Corporate Communications Specialist',
    goal='Communicate financial insights and market trends to company stakeholders',
    backstory="""As a communications specialist in a corporate setting, your expertise lies in
crafting clear and concise messages from complex financial data for stakeholders and the public.""",
    verbose=True,
    allow_delegation=True,
)

task1 = Task(
    description="""Review the latest financial news using the Yahoo Finance News Tool.
Identify key market trends and potential investment opportunities.""",
    agent=financial_analyst,
)

task2 = Task(
    description="""Based on the financial analyst's report, prepare a press release for the company.
Highlight the identified market trends and investment opportunities.""",
    agent=communications_specialist,
)

crew = Crew(
    agents=[financial_analyst, communications_specialist],
    tasks=[task1, task2],
    verbose=2,
)

result = crew.kickoff()`;

const agentYaml = `spec_version: 0.1.0
name: financial-analyst
version: 0.1.0
description: Analyze financial news to identify market trends and investment opportunities
model:
  preferred: gpt-4o
tools:
  - yahoo-finance-news
agents:
  communications-specialist:
    description: Communicate financial insights and market trends to company stakeholders
    delegation:
      mode: auto`;

const soulMd = `# Soul

## Core Identity
Financial Analyst

## Background
You are an experienced financial analyst adept at interpreting market data
and news to forecast financial trends and advise on investment strategies.

## Purpose
Analyze current financial news to identify market trends and investment opportunities.`;

const subAgentYaml = `spec_version: 0.1.0
name: communications-specialist
version: 0.1.0
description: Communicate financial insights and market trends to company stakeholders
model:
  preferred: gpt-4o`;

const subSoulMd = `# Soul

## Core Identity
Corporate Communications Specialist

## Background
As a communications specialist in a corporate setting, your expertise lies in
crafting clear and concise messages from complex financial data for stakeholders and the public.

## Purpose
Transform financial analysis into clear, stakeholder-ready communications.`;

const toolYaml = `name: yahoo-finance-news
description: Fetch the latest financial news from Yahoo Finance for a given ticker or topic.
input_schema:
  type: object
  properties:
    query:
      type: string
      description: Stock ticker or financial topic to search for
  required:
    - query
implementation:
  type: script
  path: tools/yahoo_finance_news.py
  runtime: python3
  timeout: 30`;

const validateCmd = `opengap validate -d ./financial-analyst-opengap
opengap info -d ./financial-analyst-opengap`;

const mapping = [
  ["Agent.role", "SOUL.md → ## Core Identity"],
  ["Agent.backstory", "SOUL.md → ## Background"],
  ["Agent.goal", "SOUL.md → ## Purpose + agent.yaml → description"],
  ["Agent.tools (tool names, kebab-case)", "agent.yaml → tools[]"],
  ["Each tool → name + description + schema", "tools/<name>.yaml"],
  ["First/primary agent", "root agent.yaml + SOUL.md"],
  ["Additional agents", "agents/<name>/agent.yaml + SOUL.md"],
  ["Task definitions", "stays in framework — no OpenGAP equivalent"],
  ["Crew / Process type", "stays in framework — runtime orchestration"],
];

const steps = [
  { step: "1", desc: "Take the primary agent (financial_analyst) — its role, backstory, and goal map to SOUL.md ## Core Identity, ## Background, ## Purpose." },
  { step: "2", desc: "Write agent.yaml: use role as name (kebab-case), goal as description, and llm as model.preferred (defaults to gpt-4o if not set)." },
  { step: "3", desc: "For each tool in Agent.tools, add a kebab-case name to agent.yaml → tools. YahooFinanceNewsTool becomes yahoo-finance-news." },
  { step: "4", desc: "Create tools/<name>.yaml for each tool with name, description, and input_schema." },
  { step: "5", desc: "For the second agent (communications_specialist), create agents/communications-specialist/agent.yaml and SOUL.md using the same mapping." },
  { step: "6", desc: "Task descriptions and Crew stay in financial_analysis.py — they are runtime coordination with no OpenGAP equivalent." },
];

export function CookbookCrewAI() {
  return (
    <section id="cookbook-crewai" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">CrewAI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Based on <code className="text-primary text-xs">stephenc222/example-crewai</code> — a financial analysis crew with
            a Financial Analyst agent and a Communications Specialist agent working in sequence.
            CrewAI's <code className="text-primary text-xs">Agent(role, goal, backstory)</code> maps cleanly to OpenGAP's
            SOUL.md sections; each agent becomes its own OpenGAP directory.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — The CrewAI project</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Financial analysis crew with Yahoo Finance news tool:</p>
          <div className="space-y-5">
            <CodeBlock code={projectStructure} filename="file structure" />
            <CodeBlock code={financialPy} filename="financial_analysis.py" />
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — What maps to OpenGAP</h3>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-mono mt-4">
            <div className="grid grid-cols-2 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span>CrewAI</span><span>OpenGAP</span>
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
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root agent: <code className="text-primary text-xs">agent.yaml</code> (from financial_analyst):</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Root agent: <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2"><code className="text-primary text-xs">tools/yahoo-finance-news.yaml</code> — one file per tool:</p>
              <CodeBlock code={toolYaml} filename="tools/yahoo-finance-news.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/communications-specialist/agent.yaml</code>:</p>
              <CodeBlock code={subAgentYaml} filename="agents/communications-specialist/agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Sub-agent: <code className="text-primary text-xs">agents/communications-specialist/SOUL.md</code>:</p>
              <CodeBlock code={subSoulMd} filename="agents/communications-specialist/SOUL.md" />
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
