"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, ProgressBar, ProgressBarLabelType } from "@tatum-io/tatum-design-system";
import { LevelCard } from "./LevelCard";
import { levels } from "@/lib/levels";
import { useGameStore } from "@/store/gameStore";
import { TutorialPanel } from "./TutorialPanel";

export function GameEngine() {
  const completedLevels = useGameStore((state) => state.completedLevels);
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
    <div className="min-h-screen bg-transparent text-tatum-gray-50 flex flex-col">
      <header className="border-b border-tatum-gray-700 bg-tatum-secondary-900/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-tatum-lg px-tatum-2xl py-tatum-xl">
          <div className="w-full">
            <div className="mb-tatum-xs flex items-center justify-between text-tatum-text-xs font-tatum-medium uppercase tracking-[0.18em] text-tatum-gray-400">
              <span>Fixing BlockVille with Tatum...</span>
              <span>{progressPercent}%</span>
            </div>
            {/*
              TDS applies `className` to the outer flex wrapper only; the Radix track stays `h-tatum-md` (~8px),
              which makes the fill look like a thin line. Taller track + explicit indicator height via wrapper + merge.
            */}
            <div className="w-full [&_[role=progressbar]]:!h-4 [&_[role=progressbar]]:min-h-[1rem] [&_[role=progressbar]]:!bg-tatum-secondary-600">
              <ProgressBar
                value={progressPercent}
                max={100}
                labelType={ProgressBarLabelType.None}
                indicatorClassName="!top-0 !h-full min-h-[1rem] w-full rounded-full  transition-transform duration-300 ease-out"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-tatum-2xl">
              <Link
                href="https://docs.tatum.io/"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
                aria-label="Open Tatum documentation in a new tab"
              >
                <Image
                  src="/images/logo.png"
                  alt="Tatum logo"
                  width={72}
                  height={32}
                  className="h-6 w-auto object-contain"
                  priority
                />
              </Link>
              <div>
                <p className="text-tatum-text-sm font-tatum-medium uppercase tracking-[0.2em] text-tatum-gray-200">
                  BlockVille
                </p>
                <p className="text-tatum-text-xs text-tatum-gray-500">
                  Powered by Tatum
                </p>
              </div>
            </div>
            <div className="flex items-center gap-tatum-md text-tatum-text-xs text-tatum-gray-500">
              <span className="h-2 w-2 rounded-full bg-tatum-secondary-500 shadow-[0_0_12px_rgba(79,55,253,0.6)]" />
              <span>Network: Ethereum Sepolia</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 px-tatum-lg py-tatum-xl md:px-tatum-2xl">
        {mode === "tutorial" ? (
          <TutorialPanel level={currentTutorialLevel} />
        ) : (
          <Card
            as="section"
            className="flex min-h-[60vh] flex-1 flex-col gap-0 border-tatum-gray-700 bg-tatum-secondary-950/95 p-0 shadow-tatum-lg"
          >
            <div className="border-b border-tatum-gray-700 px-tatum-lg py-tatum-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-tatum-text-xs font-tatum-semibold uppercase tracking-[0.2em] text-tatum-gray-300">
                  Freeplay Chapters
                </h2>
                <p className="text-tatum-text-xs text-tatum-gray-500">
                  Villager is now your companion while you test each chapter.
                </p>
              </div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-tatum-md p-tatum-lg sm:grid-cols-2 lg:grid-cols-3">
              {levels.map((level) => (
                <LevelCard key={level.id} level={level} />
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
