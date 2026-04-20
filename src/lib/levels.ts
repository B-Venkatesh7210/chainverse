import { connectMetaMaskWallet, sendEthWithMetaMask } from "@/lib/metamaskWallet";

export const tutorialPrologueDialogues: string[] = [
  "Tatumian... you finally arrived. This is BlockVille.",
  "Once, every lane here flowed with clean on-chain energy.",
  "Then the Great Desync hit — wallets fractured, signals died, alerts went silent.",
  "I am only a villager. I can tell the story, but I cannot repair the Ville.",
  "You can. With Tatum tools, chapter by chapter, we rebuild what was lost.",
  "Stay with me. I will show the problem. You will restore the solution. Let's Goooo!",
];

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
    id: "wallet-creation",
    kind: "wallet",
    title: "Wallet Creation",
    chapterName: "Wallets are lost",
    description: "Create a new Ethereum wallet for the villagers and Tatumian.",
    introDialogues: [
      "Tatumian! The villagers have lost their wallets.",
      "We need to create a new wallet for each villager.",
      "Let's instruct them in creating a new wallet.",
    ],
    outroDialogues: [
      "That's great. You successfully created a new wallet for the villagers and Tatumian.",
      "We have more problems ahead to address Tatumian.",
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
      log("Wallet Creation: generating wallet on Ethereum Sepolia...");
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
      log(`Wallet Creation complete: ${wallet.address}`);
      return result;
    },
  },
  {
    id: "treasury-whisper",
    kind: "balance",
    title: "Treasury Whisper",
    chapterName: "The Demolished Treasury",
    description: "Read the current balance of a selected wallet address.",
    introDialogues: [
      "The DeSync hit our Treasury Vault.",
      "We need to know how much money is left in the vault.",
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
    id: "Vault Connection",
    kind: "connect",
    title: "Vault Connection",
    chapterName: "Connecting Wallet to the Vault",
    description:
      "Connect MetaMask in the browser and read the active account address.",
    introDialogues: [
      "The Villagers are finding it difficult to connect their wallets to the vault.",
      "We will have to instruct them on how to do it using MetaMask.",
      "Let's show them how to connect wallet to the vault.",
    ],
    outroDialogues: [
      "Vault accepted the connection. Cheers!",
      "Now the BlockVille villagers can start transacting with the vault.",
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
      log("Vault Connection: requesting MetaMask connection...");
      const address = await connectMetaMaskWallet();
      const result = { address };
      setResult(result);
      log(`Vault Connection complete: connected ${address}`);
      return result;
    },
  },
  {
    id: "Broken Lanes",
    kind: "send",
    title: "Broken Lanes",
    chapterName: "Sending Funds Across the Ville",
    description: "Broadcast a signed value transfer on Ethereum Sepolia.",
    introDialogues: [
      "The lanes for sending funds are broken by thunderstorms.",
      "We need to fix them ASAP to send funds over.",
    ],
    outroDialogues: [
      "The lanes now look superfine.",
      "The shipments are ready to roll.",
    ],
    codeSnippet: `import { TatumSDK, Network, Ethereum, MetaMask, ApiVersion } from "@tatumio/tatum";

const tatum = await TatumSDK.init<Ethereum>({
  network: Network.ETHEREUM_SEPOLIA,
  version: ApiVersion.V4,
  apiKey: { v4: process.env.NEXT_PUBLIC_TATUM_API_KEY_V4! },
});

const wallet = tatum.walletProvider.use(MetaMask);
const from = await wallet.getWallet();
const to = "RECIPIENT_ADDRESS";
const amount = "0.00001";

const txHash = await wallet.transferNative(to, amount);
console.log({ from, to, amount, txHash });`,
    action: async ({ log, setResult, input }) => {
      const recipient = input?.address?.trim();
      if (!recipient) {
        throw new Error("Recipient address is required.");
      }

      log(`Broken Lanes: preparing 0.00001 ETH transfer to ${recipient}`);
      const result = await sendEthWithMetaMask(recipient, "0.00001");
      setResult(result);
      log(`Broken Lanes complete: tx ${result.txHash}`);
      return result;
    },
  },
  {
    id: "watchtower-bell",
    kind: "subscribe",
    title: "Watchtower Bell",
    chapterName: "The Sleeping Bell",
    description: "Subscribe to address activity with a webhook endpoint.",
    introDialogues: [
      "The watchtower bell has been destroyed by the DeSync. No alerts, no warning.",
      "We must hear every transaction happening in the Ville.",
      "Wake the bell with a subscription.",
    ],
    outroDialogues: [
      "The bell rings again! We'll know when txn hits",
      "Excellent work Tatumian. We are now in control of the Ville.",
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
//   {
//     id: "oracle-rift",
//     kind: "rpc",
//     title: "Oracle Rift",
//     chapterName: "The Rift of Numbers",
//     description: "Query chain state directly with Tatum RPC calls.",
//     introDialogues: [
//       "The oracle rift is unstable — data bends and cracks.",
//       "We need raw chain truth to seal it.",
//       "Call block number and balance directly through RPC.",
//     ],
//     outroDialogues: [
//       "The rift calmed. Raw truth holds the village steady.",
//       "BlockVille stands. You are truly Tatumian now.",
//     ],
//     codeSnippet: `const response = await fetch("/api/levels/fetch-rpc-data", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({ address: "YOUR_WALLET_ADDRESS" }),
// });
// const result = await response.json();
// console.log(result.rawBlockNumberJsonRpc);
// console.log(result.rpc.rawJsonRpc);`,
//     action: async ({ log, setResult, input }) => {
//       const address = input?.address?.trim();
//       if (!address) throw new Error("Wallet address is required.");

//       log(`Oracle Rift: RPC blockNumber + getBalance for ${address}`);
//       const response = await fetch("/api/levels/fetch-rpc-data", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ address }),
//       });
//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(errorText || "Failed to fetch RPC data.");
//       }

//       const result = (await response.json()) as {
//         blockNumber: string;
//         rpc: { ethBalance: string; rawJsonRpc: unknown };
//         dataApi: { ethBalance: string | null };
//         rawBlockNumberJsonRpc: unknown;
//       };
//       setResult(result);
//       log(`Oracle Rift complete: blockNumber=${result.blockNumber}`);
//       log(`Oracle Rift raw blockNumber: ${JSON.stringify(result.rawBlockNumberJsonRpc)}`);
//       log(`Oracle Rift raw getBalance: ${JSON.stringify(result.rpc.rawJsonRpc)}`);
//       if (result.dataApi.ethBalance === null) {
//         log("Oracle Rift compare: TODO - Data API mapping pending docs confirmation.");
//       } else {
//         log(
//           `Oracle Rift compare: Data API=${result.dataApi.ethBalance} ETH vs RPC=${result.rpc.ethBalance} ETH`
//         );
//       }
//       return result;
//     },
//   },
];

