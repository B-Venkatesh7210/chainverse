export type LevelAction = () => Promise<unknown>;

export type Level = {
  id: number;
  title: string;
  description: string;
  codeSnippet: string;
  action: LevelAction;
};

const notImplementedAction = async () => {
  throw new Error("Level action is not implemented yet.");
};

export const levels: Level[] = [
  {
    id: 1,
    title: "Generate Wallet",
    description: "Create a new Ethereum wallet for the player profile.",
    codeSnippet: `import { generateWallet } from "@/lib/tatum";

const wallet = await generateWallet();
console.log(wallet);`,
    action: notImplementedAction,
  },
  {
    id: 2,
    title: "Fetch Balance",
    description: "Read the current balance of a selected wallet address.",
    codeSnippet: `import { getBalance } from "@/lib/tatum";

const address = "YOUR_WALLET_ADDRESS";
const balance = await getBalance(address);
console.log(balance);`,
    action: notImplementedAction,
  },
  {
    id: 3,
    title: "Send Transaction",
    description: "Broadcast a signed value transfer on Ethereum Sepolia.",
    codeSnippet: `import { sendTransaction } from "@/lib/tatum";

const txHash = await sendTransaction({
  privateKey: process.env.WALLET_PRIVATE_KEY!,
  to: "RECIPIENT_ADDRESS",
  value: "AMOUNT_IN_ETH",
});
console.log(txHash);`,
    action: notImplementedAction,
  },
  {
    id: 4,
    title: "Enable Notifications",
    description: "Subscribe to address activity using a webhook endpoint.",
    codeSnippet: `import { createSubscription } from "@/lib/tatum";

const sub = await createSubscription({
  address: "WATCH_ADDRESS",
  url: process.env.NOTIFICATION_WEBHOOK_URL!,
});
console.log(sub);`,
    action: notImplementedAction,
  },
  {
    id: 5,
    title: "Fetch Block Data (RPC)",
    description: "Query chain state directly through the Tatum RPC client.",
    codeSnippet: `import { getTatumClient } from "@/lib/tatum";

const tatum = await getTatumClient();
const blockNumber = await tatum.rpc.blockNumber();
console.log(blockNumber);`,
    action: notImplementedAction,
  },
];

