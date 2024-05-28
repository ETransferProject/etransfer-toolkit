import { ChainId } from '@portkey/types';
import { SignatureParams, SignatureData } from 'aelf-web-login';

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

export type TGetSignatureFunc = (params: any) => Promise<SignatureData>; // WalletHookInterface['getSignature']
export type TSignatureParams = Omit<SignatureParams, 'appName' | 'address'>;

export type TGetRawTx = {
  blockHeightInput: string;
  blockHashInput: string;
  packedInput: string;
  address: string;
  contractAddress: string;
  functionName: string;
};
