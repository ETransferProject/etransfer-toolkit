import { basicActions } from '../utils';
import { TNetworkItem, TTokenItem } from '@etransfer/types';
import { IChainMenuItem } from '../../types';

export const ETransferWithdrawActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setTokenSymbol: 'setTokenSymbol',
  setTokenList: 'setTokenList',
  setNetworkItem: 'setNetworkItem',
  setNetworkList: 'setNetworkList',
  setChainItem: 'setChainItem',
  setChainList: 'setChainList',
};

export interface ETransferWithdrawState {
  // token
  tokenSymbol: string;
  tokenList?: TTokenItem[];

  // network
  networkItem?: Partial<TNetworkItem>;
  networkList?: TNetworkItem[];

  // chain
  chainItem: IChainMenuItem;
  chainList?: IChainMenuItem[];
}

export const etransferWithdrawAction = {
  initialized: {
    type: ETransferWithdrawActions['initialized'],
    actions: (initialized: ETransferWithdrawState) =>
      basicActions(ETransferWithdrawActions['initialized'], { initialized }),
  },
  setTokenSymbol: {
    type: ETransferWithdrawActions['setTokenSymbol'],
    actions: (symbol: string) => basicActions(ETransferWithdrawActions['setTokenSymbol'], { symbol }),
  },
  setTokenList: {
    type: ETransferWithdrawActions['setTokenList'],
    actions: (list: TTokenItem[]) => basicActions(ETransferWithdrawActions['setTokenList'], { list }),
  },
  setNetworkItem: {
    type: ETransferWithdrawActions['setNetworkItem'],
    actions: (network?: Partial<TNetworkItem>) => basicActions(ETransferWithdrawActions['setNetworkItem'], { network }),
  },
  setNetworkList: {
    type: ETransferWithdrawActions['setNetworkList'],
    actions: (list: TNetworkItem[]) => basicActions(ETransferWithdrawActions['setNetworkList'], { list }),
  },
  setChainItem: {
    type: ETransferWithdrawActions['setChainItem'],
    actions: (chainItem: IChainMenuItem) => basicActions(ETransferWithdrawActions['setChainItem'], { chainItem }),
  },
  setChainList: {
    type: ETransferWithdrawActions['setChainList'],
    actions: (list: IChainMenuItem[]) => basicActions(ETransferWithdrawActions['setChainList'], { list }),
  },
  destroy: {
    type: ETransferWithdrawActions['destroy'],
    actions: () => basicActions(ETransferWithdrawActions['destroy']),
  },
};
