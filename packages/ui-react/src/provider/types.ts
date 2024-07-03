import { TETransferCoreOptions } from '@etransfer/core';
import { ChainId } from '@portkey/types';

export interface ConfigProviderProps {
  children?: React.ReactNode;
}

export interface AelfReactNodesInfo {
  rpcUrl: string;
  exploreUrl: string;
}

export interface AelfReact {
  nodes: { [chainId in ChainId]?: AelfReactNodesInfo };
}

export interface GlobalConfigProps extends TETransferCoreOptions {
  aelfReact: AelfReact;
}
