"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Lightbulb, Target } from "lucide-react";
import { CodeSnippet } from "./CodeSnippet";
import { TypewriterText } from "./TypewriterText";
import { ConsolePanel } from "./ConsolePanel";
import {
  tutorialPrologueDialogues,
  type DialogueLine,
  type Level,
  type VillagerEmotion,
} from "@/lib/levels";
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

function getVillagerEmotion(line: string, phase: string): VillagerEmotion {
  const text = line.toLowerCase();

  if (
    text.includes("great") ||
    text.includes("success") ||
    text.includes("cheers") ||
    text.includes("excellent") ||
    text.includes("ready") ||
    text.includes("complete")
  ) {
    return "victory";
  }

  if (
    text.includes("let's") ||
    text.includes("show") ||
    text.includes("instruct") ||
    text.includes("with tatum") ||
    text.includes("restore")
  ) {
    return "idea";
  }

  if (
    text.includes("know") ||
    text.includes("ask") ||
    text.includes("hear") ||
    text.includes("query") ||
    text.includes("truth")
  ) {
    return "thinking";
  }

  if (
    text.includes("broken") ||
    text.includes("destroyed") ||
    text.includes("difficult") ||
    text.includes("lost") ||
    text.includes("desync") ||
    text.includes("silent") ||
    text.includes("warning") ||
    text.includes("fractured")
  ) {
    return "worried";
  }

  return phase === "outro" ? "victory" : "happy";
}

function toDialogueLine(
  line: string | DialogueLine | undefined,
  phase: string
): DialogueLine {
  if (!line) return { text: "", emotion: phase === "outro" ? "victory" : "happy" };
  if (typeof line === "string") {
    return { text: line, emotion: getVillagerEmotion(line, phase) };
  }
  return line;
}

function getVillagerScaleClass(emotion: VillagerEmotion): string {
  switch (emotion) {
    case "idea":
      return "scale-[1] origin-bottom";
    case "victory":
      return "scale-[1] origin-bottom";
    case "thinking":
      return "scale-[1] origin-bottom";
    case "worried":
      return "scale-[1] origin-bottom";
    case "happy":
    default:
      return "scale-[1] origin-bottom";
  }
}

function getDialogueTask(level: Level, phase: string): string {
  if (phase === "prologue") {
    return "Understand what happened in BlockVille and prepare to restore each core blockchain workflow.";
  }

  switch (level.kind) {
    case "wallet":
      return "Generate a brand new Ethereum wallet for a villager with mnemonic, address, and private key output.";
    case "balance":
      return "Fetch a wallet balance on Sepolia and confirm the remaining treasury funds.";
    case "connect":
      return "Connect MetaMask and return the active wallet address from the browser.";
    case "send":
      return "Send a small Sepolia ETH transaction and verify the resulting tx hash.";
    case "txByHash":
      return "Inspect a Sepolia transaction using only its hash and decode its key fields.";
    case "subscribe":
      return "Create a real webhook subscription for block-level failed transaction alerts.";
    case "rpc":
      return "Query chain state directly through RPC and compare output formats.";
    default:
      return "Complete this chapter objective with Tatum tools.";
  }
}

function getDialogueLearnItems(level: Level, phase: string): string[] {
  if (phase === "prologue") {
    return [
      "BlockVille mission context",
      "Tutorial flow and chapter goals",
      "How Tatum fits each repair step",
    ];
  }

  switch (level.kind) {
    case "wallet":
      return ["Generating mnemonic", "Deriving wallet address", "Reading private key output"];
    case "balance":
      return ["Using wallet input safely", "Fetching on-chain balance", "Reading wei to ETH values"];
    case "connect":
      return ["Connecting MetaMask", "Handling wallet permissions", "Returning selected account"];
    case "send":
      return ["Sending native ETH", "Using connected wallet signer", "Tracking tx hash result"];
    case "txByHash":
      return ["Using tx hash input", "Fetching transaction details", "Reading sender, receiver, and value"];
    case "subscribe":
      return ["Configuring webhook URL", "Creating subscription in Tatum", "Receiving alert events"];
    case "rpc":
      return ["Calling RPC methods", "Reading raw responses", "Comparing API vs RPC"];
    default:
      return ["Core workflow", "Validation", "Result interpretation"];
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
  const currentDialogue = toDialogueLine(
    phase === "prologue" ? lines[prologueDialogueIdx] : lines[dialogueIdx],
    phase
  );
  const currentLine = currentDialogue.text;
  const villagerEmotion = currentDialogue.emotion;
  const villagerImageSrc = `/images/${villagerEmotion}.png`;
  const villagerScaleClass = getVillagerScaleClass(villagerEmotion);
  const dialogueTask = getDialogueTask(level, phase);
  const dialogueLearnItems = getDialogueLearnItems(level, phase);
  const canGoBack =
    phase === "prologue"
      ? prologueDialogueIdx > 0
      : phase === "intro"
        ? tutorialLevelIdx > 0 || dialogueIdx > 0
        : phase === "challenge"
          ? true
          : dialogueIdx > 0 || phase === "outro";
  const isChallengeView = phase === "challenge";

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
  const txByHashResult =
    level.kind === "txByHash"
      ? (levelResult as
          | {
              txHash: string;
              from: string | null;
              to: string | null;
              value: string | null;
              valueEth: string | null;
              blockNumber: string | null;
            }
          | undefined)
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
          level.kind === "txByHash" ||
          level.kind === "subscribe" ||
          level.kind === "rpc"
            ? { address: addressInput, webhookUrl: webhookInput, txHash: addressInput }
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
    <section
      className={`relative flex min-h-[64vh] flex-1 flex-col justify-between overflow-hidden rounded-2xl border border-indigo-400/25 shadow-neon-blue ${
        isChallengeView
          ? "bg-gradient-to-b from-[#0b1230]/95 via-[#0c1433]/90 to-[#080f26]/95 p-4"
          : ""
      }`}
    >
      {!isChallengeView && (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[url('/images/background.png')] bg-cover bg-center bg-no-repeat" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#070f2a]/36 via-[#070f2a]/46 to-[#070f2a]/58" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_22%,rgba(107,87,255,0.23),transparent_42%),radial-gradient(circle_at_78%_74%,rgba(45,124,255,0.16),transparent_44%)]" />
        </>
      )}
      <div className={`relative ${isChallengeView ? "mb-5" : "px-4 pt-4"}`}>
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

      {phase === "challenge" && (
        <div className="mb-4 flex items-start justify-end gap-3">
          <button
            type="button"
            onClick={skipTutorial}
            className="rounded-md border border-indigo-300/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-indigo-100/80 hover:border-indigo-200/55"
          >
            Skip Tutorial
          </button>
        </div>
      )}

      {phase === "challenge" ? (
        <div className="grid flex-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-4">
            <CodeSnippet code={level.codeSnippet} language="typescript" />

            {(level.kind === "balance" ||
              level.kind === "send" ||
              level.kind === "txByHash" ||
              level.kind === "rpc") && (
              <div>
                <label className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500">
                  {level.kind === "send"
                    ? "Recipient Address"
                    : level.kind === "txByHash"
                      ? "Transaction Hash"
                      : "Wallet Address"}
                </label>
                <input
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder={
                    level.kind === "txByHash"
                      ? "0x...transactionHash"
                      : "0x..."
                  }
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
              {txByHashResult && (
                <div className="rounded-lg border border-indigo-300/30 bg-indigo-500/10 p-3 space-y-1">
                  <p className="font-semibold uppercase tracking-[0.16em] text-indigo-200">
                    Transaction Lookup
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">Tx Hash:</span>{" "}
                    {txByHashResult.txHash}
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">From:</span>{" "}
                    {txByHashResult.from ?? "Unknown"}
                  </p>
                  <p className="break-all">
                    <span className="text-indigo-200/55">To:</span>{" "}
                    {txByHashResult.to ?? "Contract creation"}
                  </p>
                  <p>
                    <span className="text-indigo-200/55">Value:</span>{" "}
                    {txByHashResult.valueEth ?? "0"} ETH
                  </p>
                  <p>
                    <span className="text-indigo-200/55">Block Number:</span>{" "}
                    {txByHashResult.blockNumber ?? "Pending"}
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
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {/* <div className="relative overflow-hidden rounded-2xl border border-indigo-300/20 bg-gradient-to-b from-[#101947]/80 via-[#0d1439]/70 to-[#09112f]/90 p-4 shadow-[0_20px_40px_rgba(12,35,92,0.35)]"> */}
          <div className="flex flex-1 items-center">
            <div className="relative grid w-full items-start gap-4 px-4 md:grid-cols-[250px_minmax(0,1fr)]">
              <div className="relative mx-auto h-[430px] w-[250px] overflow-hidden">
                <Image
                  src={villagerImageSrc}
                  alt={`Villager ${villagerEmotion}`}
                  fill
                  className={`object-contain object-bottom ${villagerScaleClass}`}
                  sizes="250px"
                  priority
                />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-indigo-200">
                  Villager of BlockVille
                </p>
                <div className="mt-2 inline-block w-fit max-w-[72ch] rounded-2xl border border-indigo-300/25 bg-gradient-to-br from-indigo-500/25 to-blue-500/10 px-4 py-3 text-sm text-indigo-50 min-h-[72px] shadow-[0_12px_34px_rgba(37,99,235,0.2)]">
                  <TypewriterText text={currentLine} playKey={typewriterKey} />
                </div>

                <div className="mt-5 grid gap-4">
                  <div className="rounded-xl border border-indigo-300/20 bg-[#0a1231]/70 p-3">
                    <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200/90">
                      <Target className="h-3.5 w-3.5" />
                      Task
                    </p>
                    <p className="text-sm text-indigo-100/80">{dialogueTask}</p>
                  </div>

                  <div className="rounded-xl border border-indigo-300/20 bg-[#0a1231]/70 p-3">
                    <p className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-200/90">
                      <Lightbulb className="h-3.5 w-3.5" />
                      What You&apos;ll Learn
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dialogueLearnItems.map((item) => (
                        <span
                          key={item}
                          className="rounded-md border border-indigo-300/20 bg-indigo-500/10 px-2.5 py-1 text-xs text-indigo-100/85"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}

          <div className="relative flex items-center justify-between gap-3 px-4 pb-4 pt-5">
            <button
              type="button"
              onClick={skipTutorial}
              className="rounded-md border border-indigo-300/30 bg-indigo-500/10 px-4 py-2 text-sm text-indigo-100/85 hover:border-indigo-200/55"
            >
              Skip Tutorial
            </button>
            <div className="flex items-center gap-2">
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
                onClick={nextTutorialDialogue}
                className="inline-flex items-center gap-1 rounded-md border border-indigo-300/50 bg-gradient-to-r from-[#5B4CFF]/70 to-[#2D7CFF]/70 px-4 py-2 text-sm font-semibold text-indigo-50"
              >
                Next
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

