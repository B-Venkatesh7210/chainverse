# Tatum Data API - Complete Parameter Reference

This document provides comprehensive parameter documentation for all Tatum v4 Data API endpoints, extracted from the OpenAPI specification.

**Base URL**: `https://api.tatum.io`

**Authentication**: All endpoints require an API key passed via the `X-API-Key` header.

---

## Table of Contents

- [Exchange Rate APIs](#exchange-rate-apis)
- [Wallet APIs](#wallet-apis)
- [Transaction APIs](#transaction-apis)
- [Token APIs](#token-apis)
- [NFT APIs](#nft-apis)
- [Blockchain APIs](#blockchain-apis)
- [DeFi APIs](#defi-apis)
- [Staking APIs](#staking-apis)
- [Mining APIs](#mining-apis)
- [Marketplace APIs](#marketplace-apis)
- [Fee Estimation APIs](#fee-estimation-apis)
- [Web3 Name Service APIs](#web3-name-service-apis)

---

## Exchange Rate APIs

### GET /v4/data/rate/symbol
Get current exchange rate for a single symbol.

**Credits**: 20 per API call

**Query Parameters**:
- `symbol` (required): Currency symbol (e.g., "BTC", "ETH")
  - Type: string
  - Example: `BTC`
- `basePair` (optional): Target fiat currency (default: EUR)
  - Type: string
  - Example: `USD`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/rate/symbol?symbol=BTC&basePair=USD" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### POST /v4/data/rate/symbol/batch
Get current exchange rates for multiple symbols in a single batch request.

**Credits**: 20 per pair per API call

**Request Body**: Array of objects

**Body Parameters**:
Each object in the array must contain:
- `symbol` (required): FIAT or crypto asset
  - Type: string
  - Example: `BTC`
- `basePair` (required): Base pair for exchange rate
  - Type: string
  - Example: `USD`
- `batchId` (required): Identifier for this pair (returned with result)
  - Type: string
  - Example: `1`

**Response**: Array of exchange rate objects with corresponding `batchId`

**Complete JavaScript Example**:
```javascript
const getBatchRatesBySymbol = async () => {
  const url = 'https://api.tatum.io/v4/data/rate/symbol/batch';

  const requestBody = [
    { basePair: 'USD', batchId: '1', symbol: 'BTC' },
    { basePair: 'USD', batchId: '2', symbol: 'ETH' },
    { basePair: 'USD', batchId: '3', symbol: 'SOL' }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('Exchange rates:', data);
  return data;
};

// Example response:
// [
//   { batchId: '1', symbol: 'BTC', basePair: 'USD', value: '45000.50', timestamp: '2026-04-17T12:00:00Z' },
//   { batchId: '2', symbol: 'ETH', basePair: 'USD', value: '3200.75', timestamp: '2026-04-17T12:00:00Z' },
//   { batchId: '3', symbol: 'SOL', basePair: 'USD', value: '150.25', timestamp: '2026-04-17T12:00:00Z' }
// ]
```

---

### GET /v4/data/rate/contract
Get current exchange rate by chain and contract address.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain to work with
  - Type: string
  - Example: `ethereum-mainnet`
- `contractAddress` (required): Smart contract address
  - Type: string
  - Example: `0xdAC17F958D2ee523a2206206994597C13D831ec7`
- `basePair` (optional): Target fiat asset (default: EUR)
  - Type: string
  - Example: `USD`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/rate/contract?chain=ethereum-mainnet&contractAddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&basePair=USD" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### POST /v4/data/rate/contract/batch
Get current exchange rates by chain and contract address for multiple pairs in one request.

**Credits**: 20 per pair per API call

**Limits**:
- Maximum 25 pairs per request
- Maximum 3 different chains per request
- Duplicate (chain, contractAddress) pairs allowed

**Request Body**: Array of objects (max 25 items)

**Body Parameters**:
Each object in the array must contain:
- `chain` (required): The blockchain to work with
  - Type: string
  - Example: `ethereum-mainnet`
- `contractAddress` (required): Smart contract address
  - Type: string
  - Example: `0xdac17f958d2ee523a2206206994597c13d831ec7`
- `basePair` (required): Target fiat asset
  - Type: string
  - Example: `USD`
- `batchId` (required): Identifier for this pair (returned with result)
  - Type: string
  - Example: `1`

**Complete JavaScript Example**:
```javascript
const getBatchRatesByContract = async () => {
  const url = 'https://api.tatum.io/v4/data/rate/contract/batch';

  const requestBody = [
    {
      chain: 'ethereum-mainnet',
      basePair: 'USD',
      contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      batchId: '1'
    },
    {
      chain: 'ethereum-mainnet',
      basePair: 'USD',
      contractAddress: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      batchId: '2'
    },
    {
      chain: 'polygon-mainnet',
      basePair: 'USD',
      contractAddress: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT on Polygon
      batchId: '3'
    }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('Contract exchange rates:', data);
  return data;
};

// Example response:
// [
//   { batchId: '1', chain: 'ethereum-mainnet', contractAddress: '0xdac...', value: '1.00', timestamp: '...' },
//   { batchId: '2', chain: 'ethereum-mainnet', contractAddress: '0xa0b...', value: '1.00', timestamp: '...' },
//   { batchId: '3', chain: 'polygon-mainnet', contractAddress: '0xc21...', value: '1.00', timestamp: '...' }
// ]
```

**Error Handling**: When a token price is not available, the response includes `value` and `timestamp` as `null` with an error object containing `message: "Token not found"`.

---

### GET /v4/data/rate/price-change
Get price change data for a symbol over a time range or interval.

**Credits**: 200 per API call

**Query Parameters**:
- `symbol` (required): Base symbol
  - Type: string
  - Example: `BTC`
- `basePair` (optional): Quote asset (default: USDT)
  - Type: string
  - Example: `USDT`
- `timeFrom` (conditionally required): Range start (ISO 8601). Required if not using interval
  - Type: string (date-time)
  - Example: `2026-04-10T00:00:00Z`
- `timeTo` (conditionally required): Range end (ISO 8601). Required if not using interval
  - Type: string (date-time)
  - Example: `2026-04-17T00:00:00Z`
- `interval` (conditionally required): Predefined interval. Use instead of timeFrom/timeTo
  - Type: string
  - Enum: `1m`, `5m`, `15m`, `30m`, `45m`, `1h`, `2h`, `4h`, `1d`, `1w`, `1M`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/rate/price-change?symbol=BTC&basePair=USDT&timeFrom=2026-04-10T00:00:00Z&timeTo=2026-04-17T00:00:00Z" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### POST /v4/data/rate/price-change/batch
Get price change data for multiple symbols in a single request.

**Credits**: 200 per API call

**Limits**: Maximum 10 items per request

**Request Body**: Array of objects (max 10 items)

**Body Parameters**:
Each object in the array must contain:
- `symbol` (required): Base symbol
  - Type: string
  - Example: `BTC`
- `basePair` (optional): Quote asset (default: USDT)
  - Type: string
  - Example: `USDT`
- `batchId` (required): Identifier for this item (returned with result)
  - Type: string
  - Example: `1`
- Either time range OR interval:
  - `timeFrom` + `timeTo`: Range start and end (ISO 8601)
    - Type: string (date-time)
    - Example: `2026-04-10T00:00:00Z`
  - OR `interval`: Predefined interval
    - Type: string
    - Enum: `1m`, `5m`, `15m`, `30m`, `45m`, `1h`, `2h`, `4h`, `1d`, `1w`, `1M`

**Complete JavaScript Example**:
```javascript
const getBatchPriceChanges = async () => {
  const url = 'https://api.tatum.io/v4/data/rate/price-change/batch';

  const requestBody = [
    {
      symbol: 'BTC',
      basePair: 'USDT',
      batchId: '1',
      timeFrom: '2026-04-10T00:00:00Z',
      timeTo: '2026-04-17T00:00:00Z'
    },
    {
      symbol: 'ETH',
      basePair: 'USDT',
      batchId: '2',
      timeFrom: '2026-04-10T00:00:00Z',
      timeTo: '2026-04-17T00:00:00Z'
    },
    {
      symbol: 'SOL',
      basePair: 'USDT',
      batchId: '3',
      interval: '1w' // Alternative: use interval instead of timeFrom/timeTo
    }
  ];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('Price changes:', data);
  return data;
};

// Example response:
// [
//   { batchId: '1', symbol: 'BTC', priceChange: 2.5, priceChangePercent: 5.5, ... },
//   { batchId: '2', symbol: 'ETH', priceChange: 150.0, priceChangePercent: 4.8, ... },
//   { batchId: '3', symbol: 'SOL', priceChange: 10.5, priceChangePercent: 7.0, ... }
// ]
```

---

### GET /v4/data/rate/symbol/OHLCV
Get historical OHLCV (Open, High, Low, Close, Volume) data for a symbol at a specific point in time.

Retrieves the closest available price record for a given symbol and timestamp. By default returns 1-minute candles; use the `interval` parameter for larger candle sizes.

**Credits**: 50 per API call

**Supported Symbols**: 439+ trading pairs (BTC, ETH, SOL, BNB, ADA, XRP, DOGE, SHIB, UNI, LINK, and many more)

**Query Parameters**:
- `symbol` (required): The base symbol of the trading pair
  - Type: string (enum, 439+ supported symbols)
  - Example: `BTC`, `ETH`, `SOL`

- `unix` OR `time` (one required): Timestamp for the price lookup
  - `unix`: Unix timestamp in milliseconds
    - Type: integer
    - Example: `1609459200000`
  - `time`: Date in ISO 8601 format
    - Type: string (date-time)
    - Example: `2021-01-01T00:00:00Z`
  - **Note**: You must provide exactly one of these, not both

- `interval` (optional): Candle interval size (defaults to `1m`)
  - Type: string
  - Allowed values: `1m`, `5m`, `15m`, `30m`, `45m`, `1h`, `2h`, `4h`, `1d`, `1w`, `1M`

**Time Handling**:
- If the provided time falls within an interval, returns that interval's OHLCV record
- If time is later than any available data, returns the most recent OHLCV record
- If time is earlier than any available data, returns the earliest available OHLCV record

**Example Request (using `time`)**:
```javascript
const url = 'https://api.tatum.io/v4/data/rate/symbol/OHLCV?' + new URLSearchParams({
  symbol: 'BTC',
  time: '2026-04-17T12:00:00Z',
  interval: '1h'
});

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});

const ohlcv = await response.json();
```

**Example Request (using `unix`)**:
```javascript
const url = 'https://api.tatum.io/v4/data/rate/symbol/OHLCV?' + new URLSearchParams({
  symbol: 'ETH',
  unix: 1609459200000,
  interval: '1d'
});

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});

const ohlcv = await response.json();
```

**Response Schema** (HistoricalPrice):
```json
{
  "symbol": "BTC",
  "openTime": 1499040000000,
  "open": "0.01634790",
  "high": "0.80000000",
  "low": "0.01575800",
  "close": "0.01577100",
  "closeTime": 1499644799999,
  "volume": "148976.11427815",
  "quoteAssetVolume": "2434.19055334",
  "numberOfTrades": 308,
  "takerBuyBaseAssetVolume": "1756.87402397",
  "takerBuyQuoteAssetVolume": "28.46694368"
}
```

| Response Field | Type | Description |
|----------------|------|-------------|
| `symbol` | string | Base symbol (e.g., "BTC") |
| `openTime` | number | Kline open time (Unix ms) |
| `open` | string | Open price |
| `high` | string | High price |
| `low` | string | Low price |
| `close` | string | Close price |
| `closeTime` | number | Kline close time (Unix ms) |
| `volume` | string | Base asset volume |
| `quoteAssetVolume` | string | Quote asset volume (USDT) |
| `numberOfTrades` | number | Number of trades |
| `takerBuyBaseAssetVolume` | string | Taker buy base asset volume |
| `takerBuyQuoteAssetVolume` | string | Taker buy quote asset volume |

---

### GET /v4/data/rate/symbol/OHLCV/batch
Get multiple historical OHLCV (Open, High, Low, Close, Volume) candles for a symbol starting from a given time.

Returns up to `numberOfCandles` (max 50) OHLCV candles with `openTime` >= the provided start time, ordered by `openTime` ascending.

**Credits**: 500 per API call

**Query Parameters**:
- `symbol` (required): The base symbol of the trading pair
  - Type: string (enum with 439+ supported symbols)
  - Example: `BTC`, `ETH`, `SOL`

- `unixFrom` OR `timeFrom` (one required): Start time for the range
  - `unixFrom`: Unix timestamp in milliseconds
    - Type: integer
    - Example: `1609459200000`
  - `timeFrom`: ISO 8601 date-time format
    - Type: string
    - Example: `2021-01-01T00:00:00Z`
  - **Note**: You must provide exactly one of these parameters, not both

- `numberOfCandles` (required): Number of candles to return
  - Type: integer
  - Range: 1 to 50
  - Example: `10`

- `interval` (optional): Candle interval size (defaults to `1m`)
  - Type: string
  - Allowed values: `1m`, `5m`, `15m`, `30m`, `45m`, `1h`, `2h`, `4h`, `1d`, `1w`, `1M`
  - Example: `1h`

**Supported Symbols**: 439+ trading pairs including BTC, ETH, SOL, and many more.

**Example Request**:
```javascript
const url = 'https://api.tatum.io/v4/data/rate/symbol/OHLCV/batch?' + new URLSearchParams({
  symbol: 'BTC',
  timeFrom: '2026-04-10T00:00:00Z',
  numberOfCandles: 10,
  interval: '1h'
});

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});

const ohlcvData = await response.json();
```

**Example Response**:
```json
[
  {
    "symbol": "BTC",
    "openTime": 1712793600000,
    "open": "65000.50",
    "high": "66500.00",
    "low": "64800.00",
    "close": "66200.75",
    "closeTime": 1712797199999,
    "volume": "1234.56789",
    "quoteAssetVolume": "80000000.00",
    "numberOfTrades": 15678,
    "takerBuyBaseAssetVolume": "678.12345",
    "takerBuyQuoteAssetVolume": "44000000.00"
  }
]
```

---

### GET /v4/data/rate/history
Get historical exchange rates for a symbol.

**Credits**: 50 per API call

**Query Parameters**:
- `symbol` (required): Currency symbol
  - Type: string
  - Example: `BTC`
- `basePair` (optional): Target currency (default: EUR)
  - Type: string
  - Example: `USD`
- `from` (required): Start timestamp (Unix epoch in milliseconds)
  - Type: number
  - Example: `1712793600000`
- `to` (required): End timestamp (Unix epoch in milliseconds)
  - Type: number
  - Example: `1713398400000`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/rate/history?symbol=BTC&basePair=USD&from=1712793600000&to=1713398400000" \
  -H "x-api-key: YOUR_API_KEY"
```

---

## Wallet APIs

### GET /v4/data/wallet/portfolio
Get portfolio balances (native, fungible tokens, NFTs) for a wallet address.

**Credits**: 50 per API call

**Supported Chains**:
- Ethereum (mainnet, sepolia, holesky)
- Solana (mainnet, devnet)
- Base, Arbitrum, BNB Smart Chain, Polygon, Optimism, Berachain, Unichain, Monad, Celo, Chiliz, Tezos, Moca Chain

**Query Parameters**:
- `chain` (required): The blockchain to work with
  - Type: string
  - Example: `ethereum-mainnet`
- `addresses` (required): Wallet address (only one allowed)
  - Type: string
  - Example: `0x80d8bac9a6901698b3749fe336bbd1385c1f98f2`
- `tokenTypes` (required): Token types to fetch
  - Type: string
  - Enum: `native`, `fungible`, `nft,multitoken`
  - Example: `fungible`
- `excludeMetadata` (optional): Exclude metadata from response
  - Type: boolean
  - Default: false
- `pageSize` (optional): Items per page
  - Type: number
  - Default: 50
- `offset` (optional): Pagination offset
  - Type: number

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/wallet/portfolio?chain=ethereum-mainnet&addresses=0x80d8bac9a6901698b3749fe336bbd1385c1f98f2&tokenTypes=fungible&pageSize=50" \
  -H "x-api-key: YOUR_API_KEY"
```

**Example Response Structure**:
```json
{
  "result": [
    {
      "asset": "USDT",
      "balance": "1000.5",
      "type": "fungible",
      "tokenAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "metadata": { "name": "Tether USD", "symbol": "USDT", "decimals": 6 }
    }
  ],
  "offset": 0,
  "totalResults": 1
}
```

---

### GET /v4/data/wallet/balance/time
Get wallet balance at a specific point in time.

**Credits**: Variable based on chain

**Query Parameters**:
- `chain` (required): Blockchain
  - Type: string
- `addresses` (required): Wallet address
  - Type: string
- `timestamp` (required): Unix timestamp
  - Type: number
- `tokenAddress` (optional): Specific token address
  - Type: string

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/wallet/balance/time?chain=ethereum-mainnet&addresses=0x123...&timestamp=1713398400" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/wallet/reputation
Get wallet reputation score and risk assessment.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): Blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

---

### GET /v4/data/wallet/reputation/portfolio
Get reputation data for all tokens in a wallet portfolio.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): Blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

---

### GET /v4/data/wallet/reputation/tokens
Get reputation data for specific tokens held by a wallet.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): Blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `tokenAddresses` (required): Comma-separated token addresses
  - Type: string

---

## Transaction APIs

### GET /v4/data/transaction/history
Get transaction history for a wallet address.

**Credits**: 20 per API call

**Supported Chains**:
- Ethereum, Base, Arbitrum, BNB Smart Chain, Polygon, Optimism, Berachain, Unichain, Monad, Celo, Chiliz, Tezos, Moca Chain

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `ethereum-mainnet`
- `addresses` (required): Wallet address (only one allowed)
  - Type: string
  - Example: `0x2474a7227877f2b65185f09468af7c6577fa207c`
- `transactionTypes` (optional): Filter by transaction types (comma-separated)
  - Type: string
  - Enum: `fungible`, `nft`, `multitoken`, `native`
  - Example: `fungible,nft`
- `transactionSubtype` (optional): Filter by direction
  - Type: string
  - Enum: `incoming`, `outgoing`, `zero-transfer`
  - Example: `incoming`
- `tokenAddress` (optional): Specific token contract address
  - Type: string
- `tokenId` (optional): Specific token ID
  - Type: string
- `blockFrom` (optional): Start block number
  - Type: number
  - Note: If blockTo not specified, automatically calculated as blockFrom + 1000
- `blockTo` (optional): End block number
  - Type: number
  - Note: If blockFrom not specified, automatically calculated as blockTo - 1000
- `pageSize` (optional): Items per page
  - Type: number
  - Default: 50
- `offset` (optional): Pagination offset
  - Type: number
- `cursor` (optional): Pagination cursor (for Tezos block queries)
  - Type: string

**Important Notes**:
- For wallets with 250+ transactions, use `transactionTypes` filter with only one value at a time
- Tezos accepts only one wallet address
- Tezos does not support: `transactionTypes`, `transactionSubtype`, `tokenId`, `blockTo` filters

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/transaction/history?chain=ethereum-mainnet&addresses=0x2474a7227877f2b65185f09468af7c6577fa207c&transactionTypes=fungible&transactionSubtype=incoming&pageSize=50" \
  -H "x-api-key: YOUR_API_KEY"
```

**Example Response Structure**:
```json
{
  "result": [
    {
      "chain": "ethereum-mainnet",
      "hash": "0xabc...",
      "address": "0x2474a7227877f2b65185f09468af7c6577fa207c",
      "blockNumber": 12345678,
      "transactionType": "fungible",
      "transactionSubtype": "incoming",
      "amount": "100.5",
      "timestamp": 1713398400000
    }
  ],
  "offset": 0
}
```

---

### GET /v4/data/transactions/hash
Get transaction details by transaction hash.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `ethereum-mainnet`
- `hash` (required): Transaction hash
  - Type: string
  - Example: `0x1234567890abcdef...`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/transactions/hash?chain=ethereum-mainnet&hash=0x1234567890abcdef..." \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/transactions/dna
Get transaction DNA (detailed analysis) for a transaction.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `hash` (required): Transaction hash
  - Type: string

---

## Token APIs

### GET /v4/data/tokens
Get information about a token (fungible, NFT, or multitoken collection).

**Credits**: 20 per API call

**Supported Chains**:
- Ethereum, Solana, Base, Arbitrum, BNB Smart Chain, Polygon, Optimism, Berachain, Unichain, Monad, Celo, Chiliz, Tezos

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `ethereum-mainnet`
- `tokenAddress` (required): Token contract address or 'native' for native currency
  - Type: string
  - Example: `0xdac17f958d2ee523a2206206994597c13d831ec7`
- `tokenId` (optional): Specific NFT token ID
  - Type: string

**Special Feature**: Use `tokenAddress=native` to get information about the chain's native currency (supported on mainnet for Ethereum, Polygon, Berachain, Celo, Tezos, Solana).

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/tokens?chain=ethereum-mainnet&tokenAddress=0xdac17f958d2ee523a2206206994597c13d831ec7" \
  -H "x-api-key: YOUR_API_KEY"
```

**Example Response (Fungible Token)**:
```json
{
  "type": "fungible",
  "name": "Tether USD",
  "symbol": "USDT",
  "decimals": 6,
  "totalSupply": "80000000000",
  "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7"
}
```

---

### GET /v4/data/tokens/trending
Get trending tokens on a blockchain.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/tokens/newest
Get newest tokens on a blockchain.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/tokens/popular
Get popular tokens on a blockchain.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/tokens/popular/history
Get historical popularity data for tokens.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `from` (required): Start timestamp
  - Type: number
- `to` (required): End timestamp
  - Type: number

---

## NFT APIs

### GET /v4/data/collections
Get all NFTs and multitokens from specified collections.

**Credits**: 20 per API call

**Supported Chains**:
- Ethereum, Base, Arbitrum, BNB Smart Chain, Polygon, Optimism, Berachain, Unichain, Monad, Celo, Chiliz, Tezos

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddresses` (required): Comma-separated collection addresses
  - Type: string
- `excludeMetadata` (optional): Exclude metadata from response
  - Type: boolean
  - Default: false
- `pageSize` (optional): Items per page
  - Type: number
  - Default: 50
- `offset` (optional): Pagination offset
  - Type: number

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/collections?chain=ethereum-mainnet&collectionAddresses=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&pageSize=50" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/metadata
Get metadata for a specific NFT.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `tokenAddress` (required): NFT contract address
  - Type: string
- `tokenId` (required): NFT token ID
  - Type: string

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/metadata?chain=ethereum-mainnet&tokenAddress=0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d&tokenId=1" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/owners
Get all owners of tokens from a collection.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `tokenAddress` (required): Collection contract address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/owners/address
Get all tokens owned by a specific address from a collection.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `tokenAddress` (required): Collection contract address
  - Type: string
- `ownerAddress` (required): Owner wallet address
  - Type: string

---

### GET /v4/data/nft/balances
Get NFT balances for a wallet address.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/multitoken/balances
Get multitoken (ERC-1155) balances for a wallet address.

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

## Blockchain APIs

### GET /v4/data/blockchains/block/current
Get current block number for a blockchain.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `ethereum-mainnet`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/blockchains/block/current?chain=ethereum-mainnet" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/blockchains/block
Get block details by block number.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `blockNumber` (required): Block number
  - Type: number

---

### GET /v4/data/blockchains/block/hash
Get block details by block hash.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `hash` (required): Block hash
  - Type: string

---

### GET /v4/data/blockchains/utxo/info
Get UTXO information for UTXO-based chains.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain (Bitcoin, Litecoin, Dogecoin, Cardano)
  - Type: string
- `hash` (required): Transaction hash
  - Type: string
- `index` (required): UTXO index
  - Type: number

---

### GET /v4/data/blockchains/mempool
Get mempool information for a blockchain.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string

---

### GET /v4/data/blockchains/transaction
Get transaction details from blockchain.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `hash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/blockchains/transaction/internal
Get internal transactions (for EVM chains).

**Credits**: 20 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `hash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/blockchains/balance
Get native balance for an address.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/blockchains/balance?chain=ethereum-mainnet&address=0x123..." \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/blockchains/balance/batch
Get native balances for multiple addresses in one request.

**Credits**: 10 per address

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `ethereum-mainnet`

- `addresses` (required): Comma-separated list of addresses
  - Type: string (comma-separated, NOT an array)
  - Maximum: 30 addresses (10 for Tron)
  - Example: `0x8ba1f109551bd432803012645ac136ddd64dba72,0xd6A7AC86DF3017A164d7d3991Fe76c9fdc8a4A61`

**Example Request**:
```javascript
const addresses = [
  '0x8ba1f109551bd432803012645ac136ddd64dba72',
  '0xd6A7AC86DF3017A164d7d3991Fe76c9fdc8a4A61'
].join(',');

const url = 'https://api.tatum.io/v4/data/blockchains/balance/batch?' + new URLSearchParams({
  chain: 'ethereum-mainnet',
  addresses: addresses
});

const response = await fetch(url, {
  method: 'GET',
  headers: {
    'x-api-key': 'YOUR_API_KEY'
  }
});

const balances = await response.json();
```

**Example with curl**:
```bash
curl -X GET "https://api.tatum.io/v4/data/blockchains/balance/batch?chain=ethereum-mainnet&addresses=0x8ba1f109551bd432803012645ac136ddd64dba72,0xd6A7AC86DF3017A164d7d3991Fe76c9fdc8a4A61" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/blockchains/transaction/count
Get transaction count (nonce) for an address.

**Credits**: 10 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

---

### GET /v4/data/blockchains/transaction/history/utxos
Get transaction history for UTXO-based chains (single address).

**Credits**: 20 per API call

**Supported Chains**: Bitcoin, Litecoin, Dogecoin, Cardano

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `bitcoin-mainnet`
- `address` (required): Wallet address
  - Type: string
- `txType` (optional): Transaction direction (not supported for Cardano)
  - Type: string
  - Enum: `incoming`, `outgoing`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/blockchains/transaction/history/utxos?chain=bitcoin-mainnet&address=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa&txType=incoming" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### POST /v4/data/blockchains/transaction/history/utxos/batch
Get transaction history for UTXO-based chains for multiple addresses in one request.

**Credits**: 20 per address (e.g., 5 addresses = 100 credits)

**Supported Chains**: Bitcoin, Litecoin, Dogecoin, Cardano

**Limits**: Maximum 30 addresses per request

**Request Body**: Single object

**Body Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `bitcoin-mainnet`
  - Enum: `bitcoin-mainnet`, `bitcoin-testnet`, `litecoin-mainnet`, `litecoin-testnet`, `doge-mainnet`, `doge-testnet`, `cardano-mainnet`, `cardano-preprod`
- `addresses` (required): Array of wallet addresses (min 1, max 30)
  - Type: array of strings
  - Example: `['btscca', 'abcacb', 'xyzxyz']`
- `txType` (optional): Transaction direction filter (NOT supported for Cardano)
  - Type: string
  - Enum: `incoming`, `outgoing`

**Response**: Array of objects, each containing:
- `address`: The requested address
- `transactions`: Array of transaction objects

**Complete JavaScript Example**:
```javascript
const getUtxoBatchHistory = async () => {
  const url = 'https://api.tatum.io/v4/data/blockchains/transaction/history/utxos/batch';

  const requestBody = {
    chain: 'bitcoin-mainnet',
    addresses: ['btscca', 'abcacb', 'xyzxyz'],
    txType: 'incoming' // Optional: filter by transaction type
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('UTXO transaction history:', data);
  return data;
};

// Example response:
// [
//   {
//     address: 'btscca',
//     transactions: [
//       { hash: '...', block: { number: 12345, hash: '...' }, inputs: [...], outputs: [...] }
//     ]
//   },
//   {
//     address: 'abcacb',
//     transactions: [...]
//   },
//   {
//     address: 'xyzxyz',
//     transactions: [...]
//   }
// ]

// Cardano-specific response format:
// [
//   {
//     address: 'addr1qywlx4v9sa7jplgdrjr2vjjdsjx509zenr4zt9w7gmn4cwga7d2ctpmayr7s68yx5e9ympydg729nx82yk2au3h8tsusqtczws',
//     transactions: [
//       {
//         block: { hash: 'cef055...', number: 13050937 },
//         hash: '121c14f0...',
//         inputs: [{ address: '...', symbol: 'ADA', value: '1456780', txHash: '...' }],
//         outputs: [{ address: '...', symbol: 'ADA', value: '1456780', index: 2, txHash: '...' }],
//         withdrawals: [{ address: 'stake1u...', symbol: 'ADA', value: '5323949', txHash: '...' }],
//         fee: '209479'
//       }
//     ]
//   }
// ]
```

**Important Notes**:
- Cardano returns a different response format with `inputs`, `outputs`, `withdrawals`, and `fee` fields
- `txType` filter is NOT available for Cardano chains
- Maximum 30 addresses per request

---

### GET /v4/data/utxos
Get unspent UTXOs for a single address.

**Credits**: 100 per API call

**Supported Chains**: Bitcoin, Litecoin, Dogecoin, Cardano

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `bitcoin-mainnet`
- `address` (required): Wallet address
  - Type: string
- `totalValue` (optional): Total amount needed for transaction
  - Type: number

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/utxos?chain=bitcoin-mainnet&address=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa&totalValue=0.01" \
  -H "x-api-key: YOUR_API_KEY"
```

---

### POST /v4/data/utxos/batch
Get unspent UTXOs for multiple addresses up to a specified total amount.

**Credits**: 100 per address per API call

**Supported Chains**: Bitcoin, Litecoin, Dogecoin, Cardano

**Request Body**: Single object

**Body Parameters**:
- `chain` (required): The blockchain
  - Type: string
  - Example: `bitcoin-mainnet`
  - Enum: `bitcoin-mainnet`, `bitcoin-testnet`, `litecoin-mainnet`, `litecoin-testnet`, `doge-mainnet`, `doge-testnet`, `cardano-mainnet`, `cardano-preprod`
- `addresses` (required): Array of wallet addresses (min 1, max 50)
  - Type: array of strings
  - Example: `['abcabc', 'xyzxyz', 'oa12abc']`
- `totalValue` (required): Total transaction amount
  - Type: number
  - Description: Only UTXOs up to this amount will be returned, so you will not spend more than needed
  - Example: `0.01`

**Complete JavaScript Example**:
```javascript
const getUtxosBatch = async () => {
  const url = 'https://api.tatum.io/v4/data/utxos/batch';

  const requestBody = {
    addresses: ['abcabc', 'xyzxyz', 'oa12abc'],
    chain: 'bitcoin-mainnet',
    totalValue: 0.01
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  console.log('UTXOs:', data);
  return data;
};

// Example response:
// [
//   {
//     address: 'abcabc',
//     utxos: [
//       { txHash: '...', index: 0, value: 0.005, script: '...' },
//       { txHash: '...', index: 1, value: 0.003, script: '...' }
//     ]
//   },
//   {
//     address: 'xyzxyz',
//     utxos: [
//       { txHash: '...', index: 0, value: 0.002, script: '...' }
//     ]
//   },
//   {
//     address: 'oa12abc',
//     utxos: []
//   }
// ]
```

**Important Notes**:
- Bitcoin mainnet/testnet, Litecoin mainnet/testnet, Dogecoin mainnet/testnet support any amount of UTXOs per address
- The API returns only enough UTXOs to cover the `totalValue`, preventing overspending
- Useful for preparing transactions on UTXO-based chains

---

## DeFi APIs

### GET /v4/data/defi/events
Get DeFi events (swaps, liquidity adds/removes, etc.) for an address.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet or contract address
  - Type: string
- `eventType` (optional): Filter by event type
  - Type: string
  - Enum: `swap`, `add_liquidity`, `remove_liquidity`
- `blockFrom` (optional): Start block
  - Type: number
- `blockTo` (optional): End block
  - Type: number
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/defi/blocks
Get blocks with DeFi activity.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `from` (required): Start block
  - Type: number
- `to` (required): End block
  - Type: number

---

### GET /v4/data/defi/blocks/latest
Get the latest block with DeFi activity.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string

---

## Staking APIs

### GET /v4/data/staking/native/current-assets
Get current staked assets for a wallet address.

**Credits**: 100 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/staking/native/current-assets?chain=ethereum-mainnet&address=0x123..." \
  -H "x-api-key: YOUR_API_KEY"
```

---

### GET /v4/data/staking/native/current-assets-by-validator
Get current staked assets by validator.

**Credits**: 100 per API call

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `validator` (required): Validator address
  - Type: string

---

### GET /v4/data/staking/native/rewards
Get staking rewards for a wallet address.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `from` (optional): Start timestamp
  - Type: number
- `to` (optional): End timestamp
  - Type: number

---

### GET /v4/data/staking/native/transactions
Get staking transactions (stakes, unstakes, claims).

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/staking/native/pools
Get information about native staking pools.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string

---

### GET /v4/data/staking/liquid/current-assets
Get current liquid staking positions.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

---

### GET /v4/data/staking/liquid/pools
Get information about liquid staking pools.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string

---

## Mining APIs

### GET /v4/data/mining/rewards
Get mining rewards for a wallet address.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `from` (optional): Start timestamp
  - Type: number
- `to` (optional): End timestamp
  - Type: number
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/mining/totalRewards
Get total mining rewards for a wallet address.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string

---

## Marketplace APIs

All marketplace APIs are under the `/v4/data/marketplace/cryptoslam/` prefix.

### GET /v4/data/marketplace/cryptoslam/token/price
Get current floor price for an NFT collection.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/token/price/history
Get historical floor price data for an NFT collection.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `from` (required): Start timestamp
  - Type: number
- `to` (required): End timestamp
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/token/price/exotic
Get exotic pricing metrics for an NFT collection.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/token/price/exotic/history
Get historical exotic pricing metrics.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `from` (required): Start timestamp
  - Type: number
- `to` (required): End timestamp
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/token/trades
Get NFT trades for a specific collection.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/token/transfers
Get NFT transfers for a specific collection.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/token/transfers/dna
Get transfer DNA (detailed analysis) for NFT transfers.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `tokenId` (required): NFT token ID
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/token/holder/reputation
Get reputation score for NFT holders.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `holderAddress` (required): Holder wallet address
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/chain/trades
Get all NFT trades on a blockchain.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `from` (optional): Start timestamp
  - Type: number
- `to` (optional): End timestamp
  - Type: number
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/chain/trades/dna
Get trade DNA for chain-level trades.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `txHash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/chain/transfers
Get all NFT transfers on a blockchain.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `from` (optional): Start timestamp
  - Type: number
- `to` (optional): End timestamp
  - Type: number
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/chain/transfers/dna
Get transfer DNA for chain-level transfers.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `txHash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/wallet/trades
Get NFT trades for a specific wallet.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/wallet/trades/dna
Get trade DNA for wallet trades.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `txHash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/wallet/transfers
Get NFT transfers for a specific wallet.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/wallet/transfers/dna
Get transfer DNA for wallet transfers.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `address` (required): Wallet address
  - Type: string
- `txHash` (required): Transaction hash
  - Type: string

---

### GET /v4/data/marketplace/cryptoslam/pair/trades
Get NFT trades for a specific trading pair.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `tokenId` (required): NFT token ID
  - Type: string
- `pageSize` (optional): Items per page
  - Type: number
- `offset` (optional): Pagination offset
  - Type: number

---

### GET /v4/data/marketplace/cryptoslam/pair/trades/dna
Get trade DNA for pair trades.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `collectionAddress` (required): NFT collection address
  - Type: string
- `tokenId` (required): NFT token ID
  - Type: string
- `txHash` (required): Transaction hash
  - Type: string

---

## Fee Estimation APIs

### POST /v4/blockchainOperations/gas
Estimate gas price (wei) and units needed for a transaction across multiple blockchain networks.

**Credits**: 10 per API call

**Description**: Unified gas estimation endpoint that consolidates all supported chains into one endpoint.

**Supported Chains** (15):
- BNB Smart Chain (BSC)
- Celo (CELO)
- Elrond (EGLD)
- Ethereum (ETH)
- Harmony (ONE)
- Klaytn (KLAY)
- KuCoin Community Chain (KCS)
- Flare (FLR)
- Cronos (CRO)
- Avalanche (AVAX)
- Base (BASE)
- Polygon (POL_ETH)
- Optimism (OPTIMISM)
- Fantom (FTM)
- Sonic (S)

**Request Body**: Single object

**Body Parameters**:
- `chain` (required): Blockchain to estimate gas for
  - Type: string
  - Enum: `BSC`, `CELO`, `EGLD`, `ETH`, `ONE`, `KLAY`, `KCS`, `FLR`, `CRO`, `AVAX`, `BASE`, `POL_ETH`, `OPTIMISM`, `FTM`, `S`
  - Example: `ETH`

- `from` (required): Blockchain address of the sender
  - Type: string
  - Example: `0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef`

- `to` (required): Blockchain address of the recipient
  - Type: string
  - Example: `0x687422eEA2cB73B5d3e242bA5456b782919AFc85`

- `amount` (required): Amount to be sent
  - Type: string
  - Example: `100000`

- `data` (optional): Data to be sent to smart contract
  - Type: string
  - Example: `0x`

- `contractAddress` (optional): Contract address of the token (only for ETH)
  - Type: string
  - Example: `0x687422eEA2cB73B5d3e242bA5456b782919AFc85`

**Response**:
Returns an object with:
- `gasPrice`: The estimated price for one gas unit in wei (string)
- `gasLimit`: The number of gas units needed to process the transaction (string)

**Complete JavaScript Example**:
```javascript
const estimateGas = async () => {
  const url = 'https://api.tatum.io/v4/blockchainOperations/gas';

  const requestBody = {
    chain: 'ETH',
    from: '0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef',
    to: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
    amount: '100000'
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY'
    },
    body: JSON.stringify(requestBody)
  });

  const gasEstimate = await response.json();
  console.log('Gas estimate:', gasEstimate);
  return gasEstimate;
};

// Example response:
// {
//   "gasPrice": "10000000000",
//   "gasLimit": "21000"
// }
```

**Example with ERC20 Token**:
```javascript
const requestBody = {
  chain: 'ETH',
  from: '0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef',
  to: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
  amount: '1000',
  contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
};
```

---

### POST /v3/ethereum/gas/batch
Estimate gas price and units needed for multiple Ethereum transactions in one request.

**Credits**: 10 per API call + 10 per gas estimation

**Special Headers**:
- `x-testnet-type` (optional): Type of Ethereum testnet
  - Type: string
  - Default: `ethereum-sepolia`
  - Enum: `ethereum-sepolia`

**Request Body**: Single object

**Body Parameters**:
- `estimations` (required): Array of gas estimation objects
  - Type: array
  - Each estimation object contains:
    - `from` (required): Sender address
      - Type: string
      - Min/Max length: 42 characters
      - Example: `0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef`
    - `to` (required): Recipient address
      - Type: string
      - Min/Max length: 42 characters
      - Example: `0x687422eEA2cB73B5d3e242bA5456b782919AFc85`
    - `amount` (required): Amount to send (in Ether or ERC20)
      - Type: string
      - Pattern: `^[+]?((\d+(\.\d*)?)|(\.\d+))$`
      - Example: `10000`
    - `contractAddress` (optional): ERC20 token contract address (if ERC20 transaction)
      - Type: string
      - Min/Max length: 42 characters
      - Example: `0x687422eEA2cB73B5d3e242bA5456b782919AFc85`

**Response Headers**:
- `x-current-block`: Current block number
- `x-current-block-time`: Current block timestamp (ISO 8601)

**Complete JavaScript Example**:
```javascript
const getEthereumGasBatchEstimate = async () => {
  const url = 'https://api.tatum.io/v3/ethereum/gas/batch';

  const requestBody = {
    estimations: [
      {
        from: '0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef',
        to: '0x687422eEA2cB73B5d3e242bA5456b782919AFc85',
        amount: '10000'
      },
      {
        from: '0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef',
        to: '0x123422eEA2cB73B5d3e242bA5456b782919AFc85',
        amount: '5000'
      },
      {
        from: '0xfb99f8ae9b70a0c8cd96ae665bbaf85a7e01a2ef',
        to: '0xabc422eEA2cB73B5d3e242bA5456b782919AFc85',
        amount: '2500',
        contractAddress: '0xdac17f958d2ee523a2206206994597c13d831ec7' // ERC20 token (USDT)
      }
    ]
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_API_KEY',
      'x-testnet-type': 'ethereum-sepolia' // Optional: for testnet
    },
    body: JSON.stringify(requestBody)
  });

  const data = await response.json();
  const currentBlock = response.headers.get('x-current-block');
  const currentBlockTime = response.headers.get('x-current-block-time');

  console.log('Gas estimations:', data);
  console.log('Current block:', currentBlock);
  console.log('Current block time:', currentBlockTime);

  return data;
};

// Example response:
// [
//   { gasLimit: 21000, gasPrice: '10000000000' }, // Gas price in wei
//   { gasLimit: 21000, gasPrice: '10000000000' },
//   { gasLimit: 65000, gasPrice: '10000000000' }  // ERC20 transfer needs more gas
// ]

// IMPORTANT: Convert gas price from wei to Gwei before making transaction:
// gasPriceInGwei = gasPriceInWei / 1000000000
// Example: 10000000000 wei = 10 Gwei
```

**Important Notes**:
- The estimated gas price is returned in **wei**
- When making a transaction and providing custom fee, you must convert from **wei to Gwei**
- The `fast` gas price is used by default
- Estimations are returned in the same order as submitted
- Gas price calculation is based on latest N blocks and current mempool state

---

## Web3 Name Service APIs

### GET /v4/data/ns/name
Resolve Web3 name service addresses (ENS, etc.).

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `name` (required): Web3 domain name
  - Type: string
  - Example: `vitalik.eth`

**Example Request**:
```bash
curl -X GET "https://api.tatum.io/v4/data/ns/name?chain=ethereum-mainnet&name=vitalik.eth" \
  -H "x-api-key: YOUR_API_KEY"
```

---

## Additional APIs

### GET /v4/data/block/time
Get block number at a specific timestamp.

**Credits**: Variable

**Query Parameters**:
- `chain` (required): The blockchain
  - Type: string
- `timestamp` (required): Unix timestamp
  - Type: number

---

## Common Query Parameters

The following parameters are commonly used across multiple endpoints:

### Pagination Parameters
- `pageSize`: Number of items per page (default: 50)
  - Type: number
  - Example: `100`
- `offset`: Pagination offset
  - Type: number
  - Example: `0`
- `cursor`: Cursor-based pagination (some endpoints)
  - Type: string

### Filter Parameters
- `excludeMetadata`: Exclude metadata from response
  - Type: boolean
  - Default: `false`

### Block Range Parameters
- `blockFrom`: Start block number
  - Type: number
- `blockTo`: End block number
  - Type: number

### Time Range Parameters
- `from`: Start timestamp (Unix epoch in milliseconds)
  - Type: number
- `to`: End timestamp (Unix epoch in milliseconds)
  - Type: number
- `timeFrom`: Start time (ISO 8601 format)
  - Type: string
  - Example: `2026-04-10T00:00:00Z`
- `timeTo`: End time (ISO 8601 format)
  - Type: string
  - Example: `2026-04-17T00:00:00Z`

---

## Supported Chains

The following chains are commonly supported across endpoints (exact support varies by endpoint):

### EVM Chains
- `ethereum-mainnet`, `ethereum-sepolia`, `ethereum-holesky`
- `base-mainnet`, `base-sepolia`
- `arbitrum-mainnet` (arb-one-mainnet), `arb-testnet`
- `bsc-mainnet`, `bsc-testnet` (BNB Smart Chain)
- `polygon-mainnet`, `polygon-amoy`
- `optimism-mainnet`, `optimism-testnet`
- `berachain-mainnet`
- `unichain-mainnet`, `unichain-sepolia`
- `monad-mainnet`, `monad-testnet`
- `celo-mainnet`, `celo-testnet`
- `chiliz-mainnet`
- `mocachain-devnet`

### Non-EVM Chains
- `solana-mainnet`, `solana-devnet`
- `tezos-mainnet`
- `bitcoin-mainnet`, `bitcoin-testnet`
- `litecoin-mainnet`, `litecoin-testnet`
- `doge-mainnet`, `doge-testnet` (Dogecoin)
- `cardano-mainnet`, `cardano-preprod`

---

## Error Responses

Common error response codes:

- **400 Bad Request**: Invalid parameters
- **401 Unauthorized**: Missing or invalid API key
- **403 Forbidden**: Insufficient permissions or credits
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

---

## Rate Limits and Credits

Each API endpoint consumes credits based on:
- Complexity of the operation
- Number of items processed (in batch endpoints)
- Amount of data returned

Refer to individual endpoint documentation for specific credit costs.

---

## Best Practices

1. **Batch Endpoints**: Use batch endpoints when querying multiple items to save on API calls and credits
2. **Pagination**: Always implement pagination for large datasets using `pageSize` and `offset`
3. **Filtering**: Use filters (`transactionTypes`, `tokenTypes`, etc.) to reduce response size and improve performance
4. **Block Ranges**: When using `blockFrom`/`blockTo`, keep ranges under 1000 blocks for optimal performance
5. **Error Handling**: Always check response status and handle errors appropriately
6. **Rate Limiting**: Implement exponential backoff for rate limit errors
7. **Caching**: Cache responses when appropriate to reduce API calls

---

## Additional Resources

- [Tatum API Documentation](https://apidoc.tatum.io/)
- [Tatum Dashboard](https://dashboard.tatum.io/)
- [Tatum GitHub](https://github.com/tatumio)

---

*This documentation is generated from the OpenAPI specification at `/Users/mohitthakkar/Desktop/Tatum/Tatum-Projects/core-api/libs/api/data-api/src/lib/openapi.yaml`*

*Last Updated: 2026-04-17*
