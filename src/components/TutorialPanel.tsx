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
    "https://example.com/webhook"
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
      ? (levelResult as { type: string; webhookUrl: string })
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
    <section className="flex min-h-[64vh] flex-1 flex-col rounded-2xl border border-indigo-400/25 bg-gradient-to-b from-[#0b1230]/95 via-[#0c1433]/90 to-[#080f26]/95 p-4 shadow-neon-blue">
      <div className="mb-3">
        <p className="text-[11px] uppercase tracking-[0.18em] text-indigo-300">
          {phase === "prologue" ? "BlockVille Prologue" : level.chapterName}
        </p>
        <h2 className="text-lg font-semibold text-indigo-50">
          {phase === "prologue" ? "Arrival of the Tatumian" : level.title}
        </h2>
        <p className="text-sm text-indigo-100/60">
          {phase === "prologue"
            ? "Hear what happened to BlockVille before the first chapter begins."
            : level.description}
        </p>
      </div>

      <div className="mb-4 flex items-start justify-end gap-3">
        <button
          type="button"
          onClick={skipTutorial}
          className="rounded-md border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-indigo-100/80 hover:border-indigo-200/55"
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
                  className="w-full rounded-md border border-indigo-300/25 bg-[#08102b] px-3 py-2 text-sm text-indigo-50 placeholder:text-indigo-200/35"
                />
              </div>
            )}

            {level.kind === "subscribe" && (
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  Webhook URL
                </label>
                <input
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://your-domain.com/api/webhooks/tatum"
                  className="w-full rounded-md border border-indigo-300/25 bg-[#08102b] px-3 py-2 text-sm text-indigo-50 placeholder:text-indigo-200/35"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={prevTutorialStep}
                disabled={!canGoBack}
                className="rounded-md border border-indigo-300/30 bg-indigo-500/5 px-4 py-2 text-sm text-indigo-100/85 disabled:opacity-40"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => void handleTest()}
                disabled={isRunning}
                className="rounded-md border border-indigo-300/45 bg-indigo-500/20 px-4 py-2 text-sm font-semibold text-indigo-50"
              >
                {isRunning ? "Testing..." : "Let's Test It"}
              </button>
              <button
                type="button"
                onClick={continueTutorialWithoutTest}
                className="rounded-md border border-indigo-300/30 bg-indigo-500/5 px-4 py-2 text-sm text-indigo-100/85"
              >
                Continue Anyway
              </button>
              {challengeResolved && (
                <button
                  type="button"
                  onClick={completeTutorialChallenge}
                  className="rounded-md border border-blue-300/55 bg-blue-500/25 px-4 py-2 text-sm font-semibold text-blue-50"
                >
                  Continue Story
                </button>
              )}
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              {walletResult && (
                <div className="rounded-lg border border-indigo-300/30 bg-indigo-500/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-indigo-200">
                    Wallet Result
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">Address:</span>{" "}
                    {walletResult.address}
                  </p>
                  {walletResult.xpub && (
                    <p className="break-all">
                      <span className="text-indigo-200/55">Xpub:</span>{" "}
                      {walletResult.xpub}
                    </p>
                  )}
                  {walletResult.mnemonic && (
                    <p className="break-words">
                      <span className="text-indigo-200/55">Mnemonic:</span>{" "}
                      {walletResult.mnemonic}
                    </p>
                  )}
                  <p className="break-all">
                    <span className="text-indigo-200/55">Private Key:</span>{" "}
                    {revealPrivateKey
                      ? walletResult.privateKey
                      : `${walletResult.privateKey.slice(0, 8)}...${walletResult.privateKey.slice(-6)}`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setRevealPrivateKey((v) => !v)}
                    className="mt-1 rounded border border-indigo-300/30 px-2 py-1 text-[11px] text-indigo-100 hover:border-indigo-200/60"
                  >
                    {revealPrivateKey ? "Hide Private Key" : "Reveal Private Key"}
                  </button>
                </div>
              )}
              {balanceResult && <p>ETH Balance: {balanceResult.ethBalance}</p>}
              {connectResult && <p>Connected: {connectResult.address}</p>}
              {sendResult && (
                <div className="rounded-lg border border-blue-300/35 bg-blue-500/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-blue-200">
                    Transaction Result
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">From:</span> {sendResult.from}
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">To:</span> {sendResult.to}
                  </p>
                  <p>
                    <span className="text-indigo-200/55">Amount:</span>{" "}
                    {sendResult.amountEth} ETH
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">Tx Hash:</span>{" "}
                    {sendResult.txHash}
                  </p>
                </div>
              )}
              {subscriptionResult && (
                <div className="rounded-lg border border-indigo-300/30 bg-indigo-500/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-indigo-200">
                    Subscription Result
                  </p>
                  <p>
                    <span className="text-indigo-200/55">Type:</span>{" "}
                    {subscriptionResult.type}
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">Webhook URL:</span>{" "}
                    {subscriptionResult.webhookUrl}
                  </p>
                </div>
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
            <div className="h-11 w-11 rounded-full border border-indigo-300/45 bg-indigo-500/20 flex items-center justify-center text-lg">
              🧑‍🌾
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-indigo-200">
                Villager of BlockVille
              </p>
              <div className="mt-2 rounded-xl border border-indigo-300/25 bg-indigo-500/10 px-3 py-2 text-sm text-indigo-50 min-h-[52px]">
                <TypewriterText text={currentLine} playKey={typewriterKey} />
              </div>
            </div>
          </div>
          <div className="pt-4">
            <button
              type="button"
              onClick={prevTutorialStep}
              disabled={!canGoBack}
              className="mr-2 rounded-md border border-indigo-300/30 bg-indigo-500/5 px-4 py-2 text-sm text-indigo-100/85 disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextTutorialDialogue}
              className="rounded-md border border-indigo-300/50 bg-gradient-to-r from-[#5B4CFF]/60 to-[#2D7CFF]/60 px-4 py-2 text-sm font-semibold text-indigo-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

