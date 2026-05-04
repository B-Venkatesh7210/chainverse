import { NextResponse } from "next/server";

type GeneratedLevel = {
  id: string;
  kind: "balance" | "txByHash" | "price" | "subscribe" | "rpc";
  title: string;
  chapterName: string;
  description: string;
  introDialogues: { text: string; emotion: "happy" | "idea" | "thinking" | "victory" | "worried" }[];
  outroDialogues: { text: string; emotion: "happy" | "idea" | "thinking" | "victory" | "worried" }[];
  codeSnippet: string;
  defaultInput?: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 36);
}

function detectKind(prompt: string): GeneratedLevel["kind"] {
  const p = prompt.toLowerCase();
  if (p.includes("price") || p.includes("rate") || p.includes("symbol")) return "price";
  if (p.includes("hash") || p.includes("transaction")) return "txByHash";
  if (p.includes("webhook") || p.includes("subscribe") || p.includes("alert")) return "subscribe";
  if (p.includes("rpc") || p.includes("block number")) return "rpc";
  return "balance";
}

function getSnippet(kind: GeneratedLevel["kind"]): string {
  switch (kind) {
    case "price":
      return `const response = await fetch("/api/levels/fetch-exchange-price", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ symbol: "ETH", basePair: "USD" }),
});
const result = await response.json();
console.log(result.rate);`;
    case "txByHash":
      return `const response = await fetch("/api/levels/fetch-tx-by-hash", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ txHash: "0xYOUR_TX_HASH" }),
});
const result = await response.json();
console.log(result);`;
    case "subscribe":
      return `const response = await fetch("/api/levels/create-subscription", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ webhookUrl: "https://example.com/webhook" }),
});
const result = await response.json();
console.log(result.type);`;
    case "rpc":
      return `const response = await fetch("/api/levels/fetch-rpc-data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ address: "0x..." }),
});
const result = await response.json();
console.log(result.rpc);`;
    case "balance":
    default:
      return `const response = await fetch("/api/levels/fetch-balance", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ address: "0x..." }),
});
const result = await response.json();
console.log(result.ethBalance);`;
  }
}

function getDefaults(kind: GeneratedLevel["kind"]): string | undefined {
  switch (kind) {
    case "price":
      return "ETH";
    case "subscribe":
      return "https://example.com/webhook";
    case "txByHash":
      return "0x...";
    default:
      return "0x...";
  }
}

function makeLevel(prompt: string): GeneratedLevel {
  const kind = detectKind(prompt);
  const core = slugify(prompt) || "custom-level";
  const id = `custom-${core}-${Date.now().toString(36)}`;
  const title = prompt.length > 42 ? `${prompt.slice(0, 42).trim()}...` : prompt;
  const chapterName = `Custom Quest: ${kind.toUpperCase()}`;

  return {
    id,
    kind,
    title,
    chapterName,
    description: `User-generated mission: ${prompt}`,
    introDialogues: [
      { text: "A traveler arrived with a brand new request for BlockVille.", emotion: "worried" },
      { text: `They asked us to solve: "${prompt}"`, emotion: "thinking" },
      { text: "Let us craft this custom challenge and restore the flow.", emotion: "idea" },
    ],
    outroDialogues: [
      { text: "Excellent. This custom mission is complete.", emotion: "victory" },
      { text: "The villagers now have another path to train their skills.", emotion: "happy" },
    ],
    codeSnippet: getSnippet(kind),
    defaultInput: getDefaults(kind),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { prompt?: string };
    const prompt = body.prompt?.trim();
    if (!prompt || prompt.length < 8) {
      return new NextResponse("Prompt must be at least 8 characters long.", { status: 400 });
    }
    return NextResponse.json(makeLevel(prompt));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate level.";
    return new NextResponse(message, { status: 500 });
  }
}

