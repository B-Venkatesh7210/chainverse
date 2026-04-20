import { connectMetaMaskWallet } from "@/lib/metamaskWallet";

export type LevelActionContext = {
  log: (message: string) => void;
  setResult: (result: unknown) => void;
  input?: Record<string, string>;
};

export type LevelAction = (context: LevelActionContext) => Promise<unknown>;

export type LevelKind =
  | "wallet"
  | "balance"
  | "connect"
  | "send"
  | "subscribe"
  | "rpc";

export type Level = {
  id: string;
  kind: LevelKind;
  title: string;
  chapterName: string;
  description: string;
  introDialogues: string[];
  outroDialogues: string[];
  codeSnippet: string;
  action: LevelAction;
};

const notImplementedAction = async ({ log }: LevelActionContext) => {
  log("This chapter action is not implemented yet.");
  throw new Error("This chapter is not implemented yet.");
};

export const levels: Level[] = [
  {
    id: "forge-spark",
    kind: "wallet",
    title: "Forge Spark",
    chapterName: "The Missing Spark",
    description: "Create a new Ethereum wallet for the Tatumian's hero profile.",
    introDialogues: [
      "Tatumian! The key forge in BlockVille is dark.",
      "Without a wallet spark, no citizen can hold value.",
      "Light the forge. Create our first wallet.",
    ],
    outroDialogues: [
      "It glows! The forge is alive again!",
      "One spark restored... five cracks remain.",
    ],
    codeSnippet: `import { TatumSDK, Network, ApiVersion } from "@tatumio/tatum";
import { EvmWalletProvider } from "@tatumio/evm-wallet-provider";

const tatum = await TatumSDK.init({
  network: Network.ETHEREUM_SEPOLIA,
  version: ApiVersion.V4,
  apiKey: { v4: process.env.TATUM_API_KEY_V4! },
  configureWalletProviders: [EvmWalletProvider],
});

const walletProvider = tatum.walletProvider.use(EvmWalletProvider);
const mnemonic = walletProvider.generateMnemonic();
const xpubDetails = await walletProvider.generateXpub(mnemonic);
const address = await walletProvider.generateAddressFromMnemonic(mnemonic, 0);
const privateKey = await walletProvider.generatePrivateKeyFromMnemonic(mnemonic, 0);

console.log({ mnemonic, xpub: xpubDetails.xpub, address, privateKey });`,
    action: async ({ log, setResult }) => {
      log("Forge Spark: generating wallet on Ethereum Sepolia...");
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
      log(`Forge Spark complete: ${wallet.address}`);
      return result;
    },
  },
  {
    id: "treasury-whisper",
    kind: "balance",
    title: "Treasury Whisper",
    chapterName: "The Silent Treasury",
    description: "Read the current balance of a selected wallet address.",
    introDialogues: [
      "Our treasury vault is sealed in silence.",
      "No one knows what balance remains.",
      "Ask the chain. Hear the vault whisper.",
    ],
    outroDialogues: [
      "The vault answered! We can read our balance again.",
      "Good. Resources mean hope.",
    ],
    codeSnippet: `import { TatumSDK, Network, Ethereum, ApiVersion } from "@tatumio/tatum";
import { EvmWalletProvider } from "@tatumio/evm-wallet-provider";

const tatum = await TatumSDK.init<Ethereum>({
  network: Network.ETHEREUM_SEPOLIA,
  version: ApiVersion.V4,
  apiKey: { v4: process.env.TATUM_API_KEY_V4! },
  configureWalletProviders: [EvmWalletProvider],
});

const address = "YOUR_WALLET_ADDRESS";
const { result } = await tatum.rpc.getBalance(address);
console.log({ address, rawBalance: result });`,
    action: async ({ log, setResult, input }) => {
      const address = input?.address?.trim();
      if (!address) throw new Error("Wallet address is required.");

      log(`Treasury Whisper: fetching balance for ${address}`);
      const response = await fetch("/api/levels/fetch-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        `Treasury Whisper complete: ${result.ethBalance} ETH for ${result.address}`
      );
      return result;
    },
  },
  {
    id: "gateway-oath",
    kind: "connect",
    title: "Gateway Oath",
    chapterName: "The Traveler Gate",
    description:
      "Connect MetaMask in the browser and read the active account address.",
    introDialogues: [
      "A steel gate blocks our road, Tatumian.",
      "It opens only for travelers who bind a wallet oath.",
      "Connect your wallet and claim your name.",
    ],
    outroDialogues: [
      "The gate bowed to your signature.",
      "You are now recognized by BlockVille.",
    ],
    codeSnippet: `import { TatumSDK, Network, Ethereum, MetaMask, ApiVersion } from "@tatumio/tatum";

const tatum = await TatumSDK.init<Ethereum>({
  network: Network.ETHEREUM_SEPOLIA,
  version: ApiVersion.V4,
  apiKey: process.env.NEXT_PUBLIC_TATUM_API_KEY_V4
});

const account = await tatum.walletProvider.use(MetaMask).getWallet();
console.log(account);
`,
    action: async ({ log, setResult }) => {
      log("Gateway Oath: requesting MetaMask connection...");
      const address = await connectMetaMaskWallet();
      const result = { address };
      setResult(result);
      log(`Gateway Oath complete: connected ${address}`);
      return result;
    },
  },
  {
    id: "courier-flame",
    kind: "send",
    title: "Courier Flame",
    chapterName: "The Burned Courier",
    description: "Broadcast a signed value transfer on Ethereum Sepolia.",
    introDialogues: [
      "Our courier lines are broken by fire.",
      "Soon we must send value across the valley again.",
      "For now, study the transmission spell.",
    ],
    outroDialogues: [
      "You've learned the courier spell.",
      "When you're ready, we can ignite real transfers.",
    ],
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
    id: "watchtower-bell",
    kind: "subscribe",
    title: "Watchtower Bell",
    chapterName: "The Sleeping Bell",
    description: "Subscribe to address activity with a webhook endpoint.",
    introDialogues: [
      "The watchtower bell sleeps. No alerts, no warning.",
      "We must hear every transaction passing our walls.",
      "Wake the bell with a subscription.",
    ],
    outroDialogues: [
      "The bell rings again! We'll know when tx storms hit.",
      "Excellent. One last mystery waits.",
    ],
    codeSnippet: `const response = await fetch("/api/levels/create-subscription", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    address: "WATCH_ADDRESS",
    webhookUrl: "https://example.com/webhook",
  }),
});
const result = await response.json();
console.log(result.type); // ADDRESS_TRANSACTION`,
    action: async ({ log, setResult, input }) => {
      const address = input?.address?.trim();
      const webhookUrl = input?.webhookUrl?.trim();
      if (!address) throw new Error("Wallet address is required.");
      if (!webhookUrl) throw new Error("Webhook URL is required.");

      log(
        `Watchtower Bell: creating ADDRESS_TRANSACTION subscription for ${address}`
      );
      const response = await fetch("/api/levels/create-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, webhookUrl }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create subscription.");
      }
      const result = (await response.json()) as {
        type: string;
        address: string;
        webhookUrl: string;
        subscription: unknown;
      };
      setResult(result);
      log(`Watchtower Bell complete: subscription for ${result.address}`);
      return result;
    },
  },
  {
    id: "oracle-rift",
    kind: "rpc",
    title: "Oracle Rift",
    chapterName: "The Rift of Numbers",
    description: "Query chain state directly with Tatum RPC calls.",
    introDialogues: [
      "The oracle rift is unstable — data bends and cracks.",
      "We need raw chain truth to seal it.",
      "Call block number and balance directly through RPC.",
    ],
    outroDialogues: [
      "The rift calmed. Raw truth holds the village steady.",
      "BlockVille stands. You are truly Tatumian now.",
    ],
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
      if (!address) throw new Error("Wallet address is required.");

      log(`Oracle Rift: RPC blockNumber + getBalance for ${address}`);
      const response = await fetch("/api/levels/fetch-rpc-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch RPC data.");
      }

      const result = (await response.json()) as {
        blockNumber: string;
        rpc: { ethBalance: string; rawJsonRpc: unknown };
        dataApi: { ethBalance: string | null };
        rawBlockNumberJsonRpc: unknown;
      };
      setResult(result);
      log(`Oracle Rift complete: blockNumber=${result.blockNumber}`);
      log(`Oracle Rift raw blockNumber: ${JSON.stringify(result.rawBlockNumberJsonRpc)}`);
      log(`Oracle Rift raw getBalance: ${JSON.stringify(result.rpc.rawJsonRpc)}`);
      if (result.dataApi.ethBalance === null) {
        log("Oracle Rift compare: TODO - Data API mapping pending docs confirmation.");
      } else {
        log(
          `Oracle Rift compare: Data API=${result.dataApi.ethBalance} ETH vs RPC=${result.rpc.ethBalance} ETH`
        );
      }
      return result;
    },
  },
];

