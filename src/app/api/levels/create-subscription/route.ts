import { NextResponse } from "next/server";
import { createFailedTxsPerBlockSubscription } from "@/lib/tatum";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      webhookUrl?: string;
    };

    const webhookUrl = body.webhookUrl?.trim();

    if (!webhookUrl) {
      return new NextResponse("Webhook URL is required.", { status: 400 });
    }

    const subscription = await createFailedTxsPerBlockSubscription(webhookUrl);

    return NextResponse.json({
      type: "FAILED_TXS_PER_BLOCK",
      webhookUrl,
      subscription,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create subscription.";
    return new NextResponse(message, { status: 500 });
  }
}

