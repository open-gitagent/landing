import { motion } from "framer-motion";
import {
  GitBranch,
  Boxes,
  Search,
  Languages,
  CheckCircle2,
  Terminal,
  ArrowRight,
  Github,
  Rocket,
  KeyRound,
  Sparkles,
  Bot,
  Wrench,
  Database,
  Network,
  Brain,
} from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

/* ═══════════════════  data  ═══════════════════ */

const primitives: { icon: typeof Bot; title: string; desc: string }[] = [
  { icon: Bot, title: "Agents & prompts", desc: "The personas and system prompts that define each agent — carried over verbatim." },
  { icon: Wrench, title: "Tools", desc: "Function tools and their schemas, rewired to the target's tool-calling convention." },
  { icon: Database, title: "State", desc: "Shared state and message history, remapped to how the target framework tracks it." },
  { icon: Network, title: "Orchestration", desc: "Graphs, handoffs, crews, group chats — re-expressed in the target's control flow." },
  { icon: Brain, title: "Memory", desc: "Persistence and context windows, mapped to the target's memory primitives." },
];

const frameworks: { name: string; style: string }[] = [
  { name: "LangGraph", style: "graph-based" },
  { name: "CrewAI", style: "role-based" },
  { name: "OpenAI Agents SDK", style: "function-based" },
  { name: "AutoGen", style: "conversation-based" },
  { name: "Semantic Kernel", style: "plugin-based" },
  { name: "Haystack", style: "pipeline-based" },
  { name: "Agno / Phidata", style: "declarative" },
  { name: "Google ADK", style: "agent-based" },
  { name: "Lyzr ADK", style: "declarative" },
];

const skills: { icon: typeof Search; n: string; title: string; body: React.ReactNode }[] = [
  {
    icon: Search,
    n: "1",
    title: "Analyze",
    body: (
      <>
        Auto-detects the source framework and extracts agents, tools, state, orchestration, and memory into a single
        canonical representation — with an ASCII architecture diagram so you can see the shape of the agent.
      </>
    ),
  },
  {
    icon: Languages,
    n: "2",
    title: "Translate",
    body: (
      <>
        Generates idiomatic code in the target framework, preserving prompts verbatim, emitting complete imports, and
        wiring up entry points. Where a concept has no clean 1:1 equivalent, it leaves a{" "}
        <code className="text-primary text-[11px]"># TRANSLATION NOTE:</code> comment explaining the trade-off. When an
        API is uncertain, it looks it up on the web rather than guessing.
      </>
    ),
  },
  {
    icon: CheckCircle2,
    n: "3",
    title: "Validate",
    body: (
      <>
        Statically checks the output for import correctness, API accuracy, completeness, and idiomatic patterns —
        without executing your code.
      </>
    ),
  },
];

const exportKey = `export ANTHROPIC_API_KEY="sk-ant-..."   # or OPENAI_API_KEY="sk-..."`;

const launchCmd = `npx @open-gitagent/gitagent run -r https://github.com/shreyas-lyzr/framework-translator-agent`;

const analyzePrompt = `Analyze the LangGraph agent in ./my-react-agent and translate it to CrewAI.`;

const validatePrompt = `Validate the translated CrewAI code.`;

const oneShot = `npx @open-gitagent/gitagent run \\
  -r https://github.com/shreyas-lyzr/framework-translator-agent \\
  -p "Translate the OpenAI Agents SDK code in ./agent to LangGraph, then validate it."`;

const steps: { n: string; title: string; body: React.ReactNode; code?: string; codeFile?: string }[] = [
  {
    n: "1",
    title: "Launch the translator agent",
    body: <>Run the agent straight from GitHub — no clone, no install. Gitagent fetches the agent repo, loads its skills and knowledge, and drops you into an interactive session.</>,
    code: launchCmd,
    codeFile: "terminal",
  },
  {
    n: "2",
    title: "Point it at your source code",
    body: (
      <>
        Tell the agent where your agent lives and what it should become — paste the code, reference local files, or give
        it a repo URL. The translator first runs <span className="text-foreground font-medium">Analyze</span>: it detects
        the source, extracts the agents, tools, state, and orchestration, and shows you a canonical representation plus an
        ASCII diagram. Review this before continuing — it's your chance to confirm it understood the source correctly.
      </>
    ),
    code: analyzePrompt,
    codeFile: "prompt",
  },
  {
    n: "3",
    title: "Translate to the target framework",
    body: (
      <>
        Once the analysis looks right, it runs <span className="text-foreground font-medium">Translate</span> and emits
        the target framework's files — idiomatic code, full imports, preserved prompts, and a runnable entry point. Watch
        for <code className="text-primary text-[11px]"># TRANSLATION NOTE:</code> comments: each one flags a place where
        the two frameworks don't map 1:1 and tells you what changed.
      </>
    ),
  },
  {
    n: "4",
    title: "Validate the output",
    body: (
      <>
        Ask the agent to validate, or let it run <span className="text-foreground font-medium">Validate</span>{" "}
        automatically. It checks imports, API usage, completeness, and idiomatic patterns statically — catching the common
        breakages (wrong import paths, renamed APIs, missing entry points) before you ever run the code.
      </>
    ),
    code: validatePrompt,
    codeFile: "prompt",
  },
  {
    n: "5",
    title: "Run and review",
    body: (
      <>
        Drop the generated files into a project, install the target framework's dependencies, and run it. Treat the{" "}
        <code className="text-primary text-[11px]"># TRANSLATION NOTE:</code> comments as your review checklist — they
        mark exactly where a human decision may be needed.
      </>
    ),
  },
];

const REPO = "https://github.com/shreyas-lyzr/framework-translator-agent";

/* ─────────────────────────  building blocks  ───────────────────────── */

function SectionHeader({ icon: Icon, label, title }: { icon: typeof Search; label: string; title: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5 pt-8 border-t border-border">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3.5 h-3.5 text-primary" />
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-body">{label}</span>
      </div>
      <h2 className="text-xl font-bold text-foreground font-heading">{title}</h2>
    </motion.div>
  );
}

/* ─────────────────────────────  Page  ───────────────────────────── */

export function CookbookFrameworkTranslator() {
  return (
    <section id="cookbook-framework-translator" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6">
          <p className="text-xs text-muted-foreground/50 font-body mb-2">OpenGAP / Cookbook /</p>
          <h2 className="text-2xl font-bold text-foreground mb-3 font-heading">Convert Between Agent Frameworks</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">
            With <span className="text-foreground font-medium">Gitagent</span> you can convert an agent from any
            code-based framework to any other — no rewriting state, tools, orchestration, and memory by hand. The{" "}
            <a href={REPO} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Framework Translator
            </a>{" "}
            is a ready-made Gitagent that does this for nine frameworks; fork it or build your own to cover the rest.
          </p>
        </motion.div>

        {/* What gets converted */}
        <SectionHeader icon={Sparkles} label="The concept" title="What gets converted" />
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            Every framework expresses the same primitives differently. Conversion maps each one across — preserving
            behavior 1:1 and flagging anything that has no clean equivalent.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {primitives.map((p) => (
              <div key={p.title} className="paper-card p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <p.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs font-semibold text-foreground font-heading">{p.title}</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Frameworks covered */}
        <SectionHeader icon={Boxes} label="Coverage" title="Frameworks covered" />
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-4">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            The Framework Translator handles every framework below as both a{" "}
            <span className="text-foreground font-medium">source</span> and a{" "}
            <span className="text-foreground font-medium">target</span> — any-to-any.
          </p>
          <div className="rounded-md border border-border overflow-hidden text-[11px] font-body">
            <div className="grid grid-cols-12 bg-muted/40 border-b border-border px-3 py-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/50">
              <span className="col-span-7">Framework</span>
              <span className="col-span-5">Style</span>
            </div>
            {frameworks.map((f, i) => (
              <div key={f.name} className={`grid grid-cols-12 px-3 py-2 gap-3 border-b border-border last:border-0 items-center ${i % 2 ? "bg-muted/20" : ""}`}>
                <span className="col-span-7 text-foreground">{f.name}</span>
                <span className="col-span-5 text-muted-foreground">{f.style}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Extensibility callout */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <div className="paper-card p-4 border-l-2 border-l-primary/40">
            <div className="flex items-start gap-2">
              <GitBranch className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed">
                <span className="text-foreground font-medium">Need a framework that isn't listed?</span> Fork the
                Framework Translator or build your own Gitagent — it's just skills and knowledge in a repo, so adding a
                source or target framework is a matter of teaching it one more set of idioms.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ══════════════ Demoted: the concrete tool ══════════════ */}
        <SectionHeader icon={Rocket} label="Automate it" title="Do it with the Framework Translator agent" />
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            The translator runs in three skills, in order:
          </p>
          <div className="space-y-3">
            {skills.map((s) => (
              <div key={s.title} className="paper-card p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <s.icon className="w-3.5 h-3.5 text-primary" />
                  <span className="text-xs text-primary font-body font-semibold">{s.n}</span>
                  <span className="text-sm font-semibold text-foreground font-heading">{s.title}</span>
                </div>
                <p className="text-[12px] text-muted-foreground font-body leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Prerequisites */}
        <SectionHeader icon={KeyRound} label="Before you start" title="Prerequisites" />
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5">
          <ul className="space-y-1.5 mb-4 max-w-2xl">
            {[
              <><span className="text-foreground font-medium">Node.js 18+</span> and <span className="text-foreground font-medium">npm</span> (for <code className="text-primary text-[11px]">npx</code>)</>,
              <>An LLM API key exported in your shell — e.g. <code className="text-primary text-[11px]">OPENAI_API_KEY</code> or <code className="text-primary text-[11px]">ANTHROPIC_API_KEY</code></>,
              <>The source agent code you want to convert, available locally or in a Git repo</>,
            ].map((t, i) => (
              <li key={i} className="text-[12px] text-muted-foreground font-body leading-relaxed flex items-start gap-2">
                <span className="text-primary/40 shrink-0 mt-0.5">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <CodeBlock code={exportKey} filename="terminal" />
        </motion.div>

        {/* Step-by-step */}
        <SectionHeader icon={Rocket} label="Walkthrough" title="Step-by-step" />
        <div className="space-y-6 mb-10">
          {steps.map((s) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="flex items-baseline gap-2 mb-2">
                <code className="text-xs text-primary font-body font-semibold shrink-0">{s.n}</code>
                <h3 className="text-base font-semibold text-foreground font-heading">{s.title}</h3>
              </div>
              <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-3">{s.body}</p>
              {s.code && <CodeBlock code={s.code} filename={s.codeFile} />}
            </motion.div>
          ))}
        </div>

        {/* One-shot */}
        <SectionHeader icon={Terminal} label="Non-interactive" title="One-shot" />
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <p className="text-[12px] text-muted-foreground font-body leading-relaxed max-w-2xl mb-4">
            To skip the REPL and run a single translation, pass your instruction with{" "}
            <code className="text-primary text-[11px]">-p</code>:
          </p>
          <CodeBlock code={oneShot} filename="terminal" />
        </motion.div>

        {/* Source */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <a
            href={REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 paper-card px-4 py-3 hover:bg-accent/20 transition-colors group"
          >
            <Github className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-body">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 block mb-0.5">Source agent</span>
              <span className="text-foreground">shreyas-lyzr/framework-translator-agent</span>
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:translate-x-0.5 transition-transform ml-1" />
          </a>
          <p className="text-[11px] text-muted-foreground/70 font-body mt-2">
            Fork it to add a framework, or build your own Gitagent to extend conversion beyond the nine above.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
