import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part1Setup = `git clone https://github.com/your-org/code-review-agent
cd code-review-agent`;

const agentYaml = `spec_version: "0.4.0"
name: code-review-agent
version: 1.0.0
description: An agent that reviews pull request diffs across security, correctness, and performance

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - cli
  - read
  - write

runtime:
  max_turns: 15
  timeout: 120`;

const soulMd = `# Soul

## Core Identity
I am a senior software engineer specialising in code review.
I review diffs thoroughly across three dimensions: security, correctness, and performance.

## How I review
- Security — OWASP Top 10: SQL injection, XSS, hardcoded secrets, missing auth
- Correctness — logic bugs, off-by-one errors, unhandled nulls, race conditions
- Performance — N+1 queries, blocking operations, missing indexes

## Output format
For each finding:
**[CRITICAL|WARNING|INFO]** File:Line — What is wrong — How to fix it

If a dimension has no findings, write "No issues found."
Be specific. No vague feedback.`;

const rulesMd = `- Never push or commit to the target repo
- Never modify source files in the target repo
- Never run destructive commands (rm -rf, git reset --hard)
- Only clone, checkout, and diff — do not modify the target repo
- Always review all three dimensions: security, correctness, performance
- Always use the exact finding format specified
- If the diff is empty, say so and stop`;

const part1Push = `git add .
git commit -m "init code review agent"
git push`;

const part2Setup = `mkdir pr-reviewer && cd pr-reviewer
npm init -y
npm install @open-gitagent/opengap`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/opengap": "^2.0.0"
  }
}`;

const envVars = `export ANTHROPIC_API_KEY=your_anthropic_key
export GITHUB_TOKEN=your_pat`;

const reviewTs = `import { query } from "@open-gitagent/opengap";
import { writeFileSync } from "fs";

const prUrl = process.argv[2];

if (!prUrl) {
  console.error("Usage: npx tsx review.ts <github-pr-url>");
  process.exit(1);
}

let report = "";

async function main() {
  console.log(\`Reviewing PR: \${prUrl}\`);

  for await (const msg of query({
    repo: {
      url: "https://github.com/your-org/code-review-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/code-review-agent",
    },
    prompt: \`
      Review this pull request: \${prUrl}

      Steps:
      1. Use gh pr checkout to clone and checkout the PR branch
      2. Run git diff main...HEAD to get the diff
      3. Review the diff across three dimensions:

      ## 1. Security (OWASP Top 10)
      - SQL injection, XSS, command injection
      - Hardcoded secrets or credentials
      - Missing authentication/authorization checks

      ## 2. Correctness
      - Logic bugs and off-by-one errors
      - Unhandled edge cases and null/undefined
      - Missing error handling

      ## 3. Performance
      - N+1 queries
      - Blocking operations on the main thread
      - Missing indexes or caching opportunities

      For each finding:
      **[CRITICAL|WARNING|INFO]** File:Line — What is wrong — How to fix it

      If a dimension has no findings, write "No issues found."
    \`,
    maxTurns: 15,
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "assistant") report += msg.content;
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }

  writeFileSync("review-report.md", report);
  console.log("\\n\\nReport saved to review-report.md");
}

main();`;

const part4Run = `npx tsx review.ts https://github.com/org/repo/pull/123`;

const steps = [
  { step: "1", desc: "PR URL passed as command line argument" },
  { step: "2", desc: "SDK clones code-review-agent from GitHub into /tmp/code-review-agent" },
  { step: "3", desc: "Loads agent.yaml + SOUL.md + RULES.md" },
  { step: "4", desc: "Agent uses cli tool to run gh pr checkout on the target PR" },
  { step: "5", desc: "Agent runs git diff main...HEAD itself to get the diff" },
  { step: "6", desc: "Agent reviews diff across all three dimensions" },
  { step: "7", desc: "Findings stream to terminal in real time" },
  { step: "8", desc: "Full report written to review-report.md" },
];

export function GitAgentCookbookCodeReview() {
  return (
    <section id="cookbook-code-review" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Code Review on a Pull Request</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Pass any GitHub PR URL and the agent clones the repo, checks out the branch, runs the diff itself,
            and produces a structured review across security, correctness, and performance — saved to{" "}
            <code className="text-primary text-xs">review-report.md</code>.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Build the Code Review Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a new repo on GitHub called <code className="text-primary text-xs">code-review-agent</code>, clone it locally:
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
          <div className="space-y-5 mt-4">
            <CodeBlock code={part2Setup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Update <code className="text-primary text-xs">package.json</code>:</p>
              <CodeBlock code={packageJson} filename="package.json" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Set environment variables:</p>
              <CodeBlock code={envVars} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Create review.ts</h3>
          <div className="mt-4">
            <CodeBlock code={reviewTs} filename="review.ts" />
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
