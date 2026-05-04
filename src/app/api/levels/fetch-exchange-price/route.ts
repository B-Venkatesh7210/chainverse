import { NextResponse } from "next/server";

type RateLike = {
  symbol?: string;
  basePair?: string;
  rate?: string | number;
  value?: string | number;
  price?: string | number;
  timestamp?: string;
  time?: string;
};

function getApiKey(): string {
  const apiKey = process.env.TATUM_API_KEY_V4 ?? process.env.TATUM_API_KEY;
  if (!apiKey) {
    throw new Error("TATUM_API_KEY_V4 (or TATUM_API_KEY) environment variable is required.");
  }
  return apiKey;
}

function normalizeRate(payload: unknown): RateLike | null {
  if (!payload) return null;
  if (Array.isArray(payload)) {
    return (payload[0] as RateLike | undefined) ?? null;
  }
  if (typeof payload === "object") {
    const p = payload as { data?: unknown };
    if (Array.isArray(p.data)) {
      return (p.data[0] as RateLike | undefined) ?? null;
    }
    if (p.data && typeof p.data === "object") {
      return p.data as RateLike;
    }
    return payload as RateLike;
  }
  return null;
}

function pickRateValue(rate: RateLike): string {
  const raw = rate.rate ?? rate.value ?? rate.price;
  if (raw === undefined || raw === null) return "0";
  return String(raw);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      symbol?: string;
      basePair?: string;
    };

    const symbol = body.symbol?.trim().toUpperCase();
    const basePair = body.basePair?.trim().toUpperCase() || "USD";

    if (!symbol) {
      return new NextResponse("Symbol is required.", { status: 400 });
    }

    const apiKey = getApiKey();
    const url = `https://api.tatum.io/v4/data/rate/symbol?symbol=${encodeURIComponent(
      symbol
    )}&basePair=${encodeURIComponent(basePair)}`;

    const response = await fetch(url, {
      headers: {
        "x-api-key": apiKey,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new NextResponse(errorText || "Failed to fetch exchange rate.", {
        status: response.status,
      });
    }

    const payload = (await response.json()) as unknown;
    const rateLike = normalizeRate(payload);

    if (!rateLike) {
      return new NextResponse("No exchange rate returned by Tatum.", { status: 404 });
    }

    return NextResponse.json({
      symbol: rateLike.symbol ?? symbol,
      basePair: rateLike.basePair ?? basePair,
      rate: pickRateValue(rateLike),
      fetchedAt: rateLike.timestamp ?? rateLike.time ?? null,
      raw: payload,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch exchange rate.";
    return new NextResponse(message, { status: 500 });
  }
}

