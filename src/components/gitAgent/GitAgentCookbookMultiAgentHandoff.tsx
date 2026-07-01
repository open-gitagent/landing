import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const part1Setup = `git clone https://github.com/your-username/buggy-code
cd buggy-code && mkdir src`;

const authJs = `async function loginUser(username, password) {
  try {
    const query = "SELECT * FROM users WHERE username = '" + username + "'";
    const user = db.execute(query);
    return user;
  } catch (e) {
    // silently swallowed
  }
}

async function fetchUserData(userId) {
  const data = fetch(\`/api/users/\${userId}\`); // promise not awaited
  return data;
}

function updateProfile(req) {
  const name = req.body.name; // no validation
  db.execute("UPDATE users SET name = '" + name + "'");
}`;

const paymentsJs = `async function processPayment(amount, cardNumber) {
  try {
    const result = await chargeCard(cardNumber, amount);
    return result;
  } catch (err) {
    // error swallowed
  }
}

async function getTransaction(id) {
  const tx = fetch(\`/api/transactions/\${id}\`); // not awaited
  return tx;
}

function createOrder(req) {
  const price = req.body.price; // no validation
  db.execute("INSERT INTO orders VALUES ('" + price + "')");
}`;

const part1Push = `git add . && git commit -m "add buggy code" && git push`;

const auditorSetup = `git clone https://github.com/your-username/auditor-agent
cd auditor-agent`;

const auditorYaml = `spec_version: "0.4.0"
name: auditor-agent
version: 1.0.0
description: Scans codebases and produces structured findings

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - cli
  - read

runtime:
  max_turns: 20
  timeout: 120`;

const auditorSoul = `# Soul

## Core Identity
I am a code auditor. I scan codebases and produce structured findings.

## What I look for
- Empty catch blocks silently swallowing errors
- Promises not awaited
- User input used without validation
- Database queries built with string concatenation

## Output format
For each finding output exactly:
FILE: <path>
LINE: <number>
TYPE: <error type>
CODE: <the problematic line>
WHY: <one sentence explaining the risk>
---`;

const auditorRules = `- Never modify any files
- Always use the exact finding format — no variations
- Scan every file in src/ without skipping
- If no issues found in a file, move on silently`;

const auditorPush = `git add . && git commit -m "init auditor agent" && git push`;

const writerSetup = `git clone https://github.com/your-username/writer-agent
cd writer-agent`;

const writerYaml = `spec_version: "0.4.0"
name: writer-agent
version: 1.0.0
description: Takes audit findings and writes a polished GitHub issue

model:
  preferred: "anthropic:claude-sonnet-4-6"
  fallback: []

tools:
  - read
  - write

runtime:
  max_turns: 5
  timeout: 120`;

const writerSoul = `# Soul

## Core Identity
I am a tech lead. I take raw audit findings and write clear, actionable GitHub issues.

## What I produce
- A clear specific title
- A 2-3 sentence problem summary explaining production risk
- A table: File | Line | Type | Risk Level (Critical/High/Medium)
- A "How to fix" section with one concrete example per issue type
- A checklist of acceptance criteria for the PR that fixes this

## Style
- GitHub Flavored Markdown throughout
- Concise and direct — no filler text
- Risk levels: SQL injection = Critical, unvalidated input = High, unhandled errors = High, unawaited promises = Medium`;

const writerRules = `- Never add findings that were not in the input
- Always include all four sections
- Always use GitHub Flavored Markdown
- Never modify source files`;

const writerPush = `git add . && git commit -m "init writer agent" && git push`;

const part4Setup = `mkdir multi-agent-sdk && cd multi-agent-sdk
npm init -y
npm install @open-gitagent/gitagent`;

const packageJson = `{
  "type": "module",
  "dependencies": {
    "@open-gitagent/gitagent": "^2.0.0"
  }
}`;

const envVars = `export ANTHROPIC_API_KEY=your_anthropic_key
export GITHUB_TOKEN=your_pat`;

const indexTs = `import { query } from "@open-gitagent/gitagent";

async function main() {
  console.log("Agent 1 — Scanning codebase for issues...\\n");

  let findings = "";
  let fileCount = 0;

  for await (const msg of query({
    repo: {
      url: "https://github.com/your-username/auditor-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/auditor-agent",
    },
    prompt: \`
      Clone https://github.com/your-username/buggy-code
      into /tmp/buggy-code using the cli tool.

      Then scan every file in /tmp/buggy-code/src/ and find:
      1. Errors silently swallowed in empty catch blocks
      2. Promises not awaited
      3. User input used without validation
      4. Database queries built with string concatenation

      For each finding output exactly:
      FILE: <path>
      LINE: <number>
      TYPE: <error type>
      CODE: <the problematic line>
      WHY: <one sentence explaining the risk>
      ---
    \`,
    maxTurns: 20,
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "assistant") findings = msg.content;
    if (msg.type === "tool_use" && msg.toolName === "read") fileCount++;
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }

  console.log(\`\\n\\nAgent 1 done. Scanned \${fileCount} files.\`);
  console.log("\\nAgent 2 — Writing GitHub issue...\\n");

  for await (const msg of query({
    repo: {
      url: "https://github.com/your-username/writer-agent",
      token: process.env.GITHUB_TOKEN!,
      dir: "/tmp/writer-agent",
    },
    prompt: \`
      Write a well-structured GitHub issue based on these audit findings:

      - A clear, specific title
      - A 2-3 sentence problem summary explaining the risk to production
      - A table with columns: File | Line | Type | Risk Level (Critical/High/Medium)
      - A "How to fix" section with one concrete example fix for each type
      - A checklist of acceptance criteria for the PR that fixes this

      Use GitHub Flavored Markdown throughout.

      Findings:
      \${findings}
    \`,
    maxTurns: 5,
    constraints: { temperature: 0.2 },
  })) {
    if (msg.type === "delta") process.stdout.write(msg.content);
    if (msg.type === "system" && msg.subtype === "error")
      console.log(\`\\n[ERROR] \${msg.content}\`);
  }
}

main();`;

const part6Run = `npx tsx index.ts`;

const steps = [
  { step: "1", desc: "SDK clones auditor-agent into /tmp/auditor-agent" },
  { step: "2", desc: "Agent 1 uses cli to clone buggy-code into /tmp/buggy-code" },
  { step: "3", desc: "Agent 1 scans every file in src/ using read tool" },
  { step: "4", desc: "Agent 1 outputs structured findings — one block per issue" },
  { step: "5", desc: "findings captures Agent 1's full output" },
  { step: "6", desc: "SDK clones writer-agent into /tmp/writer-agent" },
  { step: "7", desc: "Agent 2 receives the findings and writes a polished GitHub issue" },
  { step: "8", desc: "GitHub issue markdown streams to terminal — ready to paste" },
];

export function GitAgentCookbookMultiAgentHandoff() {
  return (
    <section id="cookbook-multi-agent-handoff" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
          <p className="text-xs text-muted-foreground/50 font-body mb-1">SDK / Cookbooks /</p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Multi-Agent Handoff</h2>
          <p className="text-sm text-muted-foreground font-body leading-relaxed">
            Runs two specialized agents back to back. Agent 1 is a code auditor — it clones a repo, scans
            every file in <code className="text-primary text-xs">src/</code>, and produces structured findings.
            Agent 2 is a tech lead writer — it takes those findings and produces a polished GitHub issue with
            a risk table, fix guide, and acceptance criteria. Each agent stays focused on one job.
          </p>
        </motion.div>

        {/* Part 1 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 1 — Create a Target Repo with Code Issues</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">buggy-code</code> on GitHub, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={part1Setup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">src/auth.js</code>:</p>
              <CodeBlock code={authJs} filename="src/auth.js" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">src/payments.js</code>:</p>
              <CodeBlock code={paymentsJs} filename="src/payments.js" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Push to GitHub:</p>
              <CodeBlock code={part1Push} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 2 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 2 — Build the Auditor Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">auditor-agent</code> on GitHub, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={auditorSetup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={auditorYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={auditorSoul} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">RULES.md</code>:</p>
              <CodeBlock code={auditorRules} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Push to GitHub:</p>
              <CodeBlock code={auditorPush} filename="terminal" />
            </div>
          </div>
        </motion.div>

        {/* Part 3 */}
        <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
          <h3 className="text-base font-semibold text-foreground mb-1 font-heading">Part 3 — Build the Writer Agent Repo</h3>
          <p className="text-[11px] text-muted-foreground/60 font-body mb-4">
            Create a repo called <code className="text-primary text-xs">writer-agent</code> on GitHub, clone it locally:
          </p>
          <div className="space-y-5">
            <CodeBlock code={writerSetup} filename="terminal" />
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">agent.yaml</code>:</p>
              <CodeBlock code={writerYaml} filename="agent.yaml" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">SOUL.md</code>:</p>
              <CodeBlock code={writerSoul} filename="SOUL.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Create <code className="text-primary text-xs">RULES.md</code>:</p>
              <CodeBlock code={writerRules} filename="RULES.md" />
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground font-body mb-2">Push to GitHub:</p>
              <CodeBlock code={writerPush} filename="terminal" />
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
