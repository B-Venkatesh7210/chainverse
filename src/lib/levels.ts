export type LevelActionContext = {
  log: (message: string) => void;
  setResult: (result: unknown) => void;
  input?: Record<string, string>;
};

export type LevelAction = (context: LevelActionContext) => Promise<unknown>;

export type Level = {
  id: number;
  title: string;
  description: string;
  codeSnippet: string;
  action: LevelAction;
};

const notImplementedAction = async ({ log }: LevelActionContext) => {
  log("This level is not implemented yet.");
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
    action: async ({ log, setResult }) => {
      log("Level 1 started: generating wallet on Ethereum Sepolia...");
      const response = await fetch("/api/levels/generate-wallet", {
        method: "POST",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to generate wallet.");
      }
      const wallet = (await response.json()) as {
        address: string;
        privateKey: string;
        mnemonic?: string;
      };
      const result = {
        address: wallet.address,
        privateKey: wallet.privateKey,
        mnemonic: wallet.mnemonic,
      };
      setResult(result);
      log(`Wallet generated: ${wallet.address}`);
      return result;
    },
  },
  {
    id: 2,
    title: "Fetch Balance",
    description: "Read the current balance of a selected wallet address.",
    codeSnippet: `import { getBalance } from "@/lib/tatum";

const address = "YOUR_WALLET_ADDRESS";
const balance = await getBalance(address);
console.log(balance);`,
    action: async ({ log, setResult, input }) => {
      const address = input?.address?.trim();
      if (!address) {
        throw new Error("Wallet address is required.");
      }

      log(`Level 2 request: fetching balance for ${address}`);
      const response = await fetch("/api/levels/fetch-balance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch balance.");
      }

      const result = (await response.json()) as {
        address: string;
        ethBalance: string;
        rawBalance: string;
      };

      setResult(result);
      log(
        `Level 2 response: ${result.address} has ${result.ethBalance} ETH (raw: ${result.rawBalance})`
      );

      return result;
    },
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
    codeSnippet: `const response = await fetch("/api/levels/fetch-rpc-data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ address: "YOUR_WALLET_ADDRESS" }),
});
const result = await response.json();
console.log(result.rawBlockNumberJsonRpc);
console.log(result.rpc.rawJsonRpc);`,
    action: async ({ log, setResult, input }) => {
      const address = input?.address?.trim();
      if (!address) {
        throw new Error("Wallet address is required.");
      }

      log(`Level 5 request: RPC blockNumber + getBalance for ${address}`);
      const response = await fetch("/api/levels/fetch-rpc-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch RPC data.");
      }

      const result = (await response.json()) as {
        blockNumber: string;
        rpc: { ethBalance: string; rawJsonRpc: unknown };
        dataApi: { ethBalance: string };
        rawBlockNumberJsonRpc: unknown;
      };

      setResult(result);
      log(`Level 5 response: blockNumber=${result.blockNumber}`);
      log(`Level 5 raw JSON-RPC blockNumber: ${JSON.stringify(result.rawBlockNumberJsonRpc)}`);
      log(`Level 5 raw JSON-RPC getBalance: ${JSON.stringify(result.rpc.rawJsonRpc)}`);
      log(
        `Level 5 compare: Data API=${result.dataApi.ethBalance} ETH vs RPC=${result.rpc.ethBalance} ETH`
      );

      return result;
    },
  },
];

