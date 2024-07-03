import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { basicETransferView, ETransferState } from './actions';
import { BasicActions } from '../utils';
import { ChainType } from '@portkey/types';

const INITIAL_STATE = {
  chainType: 'aelf',
};
const ETransferContext = createContext<any>(INITIAL_STATE);

export function useETransfer(): [ETransferState, BasicActions] {
  return useContext(ETransferContext);
}

// reducer
function reducer(state: any, { type, payload }: any) {
  switch (type) {
    case basicETransferView.destroy.type: {
      return {};
    }
    default: {
      const { destroy } = payload;
      if (destroy) return Object.assign({}, payload);
      return Object.assign({}, state, payload);
    }
  }
}

export interface ETransferProviderProps {
  chainType?: ChainType;
  children: React.ReactNode;
}

export default function ETransferProvider({ chainType, children }: ETransferProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // TODO
  //   useEffectOnce(() => {
  //     initConfig();
  //     if (etransferCore.storage) {
  //       ConfigProvider.setGlobalConfig({});
  //     }
  //   });

  return (
    <ETransferContext.Provider value={useMemo(() => [{ ...state, chainType }, { dispatch }], [state, chainType])}>
      {children}
    </ETransferContext.Provider>
  );
}
