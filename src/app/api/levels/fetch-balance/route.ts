import { NextResponse } from "next/server";
import { getRpcBalance } from "@/lib/tatum";

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

    const rawBalance = await getRpcBalance(address);
    const ethBalance = weiLikeToEthString(String(rawBalance));

    return NextResponse.json({
      address,
      ethBalance,
      rawBalance: String(rawBalance),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch balance.";
    return new NextResponse(message, { status: 500 });
  }
}

