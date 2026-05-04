"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, Lightbulb, Target } from "lucide-react";
import {
  Badge,
  BadgeColor,
  BadgeSize,
  BadgeVariant,
  Button,
  ButtonSize,
  ButtonVariant,
  Card,
  Field,
  Input,
  Label,
  toast,
} from "@tatum-io/tatum-design-system";
import { CodeSnippet } from "./CodeSnippet";
import { TypewriterText } from "./TypewriterText";
import { ConsolePanel } from "./ConsolePanel";
import {
  tutorialPrologueDialogues,
  type DialogueLine,
  type Level,
  type VillagerEmotion,
} from "@/lib/levels";
import { TDS_GAME_INPUT_CLASSNAME } from "@/lib/tdsInputStyles";
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
    case "price":
      return "Fetch a live exchange price by symbol and quote the market in USD.";
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
    case "price":
      return ["Using symbol input", "Fetching market exchange rates", "Reading symbol-to-USD value"];
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
  const priceResult =
    level.kind === "price"
      ? (levelResult as
          | {
              symbol: string;
              basePair: string;
              rate: string;
              fetchedAt: string | null;
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
    } else if (level.id === "market-oracle") {
      setAddressInput("ETH");
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
          level.kind === "price" ||
          level.kind === "subscribe" ||
          level.kind === "rpc"
            ? {
                address: addressInput,
                webhookUrl: webhookInput,
                txHash: addressInput,
                symbol: addressInput,
              }
            : undefined,
      });

      if (level.kind === "connect") {
        const connected = result as { address?: string };
        if (connected.address) setAddressInput(connected.address);
      }

      markLevelCompleted(level.id);
      toast.success(`${level.title} complete`);
      setChallengeResolved(true);
    } catch (error) {
      addLog(`${level.title} failed: ${formatActionError(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section
      className={`relative flex min-h-[64vh] flex-1 flex-col justify-between overflow-hidden rounded-tatum-2xl border border-tatum-gray-700 shadow-tatum-lg ${
        isChallengeView
          ? "bg-tatum-secondary-950/95 p-tatum-lg"
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
      <div className={`relative ${isChallengeView ? "mb-tatum-xl" : "px-tatum-lg pt-tatum-lg"}`}>
        <div className="flex items-start justify-between gap-tatum-md">
          <div>
            <p className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.18em] text-tatum-gray-400">
              {phase === "prologue" ? "BlockVille Prologue" : level.chapterName}
            </p>
            <h2 className="text-tatum-heading-xs font-tatum-semibold text-tatum-gray-50">
              {phase === "prologue" ? "Arrival of the Tatumian" : level.title}
            </h2>
            <p className="text-tatum-text-sm text-tatum-gray-400">
              {phase === "prologue"
                ? "Hear what happened to BlockVille before the first chapter begins."
                : level.description}
            </p>
          </div>
          {phase === "challenge" && (
            <Button
              type="button"
              variant={ButtonVariant.Outlined}
              size={ButtonSize.Small}
              onClick={skipTutorial}
              className="uppercase tracking-[0.14em]"
            >
              Skip Tutorial
            </Button>
          )}
        </div>
      </div>

      {phase === "challenge" ? (
        <div className="grid flex-1 gap-tatum-xl lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-tatum-xl">
            <CodeSnippet code={level.codeSnippet} language="typescript" />

            {(level.kind === "balance" ||
              level.kind === "send" ||
              level.kind === "txByHash" ||
              level.kind === "price" ||
              level.kind === "rpc") && (
              <Field>
                <Label className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.14em] text-tatum-gray-500">
                  {level.kind === "send"
                    ? "Recipient Address"
                    : level.kind === "txByHash"
                      ? "Transaction Hash"
                      : level.kind === "price"
                        ? "Symbol"
                        : "Wallet Address"}
                </Label>
                <Input
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder={
                    level.kind === "txByHash"
                      ? "0x...transactionHash"
                      : level.kind === "price"
                        ? "ETH"
                        : "0x..."
                  }
                  inputClassName={TDS_GAME_INPUT_CLASSNAME}
                />
              </Field>
            )}

            {level.kind === "subscribe" && (
              <Field>
                <Label className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.14em] text-tatum-gray-500">
                  Webhook URL
                </Label>
                <Input
                  value={webhookInput}
                  onChange={(e) => setWebhookInput(e.target.value)}
                  placeholder="https://your-domain.com/api/webhooks/tatum"
                  inputClassName={TDS_GAME_INPUT_CLASSNAME}
                />
              </Field>
            )}

            <div className="flex flex-wrap items-center gap-tatum-md">
              <Button
                type="button"
                variant={ButtonVariant.Outlined}
                size={ButtonSize.Medium}
                onClick={prevTutorialStep}
                disabled={!canGoBack}
              >
                Back
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                onClick={() => void handleTest()}
                disabled={isRunning}
                busy={isRunning}
              >
                {isRunning ? "Testing..." : "Let's Test It"}
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.Secondary}
                size={ButtonSize.Medium}
                onClick={continueTutorialWithoutTest}
              >
                Continue Anyway
              </Button>
              {challengeResolved && (
                <Button
                  type="button"
                  variant={ButtonVariant.Accent}
                  size={ButtonSize.Medium}
                  onClick={completeTutorialChallenge}
                >
                  Continue Story
                </Button>
              )}
            </div>

            <div className="space-y-tatum-md text-tatum-text-xs text-tatum-gray-300">
              {walletResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Address:</span>{" "}
                    {walletResult.address}
                  </p>
                  {walletResult.xpub && (
                    <p className="break-all">
                      <span className="text-tatum-gray-500">Xpub:</span>{" "}
                      {walletResult.xpub}
                    </p>
                  )}
                  {walletResult.mnemonic && (
                    <p className="break-words">
                      <span className="text-tatum-gray-500">Mnemonic:</span>{" "}
                      {walletResult.mnemonic}
                    </p>
                  )}
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Private Key:</span>{" "}
                    {revealPrivateKey
                      ? walletResult.privateKey
                      : `${walletResult.privateKey.slice(0, 8)}...${walletResult.privateKey.slice(-6)}`}
                  </p>
                  <Button
                    type="button"
                    variant={ButtonVariant.Outlined}
                    size={ButtonSize.Small}
                    onClick={() => setRevealPrivateKey((v) => !v)}
                    className="mt-tatum-xs w-fit"
                  >
                    {revealPrivateKey ? "Hide Private Key" : "Reveal Private Key"}
                  </Button>
                </Card>
              )}
              {balanceResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Address:</span>{" "}
                    {balanceResult.address}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">ETH Balance:</span>{" "}
                    {balanceResult.ethBalance}
                  </p>
                </Card>
              )}
              {connectResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Connected:</span>{" "}
                    {connectResult.address}
                  </p>
                </Card>
              )}
              {sendResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">From:</span> {sendResult.from}
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">To:</span> {sendResult.to}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Amount:</span>{" "}
                    {sendResult.amountEth} ETH
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Tx Hash:</span>{" "}
                    {sendResult.txHash}
                  </p>
                </Card>
              )}
              {txByHashResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Tx Hash:</span>{" "}
                    {txByHashResult.txHash}
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">From:</span>{" "}
                    {txByHashResult.from ?? "Unknown"}
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">To:</span>{" "}
                    {txByHashResult.to ?? "Contract creation"}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Value:</span>{" "}
                    {txByHashResult.valueEth ?? "0"} ETH
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Block Number:</span>{" "}
                    {txByHashResult.blockNumber ?? "Pending"}
                  </p>
                </Card>
              )}
              {priceResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Pair:</span> {priceResult.symbol}/
                    {priceResult.basePair}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Rate:</span> {priceResult.rate}
                  </p>
                  {priceResult.fetchedAt && (
                    <p className="break-all">
                      <span className="text-tatum-gray-500">Fetched:</span>{" "}
                      {priceResult.fetchedAt}
                    </p>
                  )}
                </Card>
              )}
              {subscriptionResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">Type:</span>{" "}
                    {subscriptionResult.type}
                  </p>
                  <p className="break-all">
                    <span className="text-tatum-gray-500">Webhook URL:</span>{" "}
                    {subscriptionResult.webhookUrl}
                  </p>
                </Card>
              )}
              {rpcResult && (
                <Card
                  as="div"
                  className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs shadow-none"
                >
                  <p className="font-tatum-semibold uppercase tracking-[0.16em] text-tatum-success-400">
                    Result
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">RPC Block:</span>{" "}
                    {rpcResult.blockNumber}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">RPC Balance:</span>{" "}
                    {rpcResult.rpc.ethBalance} ETH
                  </p>
                </Card>
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
                <p className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.18em] text-tatum-gray-400">
                  Villager of BlockVille
                </p>
                <Card
                  as="div"
                  className="mt-tatum-md inline-flex w-fit max-w-[72ch] min-h-[72px] flex-col gap-0 border-tatum-gray-700 bg-tatum-secondary-900/70 p-tatum-lg text-tatum-text-sm text-tatum-gray-300 shadow-none"
                >
                  <TypewriterText text={currentLine} playKey={typewriterKey} />
                </Card>

                <div className="mt-tatum-2xl grid gap-tatum-xl">
                  <Card
                    as="div"
                    className="gap-tatum-sm border-tatum-gray-700 bg-tatum-secondary-900/70 p-tatum-lg shadow-none"
                  >
                    <p className="mb-tatum-md flex items-center gap-tatum-md text-tatum-text-xs font-tatum-semibold uppercase tracking-[0.18em] text-tatum-gray-300">
                      <Target className="h-3.5 w-3.5 shrink-0" />
                      Task
                    </p>
                    <p className="text-tatum-text-sm text-tatum-gray-300">
                      {dialogueTask}
                    </p>
                  </Card>

                  <Card
                    as="div"
                    className="gap-tatum-md border-tatum-gray-700 bg-tatum-secondary-900/70 p-tatum-lg shadow-none"
                  >
                    <p className="mb-tatum-md flex items-center gap-tatum-md text-tatum-text-xs font-tatum-semibold uppercase tracking-[0.18em] text-tatum-gray-300">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                      What You&apos;ll Learn
                    </p>
                    <div className="flex flex-wrap gap-tatum-md">
                      {dialogueLearnItems.map((item) => (
                        <Badge
                          key={item}
                          variant={BadgeVariant.Pill}
                          color={BadgeColor.Brand}
                          size={BadgeSize.Small}
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
          {/* </div> */}

          <div className="relative flex items-center justify-between gap-tatum-md px-tatum-lg pb-tatum-xl pt-tatum-2xl">
            <Button
              type="button"
              variant={ButtonVariant.Outlined}
              size={ButtonSize.Medium}
              onClick={skipTutorial}
            >
              Skip Tutorial
            </Button>
            <div className="flex items-center gap-tatum-md">
              <Button
                type="button"
                variant={ButtonVariant.Outlined}
                size={ButtonSize.Medium}
                onClick={prevTutorialStep}
                disabled={!canGoBack}
              >
                Back
              </Button>
              <Button
                type="button"
                variant={ButtonVariant.Primary}
                size={ButtonSize.Medium}
                onClick={nextTutorialDialogue}
                rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

