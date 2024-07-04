import React, { createContext, useContext, useMemo, useReducer } from 'react';
import { basicETransferView, ETransferState } from './actions';
import { BasicActions } from '../utils';
import { NetworkType } from '../../types';

const INITIAL_STATE: ETransferState = {
  networkType: 'MAINNET',
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
  networkType?: NetworkType;
  children: React.ReactNode;
}

export function ETransferProvider({ networkType, children }: ETransferProviderProps) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  // TODO
  //   useEffectOnce(() => {
  //     initConfig();
  //     if (etransferCore.storage) {
  //       ETransferConfig.setGlobalConfig({});
  //     }
  //   });

  return (
    <ETransferContext.Provider value={useMemo(() => [{ ...state, networkType }, { dispatch }], [state, networkType])}>
      {children}
    </ETransferContext.Provider>
  );
}
