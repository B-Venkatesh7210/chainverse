"use client";

import React from "react";
import { useGameStore } from "@/store/gameStore";

export function ConsolePanel() {
  const logs = useGameStore((state) => state.logs);

  return (
    <div className="flex h-full min-h-[60vh] flex-col rounded-xl border border-zinc-800 bg-black/80 p-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Live Console
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
          <span>{logs.length > 1 ? "Active" : "Idle"}</span>
        </div>
      </div>
      <div className="mt-2 flex-1 space-y-1 overflow-y-auto rounded-lg bg-zinc-950 p-2 text-[11px] font-mono text-zinc-400">
        {logs.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={line.toLowerCase().includes("failed") ? "text-rose-400" : "text-zinc-300"}
          >
            {">>"} {line}
          </p>
        ))}
      </div>
    </div>
  );
}

