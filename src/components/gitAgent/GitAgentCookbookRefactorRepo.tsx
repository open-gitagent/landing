import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part1Setup = `git clone https://github.com/your-org/refactor-agent
cd refactor-agent`;

const agentYaml = `spec_version: "0.4.0"
name: refactor-agent
version: 1.0.0
description: An agent that refactors codebases without changing behavior

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - cli
  - read
  - write

runtime:
  max_turns: 50
  timeout: 120`;

const soulMd = `# Soul

## Core Identity
I am an expert refactoring agent. I improve code quality without changing behavior.

## What I do
- Replace callbacks with async/await
- Add input validation on public functions
- Extract magic strings to named constants
- Remove dead code and unused imports
- Add JSDoc comments to exported functions

## Approach
- Work through files one at a time
- After each file, confirm what changed
- Never change what the code does, only how it looks`;

const rulesMd = `- Never modify test files
- Never run destructive commands
- Never delete code without understanding it first
- Never commit secrets or API keys
- Always confirm changes before moving to next file`;

const part1Push = `git add .
git commit -m "init refactor agent"
git push`;

const part2Setup = `mkdir refactor-sdk && cd refactor-sdk
npm init -y
npm install @open-gitagent/opengap`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/opengap": "^2.0.0"
  }
}`;

const indexTs = `import { query } from "@open-gitagent/opengap";

async function main() {
  const result = query({
    repo: {
      url: "https://github.com/your-org/refactor-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/refactor-agent",
    },
    prompt: \`
      Clone https://github.com/your-org/target-repo using the cli tool
      into /tmp/target-repo.

      Then refactor the entire codebase:
      1. Replace all callback-style async code with async/await
      2. Add input validation on every public-facing function
      3. Extract all magic strings and numbers into named constants
      4. Remove any dead code or unused imports
      5. Add JSDoc comments to every exported function

      Work through files one at a time.
      After each file, confirm what changed.
      Do not modify test files.
    \`,
    maxTurns: 50,
    hooks: {
      preToolUse: async (ctx) => {
        if (ctx.toolName === "cli" && ctx.args.command?.includes("rm -rf"))
          return { action: "block", reason: "Destructive commands blocked" };
        return { action: "allow" };
      },
      fileChanged: async (ctx) => {
        console.log(\`Modified: \${ctx.path}\`);
      },
    },
  });

  const changedFiles: string[] = [];

  for await (const msg of result) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
    if (msg.type === "tool_use" && msg.toolName === "write")
      changedFiles.push(msg.args.path);
    if (msg.type === "system" && msg.subtype === "session_end") {
      console.log(\`\\n\\nDone. \${changedFiles.length} files modified:\`);
      changedFiles.forEach(f => console.log(\` - \${f}\`));
    }
  }

  const costs = result.costs();
  console.log(\`\\nTotal cost: $\${costs.totalCostUsd.toFixed(4)}\`);
}

main();`;

const part4Run = `export ANTHROPIC_API_KEY=your_key
export GITHUB_TOKEN=your_pat
npx tsx index.ts`;

const steps = [
  { step: "1", desc: "SDK clones refactor-agent into /tmp/refactor-agent" },
  { step: "2", desc: "Loads agent.yaml + SOUL.md + RULES.md from it" },
  { step: "3", desc: "Agent uses cli tool to clone the target repo" },
  { step: "4", desc: "Agent reads files one by one using read tool" },
  { step: "5", desc: "Agent rewrites each file using write tool" },
  { step: "6", desc: "fileChanged hook logs every modified file" },
  { step: "7", desc: "Session ends — prints file list and total cost" },
];

export function GitAgentCookbookRefactorRepo() {
  return (
    <section id="cookbook-refactor-repo" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Refactor a Repo</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            You build a dedicated refactoring agent and store it on GitHub. The SDK pulls that agent
            and runs it against any target codebase you specify in the prompt.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Build the Refactoring Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a new repo on GitHub called <code className="text-primary text-xs">refactor-agent</code>, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={part1Setup} filename="terminal" />

            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={agentYaml} filename="agent.yaml" />
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={soulMd} filename="SOUL.md" />
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">RULES.md</code>:</p>
              <CodeBlock code={rulesMd} filename="RULES.md" />
            </div>

            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Push to GitHub:</p>
              <CodeBlock code={part1Push} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — SDK Project Setup</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">Create a new folder and install dependencies:</p>
          <div className="space-y-5">
            <CodeBlock code={part2Setup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Update <code className="text-primary text-xs">package.json</code>:</p>
              <CodeBlock code={packageJson} filename="package.json" />
            </div>
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Write index.ts</h3>
          <div className="mt-4">
            <CodeBlock code={indexTs} filename="index.ts" />
          </div>
        </motion.div>

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Run it</h3>
          <div className="mt-4">
            <CodeBlock code={part4Run} filename="terminal" />
          </div>
        </motion.div>

        {/* Step by step */}
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
