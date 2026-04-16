import { TatumSDK, Network, Ethereum, ApiVersion } from "@tatumio/tatum";
import { EvmWalletProvider } from "@tatumio/evm-wallet-provider";

type EthereumClient = Awaited<ReturnType<typeof TatumSDK.init<Ethereum>>>;

let clientPromise: Promise<EthereumClient> | null = null;

function getApiKey() {
  const apiKey = process.env.TATUM_API_KEY_V4 ?? process.env.TATUM_API_KEY;
  if (!apiKey) {
    throw new Error(
      "TATUM_API_KEY_V4 (or TATUM_API_KEY) environment variable is required."
    );
  }
  return apiKey;
}

async function getClient(): Promise<EthereumClient> {
  if (!clientPromise) {
    clientPromise = TatumSDK.init<Ethereum>({
      network: Network.ETHEREUM_SEPOLIA,
      version: ApiVersion.V4,
      apiKey: {
        v4: getApiKey(),
      },
      configureWalletProviders: [EvmWalletProvider],
    });
  }
  return clientPromise;
}

export async function getTatumClient() {
  return getClient();
}

export async function generateWallet() {
  const tatum = await getClient();
  const walletProvider = tatum.walletProvider.use(EvmWalletProvider);

  const mnemonic = walletProvider.generateMnemonic();
  const xpub = await walletProvider.generateXpubFromMnemonic(mnemonic);
  const address = await walletProvider.generateAddressFromMnemonic(mnemonic, 0);

  return {
    mnemonic,
    xpub,
    address,
  };
}

export async function getBalance(address: string) {
  const tatum = await getClient();
  const { result } = await tatum.rpc.getBalance(address);
  return result;
}

export type SendTransactionPayload = {
  privateKey: string;
  to: string;
  value: string;
  data?: string;
  gasLimit?: string;
  gasPrice?: string;
};

export async function sendTransaction(payload: SendTransactionPayload) {
  const tatum = await getClient();
  const walletProvider = tatum.walletProvider.use(EvmWalletProvider);

  const txHash = await walletProvider.signAndBroadcast(payload);
  return txHash;
}

export type CreateSubscriptionParams = {
  address: string;
  url: string;
};

export async function createSubscription(params: CreateSubscriptionParams) {
  const tatum = await getClient();
  const subscription = await tatum.notification.subscribe.addressEvent({
    address: params.address,
    url: params.url,
  });
  return subscription;
}

