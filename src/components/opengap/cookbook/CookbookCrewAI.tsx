import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, FileText, Shield, Workflow, Settings, CheckCircle2, ChevronDown, BookOpen, Target, Package } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  PART 1 — full CrewAI source  ═══════════════════ */

const sourceTree = `example-crewai/              (CrewAI)
├── financial_analysis.py    ← Crew, Agents, Tasks for financial workflow
├── talent_search.py         ← Crew, Agents, Tasks for recruitment workflow
├── requirements.txt         ← crewai, langchain-community, python-dotenv
└── .env.example             ← OPENAI_API_KEY, SERPAPI_API_KEY`;

const srcFinancialPy = `# financial_analysis.py
from crewai import Agent, Task, Crew, Process
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
from dotenv import load_dotenv

load_dotenv()

yahoo_finance_news_tool = YahooFinanceNewsTool()

financial_analyst = Agent(
    role="Financial Analyst",
    goal="Analyze current financial news to identify market trends and investment opportunities",
    backstory="""You are an experienced financial analyst adept at interpreting
market data and news to forecast financial trends and advise on investment strategies.""",
    verbose=True,
    allow_delegation=False,
    tools=[yahoo_finance_news_tool],
)

communications_specialist = Agent(
    role="Corporate Communications Specialist",
    goal="Communicate financial insights and market trends to company stakeholders",
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
    process=Process.sequential,
    verbose=2,
)

result = crew.kickoff()`;

const srcTalentPy = `# talent_search.py
from crewai import Agent, Task, Crew, Process
from langchain_community.tools.google_jobs import GoogleJobsQueryRun
from langchain_community.utilities.google_jobs import GoogleJobsAPIWrapper
from dotenv import load_dotenv

load_dotenv()

google_jobs_tool = GoogleJobsQueryRun(api_wrapper=GoogleJobsAPIWrapper())

recruitment_specialist = Agent(
    role="Recruitment Specialist",
    goal="Find suitable job candidates for various positions within the company",
    backstory="""You are a skilled recruitment specialist with a deep understanding of
the technology job market. You excel at identifying suitable candidates for software
development roles using various job search platforms.""",
    verbose=True,
    allow_delegation=False,
    tools=[google_jobs_tool],
)

hr_communicator = Agent(
    role="HR Communicator",
    goal="Communicate job openings and company culture to potential applicants",
    backstory="""You are an experienced HR communicator who excels at creating compelling
job descriptions and recruitment content. You have a talent for showcasing the company's
culture and values to attract top talent.""",
    verbose=True,
    allow_delegation=True,
)

task1 = Task(
    description="""Identify current job openings in the field of software development.
Search for roles suitable for candidates with 1-3 years of experience.""",
    agent=recruitment_specialist,
)

task2 = Task(
    description="""Based on the job openings identified by the recruitment specialist,
create engaging job descriptions and a recruitment social media post.
Emphasize the company's commitment to innovation and a supportive work environment.""",
    agent=hr_communicator,
)

crew = Crew(
    agents=[recruitment_specialist, hr_communicator],
    tasks=[task1, task2],
    process=Process.sequential,
    verbose=2,
)

result = crew.kickoff()`;

/* ═══════════════════  PART 2 — paired mapping excerpts  ═══════════════════ */

const fromAgentDef = `# financial_analysis.py
financial_analyst = Agent(
    role="Financial Analyst",
    goal="Analyze current financial news to identify
  market trends and investment opportunities",
    backstory="""You are an experienced financial
  analyst adept at interpreting market data and
  news to forecast financial trends and advise
  on investment strategies.""",
    allow_delegation=False,
    tools=[yahoo_finance_news_tool],
)`;

const toSoul = `# agents/financial-analyst/SOUL.md

## Core Identity
You are an experienced financial analyst adept at
interpreting market data and news to forecast
financial trends and advise on investment strategies.

## Purpose
Analyze current financial news using the Yahoo Finance
News Tool. Identify key market trends and potential
investment opportunities relevant to the company's
portfolio. Produce a structured report for the
communications specialist.

## Collaboration Style
I do not delegate tasks. I produce a comprehensive
financial analysis report that the communications
specialist will use for stakeholder communications.`;

const fromCrewRules = `# financial_analysis.py  (control logic)
# allow_delegation=False  ← analyst never delegates
# allow_delegation=True   ← specialist may delegate

# Sequential process: task2 depends on task1's output
crew = Crew(
    agents=[financial_analyst, communications_specialist],
    tasks=[task1, task2],
    process=Process.sequential,
)`;

const toRules = `# RULES.md
## Must Always
- Route financial analysis requests through the
  financial-analyst sub-agent before the
  communications-specialist
- Ensure the communications-specialist uses the
  financial analyst's findings before drafting
  any press release
- Load environment variables (OPENAI_API_KEY,
  SERPAPI_API_KEY) before executing any task

## Must Never
- Allow the communications-specialist to produce
  a press release without first receiving the
  financial analyst's report
- Expose API keys in any output or log`;

const fromTask = `# financial_analysis.py  (task orchestration)
task1 = Task(
    description="""Review the latest financial news
  using the Yahoo Finance News Tool. Identify key
  market trends and potential investment
  opportunities.""",
    agent=financial_analyst,
)

task2 = Task(
    description="""Based on the financial analyst's
  report, prepare a press release for the company.
  Highlight the identified market trends and
  investment opportunities.""",
    agent=communications_specialist,
)`;

const toSkill = `# skills/analyze-financial-news/SKILL.md
---
name: analyze-financial-news
description: "Review the latest financial news and
  identify market trends and investment opportunities."
allowed-tools: yahoo-finance-news
---

## Step 1: Fetch Financial News
Use yahoo-finance-news to retrieve the latest articles.

## Step 2: Identify Market Trends
Analyze for macro trends, sector movements, risks.

## Step 3: Assess Investment Opportunities
Highlight portfolio-relevant opportunities and risks.

## Step 4: Produce Analysis Report
Compile into a structured report for the
communications specialist.`;

const fromAgentConfig = `# financial_analysis.py + talent_search.py
# Agents reference model via OPENAI_API_KEY env var
# (CrewAI defaults to gpt-4o when key is set)

financial_analyst = Agent(
    role="Financial Analyst",
    tools=[yahoo_finance_news_tool],
    allow_delegation=False,
)
recruitment_specialist = Agent(
    role="Recruitment Specialist",
    tools=[google_jobs_tool],
    allow_delegation=False,
)`;

const toAgentYaml = `# agent.yaml
spec_version: "0.1.0"
name: example-crewai
version: 1.0.0
model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini
skills:
  - analyze-financial-news
  - write-financial-press-release
  - search-job-openings
  - write-recruitment-content
tools:
  - yahoo-finance-news
  - google-jobs
agents:
  financial-analyst:
    description: Analyzes financial news for market
      trends and investment opportunities
    delegation:
      mode: auto
  communications-specialist:
    description: Communicates financial insights via
      press releases
    delegation:
      mode: auto`;

const fromTools = `# financial_analysis.py
from langchain_community.tools.yahoo_finance_news \\
    import YahooFinanceNewsTool

yahoo_finance_news_tool = YahooFinanceNewsTool()

# talent_search.py
from langchain_community.tools.google_jobs \\
    import GoogleJobsQueryRun
from langchain_community.utilities.google_jobs \\
    import GoogleJobsAPIWrapper

google_jobs_tool = GoogleJobsQueryRun(
    api_wrapper=GoogleJobsAPIWrapper()
)`;

const toToolFiles = `# tools/yahoo-finance-news.yaml
name: yahoo-finance-news
input_schema:
  type: object
  properties:
    query: { type: string }
  required: [query]
implementation:
  type: script
  path: yahoo-finance-news.py
  runtime: python3

# tools/google-jobs.yaml
name: google-jobs
input_schema:
  type: object
  properties:
    query: { type: string }
  required: [query]
implementation:
  type: script
  path: google-jobs.py
  runtime: python3`;

/* ═══════════════════  PART 3 — full OpenGAP output  ═══════════════════ */

const outputTree = `example-crewai/              (OpenGAP)
├── agent.yaml               ← manifest: model, skills, sub-agents, tools
├── SOUL.md                  ← orchestrator identity
├── RULES.md                 ← sequential workflow guardrails
├── skills/
│   ├── analyze-financial-news/SKILL.md
│   ├── write-financial-press-release/SKILL.md
│   ├── search-job-openings/SKILL.md
│   └── write-recruitment-content/SKILL.md
├── agents/
│   ├── financial-analyst/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── communications-specialist/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   ├── recruitment-specialist/
│   │   ├── agent.yaml
│   │   └── SOUL.md
│   └── hr-communicator/
│       ├── agent.yaml
│       └── SOUL.md
├── tools/
│   ├── yahoo-finance-news.yaml
│   ├── yahoo-finance-news.py
│   ├── google-jobs.yaml
│   └── google-jobs.py
└── workflows/
    ├── financial-analysis.yaml
    └── talent-search.yaml`;

const fullAgentYaml = `spec_version: "0.1.0"
name: example-crewai
version: 1.0.0
description: Multi-domain AI agent providing financial analysis and talent search capabilities via specialized sub-agents

model:
  preferred: openai:gpt-4o
  fallback:
    - openai:gpt-4o-mini

runtime:
  max_turns: 50
  timeout: 300

skills:
  - analyze-financial-news
  - write-financial-press-release
  - search-job-openings
  - write-recruitment-content

tools:
  - yahoo-finance-news
  - google-jobs

agents:
  financial-analyst:
    description: Analyzes current financial news to identify market trends and investment opportunities
    delegation:
      mode: auto
  communications-specialist:
    description: Communicates financial insights and market trends to company stakeholders via press releases
    delegation:
      mode: auto
  recruitment-specialist:
    description: Finds suitable job candidates for various positions within the company using Google Jobs
    delegation:
      mode: auto
  hr-communicator:
    description: Communicates job openings and company culture to potential applicants via compelling job descriptions
    delegation:
      mode: auto

delegation:
  mode: auto

tags:
  - finance
  - recruitment
  - multi-agent
  - crewai`;

const fullSoul = `# Soul

## Core Identity
I am an example CrewAI agent system demonstrating multi-agent collaboration across two distinct domains: financial analysis and talent search. I coordinate specialized sub-agents to accomplish complex, multi-step tasks in corporate and financial settings.

## Purpose
I provide two primary capabilities:
1. **Financial Analysis**: I gather and analyze financial news, identify market trends and investment opportunities, then produce clear stakeholder communications.
2. **Talent Search**: I identify job openings for software development roles and craft engaging job descriptions and recruitment content.

I delegate work to the appropriate specialized sub-agents based on the user's request.

## Communication Style
Professional and business-focused. I deliver structured reports, press releases, and recruitment content suitable for corporate stakeholders and the general public. Output is clear, concise, and actionable.

## Values & Principles
- **Specialization** — Each domain has dedicated agents with deep expertise in their role
- **Clarity** — Complex financial data and recruitment needs are translated into clear, stakeholder-ready communications
- **Sequential accuracy** — Analysis always precedes communication; findings inform the final deliverable
- **Relevance** — Outputs are tailored to the intended audience (stakeholders, applicants, or the public)

## Domain Expertise
- Financial news analysis and market trend identification
- Investment opportunity assessment
- Corporate press release writing
- Job market research (software development roles, 1-3 years experience)
- Recruitment social media content creation
- HR communications and employer branding

## Collaboration Style
I route requests to the most appropriate crew. For financial queries, I engage the financial analyst and communications specialist in sequence. For recruitment queries, I engage the recruitment specialist and HR communicator in sequence.`;

const fullRules = `# Rules

## Must Always
- Route financial analysis requests through the financial-analyst sub-agent before the communications-specialist
- Route talent search requests through the recruitment-specialist sub-agent before the hr-communicator
- Ensure the communications-specialist uses the financial analyst's findings before drafting any press release
- Ensure the hr-communicator uses the recruitment specialist's job findings before drafting job descriptions
- Load environment variables (OPENAI_API_KEY, SERPAPI_API_KEY) before executing any task

## Must Never
- Allow the communications-specialist to produce a press release without first receiving the financial analyst's report
- Allow the hr-communicator to draft job descriptions without first receiving the recruitment specialist's job findings
- Expose API keys (OPENAI_API_KEY, SERPAPI_API_KEY) in any output or log

## Output Constraints
- Financial analysis output: structured press release suitable for stakeholders and the general public
- Talent search output: engaging job descriptions and a recruitment social media post emphasizing innovation and a supportive work environment
- Both outputs should be polished, professional, and ready for immediate use

## Interaction Boundaries
- Financial analysis scope: current market news via Yahoo Finance; focus on company portfolio relevance
- Talent search scope: software development roles with 1-3 years of experience via Google Jobs
- Do not mix financial analysis outputs with recruitment outputs in a single response`;

const fullFinancialAnalystSoul = `# Soul

## Core Identity
You are an experienced financial analyst adept at interpreting market data and news to forecast financial trends and advise on investment strategies.

## Purpose
Analyze current financial news using the Yahoo Finance News Tool. Identify key market trends and potential investment opportunities relevant to the company's portfolio. Produce a structured report of findings for the communications specialist.

## Communication Style
Precise, data-driven, and analytical. Present findings as a structured report with clear identification of trends and investment opportunities backed by recent news.

## Values & Principles
- **Accuracy** — Base all analysis on current, verifiable financial news
- **Relevance** — Focus on trends and opportunities relevant to the company's portfolio
- **Clarity** — Present complex financial data in an organized, interpretable format

## Collaboration Style
I do not delegate tasks to other agents. I produce a comprehensive financial analysis report that the communications specialist will use to draft stakeholder communications.`;

const fullAnalyzeSkill = `---
name: analyze-financial-news
description: "Review the latest financial news and identify market trends and investment opportunities. Use when the user asks for financial analysis, market trend identification, investment opportunities, or wants to know what is happening in the financial markets. Triggers on: financial news, market trends, investment opportunities, financial analysis, portfolio analysis, market data."
allowed-tools: yahoo-finance-news
metadata:
  version: "1.0.0"
  category: financial-analysis
---

# Analyze Financial News

Review the latest financial news using the Yahoo Finance News Tool. Identify key market trends and potential investment opportunities relevant to the company's portfolio.

## Step 1: Fetch Financial News
Use the yahoo-finance-news tool to retrieve the latest financial news articles. Search for relevant market topics, major indices, and sectors of interest to the company's portfolio.

## Step 2: Identify Market Trends
Analyze the retrieved news to identify:
- Key macroeconomic trends (interest rates, inflation, GDP signals)
- Sector-specific movements (technology, energy, healthcare, etc.)
- Notable company or index performance
- Emerging risks or opportunities in the market

## Step 3: Assess Investment Opportunities
Based on the trends identified:
- Highlight potential investment opportunities relevant to the company's portfolio
- Note any risks or areas requiring caution
- Prioritize findings by potential impact and relevance

## Step 4: Produce Analysis Report
Compile findings into a structured report containing:
- Executive summary of current market conditions
- List of identified trends with supporting evidence from news
- Ranked list of investment opportunities with brief rationale
- Any notable risks to monitor

This report will be handed to the communications specialist for stakeholder messaging.`;

const fullYahooFinanceYaml = `name: yahoo-finance-news
description: Fetches the latest financial news from Yahoo Finance for a given stock ticker or topic
version: 1.0.0

input_schema:
  type: object
  properties:
    query:
      type: string
      description: Stock ticker symbol or financial topic to search for (e.g. AAPL, market trends, inflation)
  required:
    - query

output_schema:
  type: object
  properties:
    result:
      type: string
      description: Latest financial news articles and summaries relevant to the query

implementation:
  type: script
  path: yahoo-finance-news.py
  runtime: python3
  timeout: 30

annotations:
  read_only: true
  idempotent: false
  cost: low`;

const fullYahooFinancePy = `"""
Yahoo Finance News Tool
Wraps langchain_community.tools.yahoo_finance_news.YahooFinanceNewsTool
to fetch the latest financial news for a given query.

TRANSLATION NOTE: The original CrewAI source used LangChain's YahooFinanceNewsTool
directly as a crewai tool. This script wraps the same tool for OpenGAP script execution.
"""

import sys
import json

try:
    from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool
except ImportError:
    print(json.dumps({"error": "langchain_community is not installed. Run: pip install langchain_community"}))
    sys.exit(1)


def run(query: str) -> dict:
    """Fetch the latest Yahoo Finance news for the given query."""
    tool = YahooFinanceNewsTool()
    result = tool.run(query)
    return {"result": result}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        query = sys.argv[1]
    else:
        data = json.loads(sys.stdin.read())
        query = data.get("query", "")

    output = run(query)
    print(json.dumps(output))`;

const fullFinancialWorkflow = `name: financial-analysis
description: Sequential financial analysis workflow - analyst reviews news and identifies opportunities, then communications specialist produces a stakeholder press release
version: 1.0.0

inputs:
  - name: topic
    type: string
    required: false
    description: Optional topic or ticker to focus the financial analysis on (e.g. AAPL, AI sector, inflation)

outputs:
  - name: press_release
    type: string

steps:
  - id: analyze-news
    action: Review the latest financial news using Yahoo Finance. Identify key market trends and potential investment opportunities relevant to the company's portfolio.
    agent: financial-analyst
    inputs:
      topic: \${{ inputs.topic }}
    outputs:
      - analysis_report

  - id: write-press-release
    action: Based on the financial analyst's report, prepare a press release for the company. The release should highlight the identified market trends and investment opportunities, tailored for stakeholders and the general public.
    agent: communications-specialist
    inputs:
      analysis_report: \${{ steps.analyze-news.outputs.analysis_report }}
    outputs:
      - press_release
    depends_on:
      - analyze-news

error_handling:
  on_step_failure: abort`;

const validateCmd = `$ opengap validate
✓ agent.yaml                                          valid (spec 0.1.0)
✓ SOUL.md                                             present
✓ RULES.md                                            present
✓ skills/analyze-financial-news/SKILL.md              valid frontmatter
✓ skills/write-financial-press-release/SKILL.md       valid frontmatter
✓ skills/search-job-openings/SKILL.md                 valid frontmatter
✓ skills/write-recruitment-content/SKILL.md           valid frontmatter
✓ tools/yahoo-finance-news.yaml                       schema ok → yahoo-finance-news.py
✓ tools/google-jobs.yaml                              schema ok → google-jobs.py
✓ workflows/financial-analysis.yaml                   valid
✓ workflows/talent-search.yaml                        valid
  example-crewai is ready.`;

/* ─────────────────────────  Building blocks  ───────────────────────── */

const buckets = [
  { icon: FileText, title: "Identity", file: "SOUL.md", desc: "Who the agent is" },
  { icon: Shield, title: "Rules", file: "RULES.md", desc: "Hard guardrails" },
  { icon: Workflow, title: "Orchestration", file: "skills/", desc: "How it reasons" },
  { icon: Settings, title: "Config & Tools", file: "agent.yaml · tools/", desc: "Model & capabilities" },
];

const mapAtAGlance: [string, string][] = [
  ["Agent.role + Agent.backstory", "SOUL.md (identity + purpose)"],
  ["allow_delegation + Process.sequential", "RULES.md (workflow guardrails)"],
  ["Task.description per agent", "skills/<name>/SKILL.md"],
  ["Agent(tools=[...]) + Crew config", "agent.yaml (manifest)"],
  ["LangChain tool wrappers", "tools/<name>.yaml + <name>.py"],
  ["Crew(tasks=[t1, t2])", "workflows/<name>.yaml"],
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

export function CookbookCrewAI() {
  return (
    <section id="cookbook-crewai" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-md bg-primary/5 border border-primary/20">
            <BookOpen className="w-3 h-3 text-primary" />
            <span className="text-[10px] uppercase tracking-widest text-primary font-body font-semibold">Manual conversion guide</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">CrewAI → OpenGAP</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            A step-by-step guide to converting a CrewAI multi-agent crew into OpenGAP format by hand. We work through one
            real project end to end — every file, the exact mapping, and the finished result — so you can follow the same
            steps for your own crew.
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
              <code className="text-primary text-[10px]">example-crewai</code> — a multi-domain crew with four specialized
              agents across two workflows: a financial analysis crew (financial analyst + communications specialist) and a
              talent search crew (recruitment specialist + HR communicator). Tools:{" "}
              <code className="text-primary text-[10px]">yahoo-finance-news</code> and{" "}
              <code className="text-primary text-[10px]">google-jobs</code>.
            </p>
            <div className="flex items-start gap-2 pt-3 border-t border-border">
              <Target className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Use case:</span> CrewAI runs agents in sequence via{" "}
                <span className="text-foreground">Process.sequential</span> — analyst first, communicator second.
                OpenGAP replaces the Python orchestration with a declarative{" "}
                <span className="text-foreground">workflow yaml</span>, each agent's{" "}
                <code className="text-foreground text-[10px]">role/backstory/goal</code> with{" "}
                <span className="text-foreground">SOUL.md</span>, and the task descriptions with{" "}
                <span className="text-foreground">skill files</span>.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ PART 1 ══════════════ */}
        <PartHeader
          num="1"
          label="The source"
          title="The CrewAI project"
          subtitle="Two sequential crews: financial analysis (Yahoo Finance) and talent search (Google Jobs). Four agents total — each defined with role, goal, backstory, and an optional tool."
        />

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <CodeBlock code={sourceTree} filename="project structure" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <p className="text-[11px] text-muted-foreground/70 font-body">Expand any file to read it in full — reference only, the mapping in Part 2 is what matters.</p>
        </motion.div>

        <div className="space-y-2">
          <CollapsibleCode filename="financial_analysis.py" caption="financial analyst + communications specialist crew" code={srcFinancialPy} />
          <CollapsibleCode filename="talent_search.py" caption="recruitment specialist + HR communicator crew" code={srcTalentPy} />
        </div>

        {/* ══════════════ PART 2 ══════════════ */}
        <PartHeader
          num="2"
          label="The mapping"
          title="How it maps to OpenGAP"
          subtitle="CrewAI keeps agent identity, task logic, tools, and orchestration all in Python. OpenGAP splits that into four declarative pieces — then each CrewAI concept maps to one of them."
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
              <span>CrewAI</span>
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
          <p className="text-[11px] text-muted-foreground/70 font-body">Now the same six mappings, in detail — CrewAI source on the left, the OpenGAP file it becomes on the right.</p>
        </motion.div>

        <ConversionStep
          index={1}
          title="Identity — Agent(role, backstory, goal) → SOUL.md"
          fromLabel="financial_analysis.py"
          fromCode={fromAgentDef}
          toLabel="agents/financial-analyst/SOUL.md"
          toCode={toSoul}
          why="Each agent's role becomes the Core Identity, backstory becomes the character description, and goal becomes Purpose. CrewAI's three identity fields collapse into one readable prose file per agent."
        />
        <ConversionStep
          index={2}
          title="Guardrails — allow_delegation + Process → RULES.md"
          fromLabel="financial_analysis.py"
          fromCode={fromCrewRules}
          toLabel="RULES.md"
          toCode={toRules}
          why="The sequential process constraint and delegation flags are runtime control logic in CrewAI. In OpenGAP they become explicit Must Always / Must Never rules — the runtime enforces the ordering declared here, not code."
        />
        <ConversionStep
          index={3}
          title="Orchestration — Task.description → skills/<name>/SKILL.md"
          fromLabel="financial_analysis.py"
          fromCode={fromTask}
          toLabel="skills/analyze-financial-news/SKILL.md"
          toCode={toSkill}
          why="Each Task description is the agent's step-by-step procedure. OpenGAP lifts that into a named Skill file — reusable, triggerable, and decoupled from any particular crew wiring."
        />
        <ConversionStep
          index={4}
          title="Config — Agent + Crew → agent.yaml"
          fromLabel="financial_analysis.py · talent_search.py"
          fromCode={fromAgentConfig}
          toLabel="agent.yaml"
          toCode={toAgentYaml}
          why="The model (inferred from env var in CrewAI) becomes an explicit preferred/fallback pair. The agents list, their delegation modes, and the referenced skills and tools all live in one manifest."
        />
        <ConversionStep
          index={5}
          title="Tools — LangChain wrappers → tools/<name>.yaml + .py"
          fromLabel="financial_analysis.py · talent_search.py"
          fromCode={fromTools}
          toLabel="tools/yahoo-finance-news.yaml · google-jobs.yaml"
          toCode={toToolFiles}
          why="Each LangChain tool wrapper splits into a declarative schema (yaml) and a runnable script (py). The framework import is replaced by a thin stdin/stdout wrapper so the tool can be invoked by any OpenGAP runtime."
        />
        <ConversionStep
          index={6}
          title="Workflows — Crew(tasks) → workflows/<name>.yaml"
          fromLabel="financial_analysis.py"
          fromCode={`# financial_analysis.py
crew = Crew(
    agents=[financial_analyst, communications_specialist],
    tasks=[task1, task2],
    process=Process.sequential,
    verbose=2,
)
result = crew.kickoff()`}
          toLabel="workflows/financial-analysis.yaml"
          toCode={`# workflows/financial-analysis.yaml
name: financial-analysis
steps:
  - id: analyze-news
    agent: financial-analyst
    outputs: [analysis_report]

  - id: write-press-release
    agent: communications-specialist
    inputs:
      analysis_report: \${{ steps.analyze-news.outputs.analysis_report }}
    depends_on: [analyze-news]

error_handling:
  on_step_failure: abort`}
          why="The Crew kickoff and Process.sequential ordering become a declarative workflow with explicit step inputs/outputs and depends_on edges — no Python needed to describe the sequencing."
        />

        {/* What doesn't convert */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-2">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <h3 className="text-sm font-semibold text-foreground font-heading mb-2">What does <span className="text-primary">not</span> convert</h3>
            <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
              <code className="text-primary text-[11px]">crew.kickoff()</code>,{" "}
              <code className="text-[11px]">Process.sequential</code>, and <code className="text-[11px]">verbose=2</code> have no
              OpenGAP file equivalents. The execution trigger, process type, and logging level are runtime concerns owned by the
              host runtime — not by the agent. You describe <em>what</em> each agent does (soul, rules, skill, tools); the
              runtime and workflow yaml own <em>when</em> and <em>how</em> the crew runs.
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
          <CollapsibleCode filename="agents/financial-analyst/SOUL.md" code={fullFinancialAnalystSoul} reveal />
          <CollapsibleCode filename="skills/analyze-financial-news/SKILL.md" code={fullAnalyzeSkill} reveal />
          <CollapsibleCode filename="tools/yahoo-finance-news.yaml" code={fullYahooFinanceYaml} reveal />
          <CollapsibleCode filename="tools/yahoo-finance-news.py" code={fullYahooFinancePy} reveal />
          <CollapsibleCode filename="workflows/financial-analysis.yaml" code={fullFinancialWorkflow} reveal />
        </div>

        {/* Validate */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground font-heading">Validate</h3>
          </div>
          <p className="text-[12px] text-muted-foreground font-body mb-4 max-w-2xl">
            From the agent directory, run <code className="text-primary text-[11px]">opengap validate</code> to confirm the
            manifest, skill frontmatter, tool schemas, and workflow steps all resolve before you run the agent.
          </p>
          <CodeBlock code={validateCmd} filename="terminal" />
        </motion.div>

      </div>
    </section>
  );
}
