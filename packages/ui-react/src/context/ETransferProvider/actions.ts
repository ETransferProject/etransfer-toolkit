import { ChainType } from '@portkey/types';
import { basicActions } from '../utils';

const ETransferActions = {
  destroy: 'DESTROY',
};

export type ETransferState = {
  chainType: ChainType;
};

export const basicETransferView = {
  destroy: {
    type: ETransferActions['destroy'],
    actions: () => basicActions(ETransferActions['destroy']),
  },
};
