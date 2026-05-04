"use client";

import { Card } from "@tatum-io/tatum-design-system";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type CodeSnippetProps = {
  code: string;
  /** Prism language id; default typescript */
  language?: string;
  className?: string;
};

/**
 * Editor-style syntax highlighting for level snippets and docs.
 * Wrapped in TDS {@link Card} for consistent elevation and borders.
 */
export function CodeSnippet({
  code,
  language = "typescript",
  className = "",
}: CodeSnippetProps) {
  return (
    <Card
      as="div"
      className={`min-w-0 gap-0 overflow-hidden border-tatum-gray-700 bg-tatum-secondary-900 p-0 shadow-none ${className}`}
    >
      <div className="min-w-0 overflow-x-auto">
        <SyntaxHighlighter
          language={language}
          style={coldarkDark}
          showLineNumbers
          PreTag="div"
          customStyle={{
            margin: 0,
            padding: "12px 14px",
            fontSize: "13px",
            lineHeight: 1.6,
            background: "transparent",
            borderRadius: 0,
            overflow: "visible",
            whiteSpace: "pre",
          }}
          lineNumberStyle={{
            minWidth: "2.5em",
            paddingRight: "1em",
            color: "rgb(110 110 120)",
            userSelect: "none",
            textAlign: "right",
          }}
          codeTagProps={{
            style: {
              fontFamily:
                "var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              whiteSpace: "pre",
              wordBreak: "keep-all",
            },
          }}
        >
          {code.trimEnd()}
        </SyntaxHighlighter>
      </div>
    </Card>
  );
}
