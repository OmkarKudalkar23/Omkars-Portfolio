import { Fragment } from "react";

/**
 * Minimal, safe markdown renderer for short assistant messages.
 * Supports **bold**, [text](url) links, and line breaks. No raw HTML.
 */
function renderInline(text: string, keyPrefix: string) {
  const nodes: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${i}`} className="font-medium text-text-primary">
          {m[1]}
        </strong>,
      );
    } else if (m[2] && m[3]) {
      nodes.push(
        <a
          key={`${keyPrefix}-a-${i}`}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-blue underline-offset-2 hover:underline"
        >
          {m[2]}
        </a>,
      );
    }
    last = regex.lastIndex;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function Markdown({ text, className }: { text: string; className?: string }) {
  const lines = text.split("\n");
  return (
    <span className={className}>
      {lines.map((line, idx) => (
        <Fragment key={idx}>
          {renderInline(line, `l${idx}`)}
          {idx < lines.length - 1 && <br />}
        </Fragment>
      ))}
    </span>
  );
}
