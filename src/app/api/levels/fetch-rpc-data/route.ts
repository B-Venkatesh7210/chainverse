import { NextResponse } from "next/server";
import {
  getBalance,
  getRpcBalanceRaw,
  getRpcBlockNumberRaw,
} from "@/lib/tatum";

function weiLikeToEthString(value: string): string {
  const normalized = value.startsWith("0x")
    ? BigInt(value).toString(10)
    : BigInt(value).toString(10);

  const padded = normalized.padStart(19, "0");
  const whole = padded.slice(0, -18);
  const fraction = padded.slice(-18).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { address?: string };
    const address = body.address?.trim();

    if (!address) {
      return new NextResponse("Wallet address is required.", { status: 400 });
    }

    const [blockNumberRpcRaw, balanceRpcRaw, dataApiEntry] = await Promise.all([
      getRpcBlockNumberRaw(),
      getRpcBalanceRaw(address),
      getBalance(address),
    ]);

    const rpcBalanceResult = String(
      (balanceRpcRaw as { result?: string }).result ?? "0"
    );

    return NextResponse.json({
      address,
      blockNumber: String(
        (blockNumberRpcRaw as { result?: string }).result ?? "0"
      ),
      rpc: {
        ethBalance: weiLikeToEthString(rpcBalanceResult),
        rawBalance: rpcBalanceResult,
        rawJsonRpc: balanceRpcRaw,
      },
      dataApi: {
        // TODO: Map a concrete native-balance field only after confirming exact
        // Tatum Data API response shape from the provided docs.
        ethBalance: null,
        rawBalance: null,
        rawData: dataApiEntry,
      },
      rawBlockNumberJsonRpc: blockNumberRpcRaw,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch RPC data.";
    return new NextResponse(message, { status: 500 });
  }
}

