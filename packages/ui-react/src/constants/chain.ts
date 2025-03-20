import { ChainId } from '@portkey/types';
import { IChainMenuItem } from '../types';

export enum CHAIN_ID {
  AELF = 'AELF',
  tDVV = 'tDVV',
  tDVW = 'tDVW',
}

export const DEFAULT_CHAIN_ID_LIST = [CHAIN_ID.AELF, CHAIN_ID.tDVV];
export const CHAIN_ID_LIST: ChainId[] = [CHAIN_ID.AELF, CHAIN_ID.tDVV, CHAIN_ID.tDVW];

export const DEFAULT_CHAIN_ID = CHAIN_ID.tDVV;

export enum CHAIN_NAME_ENUM {
  AELF = 'aelf MainChain',
  tDVW = 'aelf dAppChain',
  tDVV = 'aelf dAppChain',
}

export const CHAIN_MENU_DATA: {
  [chainId in ChainId]: IChainMenuItem;
} = {
  AELF: {
    key: CHAIN_ID.AELF,
    label: CHAIN_NAME_ENUM.AELF,
  },
  tDVV: {
    key: CHAIN_ID.tDVV,
    label: CHAIN_NAME_ENUM.tDVV,
  },
  tDVW: {
    key: CHAIN_ID.tDVW,
    label: CHAIN_NAME_ENUM.tDVW,
  },
};

export enum TokenType {
  USDT = 'USDT',
  SGR = 'SGR-1',
  ELF = 'ELF',
}

export const USDT_DECIMAL = 6;

export const TOKEN_INFO_USDT = {
  name: 'Tether USD',
  symbol: TokenType.USDT,
  icon: 'https://d.cobo.com/public/logos/USDT%403x.png',
  contractAddress: '',
  decimals: USDT_DECIMAL,
};

export const SYNCHRONIZING_ADDRESS = 'Synchronising data on the blockchain…';
