import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part1Setup = `git clone https://github.com/your-org/email-agent
cd email-agent`;

const agentYaml = `spec_version: "0.4.0"
name: email-agent
version: 1.0.0
description: An agent that summarizes unread emails by urgency

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
I am an email assistant. I read emails and produce clear, prioritized summaries.

## What I do
- Fetch unread emails using available tools
- Group them by urgency: action needed today, can wait, FYI only
- For urgent emails, extract the specific action required
- Keep summaries scannable — bullet points, no long paragraphs

## Principles
- Never send, delete, or modify emails
- Only read`;

const rulesMd = `- Never send emails
- Never delete emails
- Never mark emails as read unless explicitly asked
- Only use the tools provided`;

const part1Push = `git add .
git commit -m "init email agent"
git push`;

const getTokenScript = `import { google } from "googleapis";
import * as readline from "readline";

const auth = new google.auth.OAuth2(
  "YOUR_CLIENT_ID",
  "YOUR_CLIENT_SECRET",
  "urn:ietf:wg:oauth:2.0:oob"
);

const url = auth.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/gmail.readonly"],
});

console.log("Open this URL in your browser:\\n", url);

const rl = readline.createInterface({ input: process.stdin });
rl.question("\\nPaste the code here: ", async (code) => {
  const { tokens } = await auth.getToken(code);
  console.log("\\nYour refresh token:", tokens.refresh_token);
  rl.close();
});`;

const runGetToken = `node get-token.mjs`;

const part3Setup = `mkdir email-summarizer && cd email-summarizer
npm init -y
npm install @open-gitagent/gitagent googleapis`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/gitagent": "^2.0.0",
    "googleapis": "latest"
  }
}`;

const envVars = `export ANTHROPIC_API_KEY=your_anthropic_key
export GITHUB_TOKEN=your_pat
export GMAIL_CLIENT_ID=your_client_id
export GMAIL_CLIENT_SECRET=your_client_secret
export GMAIL_REFRESH_TOKEN=your_refresh_token`;

const indexTs = `import { query, tool } from "@open-gitagent/gitagent";
import { google } from "googleapis";

const auth = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
);
auth.setCredentials({ refresh_token: process.env.GMAIL_REFRESH_TOKEN });
const gmail = google.gmail({ version: "v1", auth });

const listEmails = tool(
  "list_unread_emails",
  "List unread emails with subject, sender, date and snippet",
  {
    properties: {
      limit: { type: "number", description: "Number of emails to fetch (default 20)" },
      from: { type: "string", description: "Filter by sender domain e.g. @company.com" },
    },
    required: [],
  },
  async ({ limit = 20, from = "" }) => {
    const q = \`is:unread\${from ? \` from:\${from}\` : ""}\`;
    const list = await gmail.users.messages.list({ userId: "me", q, maxResults: limit });
    const messages = await Promise.all(
      (list.data.messages ?? []).map(async (m) => {
        const msg = await gmail.users.messages.get({
          userId: "me", id: m.id!, format: "metadata",
          metadataHeaders: ["From", "Subject", "Date"],
        });
        const headers = msg.data.payload?.headers ?? [];
        return {
          id: m.id,
          from: headers.find(h => h.name === "From")?.value,
          subject: headers.find(h => h.name === "Subject")?.value,
          date: headers.find(h => h.name === "Date")?.value,
          snippet: msg.data.snippet,
        };
      })
    );
    return JSON.stringify(messages);
  },
);

const getEmailBody = tool(
  "get_email_body",
  "Get the full body of a specific email by ID",
  {
    properties: {
      id: { type: "string", description: "Email message ID" },
    },
    required: ["id"],
  },
  async ({ id }: { id: string }) => {
    const msg = await gmail.users.messages.get({ userId: "me", id, format: "full" });
    const body = msg.data.payload?.parts?.[0]?.body?.data ?? msg.data.payload?.body?.data ?? "";
    return Buffer.from(body, "base64").toString("utf-8").slice(0, 5000);
  },
);

async function main() {
  for await (const msg of query({
    repo: {
      url: "https://github.com/your-org/email-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/email-agent",
    },
    prompt: \`
      Fetch my last 20 unread emails.
      Group them into three buckets:
      - Needs action today
      - Can wait until tomorrow
      - FYI only / no action needed

      For each email in "Needs action today", read the full body
      and extract the specific action required.
      Keep the summary scannable — bullet points, no long paragraphs.
    \`,
    tools: [listEmails, getEmailBody],
    maxTurns: 15,
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }
}

main();`;

const part5Run = `npx tsx index.ts`;

const steps = [
  { step: "1", desc: "SDK clones email-agent from GitHub into /tmp/email-agent" },
  { step: "2", desc: "Loads agent.yaml + SOUL.md + RULES.md" },
  { step: "3", desc: "Agent calls list_unread_emails — fetches 20 emails with subject, sender, snippet" },
  { step: "4", desc: "For urgent emails, calls get_email_body to read full content" },
  { step: "5", desc: "Produces grouped summary printed to terminal" },
];

export function GitAgentCookbookSummarizeEmails() {
  return (
    <section id="cookbook-summarize-emails" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Summarize Unread Emails</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Connects to Gmail via two custom tools, fetches your unread emails, and produces a prioritized
            summary grouped by urgency — with specific action items called out for emails that need attention today.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Build the Email Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a new repo on GitHub called <code className="text-primary text-xs">email-agent</code>, clone it locally:
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
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Get Gmail API Credentials</h3>
          <div className="space-y-4 mt-4">
            {[
              { step: "Step 1 — Create a Google Cloud project", items: ["Go to console.cloud.google.com", "Click New Project → name it email-agent → Create"] },
              { step: "Step 2 — Enable Gmail API", items: ["Go to APIs & Services → Library", "Search Gmail API → Enable"] },
              { step: "Step 3 — Create OAuth2 credentials", items: ["Go to APIs & Services → Credentials", "Click Create Credentials → OAuth client ID", "Configure consent screen: User type: External, Add your Gmail as a test user", "Application type: Desktop app → Create", "Copy Client ID and Client Secret"] },
            ].map((s, i) => (
              <div key={i} className="paper-card p-4">
                <p className="text-[11px] font-semibold text-foreground font-body mb-2">{s.step}</p>
                <ul className="space-y-1">
                  {s.items.map((item, j) => (
                    <li key={j} className="text-[11px] text-muted-foreground font-body flex gap-2">
                      <span className="text-primary shrink-0">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <p className="text-[11px] font-semibold text-foreground font-body mb-2">Step 4 — Get refresh token</p>
              <p className="text-[11px] text-muted-foreground font-body mb-3">
                Create <code className="text-primary text-xs">get-token.mjs</code>:
              </p>
              <CodeBlock code={getTokenScript} filename="get-token.mjs" />
              <div className="mt-3">
                <CodeBlock code={runGetToken} filename="terminal" />
              </div>
              <p className="text-[11px] text-muted-foreground font-body mt-3">Copy the refresh token it prints.</p>
            </div>
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — SDK Project Setup</h3>
          <div className="space-y-5 mt-4">
            <CodeBlock code={part3Setup} filename="terminal" />
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

        {/* Part 4 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 4 — Create index.ts</h3>
          <div className="mt-4">
            <CodeBlock code={indexTs} filename="index.ts" />
          </div>
        </motion.div>

        {/* Part 5 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 5 — Run it</h3>
          <div className="mt-4">
            <CodeBlock code={part5Run} filename="terminal" />
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
