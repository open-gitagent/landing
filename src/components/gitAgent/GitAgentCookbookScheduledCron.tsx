import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part1Setup = `git clone https://github.com/your-username/standup-target
cd standup-target`;

const part1Commits = `echo "# App" > README.md
git add . && git commit -m "feat: initial project setup"

mkdir src
echo "export const login = () => {}" > src/auth.js
git add . && git commit -m "feat: add login handler"

echo "export const pay = () => {}" > src/payments.js
git add . && git commit -m "fix: payment null check"`;

const part1Push = `git push`;

const part2Setup = `git clone https://github.com/your-username/standup-agent
cd standup-agent`;

const agentYaml = `spec_version: "0.4.0"
name: standup-agent
version: 1.0.0
description: Writes a daily standup digest from git activity

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - cli
  - read

runtime:
  max_turns: 10
  timeout: 120`;

const soulMd = `# Soul

## Core Identity
I am a standup digest writer. I look at what changed in a repo over the last 24 hours and summarize it for an engineering team.

## What I produce
A short Discord message with three sections:
- **Yesterday** — commits that shipped
- **Blocked** — PRs with no review activity in over 2 days
- **Today** — PRs that are approved and ready to merge

## Style
- Discord markdown: **bold**, bullet points
- Under 20 lines total
- No preamble — just the message
- If nothing to report in a section, write "Nothing to report"`;

const rulesMd = `- Never modify any files in the target repo
- Always run git log with --since='24 hours ago' — do not change the time window
- Always run gh pr list to check PR status
- Output only the Discord message — no commentary before or after
- Use Discord markdown, not GitHub markdown`;

const part2Push = `git add . && git commit -m "init standup agent" && git push`;

const part4Setup = `mkdir standup-sdk && cd standup-sdk
npm init -y
npm install @open-gitagent/opengap node-cron
npm install -D tsx`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/opengap": "^2.0.0",
    "node-cron": "^4.2.1"
  }
}`;

const envVars = `export ANTHROPIC_API_KEY=your_anthropic_key
export GITHUB_TOKEN=your_pat
export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/...`;

const indexTs = `import { query } from "@open-gitagent/opengap";
import cron from "node-cron";

async function runStandup() {
  console.log(\`[\${new Date().toISOString()}] Running standup agent...\`);

  let summary = "";

  for await (const msg of query({
    repo: {
      url: "https://github.com/your-username/standup-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/standup-agent",
    },
    prompt: \`
      Write a standup digest for the engineering team.

      Steps:
      1. Clone https://github.com/your-username/standup-target into /tmp/standup-target
         using cli: git clone https://github.com/your-username/standup-target /tmp/standup-target
         If the directory already exists, run: git -C /tmp/standup-target pull
      2. Run: git -C /tmp/standup-target log --oneline --since='24 hours ago'
      3. Run: gh pr list --repo your-username/standup-target --json title,author,reviewDecision,updatedAt

      Then write a Discord message with these three sections:
      **Yesterday** — commits that shipped in the last 24 hours
      **Blocked** — PRs with no review activity in over 2 days
      **Today** — PRs that are approved and ready to merge

      Keep it under 20 lines. Use Discord markdown (**bold**, bullet points).
      Output only the Discord message — no preamble.
    \`,
    maxTurns: 10,
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "assistant") summary = msg.content;
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }

  if (!summary) {
    console.error("\\nAgent returned no output, skipping Discord post");
    return;
  }

  const res = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: summary }),
  });

  if (res.ok) {
    console.log("\\nStandup posted to Discord");
  } else {
    console.error(\`\\nDiscord post failed: \${res.status}\`);
  }
}

// Run once immediately for testing
runStandup();

// Then schedule for weekdays at 9 AM
cron.schedule("0 9 * * 1-5", runStandup);
console.log("Standup agent running. Scheduled for 9 AM weekdays.");`;

const part6Run = `npx tsx index.ts`;

const steps = [
  { step: "1", desc: "SDK clones standup-agent into /tmp/standup-agent" },
  { step: "2", desc: "Agent uses cli to clone standup-target into /tmp/standup-target" },
  { step: "3", desc: "Agent runs git log --since='24 hours ago' on the target repo" },
  { step: "4", desc: "Agent runs gh pr list to get open PR status" },
  { step: "5", desc: "Agent writes the Discord message with Yesterday / Blocked / Today sections" },
  { step: "6", desc: "SDK posts the message to Discord via webhook" },
  { step: "7", desc: "Process stays alive and fires again every weekday at 9 AM" },
];

export function GitAgentCookbookScheduledCron() {
  return (
    <section id="cookbook-scheduled-cron" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Scheduled Cron Task</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Runs a standup agent every weekday at 9 AM. It clones your target repo, checks commits from the
            last 24 hours and open PRs, writes a digest, and posts it to a Discord channel automatically.
            The SDK handles scheduling via node-cron — no external infrastructure needed.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Create a Target Repo with Git History</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">standup-target</code> on GitHub, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={part1Setup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">
                Create some files and commits so the agent has history to report:
              </p>
              <CodeBlock code={part1Commits} filename="terminal" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Push to GitHub:</p>
              <CodeBlock code={part1Push} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Build the Standup Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">standup-agent</code> on GitHub, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={part2Setup} filename="terminal" />
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
              <CodeBlock code={part2Push} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Discord Webhook Setup</h3>
          <div className="paper-card p-4 mt-4 space-y-1.5">
            {[
              "Open your Discord server → right-click a channel → Edit Channel",
              "Go to Integrations → Webhooks → New Webhook",
              "Name it Standup Bot, click Copy Webhook URL",
              "Save it — you'll use it as DISCORD_WEBHOOK_URL",
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[11px] text-muted-foreground font-body">
                <span className="text-primary shrink-0">—</span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — SDK Project Setup</h3>
          <div className="space-y-5 mt-4">
            <CodeBlock code={part4Setup} filename="terminal" />
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

        {/* Part 5 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 5 — Create index.ts</h3>
          <div className="mt-4">
            <CodeBlock code={indexTs} filename="index.ts" />
          </div>
        </motion.div>

        {/* Part 6 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 6 — Run it</h3>
          <div className="mt-4">
            <CodeBlock code={part6Run} filename="terminal" />
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
