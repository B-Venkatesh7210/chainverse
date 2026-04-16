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
  addLog: (message: string) => void;
  setLevelResult: (levelId: number, result: unknown) => void;
};

export const useGameStore = create<GameStore>((set) => ({
  logs: ["[system] Waiting for level selection..."],
  levelResults: {},
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
}));

