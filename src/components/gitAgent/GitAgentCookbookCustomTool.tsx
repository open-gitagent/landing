import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part3Setup = `git clone https://github.com/your-username/custom-tool-agent
cd custom-tool-agent`;

const agentYaml = `spec_version: "0.4.0"
name: custom-tool-agent
version: 1.0.0
description: An agent that looks up GitHub issues and sends Discord alerts

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - read
  - write

runtime:
  max_turns: 15
  timeout: 120`;

const soulMd = `# Soul

## Core Identity
I am a project management assistant. I look up GitHub issues and send Discord alerts when action is needed.

## What I do
- Look up GitHub issues by number
- Check their status and assignee
- Send Discord messages when issues need attention

## Principles
- Only send Discord messages when there is a clear reason
- Be concise — one message covering all flagged issues
- Never spam the channel`;

const rulesMd = `- Never look up issues that were not explicitly mentioned
- Always check assignee before sending an alert
- Send only one Discord message per run
- Never close or modify issues`;

const part3Push = `git add .
git commit -m "init custom tool agent"
git push`;

const part4Setup = `mkdir custom-tool-sdk && cd custom-tool-sdk
npm init -y
npm install @open-gitagent/opengap`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/opengap": "^2.0.0"
  }
}`;

const envVars = `export ANTHROPIC_API_KEY=your_anthropic_key
export GITHUB_TOKEN=your_pat
export GITHUB_REPO=your-username/test-issues
export DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/xxx/yyy`;

const indexTs = `import { query, tool } from "@open-gitagent/opengap";

const lookupGithubIssue = tool(
  "lookup_github_issue",
  "Look up a GitHub issue by number and return its title, state, and assignee",
  {
    properties: {
      issue_number: { type: "number", description: "Issue number e.g. 1" },
    },
    required: ["issue_number"],
  },
  async ({ issue_number }: { issue_number: number }) => {
    const res = await fetch(
      \`https://api.github.com/repos/\${process.env.GITHUB_REPO}/issues/\${issue_number}\`,
      {
        headers: {
          Authorization: \`Bearer \${process.env.GITHUB_TOKEN}\`,
          Accept: "application/vnd.github+json",
        },
      }
    );
    const data = await res.json();
    return JSON.stringify({
      number: data.number,
      title: data.title,
      state: data.state,
      assignee: data.assignee?.login ?? "Unassigned",
      created_at: data.created_at,
      body: data.body?.slice(0, 500) ?? "",
    });
  },
);

const sendDiscordMessage = tool(
  "send_discord_message",
  "Send a message to a Discord channel via webhook",
  {
    properties: {
      message: { type: "string", description: "Message text to send" },
    },
    required: ["message"],
  },
  async ({ message }: { message: string }) => {
    await fetch(process.env.DISCORD_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    return "Message sent to Discord";
  },
);

async function main() {
  for await (const msg of query({
    repo: {
      url: "https://github.com/your-username/custom-tool-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/custom-tool-agent",
    },
    prompt: \`
      Look up GitHub issues #1, #2, and #3
      in the repo \${process.env.GITHUB_REPO}.
      For each one check if it is open and unassigned.
      If any are open and unassigned, draft a Discord message
      flagging them and send it.
    \`,
    tools: [lookupGithubIssue, sendDiscordMessage],
    maxTurns: 15,
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }
}

main();`;

const part6Run = `npx tsx index.ts`;

const issueRows = [
  { number: "#1", title: "Fix login page not redirecting after auth", assignee: "none" },
  { number: "#2", title: "API returns 500 on empty payload", assignee: "yourself" },
  { number: "#3", title: "Update dependencies to latest version", assignee: "none" },
];

const steps = [
  { step: "1", desc: "SDK clones custom-tool-agent from GitHub into /tmp/custom-tool-agent" },
  { step: "2", desc: "Loads agent.yaml + SOUL.md + RULES.md" },
  { step: "3", desc: "Agent calls lookup_github_issue three times — one per issue" },
  { step: "4", desc: "Checks state and assignee for each" },
  { step: "5", desc: "Issues #1 and #3 are open + unassigned → flagged" },
  { step: "6", desc: "Issue #2 is assigned → skipped" },
  { step: "7", desc: "Agent calls send_discord_message with a summary of flagged issues" },
  { step: "8", desc: "Discord message appears in your #alerts channel" },
];

export function GitAgentCookbookCustomTool() {
  return (
    <section id="cookbook-custom-tool" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Custom Tool</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Shows how to build and register custom tools so the agent can call your own functions
            mid-conversation. The agent looks up GitHub issues, checks which ones are open and
            unassigned, and sends a Discord alert flagging them.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Create Test Issues on GitHub</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">test-issues</code> on GitHub, then add three issues:
          </p>
          <div className="paper-card overflow-hidden">
            <table className="w-full text-[11px] font-body">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium">Issue</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium">Title</th>
                  <th className="text-left px-4 py-2.5 text-muted-foreground/60 font-medium">Assignee</th>
                </tr>
              </thead>
              <tbody>
                {issueRows.map((row, i) => (
                  <tr key={i} className={i < issueRows.length - 1 ? "border-b border-border/50" : ""}>
                    <td className="px-4 py-2.5 text-primary font-semibold">{row.number}</td>
                    <td className="px-4 py-2.5 text-foreground">{row.title}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{row.assignee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-muted-foreground font-body mt-3">
            Issues #1 and #3 are unassigned — the agent will flag these.
          </p>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Create a Discord Webhook</h3>
          <div className="paper-card p-4 mt-4 space-y-1.5">
            {[
              "Go to discord.com → sign up free → Create My Own server",
              "Create a channel #alerts",
              "Channel Settings → Integrations → Webhooks → New Webhook → Copy URL",
            ].map((item, i) => (
              <div key={i} className="flex gap-2 text-[11px] text-muted-foreground font-body">
                <span className="text-primary shrink-0">—</span>
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Build the Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a new repo on GitHub called <code className="text-primary text-xs">custom-tool-agent</code>, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={part3Setup} filename="terminal" />
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
              <CodeBlock code={part3Push} filename="terminal" />
            </div>
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
