"use client";

import React from "react";
import { Play } from "lucide-react";
import { Modal } from "./Modal";
import type { Level } from "@/lib/levels";
import { useGameStore, type WalletLevelResult } from "@/store/gameStore";

type LevelCardProps = {
  level: Level;
  levelLabel: string;
};

export function LevelCard({ level, levelLabel }: LevelCardProps) {
  const [open, setOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [addressInput, setAddressInput] = React.useState("");
  const addLog = useGameStore((state) => state.addLog);
  const setLevelResult = useGameStore((state) => state.setLevelResult);
  const levelResult = useGameStore((state) => state.levelResults[level.id]);

  const walletResult =
    level.id === 1 ? (levelResult as WalletLevelResult | undefined) : undefined;

  const maskedPrivateKey = walletResult?.privateKey
    ? `${walletResult.privateKey.slice(0, 8)}...${walletResult.privateKey.slice(-6)}`
    : null;
  const balanceResult =
    level.id === 2
      ? (levelResult as
          | { address: string; ethBalance: string; rawBalance: string }
          | undefined)
      : undefined;

  const handleTest = async () => {
    setIsRunning(true);
    try {
      await level.action({
        log: addLog,
        setResult: (result) => setLevelResult(level.id, result),
        input: level.id === 2 ? { address: addressInput } : undefined,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown execution error.";
      addLog(`Level ${level.id} failed: ${message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex flex-col justify-between rounded-xl border border-sky-900/60 bg-slate-950/80 px-4 py-3 text-left shadow transition hover:border-sky-400/70 hover:bg-slate-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-400">
              {levelLabel}
            </p>
            <p className="mt-1 text-sm text-zinc-200">{level.title}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-sky-500/60 bg-sky-500/20 text-sky-300 transition group-hover:shadow-neon-blue">
            <Play className="h-4 w-4 fill-sky-400/40" />
          </div>
        </div>
        <p className="mt-3 text-[11px] text-zinc-500">
          {level.description}
        </p>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={`${levelLabel}: ${level.title}`}
      >
        <p className="text-sm text-zinc-300">{level.description}</p>
        <div className="mt-4 rounded-lg border border-zinc-800 bg-black/60 p-3">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Code Snippet
          </p>
          <pre className="overflow-x-auto text-xs text-sky-300">
            <code>{level.codeSnippet}</code>
          </pre>
        </div>
        {level.id === 2 && (
          <div className="mt-4">
            <label
              htmlFor={`wallet-address-${level.id}`}
              className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500"
            >
              Wallet Address
            </label>
            <input
              id={`wallet-address-${level.id}`}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder="0x..."
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            void handleTest();
          }}
          disabled={isRunning}
          className="mt-4 inline-flex items-center justify-center rounded-md border border-sky-500/60 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200 transition hover:bg-sky-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
          {isRunning ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-sky-200 border-t-transparent" />
              Loading...
            </span>
          ) : (
            "Let's Test It"
          )}
        </button>
        {walletResult && (
          <div className="mt-4 rounded-lg border border-emerald-700/50 bg-emerald-900/10 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-emerald-400">
              Result
            </p>
            <p className="break-all text-zinc-200">
              <span className="text-zinc-500">Address:</span> {walletResult.address}
            </p>
            <p className="mt-1 break-all text-zinc-200">
              <span className="text-zinc-500">Private Key:</span>{" "}
              {maskedPrivateKey}
            </p>
            {walletResult.mnemonic && (
              <p className="mt-1 break-words text-zinc-300">
                <span className="text-zinc-500">Mnemonic:</span>{" "}
                {walletResult.mnemonic}
              </p>
            )}
          </div>
        )}
        {balanceResult && (
          <div className="mt-4 rounded-lg border border-cyan-700/50 bg-cyan-900/10 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-cyan-400">
              Balance Result
            </p>
            <p className="break-all text-zinc-200">
              <span className="text-zinc-500">Address:</span> {balanceResult.address}
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">ETH Balance:</span>{" "}
              {balanceResult.ethBalance} ETH
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

