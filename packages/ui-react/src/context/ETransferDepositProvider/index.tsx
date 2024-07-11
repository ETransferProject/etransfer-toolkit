import React, { createContext, useContext, useMemo, useReducer, useRef } from 'react';
import { BasicActions } from '../utils';
import { ETransferDepositActions, ETransferDepositState } from './actions';
import { ETransferConfig } from '../../provider/ETransferConfigProvider';
import { ETransferDepositConfig } from '../../provider/types';
import { IChainMenuItem, NetworkType } from '../../types';
import { CHAIN_ID, CHAIN_MENU_DATA } from '../../constants';
import { getDepositDefaultConfig } from '../../provider/utils';

const INITIAL_STATE = {
  // depositTokenSymbol: TokenType.USDT,
  // receiveTokenSymbol: TokenType.USDT,
  // chainItem: CHAIN_MENU_DATA['AELF'],
};

const ETransferDepositContext = createContext<any>(INITIAL_STATE);

export function useETransferDeposit(): [ETransferDepositState, BasicActions] {
  return useContext(ETransferDepositContext);
}

//reducer
function reducer(state: ETransferDepositState, { type, payload }: any) {
  switch (type) {
    case ETransferDepositActions.setDepositTokenSymbol: {
      const symbol = payload.symbol;
      if (!symbol) return state;

      return Object.assign({}, state, { depositTokenSymbol: symbol });
    }
    case ETransferDepositActions.setDepositTokenList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { depositTokenList: list });
    }
    case ETransferDepositActions.setNetworkItem: {
      const networkItem = payload.network;
      if (!networkItem?.network) return state;

      return Object.assign({}, state, { networkItem });
    }
    case ETransferDepositActions.setNetworkList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { networkList: list });
    }
    case ETransferDepositActions.setReceiveTokenSymbol: {
      const symbol = payload.symbol;
      if (!symbol) return state;

      return Object.assign({}, state, { receiveTokenSymbol: symbol });
    }
    case ETransferDepositActions.setReceiveTokenList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { receiveTokenList: list });
    }
    case ETransferDepositActions.setChainItem: {
      const item = payload.chainItem;
      if (!item?.key) return state;

      return Object.assign({}, state, { chainItem: item });
    }
    case ETransferDepositActions.setChainList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { chainList: list });
    }

    case ETransferDepositActions.destroy: {
      return INITIAL_STATE;
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export function ETransferDepositProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const depositConfig = ETransferConfig.getConfig('depositConfig') as ETransferDepositConfig;
  const depositConfigRef = useRef(depositConfig);
  depositConfigRef.current = depositConfig;

  const chain = useMemo(() => {
    const networkType = ETransferConfig.getConfig('networkType') as NetworkType;
    const defaultChainIds = networkType === 'TESTNET' ? [CHAIN_ID.tDVW, CHAIN_ID.AELF] : [CHAIN_ID.tDVV, CHAIN_ID.AELF];
    const supportChainIds = depositConfigRef.current.supportChainIds || defaultChainIds;
    const chainList: IChainMenuItem[] = [];
    supportChainIds.forEach((item) => {
      if (CHAIN_MENU_DATA[item]?.key) {
        chainList.push(CHAIN_MENU_DATA[item]);
      }
    });
    return {
      chainList: chainList,
      chainItem: chainList[0],
    };
  }, []);

  const providerValue = useMemo<[ETransferDepositState, { dispatch: React.Dispatch<any> }]>(() => {
    const { chainId, network, depositToken, receiveToken } = getDepositDefaultConfig();
    let currentChainItem: IChainMenuItem | undefined;
    if (chainId) {
      currentChainItem = chain.chainList?.find((chain) => chain.key === chainId);
    }

    return [
      {
        chainList: chain.chainList,
        chainItem: currentChainItem || chain.chainItem,
        networkItem: { network: network },
        depositTokenSymbol: depositToken,
        receiveTokenSymbol: receiveToken,
        ...state,
      },
      { dispatch },
    ];
  }, [chain.chainItem, chain.chainList, state]);

  return <ETransferDepositContext.Provider value={providerValue}>{children}</ETransferDepositContext.Provider>;
}
