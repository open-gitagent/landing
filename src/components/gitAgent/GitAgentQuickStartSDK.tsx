import { motion } from "framer-motion";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const installCode = `npm install @open-gitagent/gitagent`;

const pathWithRepo = `import { query } from "@open-gitagent/gitagent";

for await (const msg of query({
  prompt: "Summarise the open pull requests",
  repo: "https://github.com/your-gitagent",
})) {
  if (msg.type === "assistant") console.log(msg.content);
}`;

const pathWithoutRepo = `import { query } from "@open-gitagent/gitagent";

for await (const msg of query({
  prompt: "Refactor the auth module in src/auth.ts",
  model: "anthropic:claude-sonnet-4-6",
  dir: "./my-project",
})) {
  if (msg.type === "assistant") console.log(msg.content);
}`;

const nextSteps = [
  { label: "SDK reference", href: "/docs/sdk" },
];

export function GitAgentQuickStartSDK() {
  return (
    <section id="quickstart-sdk" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Breadcrumb + heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-2"
        >
          <p className="text-xs text-muted-foreground/50 font-body mb-1">
            <a href="/docs/quickstart" className="hover:text-muted-foreground transition-colors">Quick Start</a>
            {" / "}
          </p>
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">SDK / Embed</h2>
          <p className="text-sm text-muted-foreground font-body">
            Import GitAgent as a Node.js library and call{" "}
            <code className="text-primary text-xs font-body">query()</code> from your own application or script.
          </p>
        </motion.div>

        {/* Install */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
            Install
          </h3>
          <CodeBlock code={installCode} filename="terminal" />
        </motion.div>

        {/* Two code paths side by side */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Two ways to call query()
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Path 1 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="flex flex-col gap-3"
            >
              <p className="text-xs font-semibold text-foreground font-body">Path 1 — With repo URL</p>
              <CodeBlock code={pathWithRepo} filename="index.ts" className="flex-1" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                Clones the repo, reads{" "}
                <code className="text-primary text-xs font-body">agent.yaml</code>,{" "}
                <code className="text-primary text-xs font-body">SOUL.md</code>, and skills automatically. Zero local setup.
              </p>
            </motion.div>

            {/* Path 2 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="flex flex-col gap-3"
            >
              <p className="text-xs font-semibold text-foreground font-body">Path 2 — Without repo</p>
              <CodeBlock code={pathWithoutRepo} filename="index.ts" className="flex-1" />
              <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                No agent directory required. Points at a local working directory — ideal for embedding in an existing codebase or CI pipeline.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Next steps */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-3 font-body">
            Next steps
          </h3>
          <div className="flex flex-wrap gap-2">
            {nextSteps.map((s) => (
              <a
                key={s.label}
                href={s.href}
                className="inline-flex items-center gap-1 text-xs text-primary border border-primary/30 rounded px-3 py-1.5 hover:bg-primary/5 transition-colors font-body"
              >
                {s.label} →
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
