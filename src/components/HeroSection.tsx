import { motion } from "framer-motion";
import { useState } from "react";
import { Settings, FileText, BookOpen, Zap, Wrench, Database, Brain, GitFork, ShieldCheck, Folder, Cat, Sparkles, Copy, Check, Users } from "lucide-react";
import openclawLogo from "@/assets/openclaw-logo.png";
import claudeCodeLogo from "@/assets/claude-code-logo.png";
import lyzrLogo from "@/assets/lyzr-logo.png";
import gitagentLogo from "@/assets/gitagent-logo.png";


type TreeNode = {
  name: string;
  icon: React.ReactNode;
  color: string;
  tag?: string;
  children?: TreeNode[];
};

const tree: TreeNode[] = [
  {
    name: "agent.yaml",
    icon: <Settings className="w-3 h-3" />,
    color: "text-primary",
    tag: "config",
  },
  {
    name: "SOUL.md",
    icon: <Brain className="w-3 h-3" />,
    color: "text-primary",
    tag: "core",
  },
  {
    name: "RULES.md",
    icon: <FileText className="w-3 h-3" />,
    color: "text-muted-foreground",
  },
  {
    name: "AGENTS.md",
    icon: <Users className="w-3 h-3" />,
    color: "text-muted-foreground",
  },
  {
    name: "INSTRUCTIONS.md",
    icon: <FileText className="w-3 h-3" />,
    color: "text-muted-foreground",
  },
  {
    name: "scheduler.yml",
    icon: <FileText className="w-3 h-3" />,
    color: "text-muted-foreground",
  },
  {
    name: "skills/",
    icon: <Zap className="w-3 h-3" />,
    color: "text-foreground",
    tag: "capability",
    children: [
      {
        name: "code-review/",
        icon: <Folder className="w-3 h-3" />,
        color: "text-foreground/70",
        children: [
          { name: "SKILL.md", icon: <BookOpen className="w-3 h-3" />, color: "text-foreground" },
        ],
      },
    ],
  },
  {
    name: "tools/",
    icon: <Wrench className="w-3 h-3" />,
    color: "text-primary",
    tag: "capability",
    children: [
      { name: "search.yaml", icon: <Settings className="w-3 h-3" />, color: "text-primary/70" },
    ],
  },
  {
    name: "knowledge/",
    icon: <Database className="w-3 h-3" />,
    color: "text-foreground",
    children: [
      { name: "index.yaml", icon: <Settings className="w-3 h-3" />, color: "text-foreground/70" },
    ],
  },
  {
    name: "memory/",
    icon: <Brain className="w-3 h-3" />,
    color: "text-primary",
    children: [
      { name: "MEMORY.md", icon: <FileText className="w-3 h-3" />, color: "text-primary/70" },
      {
        name: "runtime/",
        icon: <Folder className="w-3 h-3" />,
        color: "text-primary/70",
        tag: "live",
        children: [
          { name: "dailylog.md", icon: <FileText className="w-3 h-3" />, color: "text-muted-foreground" },
          { name: "key-decisions.md", icon: <FileText className="w-3 h-3" />, color: "text-muted-foreground" },
          { name: "context.md", icon: <FileText className="w-3 h-3" />, color: "text-muted-foreground" },
        ],
      },
    ],
  },
  {
    name: "hooks/",
    icon: <GitFork className="w-3 h-3" />,
    color: "text-foreground",
    children: [
      { name: "hooks.yaml", icon: <Settings className="w-3 h-3" />, color: "text-foreground/70" },
      { name: "bootstrap.md", icon: <FileText className="w-3 h-3" />, color: "text-foreground/70" },
      { name: "teardown.md", icon: <FileText className="w-3 h-3" />, color: "text-foreground/70" },
    ],
  },
  {
    name: "compliance/",
    icon: <ShieldCheck className="w-3 h-3" />,
    color: "text-primary",
    tag: "governance",
    children: [
      { name: "regulatory-map.yaml", icon: <Settings className="w-3 h-3" />, color: "text-primary/70" },
    ],
  },
];

function flattenTree(nodes: TreeNode[], depth = 0, parentIsLast: boolean[] = []): { node: TreeNode; depth: number; isLast: boolean; guides: boolean[] }[] {
  const result: { node: TreeNode; depth: number; isLast: boolean; guides: boolean[] }[] = [];
  nodes.forEach((node, i) => {
    const isLast = i === nodes.length - 1;
    result.push({ node, depth, isLast, guides: parentIsLast });
    if (node.children) {
      result.push(...flattenTree(node.children, depth + 1, [...parentIsLast, isLast]));
    }
  });
  return result;
}

const flatTree = flattenTree(tree);

const adapters = [
  { label: "Claude Code", flag: "claude" },
  { label: "Lyzr", flag: "lyzr" },
  { label: "Nanobot", flag: "nanobot" },
  { label: "OpenClaw", flag: "openclaw" },
];

const buildCmd = (flag: string) =>
  `npx @open-gitagent/gitagent@0.1.7 run -r https://github.com/shreyas-lyzr/architect -a ${flag}${flag !== "claude" ? ' -p "hello"' : ''}`;

export function HeroSection() {
  const [copied, setCopied] = useState(false);
  const [selectedAdapter, setSelectedAdapter] = useState(adapters[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const currentCmd = buildCmd(selectedAdapter.flag);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCmd);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-20 pb-20 px-6">
      <div className="flame-bg" />

      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div className="inline-flex items-center gap-2 sketch-border rounded-full px-2 sm:px-3 py-1 text-xs text-muted-foreground mb-3 flex-wrap">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-primary font-medium">Open Standard</span> v0.1.0
              <span className="text-muted-foreground/40 hidden sm:inline">·</span>
              <span className="tracking-widest uppercase text-[10px] hidden sm:inline">Clone a repo. Get an agent.</span>
            </div>

            <div className="flex items-center gap-1 mb-4">
              <img src={gitagentLogo} alt="GitAgent" className="h-16 w-16 sm:h-20 sm:w-20 object-contain rounded-lg" />
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-heading font-bold leading-none tracking-tight text-foreground">
                <span className="text-foreground">Git</span><span className="text-primary">Agent</span>
              </h1>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-1 font-body">
              A git-native, framework-agnostic, <span className="text-foreground/80">open standard for defining AI agents.</span> <span className="text-foreground font-medium">Your repository becomes your agent.</span>
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-2 font-body">
              Version-controlled config that exports to Claude Code, OpenClaw, Lyzr Agent, Chimera, NanoBot, CrewAgent, and Agents SDK.
            </p>
            <p className="text-[11px] text-muted-foreground/60 mb-8 font-body">
              Maintained by team <a href="https://lyzr.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Lyzr</a>
            </p>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <a
                href="#quickstart"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-3 sm:px-4 py-2 rounded-md transition-opacity hover:opacity-90 font-body sketch-border border-primary"
              >
                Get Started
              </a>
              <a
                href="https://github.com/open-gitagent/gitagent"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border text-xs font-medium text-foreground px-3 sm:px-4 py-2 rounded-md transition-colors hover:bg-accent font-body"
              >
                View on GitHub
              </a>
            </div>

            {/* Copyable command with adapter dropdown */}
            <div className="mt-6 relative">
              <div className="code-block sketch-border border-primary/30 flex items-center gap-2 !py-2 sm:!py-2.5 !px-3 sm:!px-4 !overflow-visible">
                <span className="text-xs text-muted-foreground font-body truncate flex-1 cursor-pointer" onClick={handleCopy}>
                  <span className="text-primary">$ </span>
                  <span className="text-foreground/90">{currentCmd}</span>
                </span>

                {/* Adapter dropdown */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="inline-flex items-center gap-1.5 text-[10px] font-medium text-primary sketch-border rounded px-2 py-1 hover:bg-accent transition-colors font-body"
                  >
                    {selectedAdapter.label}
                    <svg className="w-2.5 h-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 bottom-full mb-1 z-50 bg-background border border-border rounded-md shadow-lg w-32">
                      {adapters.map((a) => (
                        <button
                          key={a.flag}
                          onClick={() => { setSelectedAdapter(a); setDropdownOpen(false); }}
                          className={`block w-full text-left px-3 py-1.5 text-xs font-body hover:bg-accent transition-colors ${a.flag === selectedAdapter.flag ? 'text-primary font-medium' : 'text-foreground'}`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  className="text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
                  aria-label="Copy command"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-primary" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 font-body leading-relaxed">
              Runs the GitAgent CLI, pulls the <a href="https://github.com/shreyas-lyzr/architect" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors font-medium">Architect</a> agent from GitHub, and launches it as a Claude Code agent.
            </p>

            <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-5 mb-2 font-body">Supports</p>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <a
                href="https://github.com/HKUDS/nanobot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors font-body"
              >
                <Cat className="w-4 h-4 text-primary" />
                <span>Nanobot</span>
              </a>
              <a
                href="https://github.com/openclaw/openclaw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors font-body"
              >
                <img src={openclawLogo} alt="OpenClaw" className="w-4 h-4 rounded-sm" />
                <span>OpenClaw</span>
              </a>
              <a
                href="https://github.com/anthropics/claude-code"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors font-body"
              >
                <img src={claudeCodeLogo} alt="Claude Code" className="w-4 h-4" />
                <span>Claude Code</span>
              </a>
              <a
                href="https://www.lyzr.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 sketch-border rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent transition-colors font-body"
              >
                <img src={lyzrLogo} alt="Lyzr" className="w-4 h-4 invert" />
                <span>Lyzr</span>
              </a>
            </div>
          </motion.div>

          {/* Right — Terminal */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <div className="code-block sketch-border">
              <div className="terminal-header">
                <span className="terminal-dot bg-primary/30" />
                <span className="terminal-dot bg-primary/20" />
                <span className="terminal-dot bg-primary/10" />
                <span className="ml-3 text-xs text-muted-foreground font-body">terminal</span>
              </div>

              {/* Branch indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 mb-3 pb-3 border-b border-border"
              >
                <GitFork className="w-3 h-3 text-muted-foreground/50" />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mr-1 font-body">Easy versioning</span>
                <div className="flex items-center gap-1.5">
                  {[
                    { name: "dev", color: "bg-primary/50", text: "text-primary/70" },
                    { name: "staging", color: "bg-foreground/40", text: "text-foreground/60" },
                    { name: "main", color: "bg-primary", text: "text-primary" },
                  ].map((branch, i) => (
                    <span key={branch.name} className="flex items-center gap-1">
                      {i > 0 && <span className="text-muted-foreground/30 text-[10px]">→</span>}
                      <span className={`inline-flex items-center gap-1 text-[10px] font-body font-semibold ${branch.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${branch.color}`} />
                        {branch.name}
                      </span>
                    </span>
                  ))}
                </div>
              </motion.div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4 font-body">
                <span className="text-primary">$</span> tree my-agent-repository/
              </div>

              <div className="font-body text-[11px] sm:text-[13px] leading-[18px] sm:leading-[22px] overflow-x-auto">
                {/* Root */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-1"
                >
                  <Folder className="w-3.5 h-3.5 text-primary" />
                  <span className="text-foreground font-semibold">my-agent-repository/</span>
                </motion.div>

                {/* Tree rows */}
                {flatTree.map((item, i) => {
                  const { node, depth, isLast, guides } = item;
                  let guideStr = "";
                  for (let d = 0; d < depth; d++) {
                    guideStr += guides[d] ? "    " : "│   ";
                  }
                  const connector = isLast ? "└── " : "├── ";

                  return (
                    <motion.div
                      key={`${node.name}-${i}`}
                      initial={{ opacity: 0, x: -3 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.25 + i * 0.03 }}
                      className="flex items-center group hover:bg-accent/30 rounded-sm -mx-1 px-1"
                    >
                      <span className="text-muted-foreground/50 whitespace-pre select-none">{guideStr}{connector}</span>
                      <span className={`${node.color} mr-1.5 flex-shrink-0`}>{node.icon}</span>
                      <span className={node.children ? "text-foreground font-medium" : "text-muted-foreground"}>
                        {node.name}
                      </span>
                      {node.tag && (
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
                          {node.tag}
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
