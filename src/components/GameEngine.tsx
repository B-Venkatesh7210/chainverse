"use client";

import React from "react";
import { LevelCard } from "./LevelCard";
import { ConsolePanel } from "./ConsolePanel";
import { levels } from "@/lib/levels";

export function GameEngine() {
  return (
    <div className="min-h-screen bg-game-bg text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-fuchsia-500/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-sky-500/20 border border-sky-400/40 shadow-neon-blue flex items-center justify-center text-sky-300 text-xl font-black">
              CV
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-400">
                ChainVerse
              </p>
              <p className="text-xs text-zinc-500">
                Interactive blockchain ops using Tatum
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-zinc-500">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.75)]" />
            <span>Network: Sandbox</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 gap-4 px-4 py-6 md:px-6">
        {/* Story panel */}
        <section className="hidden w-full max-w-sm flex-col rounded-xl border border-zinc-800 bg-game-panelSoft/60 p-4 shadow-xl backdrop-blur md:flex">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Mission Log
          </h2>
          <div className="flex-1 space-y-3 text-sm text-zinc-300">
            <p className="text-sky-300">
              You are the operator of an interchain command console.
            </p>
            <p>
              Each level on the central grid represents a blockchain action
              powered by <span className="text-sky-300">Tatum</span>.
            </p>
            <p>
              Progress through the ChainVerse, execute operations, and watch the
              live console on the right to see how the chain reacts.
            </p>
            <p className="text-zinc-400">
              For now this is a visual mock. Actual blockchain calls will be
              wired in later.
            </p>
          </div>
        </section>

        {/* Levels grid */}
        <section className="flex min-h-[60vh] flex-1 flex-col rounded-xl border border-sky-900/70 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 shadow-neon-blue">
          <div className="flex items-center justify-between border-b border-sky-900/60 px-4 py-3">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
              Levels
            </h2>
            <p className="text-[10px] text-zinc-500">
              Click a level to simulate a Tatum action
            </p>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
            {levels.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                levelLabel={`Level ${level.id}`}
              />
            ))}
          </div>
        </section>

        {/* Console panel */}
        <section className="hidden w-full max-w-sm md:block">
          <ConsolePanel />
        </section>
      </main>
    </div>
  );
}

