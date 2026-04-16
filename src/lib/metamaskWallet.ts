"use client";

/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 * MetaMask documents using this instead of `window.ethereum` when multiple wallets
 * may be installed — each wallet announces its own EIP-1193 `provider`.
 */

type EIP6963ProviderInfo = {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
};

type EIP6963ProviderDetail = {
  info: EIP6963ProviderInfo;
  provider: InjectedProvider;
};

type InjectedProvider = {
  isMetaMask?: boolean;
  request?: (args: { method: string }) => Promise<unknown>;
  providers?: InjectedProvider[];
};

/** Official MetaMask family reverse-DNS ids (MetaMask docs / EIP-6963 examples). */
const METAMASK_RDNS = new Set([
  "io.metamask",
  "io.metamask.flask",
  "io.metamask.mmi",
]);

/**
 * Discover MetaMask's EIP-1193 provider without using `window.ethereum`.
 * Works when Rabby, Phantom EVM, etc. are also installed.
 */
function discoverMetaMaskViaEip6963(timeoutMs: number): Promise<InjectedProvider | null> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(null);
      return;
    }

    const candidates: InjectedProvider[] = [];

    const onAnnounce = (event: Event) => {
      const e = event as CustomEvent<EIP6963ProviderDetail>;
      const detail = e.detail;
      if (
        detail?.provider?.request &&
        detail.info?.rdns &&
        METAMASK_RDNS.has(detail.info.rdns)
      ) {
        candidates.push(detail.provider);
      }
    };

    window.addEventListener("eip6963:announceProvider", onAnnounce);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    window.setTimeout(() => {
      window.removeEventListener("eip6963:announceProvider", onAnnounce);
      resolve(candidates[0] ?? null);
    }, timeoutMs);
  });
}

/** Legacy fallback when a wallet does not implement EIP-6963 yet. */
function getMetaMaskFromWindowEthereum(): InjectedProvider | null {
  if (typeof window === "undefined") return null;
  const ethereum = (window as unknown as { ethereum?: InjectedProvider })
    .ethereum;
  if (!ethereum) return null;
  if (ethereum.isMetaMask) return ethereum;
  if (Array.isArray(ethereum.providers)) {
    const mm = ethereum.providers.find((p) => p.isMetaMask);
    if (mm) return mm;
  }
  return null;
}

async function resolveMetaMaskProvider(): Promise<InjectedProvider | null> {
  const from6963 = await discoverMetaMaskViaEip6963(600);
  if (from6963?.request) return from6963;
  return getMetaMaskFromWindowEthereum();
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
 * Prefers EIP-6963 discovery, then falls back to `window.ethereum` / `providers`.
 */
export async function connectMetaMaskWallet(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("MetaMask connection is only available in the browser.");
  }

  const metaMask = await resolveMetaMaskProvider();
  if (!metaMask?.request) {
    throw new Error(
      "MetaMask was not found. Install a current MetaMask build (with EIP-6963 support), or temporarily disable other wallet extensions."
    );
  }

  try {
    const accounts = (await metaMask.request({
      method: "eth_requestAccounts",
    })) as unknown;

    if (!Array.isArray(accounts) || typeof accounts[0] !== "string") {
      throw new Error("MetaMask returned an unexpected response.");
    }
    return accounts[0];
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

    if (
      details.includes("Cannot set property ethereum") ||
      details.includes("only a getter") ||
      details.includes("Cannot redefine property: ethereum") ||
      details.includes("another Ethereum wallet extension")
    ) {
      throw new Error(
        "Wallet extension conflict on this page. Reload the tab after updating extensions, or use EIP-6963-capable MetaMask with other wallets still installed."
      );
    }

    throw new Error(`MetaMask: ${details}`);
  }
}
