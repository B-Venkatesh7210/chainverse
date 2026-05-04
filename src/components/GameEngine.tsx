"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Alert,
  AlertType,
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
  Field,
  Input,
  Label,
  ProgressBar,
  ProgressBarLabelType,
} from "@tatum-io/tatum-design-system";
import { LevelCard } from "./LevelCard";
import { levels, materializeCustomLevel } from "@/lib/levels";
import { TDS_GAME_INPUT_CLASSNAME } from "@/lib/tdsInputStyles";
import { useGameStore } from "@/store/gameStore";
import { TutorialPanel } from "./TutorialPanel";

export function GameEngine() {
  const [prompt, setPrompt] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationError, setGenerationError] = React.useState<string | null>(null);
  const completedLevels = useGameStore((state) => state.completedLevels);
  const mode = useGameStore((state) => state.mode);
  const tutorialLevelIdx = useGameStore((state) => state.tutorialLevelIdx);
  const hydrateTutorialState = useGameStore((state) => state.hydrateTutorialState);
  const customLevels = useGameStore((state) => state.customLevels);
  const addCustomLevel = useGameStore((state) => state.addCustomLevel);

  React.useEffect(() => {
    hydrateTutorialState();
  }, [hydrateTutorialState]);

  const progressPercent = Math.round(
    (completedLevels.length / levels.length) * 100
  );
  const currentTutorialLevel = levels[tutorialLevelIdx] ?? levels[0];
  const freeplayLevels = React.useMemo(
    () => [...levels, ...customLevels.map(materializeCustomLevel)],
    [customLevels]
  );

  const handleGenerateLevel = async () => {
    const userPrompt = prompt.trim();
    if (userPrompt.length < 8) {
      setGenerationError("Write at least 8 characters to generate a custom level.");
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const response = await fetch("/api/levels/generate-custom-level", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userPrompt }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate custom level.");
      }
      const generatedLevel = await response.json();
      addCustomLevel(generatedLevel);
      setPrompt("");
    } catch (error) {
      setGenerationError(error instanceof Error ? error.message : "Generation failed.");
    } finally {
      setIsGenerating(false);
    }
  };

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
              <Card
                as="div"
                className="mt-tatum-lg border-tatum-gray-700 bg-tatum-secondary-900/80 p-tatum-lg shadow-none"
              >
                <p className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.16em] text-tatum-gray-400">
                  Custom Level Generator
                </p>
                <div className="mt-tatum-md flex flex-col gap-tatum-md md:flex-row">
                  <Field className="min-w-0 flex-1">
                    <Label className="sr-only">Custom level prompt</Label>
                    <Input
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder='Example: "Create a level to check BTC price in USD with a bazaar story"'
                      inputClassName={TDS_GAME_INPUT_CLASSNAME}
                    />
                  </Field>
                  <Button
                    type="button"
                    variant={ButtonVariant.Primary}
                    size={ButtonSize.Medium}
                    onClick={() => void handleGenerateLevel()}
                    disabled={isGenerating}
                    busy={isGenerating}
                    className="shrink-0"
                  >
                    {isGenerating ? "Generating..." : "Generate Level"}
                  </Button>
                </div>
                {generationError && (
                  <div className="mt-tatum-md">
                    <Alert
                      type={AlertType.Error}
                      title="Could not generate level"
                      description={generationError}
                      withoutCloseButton
                      className="border-tatum-error-700 bg-tatum-error-950/40"
                    />
                  </div>
                )}
                {customLevels.length > 0 && (
                  <p className="mt-tatum-md text-tatum-text-xs text-tatum-success-400">
                    Custom levels created: {customLevels.length}
                  </p>
                )}
              </Card>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-tatum-md p-tatum-lg sm:grid-cols-2 lg:grid-cols-3">
              {freeplayLevels.map((level) => (
                <LevelCard key={level.id} level={level} />
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
