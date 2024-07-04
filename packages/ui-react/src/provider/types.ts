import { TETransferCoreOptions } from '@etransfer/core';
import { ChainId } from '@portkey/types';

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
  aelfReact: AelfReact;
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
  supportChainId?: ChainId[];
  // deposit token
  defaultDepositToken?: string;
  supportDepositToken?: string[];
  // receive token
  defaultReceiveToken?: string;
  supportReceiveToken?: string[];
  // network
  defaultNetwork?: string;
  supportNetwork?: string[];
}

export interface ETransferWithdrawConfig {
  // chain
  defaultChainId?: ChainId;
  supportChainId?: ChainId[];
  //  token
  defaultToken?: string;
  supportToken?: string[];
  // network
  defaultNetwork?: string;
  supportNetwork?: string[];
}
