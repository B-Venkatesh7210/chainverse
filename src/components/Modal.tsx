import React from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-[80vw] flex-col overflow-hidden rounded-2xl border border-sky-900/70 bg-slate-950/95 shadow-2xl animate-scale-in">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold tracking-wide text-zinc-100">
                {title}
              </h3>
            )}
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-sky-500">
              ChainVerse
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 bg-slate-900 text-zinc-400 transition hover:border-zinc-500 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
            aria-label="Close modal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto px-5 py-4 text-sm text-zinc-200">
          {children}
        </div>
      </div>
    </div>
  );
}

