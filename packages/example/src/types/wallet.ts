import { TChainId } from '@aelf-web-login/wallet-adapter-base';
import type { Accounts, IPortkeyProvider } from '@portkey/provider-types';
import { PortkeyDid } from '@aelf-web-login/wallet-adapter-bridge';
import { TAelfAccounts } from '@etransfer/ui-react';

export type TChainIds = TChainId[];
export type TChainType = 'ethereum' | 'aelf';

export interface WalletInfo {
  name?: string;
  address: string;
  extraInfo: ExtraInfoForDiscover | ExtraInfoForPortkeyAA | ExtraInfoForNightElf;
}

export interface ExtraInfoForDiscover {
  accounts: Accounts;
  nickName: string;
  provider: IPortkeyProvider;
}

export interface ExtraInfoForPortkeyAA {
  publicKey: string;
  portkeyInfo: PortkeyDid.DIDWalletInfo & {
    accounts: TAelfAccounts;
    nickName: string;
  };
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
