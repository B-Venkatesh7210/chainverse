"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { levels, tutorialPrologueDialogues } from "@/lib/levels";

export type WalletLevelResult = {
  address: string;
  privateKey: string;
  mnemonic?: string;
  xpub?: string;
};

export type TutorialPhase = "prologue" | "intro" | "challenge" | "outro";

type GameStore = {
  logs: string[];
  levelResults: Record<string, unknown>;
  completedLevels: string[];
  successMessage: string | null;
  guideMessage: string;
  soundEnabled: boolean;
  mode: "tutorial" | "freeplay";
  tutorialSkipped: boolean;
  tutorialLevelIdx: number;
  tutorialDialogueIdx: number;
  prologueDialogueIdx: number;
  tutorialPhase: TutorialPhase;
  typewriterKey: number;
  addLog: (message: string) => void;
  setLevelResult: (levelId: string, result: unknown) => void;
  markLevelCompleted: (levelId: string) => void;
  setSuccessMessage: (message: string | null) => void;
  setGuideMessage: (message: string) => void;
  toggleSound: () => void;
  skipTutorial: () => void;
  resetTutorial: () => void;
  nextTutorialDialogue: () => void;
  prevTutorialStep: () => void;
  continueTutorialWithoutTest: () => void;
  completeTutorialChallenge: () => void;
  hydrateTutorialState: () => void;
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      logs: ["[system] Waiting for level selection..."],
      levelResults: {},
      completedLevels: [],
      successMessage: null,
      guideMessage: "Villager: Welcome, Tatumian. BlockVille needs you.",
      soundEnabled: false,
      mode: "tutorial",
      tutorialSkipped: false,
      tutorialLevelIdx: 0,
      tutorialDialogueIdx: 0,
      prologueDialogueIdx: 0,
      tutorialPhase: "prologue",
      typewriterKey: 0,
      addLog: (message) =>
        set((state) => ({
          logs: [...state.logs, `[${new Date().toLocaleTimeString()}] ${message}`],
        })),
      setLevelResult: (levelId, result) =>
        set((state) => ({
          levelResults: {
            ...state.levelResults,
            [levelId]: result,
          },
        })),
      markLevelCompleted: (levelId) =>
        set((state) => ({
          completedLevels: state.completedLevels.includes(levelId)
            ? state.completedLevels
            : [...state.completedLevels, levelId],
        })),
      setSuccessMessage: (message) => set({ successMessage: message }),
      setGuideMessage: (message) => set({ guideMessage: message }),
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      skipTutorial: () =>
        set({
          mode: "freeplay",
          tutorialSkipped: true,
          tutorialLevelIdx: 0,
          tutorialDialogueIdx: 0,
          prologueDialogueIdx: 0,
          tutorialPhase: "intro",
          guideMessage: "Villager: Training skipped. Freeplay unlocked.",
        }),
      resetTutorial: () =>
        set({
          mode: "tutorial",
          tutorialSkipped: false,
          tutorialLevelIdx: 0,
          tutorialDialogueIdx: 0,
          prologueDialogueIdx: 0,
          tutorialPhase: "prologue",
          typewriterKey: 0,
          guideMessage: "Villager: A fresh run? Brave. Let us begin again.",
        }),
      nextTutorialDialogue: () =>
        set((state) => {
          if (state.tutorialPhase === "prologue") {
            if (state.prologueDialogueIdx < tutorialPrologueDialogues.length - 1) {
              return {
                prologueDialogueIdx: state.prologueDialogueIdx + 1,
                typewriterKey: state.typewriterKey + 1,
              };
            }
            return {
              tutorialPhase: "intro",
              tutorialDialogueIdx: 0,
              typewriterKey: state.typewriterKey + 1,
            };
          }

          const level = levels[state.tutorialLevelIdx];
          if (!level) return state;
          const lines =
            state.tutorialPhase === "intro"
              ? level.introDialogues
              : state.tutorialPhase === "outro"
                ? level.outroDialogues
                : [];

          if (state.tutorialPhase === "challenge") return state;

          if (state.tutorialDialogueIdx < lines.length - 1) {
            return {
              tutorialDialogueIdx: state.tutorialDialogueIdx + 1,
              typewriterKey: state.typewriterKey + 1,
            };
          }

          if (state.tutorialPhase === "intro") {
            return {
              tutorialPhase: "challenge",
              tutorialDialogueIdx: 0,
              typewriterKey: state.typewriterKey + 1,
            };
          }

          const nextIdx = state.tutorialLevelIdx + 1;
          if (nextIdx >= levels.length) {
            return {
              mode: "freeplay",
              tutorialLevelIdx: 0,
              tutorialDialogueIdx: 0,
              prologueDialogueIdx: 0,
              tutorialPhase: "intro",
              typewriterKey: state.typewriterKey + 1,
              guideMessage:
                "Villager: You restored BlockVille. Freeplay is yours.",
            };
          }
          return {
            tutorialLevelIdx: nextIdx,
            tutorialDialogueIdx: 0,
            prologueDialogueIdx: state.prologueDialogueIdx,
            tutorialPhase: "intro",
            typewriterKey: state.typewriterKey + 1,
          };
        }),
      prevTutorialStep: () =>
        set((state) => {
          if (state.tutorialPhase === "prologue") {
            if (state.prologueDialogueIdx === 0) return state;
            return {
              prologueDialogueIdx: state.prologueDialogueIdx - 1,
              typewriterKey: state.typewriterKey + 1,
            };
          }

          const currentLevel = levels[state.tutorialLevelIdx];
          if (!currentLevel) return state;

          if (state.tutorialPhase === "intro") {
            if (state.tutorialDialogueIdx > 0) {
              return {
                tutorialDialogueIdx: state.tutorialDialogueIdx - 1,
                typewriterKey: state.typewriterKey + 1,
              };
            }

            if (state.tutorialLevelIdx === 0) {
              return {
                tutorialPhase: "prologue",
                prologueDialogueIdx: Math.max(tutorialPrologueDialogues.length - 1, 0),
                typewriterKey: state.typewriterKey + 1,
              };
            }

            const prevLevelIdx = state.tutorialLevelIdx - 1;
            const prevLevel = levels[prevLevelIdx];
            return {
              tutorialLevelIdx: prevLevelIdx,
              tutorialPhase: "outro",
              tutorialDialogueIdx: Math.max(prevLevel.outroDialogues.length - 1, 0),
              typewriterKey: state.typewriterKey + 1,
            };
          }

          if (state.tutorialPhase === "challenge") {
            return {
              tutorialPhase: "intro",
              tutorialDialogueIdx: Math.max(currentLevel.introDialogues.length - 1, 0),
              typewriterKey: state.typewriterKey + 1,
            };
          }

          // outro
          if (state.tutorialDialogueIdx > 0) {
            return {
              tutorialDialogueIdx: state.tutorialDialogueIdx - 1,
              typewriterKey: state.typewriterKey + 1,
            };
          }

          return {
            tutorialPhase: "challenge",
            tutorialDialogueIdx: 0,
            typewriterKey: state.typewriterKey + 1,
          };
        }),
      continueTutorialWithoutTest: () =>
        set((state) => ({
          tutorialPhase: "outro",
          tutorialDialogueIdx: 0,
          typewriterKey: state.typewriterKey + 1,
          guideMessage: "Villager: No shame. We still move forward.",
        })),
      completeTutorialChallenge: () =>
        set((state) => ({
          tutorialPhase: "outro",
          tutorialDialogueIdx: 0,
          typewriterKey: state.typewriterKey + 1,
        })),
      hydrateTutorialState: () => {
        if (typeof window === "undefined") return;
        const completedLegacy =
          window.localStorage.getItem("chainverse.tutorial.completed") === "true";
        if (completedLegacy) {
          set({
            mode: "freeplay",
            tutorialSkipped: false,
            guideMessage:
              "Villager: Welcome back, Tatumian. BlockVille still trusts your skill.",
          });
        }
      },
    }),
    {
      name: "chainverse.tutorial.state",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        tutorialSkipped: state.tutorialSkipped,
        tutorialLevelIdx: state.tutorialLevelIdx,
        tutorialDialogueIdx: state.tutorialDialogueIdx,
        prologueDialogueIdx: state.prologueDialogueIdx,
        tutorialPhase: state.tutorialPhase,
        completedLevels: state.completedLevels,
        soundEnabled: state.soundEnabled,
        guideMessage: state.guideMessage,
      }),
    }
  )
);

