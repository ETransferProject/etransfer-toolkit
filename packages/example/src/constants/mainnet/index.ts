import { ContractType } from '@/constants/chain';
import * as AELF from '../platform/AELF';
import * as tDVV from '../platform/tDVV';
import { NetworkName } from '@/constants/network';
import { NetworkType } from '@portkey/provider-types';
import { TNetworkTypeV1 } from '@/types';

export const NETWORK_NAME = NetworkName.mainnet;

export const NETWORK_TYPE_V1: TNetworkTypeV1 = 'MAIN';
export const NETWORK_TYPE_V2: NetworkType = 'MAINNET';

export enum SupportedELFChainId {
  AELF = 'AELF',
  tDVV = 'tDVV',
}

export const SupportedChainId = {
  mainChain: SupportedELFChainId.AELF,
  sideChain: SupportedELFChainId.tDVV,
};

export const CHAIN_NAME: { [chainId in SupportedELFChainId]: string } = {
  [SupportedELFChainId.AELF]: 'MainChain AELF',
  [SupportedELFChainId.tDVV]: 'SideChain tDVV',
};

export enum CHAIN_NAME_ENUM {
  'MainChain' = 'MainChain AELF',
  'SideChain' = 'SideChain tDVV',
}

export interface IChainNameItem {
  key: SupportedELFChainId;
  label: CHAIN_NAME_ENUM;
}

export const CHAIN_LIST: IChainNameItem[] = [
  {
    key: SupportedELFChainId.tDVV,
    label: CHAIN_NAME_ENUM.SideChain,
  },
  {
    key: SupportedELFChainId.AELF,
    label: CHAIN_NAME_ENUM.MainChain,
  },
];

export const CHAIN_LIST_SIDE_CHAIN: IChainNameItem[] = [
  {
    key: SupportedELFChainId.tDVV,
    label: CHAIN_NAME_ENUM.SideChain,
  },
];

export const AelfReact = {
  [SupportedELFChainId.AELF]: {
    chainId: AELF.CHAIN_INFO.chainId,
    rpcUrl: AELF.CHAIN_INFO.rpcUrl,
  },
  [SupportedELFChainId.tDVV]: {
    chainId: tDVV.CHAIN_INFO.chainId,
    rpcUrl: tDVV.CHAIN_INFO.rpcUrl,
  },
};

export const AELF_NODES = {
  AELF: AELF.CHAIN_INFO,
  tDVV: tDVV.CHAIN_INFO,
};

export const ETransferHost = 'https://etransfer.exchange';
export const ETransferAuthHost = 'https://etransfer.exchange';
export const WebLoginGraphqlUrlV1 = 'https://dapp-portkey.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql';
export const WebLoginGraphqlUrlV2 =
  'https://dapp-aa-portkey.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql';
export const WebLoginRequestDefaultsUrlV1 = 'https://did-portkey.portkey.finance';
export const WebLoginRequestDefaultsUrlV2 = 'https://aa-portkey.portkey.finance';
export const WebLoginServiceUrlV1 = 'https://did-portkey.portkey.finance';
export const WebLoginServiceUrlV2 = 'https://aa-portkey.portkey.finance';
export const WebLoginConnectUrlV2 = 'https://auth-aa-portkey.portkey.finance';

export const ADDRESS_MAP = {
  [SupportedELFChainId.AELF]: {
    [ContractType.CA]: AELF.CA_CONTRACT_V2,
    [ContractType.TOKEN]: AELF.TOKEN_CONTRACT,
  },
  [SupportedELFChainId.tDVV]: {
    [ContractType.CA]: tDVV.CA_CONTRACT_V2,
    [ContractType.TOKEN]: tDVV.TOKEN_CONTRACT,
  },
};

export const EXPLORE_CONFIG = {
  [SupportedChainId.mainChain]: AELF_NODES.AELF.exploreUrl,
  [SupportedChainId.sideChain]: AELF_NODES.tDVV.exploreUrl,
};
