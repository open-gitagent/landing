import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { CodeBlock } from "@/components/gitAgent/CodeBlock";

export function PartHeader({ num, label, title, subtitle }: { num: string; label: string; title: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 pt-6 border-t border-border first:border-t-0 first:pt-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] uppercase tracking-widest text-primary/70 font-body font-semibold">Part {num}</span>
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40 font-body">{label}</span>
      </div>
      <h2 className="text-xl font-bold text-foreground font-heading mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-2xl">{subtitle}</p>
    </motion.div>
  );
}

export function CollapsibleCode({ filename, caption, code, reveal = false }: { filename: string; caption?: string; code: string; reveal?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-2 paper-card px-3 py-2.5 text-left hover:bg-accent/20 transition-colors"
        aria-expanded={open}
      >
        <span className="min-w-0 truncate">
          <code className="text-[11px] text-primary font-body">{filename}</code>
          {caption && <span className="text-[11px] text-muted-foreground/60 font-body"> — {caption}</span>}
        </span>
        <span className="flex items-center gap-2 shrink-0">
          {!open && (
            <span className="text-[10px] text-muted-foreground/40 font-body uppercase tracking-widest">{reveal ? "Reveal" : "View"}</span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground/50 transition-transform ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <CodeBlock code={code} filename={filename} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
