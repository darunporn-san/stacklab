import { CopyButton } from "./CopyButton";

interface CodeBlockProps {
  code: string;
  label?: string;
  className?: string;
}

export function CodeBlock({ code, label, className = "" }: CodeBlockProps) {
  return (
    <div className={`rounded-lg border border-border bg-code ${className}`}>
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <CopyButton text={code} />
        </div>
      )}
      <pre className="overflow-auto p-4 font-mono text-sm text-code-foreground whitespace-pre-wrap break-all">
        {code}
      </pre>
      {!label && (
        <div className="flex justify-end border-t border-border px-4 py-2">
          <CopyButton text={code} />
        </div>
      )}
    </div>
  );
}
