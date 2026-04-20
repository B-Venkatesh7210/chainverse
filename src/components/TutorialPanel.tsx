"use client";

import React from "react";
import { CodeSnippet } from "./CodeSnippet";
import { TypewriterText } from "./TypewriterText";
import { ConsolePanel } from "./ConsolePanel";
import { tutorialPrologueDialogues, type Level } from "@/lib/levels";
import { useGameStore, type WalletLevelResult } from "@/store/gameStore";

type TutorialPanelProps = {
  level: Level;
};

function formatActionError(error: unknown): string {
  if (error instanceof Error) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function TutorialPanel({ level }: TutorialPanelProps) {
  const TREASURY_DEFAULT_ADDRESS =
    "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
  const [isRunning, setIsRunning] = React.useState(false);
  const [challengeResolved, setChallengeResolved] = React.useState(false);
  const [revealPrivateKey, setRevealPrivateKey] = React.useState(false);
  const [addressInput, setAddressInput] = React.useState("");
  const [webhookInput, setWebhookInput] = React.useState(
    "https://example.com/mock-webhook"
  );

  const phase = useGameStore((state) => state.tutorialPhase);
  const dialogueIdx = useGameStore((state) => state.tutorialDialogueIdx);
  const prologueDialogueIdx = useGameStore((state) => state.prologueDialogueIdx);
  const tutorialLevelIdx = useGameStore((state) => state.tutorialLevelIdx);
  const typewriterKey = useGameStore((state) => state.typewriterKey);
  const nextTutorialDialogue = useGameStore((state) => state.nextTutorialDialogue);
  const prevTutorialStep = useGameStore((state) => state.prevTutorialStep);
  const continueTutorialWithoutTest = useGameStore(
    (state) => state.continueTutorialWithoutTest
  );
  const completeTutorialChallenge = useGameStore(
    (state) => state.completeTutorialChallenge
  );
  const skipTutorial = useGameStore((state) => state.skipTutorial);
  const addLog = useGameStore((state) => state.addLog);
  const setLevelResult = useGameStore((state) => state.setLevelResult);
  const markLevelCompleted = useGameStore((state) => state.markLevelCompleted);
  const setSuccessMessage = useGameStore((state) => state.setSuccessMessage);
  const levelResult = useGameStore((state) => state.levelResults[level.id]);

  const lines =
    phase === "prologue"
      ? tutorialPrologueDialogues
      : phase === "intro"
      ? level.introDialogues
      : phase === "outro"
        ? level.outroDialogues
        : [];
  const currentLine =
    phase === "prologue"
      ? lines[prologueDialogueIdx] ?? ""
      : lines[dialogueIdx] ?? "";
  const canGoBack =
    phase === "prologue"
      ? prologueDialogueIdx > 0
      : phase === "intro"
        ? tutorialLevelIdx > 0 || dialogueIdx > 0
        : phase === "challenge"
          ? true
          : dialogueIdx > 0 || phase === "outro";

  const walletResult =
    level.kind === "wallet"
      ? (levelResult as WalletLevelResult | undefined)
      : undefined;
  const balanceResult =
    level.kind === "balance"
      ? (levelResult as
          | { address: string; ethBalance: string; rawBalance: string }
          | undefined)
      : undefined;
  const connectResult =
    level.kind === "connect"
      ? (levelResult as { address: string } | undefined)
      : undefined;
  const sendResult =
    level.kind === "send"
      ? (levelResult as
          | {
              from: string;
              to: string;
              amountEth: string;
              txHash: string;
            }
          | undefined)
      : undefined;
  const subscriptionResult =
    level.kind === "subscribe"
      ? (levelResult as { type: string; address: string; webhookUrl: string })
      : undefined;
  const rpcResult =
    level.kind === "rpc"
      ? (levelResult as
          | {
              blockNumber: string;
              rpc: { ethBalance: string };
              dataApi: { ethBalance: string | null };
            }
          | undefined)
      : undefined;

  React.useEffect(() => {
    setChallengeResolved(false);
    setRevealPrivateKey(false);
    if (level.id === "treasury-whisper") {
      setAddressInput(TREASURY_DEFAULT_ADDRESS);
    }
  }, [level.id, phase]);

  const handleTest = async () => {
    setIsRunning(true);
    try {
      const result = await level.action({
        log: addLog,
        setResult: (r) => setLevelResult(level.id, r),
        input:
          level.kind === "balance" ||
          level.kind === "send" ||
          level.kind === "subscribe" ||
          level.kind === "rpc"
            ? { address: addressInput, webhookUrl: webhookInput }
            : undefined,
      });

      if (level.kind === "connect") {
        const connected = result as { address?: string };
        if (connected.address) setAddressInput(connected.address);
      }

      markLevelCompleted(level.id);
      setSuccessMessage(`${level.title} complete`);
      window.setTimeout(() => setSuccessMessage(null), 2000);
      setChallengeResolved(true);
    } catch (error) {
      addLog(`${level.title} failed: ${formatActionError(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section className="flex min-h-[64vh] flex-1 flex-col rounded-2xl border border-sky-900/70 bg-slate-950/90 p-4 shadow-neon-blue">
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-sky-400">
          {phase === "prologue" ? "BlockVille Prologue" : level.chapterName}
        </p>
        <h2 className="text-lg font-semibold text-zinc-100">
          {phase === "prologue" ? "Arrival of the Tatumian" : level.title}
        </h2>
        <p className="text-sm text-zinc-400">
          {phase === "prologue"
            ? "Hear what happened to BlockVille before the first chapter begins."
            : level.description}
        </p>
      </div>

      <div className="mb-4 flex items-start justify-end gap-3">
        <button
          type="button"
          onClick={skipTutorial}
          className="rounded-md border border-zinc-700 px-3 py-1 text-xs uppercase tracking-[0.14em] text-zinc-300 hover:border-zinc-500"
        >
          Skip Tutorial
        </button>
      </div>

      {phase === "challenge" ? (
        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-4">
            <CodeSnippet code={level.codeSnippet} language="typescript" />

            {(level.kind === "balance" ||
              level.kind === "send" ||
              level.kind === "subscribe" ||
              level.kind === "rpc") && (
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {level.kind === "send"
                    ? "Recipient Address"
                    : "Wallet Address"}
                </label>
                <input
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
                />
              </div>
            )}

            {level.kind === "subscribe" && (
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Webhook URL (mock)
                </label>
                <input
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={prevTutorialStep}
                disabled={!canGoBack}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleTest()}
                disabled={isRunning}
                className="rounded-md border border-sky-500/60 bg-sky-500/20 px-4 py-2 text-sm font-semibold text-sky-200"
              >
                {isRunning ? "Testing..." : "Let's Test It"}
              </button>
              <button
                type="button"
                onClick={continueTutorialWithoutTest}
                className="rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300"
              >
                Continue Anyway
              </button>
              {challengeResolved && (
                <button
                  type="button"
                  onClick={completeTutorialChallenge}
                  className="rounded-md border border-emerald-500/60 bg-emerald-500/20 px-4 py-2 text-sm font-semibold text-emerald-100"
                >
                  Continue Story
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              {walletResult && (
                <div className="rounded-lg border border-emerald-700/50 bg-emerald-900/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-emerald-300">
                    Wallet Result
                  </p>
                  <p className="break-all">
                    <span className="text-zinc-500">Address:</span>{" "}
                    {walletResult.address}
                  </p>
                  {walletResult.xpub && (
                    <p className="break-all">
                      <span className="text-zinc-500">Xpub:</span>{" "}
                      {walletResult.xpub}
                    </p>
                  )}
                  {walletResult.mnemonic && (
                    <p className="break-words">
                      <span className="text-zinc-500">Mnemonic:</span>{" "}
                      {walletResult.mnemonic}
                    </p>
                  )}
                  <p className="break-all">
                    <span className="text-zinc-500">Private Key:</span>{" "}
                    {revealPrivateKey
                      ? walletResult.privateKey
                      : `${walletResult.privateKey.slice(0, 8)}...${walletResult.privateKey.slice(-6)}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealPrivateKey((v) => !v)}
                    className="mt-1 rounded border border-zinc-600 px-2 py-1 text-[11px] text-zinc-200 hover:border-zinc-400"
                  >
                    {revealPrivateKey ? "Hide Private Key" : "Reveal Private Key"}
                  </button>
                </div>
              )}
              {balanceResult && <p>ETH Balance: {balanceResult.ethBalance}</p>}
              {connectResult && <p>Connected: {connectResult.address}</p>}
              {sendResult && (
                <div className="rounded-lg border border-sky-700/50 bg-sky-900/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-sky-300">
                    Transaction Result
                  </p>
                  <p className="break-all">
                    <span className="text-zinc-500">From:</span> {sendResult.from}
                  </p>
                  <p className="break-all">
                    <span className="text-zinc-500">To:</span> {sendResult.to}
                  </p>
                  <p>
                    <span className="text-zinc-500">Amount:</span>{" "}
                    {sendResult.amountEth} ETH
                  </p>
                  <p className="break-all">
                    <span className="text-zinc-500">Tx Hash:</span>{" "}
                    {sendResult.txHash}
                  </p>
                </div>
              )}
              {subscriptionResult && (
                <p>
                  Subscription: {subscriptionResult.type} for{" "}
                  {subscriptionResult.address}
                </p>
              )}
              {rpcResult && (
                <p>
                  RPC Block: {rpcResult.blockNumber} | RPC Balance:{" "}
                  {rpcResult.rpc.ethBalance} ETH
                </p>
              )}
            </div>
          </div>

          <div className="min-h-[380px]">
            <ConsolePanel />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full border border-amber-500/60 bg-amber-500/15 flex items-center justify-center text-lg">
              🧑‍🌾
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-amber-300">
                Villager of BlockVille
              </p>
              <div className="mt-2 rounded-xl border border-amber-900/60 bg-amber-950/30 px-3 py-2 text-sm text-amber-100 min-h-[52px]">
                <TypewriterText text={currentLine} playKey={typewriterKey} />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={prevTutorialStep}
              disabled={!canGoBack}
              className="mr-2 rounded-md border border-zinc-700 px-4 py-2 text-sm text-zinc-300 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextTutorialDialogue}
              className="rounded-md border border-amber-500/60 bg-amber-500/20 px-4 py-2 text-sm font-semibold text-amber-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

