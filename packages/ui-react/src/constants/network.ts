export enum BlockchainNetworkType {
  AELF = 'AELF',
  tDVV = 'tDVV',
  tDVW = 'tDVW',
  SETH = 'SETH',
  Ethereum = 'ETH',
  Polygon = 'MATIC',
  Arbitrum = 'ARBITRUM',
  Optimism = 'OPTIMISM',
  Solana = 'Solana',
  Tron = 'TRX',
  Binance = 'BSC',
  Avax = 'AVAXC',
  TBinance = 'TBSC',
  TON = 'TON',
  BASE = 'BASE',
}

export enum ExploreUrlNotAelf {
  SETH = 'https://sepolia.etherscan.io',
  ETH = 'https://etherscan.io',
  MATIC = 'https://polygonscan.com',
  ARBITRUM = 'https://arbiscan.io',
  OPTIMISM = 'https://optimistic.etherscan.io',
  Solana = 'https://explorer.solana.com',
  TRX = 'https://tronscan.io',
  BSC = 'https://bscscan.com',
  AVAXC = 'https://subnets.avax.network/c-chain',
  TBSC = 'https://bscscan.com',
  TON = 'https://tonscan.org',
  BASE = 'https://basescan.org',
}

export const LOOP_TOP_TX_URL = 'https://loop.top/tx/';

export enum AelfExploreType {
  transaction = 'transaction',
  token = 'token',
  address = 'address',
  block = 'block',
}

export enum OtherExploreType {
  transaction = 'transaction',
  address = 'address',
}
