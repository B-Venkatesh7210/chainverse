"use client";

import React from "react";
import { LevelCard } from "./LevelCard";
import { levels } from "@/lib/levels";
import { useGameStore } from "@/store/gameStore";
import { TutorialPanel } from "./TutorialPanel";

export function GameEngine() {
  const completedLevels = useGameStore((state) => state.completedLevels);
  const successMessage = useGameStore((state) => state.successMessage);
  const soundEnabled = useGameStore((state) => state.soundEnabled);
  const toggleSound = useGameStore((state) => state.toggleSound);
  const mode = useGameStore((state) => state.mode);
  const tutorialLevelIdx = useGameStore((state) => state.tutorialLevelIdx);
  const hydrateTutorialState = useGameStore((state) => state.hydrateTutorialState);

  React.useEffect(() => {
    hydrateTutorialState();
  }, [hydrateTutorialState]);

  const progressPercent = Math.round(
    (completedLevels.length / levels.length) * 100
  );
  const currentTutorialLevel = levels[tutorialLevelIdx] ?? levels[0];

  return (
    <div className="min-h-screen bg-game-bg text-zinc-100 flex flex-col">
      <header className="border-b border-zinc-800 bg-gradient-to-r from-sky-500/10 via-purple-500/10 to-fuchsia-500/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
          <div className="w-full">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-zinc-400">
              <span>Fixing ChainVerse...</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full animate-pulse rounded-full bg-gradient-to-r from-emerald-400 to-sky-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
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
            <button
              type="button"
              onClick={toggleSound}
              className="rounded-md border border-zinc-700 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-zinc-300 transition hover:border-sky-500 hover:text-sky-300"
            >
              Sound {soundEnabled ? "On" : "Off"}
            </button>
          </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-4 py-6 md:px-6">
        {mode === "tutorial" ? (
          <TutorialPanel level={currentTutorialLevel} />
        ) : (
          <section className="flex min-h-[60vh] flex-1 flex-col rounded-xl border border-sky-900/70 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950 shadow-neon-blue">
            <div className="flex items-center justify-between border-b border-sky-900/60 px-4 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300">
                Freeplay Chapters
              </h2>
              <p className="text-[10px] text-zinc-500">
                Villager is now your companion while you test each chapter.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
              {levels.map((level) => (
                <LevelCard key={level.id} level={level} />
              ))}
            </div>
          </section>
        )}
      </main>
      {successMessage && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-slide-up rounded-lg border border-emerald-500/40 bg-emerald-500/15 px-4 py-2 text-sm text-emerald-100 shadow-lg shadow-emerald-900/40">
          {successMessage}
        </div>
      )}
    </div>
  );
}

