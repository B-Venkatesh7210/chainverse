import React from "react";

export function ConsolePanel() {
  return (
    <div className="flex h-full min-h-[60vh] flex-col rounded-xl border border-zinc-800 bg-black/80 p-3 shadow-lg">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
          Live Console
        </h2>
        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
          <span>Idle</span>
        </div>
      </div>
      <div className="mt-2 flex-1 space-y-1 overflow-hidden rounded-lg bg-zinc-950 p-2 text-[11px] font-mono text-zinc-400">
        <p className="text-zinc-600">
          # Console output will appear here once actions are wired to Tatum.
        </p>
        <p className="text-sky-400">
          &gt;&gt; Waiting for level selection…
        </p>
        <p className="text-zinc-600">
          # For now this is just a styled placeholder log stream.
        </p>
      </div>
    </div>
  );
}

