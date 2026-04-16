import { NextResponse } from "next/server";
import { generateWallet } from "@/lib/tatum";

export async function POST() {
  try {
    const wallet = await generateWallet();
    return NextResponse.json({
      address: wallet.address,
      privateKey: wallet.privateKey,
      mnemonic: wallet.mnemonic,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate wallet.";
    return new NextResponse(message, { status: 500 });
  }
}

