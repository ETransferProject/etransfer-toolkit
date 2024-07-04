import { ChainId } from '@portkey/types';
import { dealURLLastChar } from '../utils';
import { ETransferConfig } from './ETransferConfigProvider';

export const getEtransferUrl = () => {
  if (!ETransferConfig.config.etransferUrl) throw Error('Please config etransferUrl');
  return dealURLLastChar(ETransferConfig.config.etransferUrl);
};

export const getEtransferAuthUrl = () => {
  if (!ETransferConfig.config.etransferAuthUrl) throw Error('Please config etransferAuthUrl');
  return dealURLLastChar(ETransferConfig.config.etransferUrl);
};

export const getAelfNode = (chainId: ChainId) => {
  if (!ETransferConfig.config.aelfReact.nodes[chainId]) throw Error('Please config aelfReact');
  return ETransferConfig.config.aelfReact.nodes[chainId];
};

export const getAelfExploreUrl = (chainId: ChainId) => {
  if (!ETransferConfig.config.aelfReact.nodes[chainId]?.exploreUrl) throw Error('Please config exploreUrl');
  return ETransferConfig.config.aelfReact.nodes[chainId]?.exploreUrl || '';
};

export const getAelfRpcUrl = (chainId: ChainId): string => {
  if (!ETransferConfig.config.aelfReact.nodes[chainId]?.rpcUrl) throw Error('Please config rpcUrl');
  return ETransferConfig.config.aelfReact.nodes[chainId]?.rpcUrl || '';
};
