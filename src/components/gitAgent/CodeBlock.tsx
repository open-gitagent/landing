import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { track } from "@/lib/analytics";

interface CodeBlockProps {
  code: string;
  filename?: string;
  trackEvent?: string;
  codeClassName?: string;
  className?: string;
}

export function CodeBlock({
  code,
  filename,
  trackEvent,
  codeClassName,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    if (trackEvent) track(trackEvent);
  };

  return (
    <div className={`code-block sketch-border overflow-x-auto ${className ?? ""}`}>
      <div className="terminal-header">
        <span className="terminal-dot bg-primary/30" />
        <span className="terminal-dot bg-primary/20" />
        <span className="terminal-dot bg-primary/10" />
        {filename && (
          <span className="ml-3 text-xs text-muted-foreground font-body flex-1">{filename}</span>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto text-muted-foreground/50 hover:text-foreground transition-colors shrink-0"
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-primary" />
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
      <pre
        className={
          codeClassName ??
          "text-[11px] sm:text-xs text-muted-foreground leading-5 font-body whitespace-pre-wrap"
        }
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
