import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is GitAgent?",
    answer:
      "GitAgent is an open standard for defining AI agents as files in a git repository. Instead of configuring agents in proprietary dashboards, you define identity (SOUL.md), skills (SKILL.md), config (agent.yaml), and more — all version-controlled, branchable, and exportable to any AI framework.",
  },
  {
    question: "What makes GitAgent a git-native AI agent framework?",
    answer:
      "GitAgent stores every aspect of an AI agent — identity, skills, tools, knowledge, memory, hooks, and compliance artifacts — as plain files in a git repository. This means you get version control, branching, pull requests, code review, CI/CD, and collaboration for free, using tools developers already know.",
  },
  {
    question: "How is GitAgent different from other AI agent frameworks?",
    answer:
      "Most agent frameworks lock you into a single runtime or vendor. GitAgent is framework-agnostic: define your agent once, then export to Claude Code, OpenAI Agents SDK, CrewAI, Lyzr, OpenClaw, Nanobot, or a raw system prompt. Your agent definition lives in git, not in a vendor's cloud.",
  },
  {
    question: "Is GitAgent an open standard?",
    answer:
      "Yes. GitAgent is MIT-licensed and developed in the open at github.com/open-gitagent/gitagent. The specification, CLI, adapters, and examples are all open source. Anyone can contribute, fork, or build on the standard.",
  },
  {
    question: "How do I create a git-native AI agent?",
    answer:
      'Install the CLI with "npm install -g gitagent", then run "gitagent init --template standard" to scaffold an agent repo. Edit agent.yaml, SOUL.md, and SKILL.md to define your agent. Validate with "gitagent validate", then run or export with "gitagent run" or "gitagent export".',
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="py-20 px-6 border-t border-border">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground font-body">
            Common questions about the GitAgent open AI agent standard.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-sm font-heading font-semibold text-foreground text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground leading-relaxed font-body">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
