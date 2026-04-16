import { NextResponse } from "next/server";
import { createSubscription } from "@/lib/tatum";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      address?: string;
      webhookUrl?: string;
    };

    const address = body.address?.trim();
    const webhookUrl = body.webhookUrl?.trim();

    if (!address) {
      return new NextResponse("Wallet address is required.", { status: 400 });
    }
    if (!webhookUrl) {
      return new NextResponse("Webhook URL is required.", { status: 400 });
    }

    const subscription = await createSubscription({
      address,
      url: webhookUrl,
    });

    return NextResponse.json({
      type: "ADDRESS_TRANSACTION",
      address,
      webhookUrl,
      subscription,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create subscription.";
    return new NextResponse(message, { status: 500 });
  }
}

