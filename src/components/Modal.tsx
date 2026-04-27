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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm animate-fade-in">
      <div className="flex max-h-[90vh] w-full max-w-[80vw] flex-col overflow-hidden rounded-2xl border border-indigo-300/30 bg-gradient-to-b from-[#0c1434]/95 to-[#090f25]/95 shadow-2xl animate-scale-in">
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-indigo-300/20 px-5 py-4">
          <div>
            {title && (
              <h3 className="text-sm font-semibold tracking-wide text-indigo-50">
                {title}
              </h3>
            )}
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-indigo-300">
              Powered by Tatum
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-indigo-300/30 bg-indigo-500/10 text-indigo-100/70 transition hover:border-indigo-200/70 hover:text-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            aria-label="Close modal"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="min-w-0 flex-1 overflow-y-auto px-5 py-4 text-sm text-indigo-50/90">
          {children}
        </div>
      </div>
    </div>
  );
}

