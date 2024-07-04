import { basicActions } from '../utils';
import { NetworkType } from '../../types';

const ETransferActions = {
  destroy: 'DESTROY',
};

export type ETransferState = {
  networkType: NetworkType;
};

export const basicETransferView = {
  destroy: {
    type: ETransferActions['destroy'],
    actions: () => basicActions(ETransferActions['destroy']),
  },
};
