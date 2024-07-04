import { TETransferCoreOptions } from '@etransfer/core';
import { ChainId } from '@portkey/types';
import { NetworkType } from '../types';

export interface ETransferConfigProviderProps {
  config: ETransferConfigProps;
  getAllConfig: () => ETransferConfigProps;
  getConfig: (key: ConfigKey) => ETransferConfigProps[typeof key];
  setConfig: (config: Partial<ETransferConfigProps>) => void;
}

export type ConfigKey = keyof ETransferConfigProps;

export interface ETransferConfigProps {
  children?: React.ReactNode;
}

export interface AelfReactNodesInfo {
  rpcUrl: string;
  exploreUrl: string;
}

export interface AelfReact {
  nodes: { [chainId in ChainId]?: AelfReactNodesInfo };
}

export interface ETransferConfigProps extends TETransferCoreOptions {
  networkType: NetworkType;
  aelfReact?: AelfReact;
  depositConfig?: ETransferDepositConfig;
  withdrawConfig?: ETransferWithdrawConfig;
  authorization?: ETransferAuthorizationConfig;
}

export interface ETransferAuthorizationConfig {
  jwt: string;
}

export interface ETransferDepositConfig {
  // chain
  defaultChainId?: ChainId;
  supportChainIds?: ChainId[];
  // deposit token
  defaultDepositToken?: string;
  supportDepositTokens?: string[];
  // receive token
  defaultReceiveToken?: string;
  supportReceiveTokens?: string[];
  // network
  defaultNetwork?: string;
  supportNetworks?: string[];
}

export interface ETransferWithdrawConfig {
  // chain
  defaultChainId?: ChainId;
  supportChainIds?: ChainId[];
  //  token
  defaultToken?: string;
  supportTokens?: string[];
  // network
  defaultNetwork?: string;
  supportNetworks?: string[];
}

export interface SupportDataResult {
  isLimit: boolean;
  limits?: string[];
}
