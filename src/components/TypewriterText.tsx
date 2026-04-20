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

  return <span>{visible}</span>;
}

