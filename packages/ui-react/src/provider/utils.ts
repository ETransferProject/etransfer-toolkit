import { ChainId } from '@portkey/types';
import { dealURLLastChar } from '../utils';
import ConfigProvider from './';

export const getEtransferUrl = () => {
  if (!ConfigProvider.config.etransferUrl) throw Error('Please config etransferUrl');
  return dealURLLastChar(ConfigProvider.config.etransferUrl);
};

export const getEtransferAuthUrl = () => {
  if (!ConfigProvider.config.etransferAuthUrl) throw Error('Please config etransferAuthUrl');
  return dealURLLastChar(ConfigProvider.config.etransferUrl);
};

export const getAelfNode = (chainId: ChainId) => {
  if (!ConfigProvider.config.aelfReact.nodes[chainId]) throw Error('Please config aelfReact');
  return ConfigProvider.config.aelfReact.nodes[chainId];
};

export const getAelfExploreUrl = (chainId: ChainId) => {
  if (!ConfigProvider.config.aelfReact.nodes[chainId]?.exploreUrl) throw Error('Please config exploreUrl');
  return ConfigProvider.config.aelfReact.nodes[chainId]?.exploreUrl || '';
};

export const getAelfRpcUrl = (chainId: ChainId): string => {
  if (!ConfigProvider.config.aelfReact.nodes[chainId]?.rpcUrl) throw Error('Please config rpcUrl');
  return ConfigProvider.config.aelfReact.nodes[chainId]?.rpcUrl || '';
};
