import React from "react";
import { Play } from "lucide-react";
import { Modal } from "./Modal";

type LevelCardProps = {
  title: string;
  subtitle: string;
};

export function LevelCard({ title, subtitle }: LevelCardProps) {
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
              {title}
            </p>
            <p className="mt-1 text-sm text-zinc-200">{subtitle}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/60 bg-sky-500/20 text-sky-300 transition group-hover:shadow-neon-blue">
            <Play className="h-4 w-4 fill-sky-400/40" />
          </div>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          Placeholder only. Logic will be connected to Tatum later.
        </p>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${title} – Coming soon`}
      >
        <p className="text-sm text-zinc-300">
          This level will trigger a blockchain action via{" "}
          <span className="text-sky-300">Tatum</span>.
        </p>
        <p className="mt-2 text-xs text-zinc-500">
          For now, this is just a visual shell so you can design the flow and
          interactions.
        </p>
      </Modal>
    </>
  );
}

