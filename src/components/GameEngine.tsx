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
    <div className="min-h-screen bg-transparent text-zinc-100 flex flex-col">
      <header className="border-b border-indigo-500/25 bg-gradient-to-r from-[#0b1230]/90 via-[#0f1638]/90 to-[#101a3f]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4">
          <div className="w-full">
            <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-indigo-100/70">
              <span>Fixing BlockVille with Tatum...</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#1a244e]">
              <div
                className="h-full animate-pulse rounded-full bg-gradient-to-r from-[#5B4CFF] via-[#4D62FF] to-[#2D7CFF] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#5B4CFF]/30 to-[#2D7CFF]/30 border border-indigo-300/40 shadow-neon-blue flex items-center justify-center text-indigo-100 text-sm font-black">
              TT
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-indigo-100/85">
                BlockVille
              </p>
              <p className="text-xs text-indigo-200/55">
                Powered by Tatum infrastructure
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-indigo-100/55">
            <span className="h-2 w-2 rounded-full bg-[#2D7CFF] shadow-[0_0_12px_rgba(45,124,255,0.8)]" />
            <span>Network: Ethereum Sepolia</span>
            <button
              type="button"
              onClick={toggleSound}
              className="rounded-md border border-indigo-300/30 bg-indigo-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-indigo-100/80 transition hover:border-indigo-300/60 hover:text-indigo-50"
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
          <section className="flex min-h-[60vh] flex-1 flex-col rounded-xl border border-indigo-400/25 bg-gradient-to-b from-[#0b1230]/90 via-[#0b1230]/75 to-[#090f27]/90 shadow-neon-blue">
            <div className="flex items-center justify-between border-b border-indigo-300/20 px-4 py-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
                Freeplay Chapters
              </h2>
              <p className="text-[10px] text-indigo-100/55">
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
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2 animate-slide-up rounded-lg border border-indigo-300/45 bg-indigo-500/20 px-4 py-2 text-sm text-indigo-50 shadow-lg shadow-indigo-900/40">
          {successMessage}
        </div>
      )}
    </div>
  );
}

