"use client";

import { ApiVersion, MetaMask, Network, TatumSDK, type Ethereum } from "@tatumio/tatum";

type EthereumClient = Awaited<ReturnType<typeof TatumSDK.init<Ethereum>>>;

let browserClientPromise: Promise<EthereumClient> | null = null;
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

function getPublicApiKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_TATUM_API_KEY_V4 ?? process.env.NEXT_PUBLIC_TATUM_API_KEY
  );
}

async function getBrowserTatumClient(): Promise<EthereumClient> {
  if (typeof window === "undefined") {
    throw new Error("MetaMask operations are only available in the browser.");
  }

  if (!browserClientPromise) {
    const apiKey = getPublicApiKey();
    browserClientPromise = TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
      version: ApiVersion.V4,
      ...(apiKey ? { apiKey: { v4: apiKey } } : {}),
    });
  }

  return browserClientPromise;
}

type InjectedProvider = {
  isMetaMask?: boolean;
  request?: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  providers?: InjectedProvider[];
};

function getMetaMaskProviderFromWindow(): InjectedProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as unknown as { ethereum?: InjectedProvider }).ethereum;
  if (!ethereum) return null;
  if (ethereum.isMetaMask) return ethereum;
  if (Array.isArray(ethereum.providers)) {
    const metaMaskProvider = ethereum.providers.find((p) => p.isMetaMask);
    if (metaMaskProvider) return metaMaskProvider;
  }
  return null;
}

async function ensureSepoliaNetwork(): Promise<void> {
  const provider = getMetaMaskProviderFromWindow();
  if (!provider?.request) return;

  await provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
  });
}

function formatWalletRejection(error: unknown): string {
  if (error instanceof Error) return error.message;
  const o = error as { message?: string; code?: number };
  if (typeof o?.message === "string" && o.message.length > 0) {
    return o.code !== undefined ? `${o.message} (code ${o.code})` : o.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

/**
 * Connect MetaMask and return the selected account address.
 *
 * Uses Tatum SDK MetaMask wallet provider.
 */
export async function connectMetaMaskWallet(): Promise<string> {
  try {
    await ensureSepoliaNetwork();
    const tatum = await getBrowserTatumClient();
    const address = await tatum.walletProvider.use(MetaMask).getWallet();
    if (!address) throw new Error("MetaMask returned an empty wallet address.");
    return address;
  } catch (error) {
    const details = formatWalletRejection(error);
    const o = error as { code?: number };

    if (o?.code === 4001) {
      throw new Error(
        "MetaMask: request was rejected. Open MetaMask, unlock it, and approve the connection for this site."
      );
    }

    if (
      details.includes("User denied") ||
      details.includes("denied account access") ||
      details.includes("rejected")
    ) {
      throw new Error(
        "MetaMask did not authorize this site. Open the MetaMask extension, unlock it, approve the connection, then try again."
      );
    }

    throw new Error(`MetaMask: ${details}`);
  }
}

export type MetaMaskSendResult = {
  from: string;
  to: string;
  amountEth: string;
  txHash: string;
};

export async function sendEthWithMetaMask(
  to: string,
  amountEth: string
): Promise<MetaMaskSendResult> {
  const recipient = to.trim();
  if (!recipient) {
    throw new Error("Recipient address is required.");
  }

  try {
    await ensureSepoliaNetwork();
    const tatum = await getBrowserTatumClient();
    const walletProvider = tatum.walletProvider.use(MetaMask);
    const from = await walletProvider.getWallet();
    const txHash = await walletProvider.transferNative(recipient, amountEth);

    return {
      from,
      to: recipient,
      amountEth,
      txHash,
    };
  } catch (error) {
    const details = formatWalletRejection(error);
    const code = (error as { code?: number })?.code;

    if (code === 4001) {
      throw new Error(
        "MetaMask request rejected. Approve account access and transaction signing."
      );
    }
    if (code === 4902) {
      throw new Error(
        "Sepolia network is not available in MetaMask. Add Sepolia and retry."
      );
    }

    throw new Error(`MetaMask send failed: ${details}`);
  }
}
