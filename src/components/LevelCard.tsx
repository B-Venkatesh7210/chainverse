import React from "react";
import { Play } from "lucide-react";
import { Modal } from "./Modal";
import type { Level } from "@/lib/levels";

type LevelCardProps = {
  level: Level;
  levelLabel: string;
};

export function LevelCard({ level, levelLabel }: LevelCardProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col justify-between rounded-xl border border-sky-900/60 bg-slate-950/80 px-4 py-3 text-left shadow transition hover:border-sky-400/70 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              {levelLabel}
            </p>
            <p className="mt-1 text-sm text-zinc-200">{level.title}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/60 bg-sky-500/20 text-sky-300 transition group-hover:shadow-neon-blue">
            <Play className="h-4 w-4 fill-sky-400/40" />
          </div>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          {level.description}
        </p>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${levelLabel}: ${level.title}`}
      >
        <p className="text-sm text-zinc-300">{level.description}</p>
        <div className="mt-4 rounded-lg border border-zinc-800 bg-black/60 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Code Snippet
          </p>
          <pre className="overflow-x-auto text-xs text-sky-300">
            <code>{level.codeSnippet}</code>
          </pre>
        </div>
        <button
          type="button"
          onClick={() => {
            void level.action();
          }}
          className="mt-4 inline-flex items-center justify-center rounded-md border border-sky-500/60 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          Let&apos;s Test It
        </button>
      </Modal>
    </>
  );
}

