import React, { createContext, useContext, useMemo, useReducer } from 'react';

import { BasicActions } from '../utils';

import { CHAIN_MENU_DATA, TokenType } from '../../constants';
import { ETransferDepositActions, ETransferDepositBaseState, ETransferDepositState } from './actions';

const INITIAL_STATE = {
  depositTokenSymbol: TokenType.USDT,
  receiveTokenSymbol: TokenType.USDT,
  chainItem: CHAIN_MENU_DATA['tDVV'],
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
      console.log('🌈 🌹 🌹 payload', payload);
      const item = payload.chainItem;
      if (!item?.key) return state;
      console.log('🌈 🌹 🌹 res', Object.assign({}, state, { chainItem: item }));
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

export function ETransferDepositProvider({
  children,
  ...props
}: {
  children: React.ReactNode;
} & ETransferDepositBaseState) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);

  return (
    <ETransferDepositContext.Provider value={useMemo(() => [{ ...props, ...state }, { dispatch }], [state, props])}>
      {children}
    </ETransferDepositContext.Provider>
  );
}
