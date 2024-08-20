import React, { createContext, useContext, useMemo, useReducer, useRef } from 'react';
import { BasicActions } from '../utils';
import { ETransferWithdrawActions, ETransferWithdrawState } from './actions';
import { ETransferConfig } from '../../provider/ETransferConfigProvider';
import { ETransferWithdrawConfig } from '../../provider/types';
import { IChainMenuItem } from '../../types';
import { CHAIN_ID, CHAIN_MENU_DATA } from '../../constants';
import { getWithdrawDefaultConfig } from '../../provider/utils';
import { getNetworkType } from '../../utils';

const INITIAL_STATE = {
  // depositTokenSymbol: TokenType.USDT,
  // receiveTokenSymbol: TokenType.USDT,
  // chainItem: CHAIN_MENU_DATA['AELF'],
};

const ETransferWithdrawContext = createContext<any>(INITIAL_STATE);

export function useETransferWithdraw(): [ETransferWithdrawState, BasicActions] {
  return useContext(ETransferWithdrawContext);
}

//reducer
function reducer(state: ETransferWithdrawState, { type, payload }: any) {
  switch (type) {
    case ETransferWithdrawActions.setTokenSymbol: {
      const symbol = payload.symbol;
      if (!symbol) return state;

      return Object.assign({}, state, { tokenSymbol: symbol });
    }
    case ETransferWithdrawActions.setTokenList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { tokenList: list });
    }
    case ETransferWithdrawActions.setNetworkItem: {
      const networkItem = payload.network;

      return Object.assign({}, state, { networkItem });
    }
    case ETransferWithdrawActions.setNetworkList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { networkList: list });
    }
    case ETransferWithdrawActions.setChainItem: {
      const item = payload.chainItem;
      if (!item?.key) return state;

      return Object.assign({}, state, { chainItem: item });
    }
    case ETransferWithdrawActions.setChainList: {
      const list = payload.list;
      if (!list || !Array.isArray(list)) return state;

      return Object.assign({}, state, { chainList: list });
    }
    case ETransferWithdrawActions.setAddress: {
      return Object.assign({}, state, { address: payload.address });
    }
    case ETransferWithdrawActions.destroy: {
      return INITIAL_STATE;
    }
    default: {
      return Object.assign({}, state, payload);
    }
  }
}

export function ETransferWithdrawProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const withdrawConfig = ETransferConfig.getConfig('withdrawConfig') as ETransferWithdrawConfig | undefined;
  const withdrawConfigRef = useRef(withdrawConfig);
  withdrawConfigRef.current = withdrawConfig;

  const chain = useMemo(() => {
    const networkType = getNetworkType();
    const defaultChainIds = networkType === 'TESTNET' ? [CHAIN_ID.tDVW, CHAIN_ID.AELF] : [CHAIN_ID.tDVV, CHAIN_ID.AELF];
    const supportChainIds = withdrawConfigRef.current?.supportChainIds || defaultChainIds;
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

  const providerValue = useMemo<[ETransferWithdrawState, { dispatch: React.Dispatch<any> }]>(() => {
    const { chainId, network, token } = getWithdrawDefaultConfig();
    let currentChainItem: IChainMenuItem | undefined;
    if (chainId) {
      currentChainItem = chain.chainList?.find((chain) => chain.key === chainId);
    }

    return [
      {
        chainList: chain.chainList,
        chainItem: currentChainItem || chain.chainItem,
        networkItem: { network: network },
        tokenSymbol: token,
        ...state,
      },
      { dispatch },
    ];
  }, [chain.chainItem, chain.chainList, state]);

  return <ETransferWithdrawContext.Provider value={providerValue}>{children}</ETransferWithdrawContext.Provider>;
}
