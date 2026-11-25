import React from "react";

// Lightweight inline emphasis for editable copy, so gold/bright accents survive
// the move into src/content/*.json and stay editable in the CMS.
//
//   **word**  -> gold accent   (the brand highlight, e.g. "South Florida")
//   *word*    -> bright/foreground emphasis
//
// Anything without markers renders as plain text. Laura only needs to remember
// the gold one: wrap a word in double asterisks.
export function renderRichText(text: string): React.ReactNode {
  // A line break typed in the editor shows as a line break on the page.
  if (text.includes("\n")) {
    const lines = text.split(/\n/);
    return lines.map((line, i) => (
      <React.Fragment key={`l${i}`}>
        {renderRichText(line)}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));
  }
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(
        <span key={key++} className="text-gold">
          {match[1]}
        </span>
      );
    } else {
      nodes.push(
        <span key={key++} className="text-foreground">
          {match[2]}
        </span>
      );
    }
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
