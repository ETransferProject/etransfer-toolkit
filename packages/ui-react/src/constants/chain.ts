import { ChainId } from '@portkey/types';

export interface IChainNameItem {
  key: ChainId;
  label: string;
}

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
