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
  const xpubDetails = await walletProvider.generateXpub(mnemonic);
  const address = await walletProvider.generateAddressFromMnemonic(mnemonic, 0);
  const privateKey = await walletProvider.generatePrivateKeyFromMnemonic(
    mnemonic,
    0
  );

  return {
    mnemonic,
    xpub: xpubDetails.xpub,
    address,
    privateKey,
  };
}

export async function getBalance(address: string) {
  const tatum = await getClient();
  const { data } = await tatum.address.getBalance({
    addresses: [address],
  });
  const firstEntry = Array.isArray(data) ? data[0] : data;
  return firstEntry;
}

export async function getRpcBalance(address: string) {
  const tatum = await getClient();
  const { result } = await tatum.rpc.getBalance(address);
  return result;
}

export async function getRpcBlockNumber() {
  const tatum = await getClient();
  const { result } = await tatum.rpc.blockNumber();
  return result;
}

export async function getRpcBlockNumberRaw() {
  const tatum = await getClient();
  return tatum.rpc.blockNumber();
}

export async function getRpcBalanceRaw(address: string) {
  const tatum = await getClient();
  return tatum.rpc.getBalance(address);
}

export async function getRpcTransactionByHash(txHash: string) {
  const tatum = await getClient();
  const tx = await tatum.rpc.getTransactionByHash(txHash);
  return tx;
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

export type CreateAddressSubscriptionParams = {
  address: string;
  url: string;
};

export async function createAddressSubscription(
  params: CreateAddressSubscriptionParams
) {
  const tatum = await getClient();
  const subscription = await tatum.notification.subscribe.addressEvent({
    address: params.address,
    url: params.url,
  });
  return subscription;
}

export async function createFailedTxsPerBlockSubscription(url: string) {
  const tatum = await getClient();
  const subscription = await tatum.notification.subscribe.failedTxsPerBlock({
    url,
  });
  return subscription;
}

