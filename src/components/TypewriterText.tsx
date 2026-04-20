"use client";

import React from "react";

type TypewriterTextProps = {
  text: string;
  speedMs?: number;
  playKey?: number;
};

export function TypewriterText({
  text,
  speedMs = 22,
  playKey = 0,
}: TypewriterTextProps) {
  const [visible, setVisible] = React.useState("");

  React.useEffect(() => {
    setVisible("");
    if (!text) return;
    let i = 0;
    const timer = window.setInterval(() => {
      i += 1;
      setVisible(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(timer);
      }
    }, speedMs);
    return () => window.clearInterval(timer);
  }, [text, speedMs, playKey]);

  const shouldLinkTatumInThisLine =
    text === "You can. With Tatum tools, chapter by chapter, we rebuild what was lost.";

  const parts = shouldLinkTatumInThisLine ? visible.split(/(Tatum)/g) : [visible];

  return (
    <span>
      {parts.map((part, index) =>
        part === "Tatum" && shouldLinkTatumInThisLine ? (
          <a
            key={`tatum-${index}`}
            href="https://docs.tatum.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-300 underline decoration-sky-400/60 underline-offset-2 hover:text-sky-200"
          >
            {part}
          </a>
        ) : (
          <React.Fragment key={`text-${index}`}>{part}</React.Fragment>
        )
      )}
    </span>
  );
}

