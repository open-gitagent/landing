import { motion } from "framer-motion";
import { ArrowDown, Folder, FileText } from "lucide-react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

const skillMdExample = `---
name: code-review
description: Review code for bugs, style, and security issues
---

# Code Review

## Instructions

1. Read the specified file(s) using the read tool
2. Analyze for:
   - Bugs and logic errors
   - Security vulnerabilities (OWASP top 10)
   - Code style and readability
   - Performance issues
3. Write a review report to workspace/review.md

## Output Format

For each issue found:
- **File**: path
- **Line**: number
- **Severity**: critical / warning / info
- **Description**: what's wrong
- **Fix**: suggested change`;

const invokeExample = `# In REPL
/skill:code-review Review the auth module

# In voice/text
"Use the code-review skill on src/auth.ts"

# Via SDK
query({ prompt: "/skill:code-review Review src/auth.ts", dir: "./my-agent" })`;

const learningSteps = [
  {
    num: "01",
    title: "Task begins",
    desc: "task_tracker begins tracking a task",
  },
  {
    num: "02",
    title: "Task completes",
    desc: "Agent completes the task successfully",
  },
  {
    num: "03",
    title: "Evaluation",
    desc: "skill_learner evaluates if the approach is worth saving",
  },
  {
    num: "04",
    title: "Crystallization",
    desc: "If the task passes worthiness checks, crystallizes it as a new skill",
  },
  {
    num: "05",
    title: "Reuse",
    desc: "Future tasks search for matching skills",
  },
  {
    num: "06",
    title: "Feedback loop",
    desc: "Confidence adjusts based on success/failure outcomes",
  },
];

export function GitAgentSkills() {
  return (
    <section id="skills" className="py-16 px-0 border-t border-border">
      <div className="mx-auto max-w-6xl px-6">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2 font-heading">
            Skills
          </h2>
          <p className="text-sm text-muted-foreground font-body mb-2">
            Skills are reusable task modules defined in Markdown with YAML frontmatter. The agent
            learns new skills automatically and crystallizes effective patterns.
          </p>
        </motion.div>

        {/* A. SKILL.md format */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            SKILL.md Format
          </h3>
          <CodeBlock code={skillMdExample} filename="skills/code-review/SKILL.md" />
          <p className="text-[11px] text-muted-foreground font-body mt-3 mb-2">Auto-generated fields added by the skill learner:</p>
          <CodeBlock
            code={`confidence: 1.0\nlearned_from: "task:<task-id>"\nlearned_at: "<ISO timestamp>"\nusage_count: 0\nsuccess_count: 0\nfailure_count: 0\nnegative_examples: []`}
            filename="auto-generated frontmatter"
          />
        </motion.div>

        {/* B. Invoking Skills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Invoking Skills
          </h3>
          <CodeBlock code={invokeExample} filename="bash" />
        </motion.div>

        {/* C. Skill Learning Workflow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Skill Learning Workflow
          </h3>
          <div className="max-w-lg">
            {learningSteps.map((step, i) => (
              <div key={step.num}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="paper-card p-4 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-start gap-3 relative z-10">
                    <span className="text-[10px] font-semibold text-primary font-body shrink-0 mt-0.5 w-6">
                      {step.num}
                    </span>
                    <div>
                      <p className="text-xs font-semibold text-foreground font-body mb-0.5">
                        {step.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground font-body leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
                {i < learningSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-3.5 h-3.5 text-muted-foreground/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* D. Skill Directory Structure */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground/60 mb-4 font-body">
            Skill Directory Structure
          </h3>
          <div className="paper-card p-4 max-w-xs hover:border-primary/40 transition-colors">
            <div className="relative z-10 space-y-1.5">
              {[
                { indent: 0, icon: Folder, name: "skills/", type: "dir" },
                { indent: 1, icon: Folder, name: "code-review/", type: "dir" },
                { indent: 2, icon: FileText, name: "SKILL.md", type: "file", note: "skill instructions + frontmatter" },
                { indent: 2, icon: Folder, name: "scripts/", type: "dir" },
                { indent: 3, icon: FileText, name: "lint.sh", type: "file", note: "helper scripts" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={`${item.indent}-${item.name}`}
                    className="flex items-center gap-2 font-body"
                    style={{ paddingLeft: `${item.indent * 16}px` }}
                  >
                    <Icon
                      className={`w-3 h-3 shrink-0 ${
                        item.type === "dir" ? "text-primary/70" : "text-muted-foreground/60"
                      }`}
                    />
                    <code className="text-[11px] text-foreground/80 font-body">{item.name}</code>
                    {item.note && (
                      <span className="text-[10px] text-muted-foreground/50 font-body">
                        ← {item.note}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
