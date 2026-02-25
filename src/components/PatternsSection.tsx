import { motion } from "framer-motion";
import { Folder, FileText, GitBranch, ArrowRight, Share2, Zap, Wrench, Database, Network, UserCheck, Anchor, BrainCircuit, History, GitFork, RefreshCw, SearchCode } from "lucide-react";
import humanInTheLoopImg from "@/assets/human-in-the-loop.png";
import sharedContextImg from "@/assets/shared-context.png";
import branchDeploymentImg from "@/assets/branch-deployment.png";
import knowledgeTreeImg from "@/assets/knowledge-tree.png";
import agentAutomationHooksImg from "@/assets/agent-automation-hooks.png";
import liveAgentMemoryImg from "@/assets/live-agent-memory.png";
import agentVersioningImg from "@/assets/agent-versioning.png";
import agentForkingImg from "@/assets/agent-forking.png";
import ciCdAgentsImg from "@/assets/ci-cd-agents.png";
import agentDiffAuditImg from "@/assets/agent-diff-audit.png";

export function PatternsSection() {
  return (
    <section id="patterns" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">Patterns</h2>
          <p className="text-sm text-muted-foreground max-w-2xl font-body">
            A gitagent is your git repository as an agent — complete with version control, branching, pull requests, and collaboration built in. These are the architectural patterns that emerge when you define agents as git-native file systems.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Pattern 1 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <UserCheck className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Human-in-the-Loop for RL Agents</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              When an agent learns a new skill or writes to memory, it can open a <code className="text-foreground/70">branch + PR</code> for human review before merging.
            </p>
            <img 
              src={humanInTheLoopImg} 
              alt="Human-in-the-Loop for RL Agents: agents create branches and PRs for human review before updating memory or skills" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 2 — Live Agent Memory */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.10 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <BrainCircuit className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Live Agent Memory</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              The <code className="text-foreground/70">memory/</code> folder holds a <code className="text-foreground/70">runtime/</code> subfolder where agents write live knowledge — <code className="text-foreground/70">dailylog.md</code>, <code className="text-foreground/70">key-decisions.md</code>, and <code className="text-foreground/70">context.md</code> — persisting execution state across sessions.
            </p>
            <img 
              src={liveAgentMemoryImg} 
              alt="Live Agent Memory: memory/ folder with runtime logs, key decisions, and context files" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 3 — Shared Context */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <Share2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Shared Context & Skills via Monorepo</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Anything placed at the root — <code className="text-foreground/70">context.md</code>, <code className="text-foreground/70">skills/</code>, <code className="text-foreground/70">tools/</code> — is automatically shared across every agent in the monorepo. No duplication, one source of truth.
            </p>
            <img 
              src={sharedContextImg} 
              alt="Shared Context: root-level context.md, skills/, tools/, and knowledge/ inherited by all agents" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 3 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <GitBranch className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Branch-based Deployment</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Use git branches to promote agent changes through environments — just like shipping software.
            </p>
            <img 
              src={branchDeploymentImg} 
              alt="Branch-based Deployment: dev, staging, and main branches for promoting agent changes" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 4 — Knowledge Tree */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.18 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <Network className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Knowledge Tree</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              The <code className="text-foreground/70">knowledge/</code> folder stores entity relationships as a hierarchical knowledge tree + embeddings — letting agents reason over structured data at runtime.
            </p>
            <img 
              src={knowledgeTreeImg} 
              alt="Knowledge Tree: the knowledge/ folder stores entity relationships as a directory tree with embeddings" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 5 — Agent Versioning */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.21 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <History className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Agent Versioning</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Every change to your agent is a <code className="text-foreground/70">git commit</code>. Roll back broken prompts, revert bad skills, and explore past versions — full undo history for your agent, powered by git.
            </p>
            <img
              src={agentVersioningImg}
              alt="Agent Versioning: git commit history showing agent changes that can be reverted"
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 6 — Agent Forking & Remixing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <GitFork className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Agent Forking & Remixing</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Fork any public agent repo, customize its <code className="text-foreground/70">SOUL.md</code>, add your own skills, and PR improvements back upstream — open-source collaboration for AI agents.
            </p>
            <img
              src={agentForkingImg}
              alt="Agent Forking & Remixing: fork an agent, customize it, and contribute back via pull request"
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 7 — CI/CD for Agents */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.27 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <RefreshCw className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">CI/CD for Agents</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Run <code className="text-foreground/70">gitagent validate</code> on every push via GitHub Actions. Test agent behavior in CI, block bad merges, and auto-deploy to production — treat agent quality like code quality.
            </p>
            <img
              src={ciCdAgentsImg}
              alt="CI/CD for Agents: GitHub Actions pipeline with validate, test, merge, and deploy stages"
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 8 — Agent Diff & Audit Trail */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.30 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <SearchCode className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Agent Diff & Audit Trail</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              <code className="text-foreground/70">git diff</code> shows exactly what changed between agent versions. <code className="text-foreground/70">git blame</code> traces every line to who wrote it and when — full traceability out of the box.
            </p>
            <img
              src={agentDiffAuditImg}
              alt="Agent Diff & Audit Trail: git diff and git blame showing full traceability of agent changes"
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

          {/* Pattern 9 — Agent Automation Hooks */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.24 }}
            className="paper-card p-4 sm:p-6"
          >
            <div className="flex items-center gap-2 mb-1 relative z-10">
              <Anchor className="w-4 h-4 text-primary" />
              <span className="text-sm font-heading font-semibold text-foreground">Agent Lifecycle with Hooks</span>
            </div>
            <p className="text-xs text-muted-foreground mb-5 leading-relaxed font-body relative z-10">
              Define <code className="text-foreground/70">bootstrap.md</code> and <code className="text-foreground/70">teardown.md</code> in the <code className="text-foreground/70">hooks/</code> folder to control what an agent does when it starts up and what it should do before it stops — injecting lifecycle logic at key points.
            </p>
            <img 
              src={agentAutomationHooksImg} 
              alt="Agent Automation Hooks: hooks/ folder with bootstrap.md and teardown.md for agent lifecycle events" 
              className="w-full rounded-md relative z-10"
            />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
