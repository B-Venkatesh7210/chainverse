"use client";

import React from "react";
import { useGameStore } from "@/store/gameStore";

export function ConsolePanel() {
  const logs = useGameStore((state) => state.logs);

  return (
    <div className="flex h-full min-h-[60vh] flex-col rounded-xl border border-indigo-300/25 bg-[#0a112b]/85 p-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-indigo-300/20 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200/70">
          Live Console
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-indigo-100/55">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2D7CFF] shadow-[0_0_8px_rgba(45,124,255,0.9)]" />
          <span>{logs.length > 1 ? "Active" : "Idle"}</span>
        </div>
      </div>
      <div className="mt-2 flex-1 space-y-1 overflow-y-auto rounded-lg bg-[#060c20] p-2 text-[11px] font-mono text-indigo-100/70">
        {logs.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={
              line.toLowerCase().includes("failed")
                ? "text-rose-300"
                : "text-indigo-100/85"
            }
          >
            {">>"} {line}
          </p>
        ))}
      </div>
    </div>
  );
}

