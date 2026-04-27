"use client";

import React from "react";
import { CheckCircle2, Play } from "lucide-react";
import { Modal } from "./Modal";
import { CodeSnippet } from "./CodeSnippet";
import type { Level } from "@/lib/levels";
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
  const setSuccessMessage = useGameStore((state) => state.setSuccessMessage);
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

  const handleTest = async () => {
    setIsRunning(true);
    try {
      await level.action({
        log: addLog,
        setResult: (result) => setLevelResult(level.id, result),
        input:
          level.kind === "balance" ||
          level.kind === "txByHash" ||
          level.kind === "subscribe" ||
          level.kind === "rpc"
            ? { address: addressInput, webhookUrl: webhookInput, txHash: addressInput }
            : undefined,
      });
      markLevelCompleted(level.id);
      if (level.kind === "connect") {
        const r = useGameStore.getState().levelResults[level.id] as
          | { address?: string }
          | undefined;
        if (r?.address) setAddressInput(r.address);
      }
      setSuccessMessage(`${level.title} complete`);
      setGuideMessage(
        `Great run. ${
          completedLevels.length + 1 < 6
            ? "Another chapter awaits."
            : "All chapters cleared. BlockVille systems are stabilizing."
        }`
      );
      window.setTimeout(() => {
        setSuccessMessage(null);
      }, 2500);
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
        className={`group relative flex flex-col justify-between rounded-xl border px-4 py-3 text-left shadow transition hover:bg-indigo-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
          isCompleted
            ? "border-blue-300/50 bg-blue-500/10 animate-fade-in"
            : "border-indigo-300/25 bg-[#0b1230]/70 hover:border-indigo-300/65"
        }`}
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
              {level.chapterName}
            </p>
            <p className="mt-1 text-sm text-indigo-50">{level.title}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-indigo-300/50 bg-indigo-500/20 text-indigo-100 transition group-hover:shadow-neon-blue">
            {isCompleted ? (
              <CheckCircle2 className="h-4 w-4 text-blue-200" />
            ) : (
              <Play className="h-4 w-4 fill-indigo-300/50" />
            )}
          </div>
        </div>
        <p className="mt-3 text-[11px] text-indigo-100/55">
          {level.description}
        </p>
        {isCompleted && (
          <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-blue-200">
            Cleared
          </p>
        )}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={level.title}
      >
        <p className="text-sm text-zinc-300">{level.description}</p>
        {level.kind === "connect" && (
          <p className="mt-2 text-xs text-amber-200/90">
            This level uses EIP-6963 to find MetaMask even if other wallets are
            installed. Unlock MetaMask and switch to Sepolia if prompted. Very old
            MetaMask builds without EIP-6963 may still need other wallets disabled.
          </p>
        )}
        <div className="mt-4">
          <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            Code Snippet
          </p>
          <CodeSnippet code={level.codeSnippet} language="typescript" />
        </div>
        {(level.kind === "balance" ||
          level.kind === "txByHash" ||
          level.kind === "subscribe" ||
          level.kind === "rpc") && (
          <div className="mt-4">
            <label
              htmlFor={`wallet-address-${level.id}`}
              className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500"
            >
              {level.kind === "txByHash" ? "Transaction Hash" : "Wallet Address"}
            </label>
            <input
              id={`wallet-address-${level.id}`}
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder={
                level.kind === "txByHash"
                  ? "0x...transactionHash"
                  : "0x..."
              }
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        )}
        {level.kind === "subscribe" && (
          <div className="mt-3">
            <label
              htmlFor={`webhook-url-${level.id}`}
              className="mb-1 block text-xs uppercase tracking-[0.14em] text-zinc-500"
            >
              Webhook URL (mock for now)
            </label>
            <input
              id={`webhook-url-${level.id}`}
              value={webhookInput}
              onChange={(e) => setWebhookInput(e.target.value)}
              placeholder="https://example.com/mock-webhook"
              className="w-full rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <p className="mt-2 text-xs text-zinc-400">
              This triggers webhook when tx happens.
            </p>
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
        <div
          ref={resultAreaRef}
          className="mt-4 scroll-mt-6 space-y-4 empty:hidden"
        >
        {walletResult && (
          <div className="rounded-lg border border-emerald-700/50 bg-emerald-900/10 p-3 text-xs">
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
        {connectWalletResult && (
          <div className="rounded-lg border border-orange-700/50 bg-orange-950/30 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-orange-300">
              Connected account
            </p>
            <p className="break-all text-zinc-100">
              <span className="text-zinc-500">Address:</span>{" "}
              {connectWalletResult.address}
            </p>
          </div>
        )}
        {balanceResult && (
          <div className="rounded-lg border border-cyan-700/50 bg-cyan-900/10 p-3 text-xs">
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
        {rpcResult && (
          <div className="rounded-lg border border-violet-700/50 bg-violet-900/10 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-violet-400">
              RPC vs Data API
            </p>
            <p className="break-all text-zinc-200">
              <span className="text-zinc-500">Address:</span> {rpcResult.address}
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">Block Number (RPC):</span>{" "}
              {rpcResult.blockNumber}
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">Data API Balance:</span>{" "}
              {rpcResult.dataApi.ethBalance === null
                ? "TODO (pending docs-confirmed field mapping)"
                : `${rpcResult.dataApi.ethBalance} ETH`}
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">RPC Balance:</span>{" "}
              {rpcResult.rpc.ethBalance} ETH
            </p>
          </div>
        )}
        {subscriptionResult && (
          <div className="rounded-lg border border-amber-700/50 bg-amber-900/10 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-amber-400">
              Subscription Result
            </p>
            <p className="text-zinc-200">
              <span className="text-zinc-500">Type:</span> {subscriptionResult.type}
            </p>
            <p className="mt-1 break-all text-zinc-200">
              <span className="text-zinc-500">Address:</span>{" "}
              {subscriptionResult.address}
            </p>
            <p className="mt-1 break-all text-zinc-200">
              <span className="text-zinc-500">Webhook URL:</span>{" "}
              {subscriptionResult.webhookUrl}
            </p>
            <button
              type="button"
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
              className="mt-3 inline-flex items-center justify-center rounded-md border border-amber-500/60 bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              Simulate Webhook Event (Mock)
            </button>
            {mockWebhookEvent && (
              <div
                ref={mockEventRef}
                className="mt-3 rounded-md border border-zinc-700 bg-black/40 p-2"
              >
                <p className="text-[11px] text-zinc-300">
                  <span className="text-zinc-500">txId:</span>{" "}
                  {mockWebhookEvent.txId}
                </p>
                <p className="mt-1 text-[11px] text-zinc-300">
                  <span className="text-zinc-500">amount:</span>{" "}
                  {mockWebhookEvent.amountEth} ETH
                </p>
                <p className="mt-1 text-[11px] text-zinc-300">
                  <span className="text-zinc-500">status:</span>{" "}
                  {mockWebhookEvent.status}
                </p>
                <p className="mt-1 text-[11px] text-zinc-300">
                  <span className="text-zinc-500">timestamp:</span>{" "}
                  {mockWebhookEvent.timestamp}
                </p>
              </div>
            )}
          </div>
        )}
        {txByHashResult && (
          <div className="rounded-lg border border-indigo-700/50 bg-indigo-900/10 p-3 text-xs">
            <p className="mb-2 font-semibold uppercase tracking-[0.18em] text-indigo-300">
              Transaction Lookup
            </p>
            <p className="break-all text-zinc-200">
              <span className="text-zinc-500">Tx Hash:</span> {txByHashResult.txHash}
            </p>
            <p className="mt-1 break-all text-zinc-200">
              <span className="text-zinc-500">From:</span>{" "}
              {txByHashResult.from ?? "Unknown"}
            </p>
            <p className="mt-1 break-all text-zinc-200">
              <span className="text-zinc-500">To:</span>{" "}
              {txByHashResult.to ?? "Contract creation"}
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">Value:</span>{" "}
              {txByHashResult.valueEth ?? "0"} ETH
            </p>
            <p className="mt-1 text-zinc-100">
              <span className="text-zinc-500">Block:</span>{" "}
              {txByHashResult.blockNumber ?? "Pending"}
            </p>
          </div>
        )}
        </div>
      </Modal>
    </>
  );
}

