import { ContractType } from '@/constants/chain';
import * as AELF_Test from '../platform/AELF_Test';
import * as tDVW_Test from '../platform/tDVW_Test';
import { NetworkType } from '@portkey/provider-types';
import { NetworkName } from '@/constants/network';
import { TNetworkTypeV1 } from '@/types';

export const NETWORK_NAME: NetworkName = NetworkName.testnet;

export const NETWORK_TYPE_V1: TNetworkTypeV1 = 'MAIN';
export const NETWORK_TYPE_V2: NetworkType = 'TESTNET';

export enum SupportedELFChainId {
  AELF = 'AELF',
  tDVW = 'tDVW',
}

export const SupportedChainId = {
  mainChain: SupportedELFChainId.AELF,
  sideChain: SupportedELFChainId.tDVW,
};

export const CHAIN_NAME: { [chainId in SupportedELFChainId]: string } = {
  [SupportedELFChainId.AELF]: 'MainChain AELF Testnet',
  [SupportedELFChainId.tDVW]: 'SideChain tDVW Testnet',
};

export enum CHAIN_NAME_ENUM {
  'MainChain' = 'MainChain AELF',
  'SideChain' = 'SideChain tDVW',
}

export interface IChainNameItem {
  key: SupportedELFChainId;
  label: CHAIN_NAME_ENUM;
}

export const CHAIN_LIST: IChainNameItem[] = [
  {
    key: SupportedELFChainId.tDVW,
    label: CHAIN_NAME_ENUM.SideChain,
  },
  {
    key: SupportedELFChainId.AELF,
    label: CHAIN_NAME_ENUM.MainChain,
  },
];

export const CHAIN_LIST_SIDE_CHAIN: IChainNameItem[] = [
  {
    key: SupportedELFChainId.tDVW,
    label: CHAIN_NAME_ENUM.SideChain,
  },
];

export const AelfReact = {
  [SupportedELFChainId.AELF]: {
    chainId: AELF_Test.CHAIN_INFO.chainId,
    rpcUrl: AELF_Test.CHAIN_INFO.rpcUrl,
  },
  [SupportedELFChainId.tDVW]: {
    chainId: tDVW_Test.CHAIN_INFO.chainId,
    rpcUrl: tDVW_Test.CHAIN_INFO.rpcUrl,
  },
};

export const AELF_NODES = {
  AELF: AELF_Test.CHAIN_INFO,
  tDVW: tDVW_Test.CHAIN_INFO,
};

// testnet-jenkins
export const ETRANSFER_URL = 'https://test.etransfer.exchange';
export const ETRANSFER_AUTH_URL = 'https://test.etransfer.exchange';
export const WEB_LOGIN_GRAPHQL_URL_V1 =
  'https://dapp-portkey-test.portkey.finance/Portkey_DID/PortKeyIndexerCASchema/graphql';
export const WEB_LOGIN_GRAPHQL_URL_V2 =
  'https://dapp-aa-portkey-test.portkey.finance/Portkey_V2_DID/PortKeyIndexerCASchema/graphql';
export const WEB_LOGIN_REQUEST_URL_V1 = 'https://did-portkey-test.portkey.finance';
export const WEB_LOGIN_REQUEST_URL_V2 = 'https://aa-portkey-test.portkey.finance';
export const WEB_LOGIN_SERVICE_URL_V1 = 'https://did-portkey-test.portkey.finance';
export const WEB_LOGIN_SERVICE_URL_V2 = 'https://aa-portkey-test.portkey.finance';
export const WEB_LOGIN_CONNECT_URL_V2 = 'https://auth-aa-portkey-test.portkey.finance';

export const ADDRESS_MAP = {
  [SupportedELFChainId.AELF]: {
    [ContractType.CA]: AELF_Test.CA_CONTRACT_V2,
    [ContractType.TOKEN]: AELF_Test.TOKEN_CONTRACT,
    [ContractType.ETRANSFER]: AELF_Test.ETRANSFER_CONTRACT,
  },
  [SupportedELFChainId.tDVW]: {
    [ContractType.CA]: tDVW_Test.CA_CONTRACT_V2,
    [ContractType.TOKEN]: tDVW_Test.TOKEN_CONTRACT,
    [ContractType.ETRANSFER]: tDVW_Test.ETRANSFER_CONTRACT,
  },
};

export const EXPLORE_CONFIG = {
  [SupportedChainId.mainChain]: AELF_NODES.AELF.exploreUrl,
  [SupportedChainId.sideChain]: AELF_NODES.tDVW.exploreUrl,
};
