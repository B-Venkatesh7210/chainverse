"use client";

import { create } from "zustand";

export type WalletLevelResult = {
  address: string;
  privateKey: string;
  mnemonic?: string;
};

type GameStore = {
  logs: string[];
  levelResults: Record<number, unknown>;
  completedLevels: number[];
  successMessage: string | null;
  guideMessage: string;
  soundEnabled: boolean;
  addLog: (message: string) => void;
  setLevelResult: (levelId: number, result: unknown) => void;
  markLevelCompleted: (levelId: number) => void;
  setSuccessMessage: (message: string | null) => void;
  setGuideMessage: (message: string) => void;
  toggleSound: () => void;
};

export const useGameStore = create<GameStore>((set) => ({
  logs: ["[system] Waiting for level selection..."],
  levelResults: {},
  completedLevels: [],
  successMessage: null,
  guideMessage:
    "Pilot, start with Level 1 and stabilize the chain systems step by step.",
  soundEnabled: false,
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
        : [...state.completedLevels, levelId].sort((a, b) => a - b),
    })),
  setSuccessMessage: (message) => set({ successMessage: message }),
  setGuideMessage: (message) => set({ guideMessage: message }),
  toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
}));

