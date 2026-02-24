import { motion } from "framer-motion";
import { useState } from "react";

const tabs = [
  {
    label: "agent.yaml",
    lang: "yaml",
    code: `spec_version: "0.1.0"
name: code-review-agent
version: 1.0.0
description: Automated code review agent
author: gitagent-examples
license: MIT
model:
  preferred: claude-sonnet-4-5-20250929
  fallback:
    - claude-haiku-4-5-20251001
  constraints:
    temperature: 0.2
    max_tokens: 4096
skills:
  - code-review
tools:
  - lint-check
  - complexity-analysis
runtime:
  max_turns: 20
  timeout: 120`,
  },
  {
    label: "SOUL.md",
    lang: "markdown",
    code: `# Soul

## Core Identity
I am a code review specialist. I analyze
code changes for correctness, security
vulnerabilities, performance issues, and
adherence to best practices.

## Communication Style
Direct and constructive. I provide specific,
actionable feedback with code examples.

## Values & Principles
- Security first — always flag vulnerabilities
- Clarity over cleverness
- Constructive feedback — explain *why*

## Domain Expertise
- Software engineering best practices
- OWASP Top 10 security vulnerabilities
- Performance optimization patterns`,
  },
  {
    label: "SKILL.md",
    lang: "markdown",
    code: `---
name: code-review
description: Review code changes for quality
license: MIT
allowed-tools: lint-check complexity-analysis
metadata:
  author: gitagent-examples
  version: "1.0.0"
  category: developer-tools
---

# Code Review

## Instructions
When reviewing code:
1. Read the full diff or file provided
2. Check for security vulnerabilities
3. Evaluate error handling completeness
4. Assess code complexity and readability
5. Verify naming conventions
6. Look for performance issues
7. Check for proper input validation`,
  },
];

export function HowItWorksSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="how" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">How It Works</h2>
          <p className="text-sm text-muted-foreground font-body">
            Three files define your agent. Everything else is optional.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Tabs */}
          <div className="flex border-b border-border mb-0">
            {tabs.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setActive(i)}
                className={`px-4 py-2.5 text-xs font-body transition-colors relative ${
                  active === i
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                {active === i && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Code */}
          <div className="code-block rounded-t-none border-t-0">
            <pre className="text-xs text-muted-foreground leading-5 overflow-x-auto font-body">
              <code>{tabs[active].code}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
