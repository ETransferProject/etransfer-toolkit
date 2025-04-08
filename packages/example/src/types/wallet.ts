import { TChainId } from '@aelf-web-login/wallet-adapter-base';
import type { Accounts, IPortkeyProvider } from '@portkey/provider-types';

export type TChainIds = TChainId[];
export type TChainType = 'ethereum' | 'aelf';

export interface WalletInfo {
  name?: string;
  address: string;
  extraInfo: ExtraInfoForDiscoverAndWeb | ExtraInfoForNightElf;
}

export interface ExtraInfoForDiscoverAndWeb {
  accounts: Accounts;
  nickName: string;
  provider: IPortkeyProvider;
}

export interface ExtraInfoForNightElf {
  publicKey: string;
  nightElfInfo: {
    name: string;
    // appPermission;
    // defaultAElfBridge: bridge;
    // aelfBridges: bridges;
    // nodes;
  };
}
