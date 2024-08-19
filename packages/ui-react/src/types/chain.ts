import { ChainId } from '@portkey/types';

export interface IChainMenuItem {
  key: ChainId;
  label: string;
}

export enum CONTRACT_TYPE {
  CA = 'CA_CONTRACT',
  TOKEN = 'TOKEN_CONTRACT',
  ETRANSFER = 'ETRANSFER',
}
