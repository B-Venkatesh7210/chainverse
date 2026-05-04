"use client";

import React from "react";
import { X } from "lucide-react";
import {
  ButtonSize,
  ButtonVariant,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  IconButton,
} from "@tatum-io/tatum-design-system";

type ModalProps = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <Dialog open onOpenChange={(next) => !next && onClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-tatum-black/70 backdrop-blur-sm animate-fade-in" />
        <DialogContent
          aria-describedby={undefined}
          width="min(90vw, 56rem)"
          variant="modal"
          className="max-h-[90vh] overflow-hidden border border-tatum-gray-700 bg-tatum-secondary-950 p-0 text-tatum-gray-50 shadow-tatum-2xl [&>button:last-child]:hidden"
        >
          <DialogHeader className="shrink-0 border-b border-tatum-gray-700 px-tatum-2xl py-tatum-xl">
            <div className="flex items-start justify-between gap-tatum-lg">
              <div>
                {title && (
                  <DialogTitle className="text-tatum-text-md font-tatum-semibold text-tatum-gray-50">
                    {title}
                  </DialogTitle>
                )}
                <p className="mt-tatum-xs text-tatum-text-xs font-tatum-medium uppercase tracking-[0.18em] text-tatum-gray-400">
                  Powered by Tatum
                </p>
              </div>
              {/*
                Do not use DialogClose asChild here: TDS DialogClose always injects two
                children (icon + sr-only), which breaks Radix Slot (Children.only).
                DialogContent already renders a default close control; this duplicates
                the action for a header-aligned dismiss control.
              */}
              <IconButton
                type="button"
                variant={ButtonVariant.Flat}
                size={ButtonSize.Small}
                aria-label="Close modal"
                className="text-tatum-gray-400 hover:text-tatum-gray-100"
                onClick={onClose}
              >
                <X size={16} strokeWidth={2} />
              </IconButton>
            </div>
          </DialogHeader>
          <DialogBody className="max-h-[calc(90vh-5rem)] overflow-y-auto px-tatum-2xl py-tatum-xl text-tatum-text-sm text-tatum-gray-200">
            {children}
          </DialogBody>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
