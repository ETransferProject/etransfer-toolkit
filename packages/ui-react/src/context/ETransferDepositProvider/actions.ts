import { basicActions } from '../utils';
import { TNetworkItem } from '@etransfer/types';
import { IChainMenuItem } from '../../types';
import { DepositReceiveTokenItem, DepositTokenOptionItem } from '../../components/Deposit/types';

export const ETransferDepositActions = {
  initialized: 'INITIALIZED',
  destroy: 'DESTROY',
  setDepositTokenSymbol: 'setDepositTokenSymbol',
  setDepositTokenList: 'setDepositTokenList',
  setNetworkItem: 'setNetworkItem',
  setNetworkList: 'setNetworkList',
  setReceiveTokenSymbol: 'setReceiveTokenSymbol',
  setReceiveTokenList: 'setReceiveTokenList',
  setChainItem: 'setChainItem',
  setChainList: 'setChainList',
  setDepositProcessingCount: 'setDepositProcessingCount',
};

export interface ETransferDepositState {
  // deposit token
  depositTokenSymbol: string;
  depositTokenList?: DepositTokenOptionItem[];

  // network
  networkItem?: Partial<TNetworkItem>;
  networkList?: TNetworkItem[];

  // receive token
  receiveTokenSymbol: string;
  receiveTokenList?: DepositReceiveTokenItem[];

  // chain
  chainItem: IChainMenuItem;
  chainList?: IChainMenuItem[];

  // notice
  depositProcessingCount?: number;
}

export const etransferDepositAction = {
  initialized: {
    type: ETransferDepositActions['initialized'],
    actions: (initialized: ETransferDepositState) =>
      basicActions(ETransferDepositActions['initialized'], { initialized }),
  },
  setDepositTokenSymbol: {
    type: ETransferDepositActions['setDepositTokenSymbol'],
    actions: (symbol: string) => basicActions(ETransferDepositActions['setDepositTokenSymbol'], { symbol }),
  },
  setDepositTokenList: {
    type: ETransferDepositActions['setDepositTokenList'],
    actions: (list: DepositTokenOptionItem[]) => basicActions(ETransferDepositActions['setDepositTokenList'], { list }),
  },
  setNetworkItem: {
    type: ETransferDepositActions['setNetworkItem'],
    actions: (network?: Partial<TNetworkItem>) => basicActions(ETransferDepositActions['setNetworkItem'], { network }),
  },
  setNetworkList: {
    type: ETransferDepositActions['setNetworkList'],
    actions: (list: TNetworkItem[]) => basicActions(ETransferDepositActions['setNetworkList'], { list }),
  },
  setReceiveTokenSymbol: {
    type: ETransferDepositActions['setReceiveTokenSymbol'],
    actions: (symbol: string) => basicActions(ETransferDepositActions['setReceiveTokenSymbol'], { symbol }),
  },
  setReceiveTokenList: {
    type: ETransferDepositActions['setReceiveTokenList'],
    actions: (list: DepositReceiveTokenItem[]) =>
      basicActions(ETransferDepositActions['setReceiveTokenList'], { list }),
  },
  setChainItem: {
    type: ETransferDepositActions['setChainItem'],
    actions: (chainItem: IChainMenuItem) => basicActions(ETransferDepositActions['setChainItem'], { chainItem }),
  },
  setChainList: {
    type: ETransferDepositActions['setChainList'],
    actions: (list: IChainMenuItem[]) => basicActions(ETransferDepositActions['setChainList'], { list }),
  },
  setDepositProcessingCount: {
    type: ETransferDepositActions['setDepositProcessingCount'],
    actions: (count?: number) => basicActions(ETransferDepositActions['setDepositProcessingCount'], { count }),
  },
  destroy: {
    type: ETransferDepositActions['destroy'],
    actions: () => basicActions(ETransferDepositActions['destroy']),
  },
};
