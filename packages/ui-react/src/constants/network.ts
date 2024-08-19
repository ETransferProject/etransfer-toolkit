export enum BlockchainNetworkType {
  AELF = 'AELF',
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

export enum ExploreUrlType {
  AELF = 'https://explorer.aelf.io',
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
