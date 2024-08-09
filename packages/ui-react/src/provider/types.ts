import { TETransferCoreOptions } from '@etransfer/core';
import { ChainId, SendOptions } from '@portkey/types';
import { NetworkType } from '../types';
import { CallContractParams, TGetSignatureFunc } from '@etransfer/utils';

export interface ETransferConfigProviderProps {
  config: ETransferConfigProps;
  getAllConfig: () => ETransferConfigProps;
  getConfig: (key: ConfigKey) => ETransferConfigProps[typeof key];
  setConfig: (config: Partial<ETransferConfigProps>) => void;
}

export type ConfigKey = keyof ETransferConfigProps;

export interface AelfReactNodesInfo {
  rpcUrl: string;
  exploreUrl: string;
}

export interface AelfReact {
  nodes: { [chainId in ChainId]?: AelfReactNodesInfo };
}

export interface ETransferConfigProps extends TETransferCoreOptions {
  networkType: NetworkType;
  accountInfo: ETransferAccountConfig;
  // aelfReact?: AelfReact;
  depositConfig?: ETransferDepositConfig;
  withdrawConfig?: ETransferWithdrawConfig;
  authorization?: ETransferAuthorizationConfig;
}

export enum WalletTypeEnum {
  unknown = 'Unknown',
  elf = 'NightElf',
  aa = 'PortkeyAA',
  discover = 'PortkeyDiscover',
}

export interface ETransferAccountConfig {
  walletType: WalletTypeEnum;
  accounts: TAelfAccounts; // account address
  caHash?: string; // for portkey wallet
  managerAddress?: string; // for portkey wallet
  tokenContractCallSendMethod<T, R>(
    chainId: ChainId,
    params: CallContractParams<T>,
    sendOptions?: SendOptions,
  ):
    | Promise<
        R & {
          transactionId: string;
        }
      >
    | undefined;
  getSignature: TGetSignatureFunc;
}

export type TAelfAccounts = {
  AELF?: string;
  tDVV?: string;
  tDVW?: string;
};

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
