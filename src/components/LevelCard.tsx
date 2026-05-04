"use client";

import React from "react";
import { CheckCircle2, Play } from "lucide-react";
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
  toast,
} from "@tatum-io/tatum-design-system";
import { Modal } from "./Modal";
import { CodeSnippet } from "./CodeSnippet";
import type { Level } from "@/lib/levels";
import { TDS_GAME_INPUT_CLASSNAME } from "@/lib/tdsInputStyles";
import { useGameStore, type WalletLevelResult } from "@/store/gameStore";

type LevelCardProps = {
  level: Level;
};

function formatActionError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    const o = error as { message?: unknown; code?: unknown };
    if (typeof o.message === "string" && o.message.length > 0) {
      const code =
        typeof o.code === "number" || typeof o.code === "string"
          ? ` (code ${o.code})`
          : "";
      return `${o.message}${code}`;
    }
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function LevelCard({ level }: LevelCardProps) {
  const [open, setOpen] = React.useState(false);
  const [isRunning, setIsRunning] = React.useState(false);
  const [addressInput, setAddressInput] = React.useState("");
  const [webhookInput, setWebhookInput] = React.useState(
    "https://example.com/mock-webhook"
  );
  const [mockWebhookEvent, setMockWebhookEvent] = React.useState<{
    txId: string;
    amountEth: string;
    status: string;
    timestamp: string;
  } | null>(null);
  const [shouldScrollToResult, setShouldScrollToResult] = React.useState(false);
  const resultAreaRef = React.useRef<HTMLDivElement>(null);
  const mockEventRef = React.useRef<HTMLDivElement>(null);
  const addLog = useGameStore((state) => state.addLog);
  const setLevelResult = useGameStore((state) => state.setLevelResult);
  const markLevelCompleted = useGameStore((state) => state.markLevelCompleted);
  const completedLevels = useGameStore((state) => state.completedLevels);
  const setGuideMessage = useGameStore((state) => state.setGuideMessage);
  const levelResult = useGameStore((state) => state.levelResults[level.id]);
  const isCompleted = completedLevels.includes(level.id);

  const walletResult =
    level.kind === "wallet"
      ? (levelResult as WalletLevelResult | undefined)
      : undefined;

  const maskedPrivateKey = walletResult?.privateKey
    ? `${walletResult.privateKey.slice(0, 8)}...${walletResult.privateKey.slice(-6)}`
    : null;
  const balanceResult =
    level.kind === "balance"
      ? (levelResult as
          | { address: string; ethBalance: string; rawBalance: string }
          | undefined)
      : undefined;
  const connectWalletResult =
    level.kind === "connect"
      ? (levelResult as { address: string } | undefined)
      : undefined;

  const rpcResult =
    level.kind === "rpc"
      ? (levelResult as
          | {
              address: string;
              blockNumber: string;
              rpc: { ethBalance: string; rawBalance: string };
              dataApi: { ethBalance: string | null; rawBalance: string | null };
            }
          | undefined)
      : undefined;
  const subscriptionResult =
    level.kind === "subscribe"
      ? (levelResult as
          | {
              type: string;
              address: string;
              webhookUrl: string;
              subscription: unknown;
            }
          | undefined)
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

  const handleTest = async () => {
    setIsRunning(true);
    try {
      await level.action({
        log: addLog,
        setResult: (result) => setLevelResult(level.id, result),
        input:
          level.kind === "balance" ||
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
      markLevelCompleted(level.id);
      if (level.kind === "connect") {
        const r = useGameStore.getState().levelResults[level.id] as
          | { address?: string }
          | undefined;
        if (r?.address) setAddressInput(r.address);
      }
      toast.success(`${level.title} complete`);
      setGuideMessage(
        `Great run. ${
          completedLevels.length + 1 < 6
            ? "Another chapter awaits."
            : "All chapters cleared. BlockVille systems are stabilizing."
        }`
      );
      setShouldScrollToResult(true);
    } catch (error) {
      addLog(`${level.title} failed: ${formatActionError(error)}`);
    } finally {
      setIsRunning(false);
    }
  };

  React.useEffect(() => {
    if (!open || !shouldScrollToResult) return;
    const timer = window.setTimeout(() => {
      resultAreaRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
      setShouldScrollToResult(false);
    }, 80);
    return () => window.clearTimeout(timer);
  }, [open, shouldScrollToResult]);

  React.useEffect(() => {
    if (!open || !mockWebhookEvent) return;
    const id = window.requestAnimationFrame(() => {
      mockEventRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    });
    return () => window.cancelAnimationFrame(id);
  }, [open, mockWebhookEvent]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative flex cursor-pointer flex-col rounded-tatum-xl border px-tatum-lg py-tatum-md text-left shadow-tatum-md transition-tatum-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tatum-primary-400 ${
          isCompleted
            ? "border-tatum-success-500/50 bg-[linear-gradient(rgba(23,178,106,0.15),rgba(23,178,106,0.15)),url('/images/background.png')] bg-cover bg-center animate-fade-in"
            : "border-tatum-gray-700 bg-[linear-gradient(rgba(28,30,79,0.82),rgba(28,30,79,0.82)),url('/images/background.png')] bg-cover bg-center hover:border-tatum-primary-500/50 hover:shadow-tatum-lg"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="text-center">
            <p
              className={`text-tatum-text-xs font-tatum-semibold uppercase tracking-[0.18em] ${
                isCompleted ? "text-tatum-success-300" : "text-tatum-gray-400"
              }`}
            >
              {level.chapterName}
            </p>
            <p className="mt-tatum-xs text-tatum-text-sm text-tatum-gray-50">
              {level.title}
            </p>
          </div>

          <div
            className={`pointer-events-none absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition group-hover:shadow-tatum-md ${
              isCompleted
                ? "border-tatum-success-500/55 bg-tatum-success-500/20 text-tatum-success-100"
                : "border-tatum-primary-500/50 bg-tatum-primary-500/15 text-tatum-primary-100"
            }`}
          >
            {isCompleted ? (
              <CheckCircle2 className="h-7 w-7 text-tatum-success-300" />
            ) : (
              <Play className="h-7 w-7 fill-tatum-primary-400/50" />
            )}
          </div>

          <div className="mt-auto pt-tatum-2xl text-center">
            <p className="text-tatum-text-xs text-tatum-gray-500">
              {level.description}
            </p>
          </div>
        </div>
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={level.title}
      >
        <p className="text-tatum-text-sm text-tatum-gray-300">{level.description}</p>
        {level.kind === "connect" && (
          <div className="mt-tatum-md">
            <Alert
              type={AlertType.Warning}
              title="MetaMask & Sepolia"
              description="This level uses EIP-6963 to find MetaMask even if other wallets are installed. Unlock MetaMask and switch to Sepolia if prompted. Very old MetaMask builds without EIP-6963 may still need other wallets disabled."
              withoutCloseButton
              className="border-tatum-warning-700 bg-tatum-warning-950/30"
            />
          </div>
        )}
        <div className="mt-tatum-xl">
          <p className="mb-tatum-md text-tatum-text-xs font-tatum-medium uppercase tracking-[0.18em] text-tatum-gray-500">
            Code Snippet
          </p>
          <CodeSnippet code={level.codeSnippet} language="typescript" />
        </div>
        {(level.kind === "balance" ||
          level.kind === "txByHash" ||
          level.kind === "price" ||
          level.kind === "subscribe" ||
          level.kind === "rpc") && (
          <Field className="mt-tatum-xl">
            <Label
              htmlFor={`wallet-address-${level.id}`}
              className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.14em] text-tatum-gray-500"
            >
              {level.kind === "txByHash"
                ? "Transaction Hash"
                : level.kind === "price"
                  ? "Symbol"
                  : "Wallet Address"}
            </Label>
            <Input
              id={`wallet-address-${level.id}`}
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
          <Field className="mt-tatum-lg">
            <Label
              htmlFor={`webhook-url-${level.id}`}
              className="text-tatum-text-xs font-tatum-medium uppercase tracking-[0.14em] text-tatum-gray-500"
            >
              Webhook URL (mock for now)
            </Label>
            <Input
              id={`webhook-url-${level.id}`}
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              placeholder="https://example.com/mock-webhook"
              inputClassName={TDS_GAME_INPUT_CLASSNAME}
            />
            <p className="mt-tatum-md text-tatum-text-xs text-tatum-gray-500">
              This triggers webhook when tx happens.
            </p>
          </Field>
        )}
        <Button
          type="button"
          variant={ButtonVariant.Primary}
          size={ButtonSize.Medium}
          onClick={() => {
            void handleTest();
          }}
          disabled={isRunning}
          busy={isRunning}
          className="mt-tatum-xl"
        >
          {isRunning ? "Loading..." : "Let's Test It"}
        </Button>
        <div
          ref={resultAreaRef}
          className="mt-tatum-xl scroll-mt-6 space-y-tatum-lg empty:hidden"
        >
        {walletResult && (
          <Card
            as="div"
            className="gap-tatum-md border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-success-400">
              Result
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Address:</span>{" "}
              {walletResult.address}
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Private Key:</span>{" "}
              {maskedPrivateKey}
            </p>
            {walletResult.mnemonic && (
              <p className="break-words">
                <span className="text-tatum-gray-500">Mnemonic:</span>{" "}
                {walletResult.mnemonic}
              </p>
            )}
          </Card>
        )}
        {connectWalletResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-warning-600 bg-tatum-warning-950/25 p-tatum-lg text-tatum-text-xs text-tatum-gray-100 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-warning-300">
              Connected account
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Address:</span>{" "}
              {connectWalletResult.address}
            </p>
          </Card>
        )}
        {balanceResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-tertiary-600 bg-tatum-tertiary-950/20 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-tertiary-400">
              Balance Result
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Address:</span>{" "}
              {balanceResult.address}
            </p>
            <p>
              <span className="text-tatum-gray-500">ETH Balance:</span>{" "}
              {balanceResult.ethBalance} ETH
            </p>
          </Card>
        )}
        {rpcResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-primary-600 bg-tatum-primary-950/20 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-primary-300">
              RPC vs Data API
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Address:</span> {rpcResult.address}
            </p>
            <p>
              <span className="text-tatum-gray-500">Block Number (RPC):</span>{" "}
              {rpcResult.blockNumber}
            </p>
            <p>
              <span className="text-tatum-gray-500">Data API Balance:</span>{" "}
              {rpcResult.dataApi.ethBalance === null
                ? "TODO (pending docs-confirmed field mapping)"
                : `${rpcResult.dataApi.ethBalance} ETH`}
            </p>
            <p>
              <span className="text-tatum-gray-500">RPC Balance:</span>{" "}
              {rpcResult.rpc.ethBalance} ETH
            </p>
          </Card>
        )}
        {subscriptionResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-warning-600 bg-tatum-warning-950/20 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-warning-400">
              Subscription Result
            </p>
            <p>
              <span className="text-tatum-gray-500">Type:</span> {subscriptionResult.type}
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Address:</span>{" "}
              {subscriptionResult.address}
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Webhook URL:</span>{" "}
              {subscriptionResult.webhookUrl}
            </p>
            <Button
              type="button"
              variant={ButtonVariant.Secondary}
              size={ButtonSize.Small}
              onClick={() => {
                const event = {
                  txId: `0xmock${Math.random().toString(16).slice(2, 14)}`,
                  amountEth: (Math.random() * 0.05 + 0.001).toFixed(6),
                  status: "CONFIRMED",
                  timestamp: new Date().toISOString(),
                };
                setMockWebhookEvent(event);
                addLog(
                  `Mock webhook fired: tx=${event.txId}, amount=${event.amountEth} ETH, status=${event.status}`
                );
              }}
              className="mt-tatum-md w-fit"
            >
              Simulate Webhook Event (Mock)
            </Button>
            {mockWebhookEvent && (
              <div ref={mockEventRef}>
                <Card
                  as="div"
                  className="mt-tatum-md gap-tatum-xs border-tatum-gray-700 bg-tatum-secondary-900/80 p-tatum-md text-tatum-text-xs text-tatum-gray-300 shadow-none"
                >
                  <p>
                    <span className="text-tatum-gray-500">txId:</span>{" "}
                    {mockWebhookEvent.txId}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">amount:</span>{" "}
                    {mockWebhookEvent.amountEth} ETH
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">status:</span>{" "}
                    {mockWebhookEvent.status}
                  </p>
                  <p>
                    <span className="text-tatum-gray-500">timestamp:</span>{" "}
                    {mockWebhookEvent.timestamp}
                  </p>
                </Card>
              </div>
            )}
          </Card>
        )}
        {txByHashResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-primary-600 bg-tatum-primary-950/20 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-primary-300">
              Transaction Lookup
            </p>
            <p className="break-all">
              <span className="text-tatum-gray-500">Tx Hash:</span> {txByHashResult.txHash}
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
              <span className="text-tatum-gray-500">Block:</span>{" "}
              {txByHashResult.blockNumber ?? "Pending"}
            </p>
          </Card>
        )}
        {priceResult && (
          <Card
            as="div"
            className="gap-tatum-sm border-tatum-success-600 bg-tatum-success-950/25 p-tatum-lg text-tatum-text-xs text-tatum-gray-200 shadow-none"
          >
            <p className="font-tatum-semibold uppercase tracking-[0.18em] text-tatum-success-400">
              Exchange Rate
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
        </div>
      </Modal>
    </>
  );
}

