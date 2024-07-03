import { ChainId } from '@portkey/types';
import { IChainMenuItem } from '../types';

export enum CHAIN_NAME_ENUM {
  AELF = 'MainChain AELF',
  tDVW = 'SideChain tDVW',
  tDVV = 'SideChain tDVV',
}

export const CHAIN_MENU_DATA: {
  [chainId in ChainId]: IChainMenuItem;
} = {
  AELF: {
    key: 'AELF',
    label: CHAIN_NAME_ENUM.AELF,
  },
  tDVV: {
    key: 'tDVV',
    label: CHAIN_NAME_ENUM.tDVV,
  },
  tDVW: {
    key: 'tDVW',
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
  icon: '',
  contractAddress: '',
  decimals: USDT_DECIMAL,
};
