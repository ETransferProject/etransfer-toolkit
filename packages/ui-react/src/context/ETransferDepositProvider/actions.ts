import { basicActions } from '../utils';
import { TNetworkItem, TToTokenItem, TTokenOptionItem } from '@etransfer/types';
import { IChainMenuItem } from '../../types';

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
};

export interface ETransferDepositBaseState {
  depositTokenSymbol: string;
  receiveTokenSymbol: string;
  chainItem: IChainMenuItem;
}

export interface ETransferDepositState extends ETransferDepositBaseState {
  // deposit token
  depositTokenList?: TTokenOptionItem[];

  // network
  networkItem?: TNetworkItem;
  networkList?: TNetworkItem[];

  // receive token
  receiveTokenList?: TToTokenItem[];

  // chain
  chainList?: IChainMenuItem[];
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
    actions: (list: TTokenOptionItem[]) => basicActions(ETransferDepositActions['setDepositTokenList'], { list }),
  },
  setNetworkItem: {
    type: ETransferDepositActions['setNetworkItem'],
    actions: (network?: TNetworkItem) => basicActions(ETransferDepositActions['setNetworkItem'], { network }),
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
    actions: (list: TToTokenItem[]) => basicActions(ETransferDepositActions['setReceiveTokenList'], { list }),
  },
  setChainItem: {
    type: ETransferDepositActions['setChainItem'],
    actions: (chainItem: IChainMenuItem) => basicActions(ETransferDepositActions['setChainItem'], { chainItem }),
  },
  setChainList: {
    type: ETransferDepositActions['setChainList'],
    actions: (list: IChainMenuItem[]) => basicActions(ETransferDepositActions['setChainList'], { list }),
  },
  destroy: {
    type: ETransferDepositActions['destroy'],
    actions: () => basicActions(ETransferDepositActions['destroy']),
  },
};
