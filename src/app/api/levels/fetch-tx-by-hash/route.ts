import { NextResponse } from "next/server";
import { getRpcTransactionByHash } from "@/lib/tatum";

function weiHexToEthString(value: string): string {
  const wei = BigInt(value);
  const negative = wei < 0n;
  const absWei = negative ? -wei : wei;
  const whole = absWei / 1000000000000000000n;
  const fraction = (absWei % 1000000000000000000n)
    .toString()
    .padStart(18, "0")
    .replace(/0+$/, "");
  const formatted = fraction ? `${whole.toString()}.${fraction}` : whole.toString();
  return negative ? `-${formatted}` : formatted;
}

function weiLikeToEthString(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    if (value.startsWith("0x") || value.startsWith("0X")) {
      return weiHexToEthString(value);
    }
    return weiHexToEthString(BigInt(value).toString());
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { txHash?: string };
    const txHash = body.txHash?.trim();

    if (!txHash) {
      return new NextResponse("Transaction hash is required.", { status: 400 });
    }

    const tx = (await getRpcTransactionByHash(txHash)) as
      | {
          id?: number;
          jsonrpc?: string;
          result?: {
            hash?: string;
            from?: string;
            to?: string | null;
            value?: string;
            blockNumber?: string | null;
            nonce?: string;
            gas?: string;
            gasPrice?: string;
            input?: string;
          } | null;
        }
      | {
          hash?: string;
          from?: string;
          to?: string | null;
          value?: string;
          blockNumber?: string | null;
          nonce?: string;
          gas?: string;
          gasPrice?: string;
          input?: string;
        }
      | null;

    if (!tx) {
      return new NextResponse("Transaction not found on Ethereum Sepolia.", {
        status: 404,
      });
    }

    const txResult =
      "result" in tx && tx.result && typeof tx.result === "object"
        ? tx.result
        : tx;

    return NextResponse.json({
      txHash: txResult.hash ?? txHash,
      from: txResult.from ?? null,
      to: txResult.to ?? null,
      value: txResult.value ?? null,
      valueEth: weiLikeToEthString(txResult.value),
      blockNumber: txResult.blockNumber ?? null,
      nonce: txResult.nonce ?? null,
      gas: txResult.gas ?? null,
      gasPrice: txResult.gasPrice ?? null,
      input: txResult.input ?? null,
      raw: txResult,
      rawJsonRpc: tx,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch transaction.";
    return new NextResponse(message, { status: 500 });
  }
}

