import { ChainId } from '@portkey/types';
import { WalletHookInterface, SignatureParams } from 'aelf-web-login';

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

export type TGetSignatureFunc = WalletHookInterface['getSignature'];
export type TSignatureParams = Omit<SignatureParams, 'appName' | 'address'>;
