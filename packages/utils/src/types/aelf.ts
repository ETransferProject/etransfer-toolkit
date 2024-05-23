import { ChainId } from '@portkey/types';

export type AelfInstanceType = { getAelfInstance: (rpcUrl: string, timeout?: number) => any };

export type AELFInstances = {
  AELF?: AelfInstanceType;
  tDVV?: AelfInstanceType;
  tDVW?: AelfInstanceType;
};
export interface IAelfAbstract {
  instances?: AELFInstances;
  rpcUrl?: string;
  aelfSDK?: any;
  setAelf: () => any;
  getInstance: (chainId: ChainId, rpcUrl: string) => AelfInstanceType;
}
