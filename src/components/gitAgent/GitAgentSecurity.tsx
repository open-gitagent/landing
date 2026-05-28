import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const passwordBashCode = `# Basic auth
GITAGENT_PASSWORD=mysecret gitagent --voice --dir ~/assistant

# With custom username (defaults to "admin")
GITAGENT_USERNAME=alice GITAGENT_PASSWORD=mysecret gitagent --voice --dir ~/assistant`;

const sandboxCode = `# Run agent in an E2B cloud sandbox
gitagent --sandbox --dir ~/assistant

# Clone a remote repo into the sandbox
gitagent --sandbox --sandbox-repo https://github.com/user/repo --dir ~/assistant`;

const passwordFeatures = [
  "All HTTP routes show a login page instead of the UI",
  "WebSocket connections are rejected without valid auth cookie",
  "/health endpoint remains open (for load balancers)",
  "Cookie: HttpOnly, SameSite=Strict, 24-hour expiry",
  "Token is SHA-256 hash (password never stored in cookie)",
  "GITAGENT_USERNAME sets the login username (defaults to \"admin\")",
];

const bestPractices = [
  { title: "Use HTTPS in production", desc: "Via nginx, Caddy, or Cloudflare Tunnel" },
  { title: "Set GITAGENT_PASSWORD", desc: "When exposing to a network" },
  { title: "Use --sandbox for untrusted code", desc: "Runs the agent in an isolated E2B cloud VM" },
  { title: "Enable audit logging", desc: "For compliance and incident review" },
];

const sandboxPoints = [
  {
    title: "Cloud VM isolation",
    desc: "Agent runs inside an E2B cloud sandbox — fully isolated from your local machine.",
  },
  {
    title: "Filesystem isolation",
    desc: "The sandbox has its own filesystem. Your host files are not accessible unless explicitly mounted.",
  },
  {
    title: "Remote repo support",
    desc: "Use --sandbox-repo to clone a repository directly into the sandbox environment.",
  },
  {
    title: "API token required",
    desc: "Set E2B_API_KEY in your environment — the E2B SDK reads it directly. --sandbox-token is a Git token for cloning the repository (falls back to GITHUB_TOKEN / GIT_TOKEN).",
  },
];

export function GitAgentSecurity() {
  return (
    <section id="security" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">Security</h2>
          <p className="text-sm text-muted-foreground font-body">
            Password protection, best practices, and cloud sandboxing via E2B.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* A. Password Protection */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Password Protection
            </h3>
            <CodeBlock code={passwordBashCode} filename="terminal" className="mb-4" />
            <div className="space-y-1.5">
              {passwordFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-primary text-xs mt-0.5 shrink-0">—</span>
                  <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{f}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* B. Best Practices */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.04 }}
          >
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
              Best Practices
            </h3>
            <div className="space-y-2">
              {bestPractices.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-3 hover:border-primary/40 transition-colors"
                >
                  <div className="relative z-10">
                    <p className="text-xs font-semibold text-foreground font-body mb-0.5">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{p.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* C. E2B Sandboxing */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-primary/20 rounded-lg p-6 bg-primary/5"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <h3 className="text-base font-semibold text-foreground font-heading">E2B Cloud Sandbox</h3>
          </div>
          <p className="text-xs text-muted-foreground font-body mb-6">
            Run the agent in an isolated E2B cloud VM via the <code className="text-primary">--sandbox</code> flag
          </p>

          <div className="space-y-2 mb-8">
            {sandboxPoints.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="paper-card p-3 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3 relative z-10">
                  <span className="text-primary text-xs font-semibold font-body shrink-0 w-4 mt-0.5">{i + 1}.</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground font-body mb-0.5">{p.title}</p>
                    <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <h4 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Quick Start
          </h4>
          <CodeBlock code={sandboxCode} filename="terminal" />
        </motion.div>
      </div>
    </section>
  );
}
