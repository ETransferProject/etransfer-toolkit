import { ContractType } from '@/constants/chain';
import * as AELF_Test from '../platform/AELF_Test';
import * as tDVW_Test from '../platform/tDVW_Test';
import { NetworkName } from '@/constants/network';
import { NetworkEnum } from '@aelf-web-login/wallet-adapter-base';

export const TELEGRAM_BOT_ID = '7057631599';

export const NETWORK_NAME: NetworkName = NetworkName.testnet;

export const NETWORK_TYPE: NetworkEnum = NetworkEnum.TESTNET;

export enum SupportedELFChainId {
  AELF = 'AELF',
  tDVW = 'tDVW',
}

export const SupportedChainId = {
  mainChain: SupportedELFChainId.AELF,
  sideChain: SupportedELFChainId.tDVW,
};

export const CHAIN_NAME: { [chainId in SupportedELFChainId]: string } = {
  [SupportedELFChainId.AELF]: 'aelf MainChain Testnet',
  [SupportedELFChainId.tDVW]: 'aelf dAppChain Testnet',
};

export enum CHAIN_NAME_ENUM {
  'MainChain' = 'aelf MainChain',
  'SideChain' = 'aelf dAppChain',
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
export const ETRANSFER_URL = 'https://test-app.etransfer.exchange';
export const ETRANSFER_AUTH_URL = 'https://test-app.etransfer.exchange';
export const WebLoginGraphqlUrl = 'https://test-indexer-api.aefinder.io/api/app/graphql/portkey';
export const WebLoginServiceUrl = 'https://aa-portkey-test.portkey.finance';
export const WebLoginConnectUrl = 'https://auth-aa-portkey-test.portkey.finance';

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
