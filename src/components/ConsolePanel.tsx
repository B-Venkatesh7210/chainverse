"use client";

import React from "react";
import { Card } from "@tatum-io/tatum-design-system";
import { useGameStore } from "@/store/gameStore";

export function ConsolePanel() {
  const logs = useGameStore((state) => state.logs);

  return (
    <Card
      as="div"
      className="flex h-full min-h-[60vh] flex-col gap-0 border-tatum-gray-700 bg-tatum-secondary-950/90 p-tatum-lg shadow-tatum-lg"
    >
      <div className="flex items-center justify-between border-b border-tatum-gray-700 pb-tatum-md">
        <h2 className="text-tatum-text-xs font-tatum-semibold uppercase tracking-[0.2em] text-tatum-gray-400">
          Live Console
        </h2>
        <div className="flex items-center gap-tatum-md text-tatum-text-xs text-tatum-gray-500">
          <span className="h-1.5 w-1.5 rounded-full bg-tatum-secondary-500 shadow-[0_0_8px_rgba(79,55,253,0.7)]" />
          <span>{logs.length > 1 ? "Active" : "Idle"}</span>
        </div>
      </div>
      <div className="mt-tatum-md flex-1 space-y-tatum-xs overflow-y-auto rounded-tatum-lg bg-tatum-secondary-900 p-tatum-md font-mono text-tatum-text-xs text-tatum-gray-300">
        {logs.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={
              line.toLowerCase().includes("failed")
                ? "text-tatum-error-400"
                : "text-tatum-gray-200"
            }
          >
            {">>"} {line}
          </p>
        ))}
      </div>
    </Card>
  );
}
