// import { ChainId } from '@portkey/types';
import { dealURLLastChar, getNetworkType } from '../utils';
import { ETransferConfig } from './ETransferConfigProvider';
import { ETransferDepositConfig, ETransferWithdrawConfig, SupportDataResult } from './types';
import { CHAIN_ID, TokenType } from '../constants';
import { handleErrorMessage } from '@etransfer/utils';

export const getEtransferUrl = () => {
  if (!ETransferConfig.config.etransferUrl) throw Error('Please config etransferUrl');
  return dealURLLastChar(ETransferConfig.config.etransferUrl);
};

export const getEtransferAuthUrl = () => {
  if (!ETransferConfig.config.etransferAuthUrl) throw Error('Please config etransferAuthUrl');
  return dealURLLastChar(ETransferConfig.config.etransferUrl);
};

// export const getAelfNode = (chainId: ChainId) => {
//   if (!ETransferConfig.config?.aelfReact?.nodes?.[chainId]) throw Error('Please config aelfReact');
//   return ETransferConfig.config.aelfReact.nodes[chainId];
// };

// export const getAelfExploreUrl = (chainId: ChainId) => {
//   if (!ETransferConfig.config?.aelfReact?.nodes?.[chainId]?.exploreUrl) throw Error('Please config exploreUrl');
//   return ETransferConfig.config.aelfReact.nodes[chainId]?.exploreUrl || '';
// };

// export const getAelfRpcUrl = (chainId: ChainId): string => {
//   if (!ETransferConfig.config?.aelfReact?.nodes?.[chainId]?.rpcUrl) throw Error('Please config rpcUrl');
//   return ETransferConfig.config.aelfReact.nodes[chainId]?.rpcUrl || '';
// };

// deposit
export const getDepositSupportChainIds = (): SupportDataResult => {
  const supportChainIds = ETransferConfig.config.depositConfig?.supportChainIds;
  if (supportChainIds && Array.isArray(supportChainIds) && supportChainIds.length > 0) {
    return {
      isLimit: true,
      limits: supportChainIds,
    };
  }
  return {
    isLimit: false,
  };
};

export const getDepositSupportDepositTokens = (): SupportDataResult => {
  const supportDepositTokens = ETransferConfig.config.depositConfig?.supportDepositTokens;
  if (supportDepositTokens && Array.isArray(supportDepositTokens) && supportDepositTokens.length > 0) {
    return {
      isLimit: true,
      limits: supportDepositTokens,
    };
  }

  return {
    isLimit: false,
  };
};

export const getDepositSupportNetworks = (): SupportDataResult => {
  const supportNetworks = ETransferConfig.config.depositConfig?.supportNetworks;
  if (supportNetworks && Array.isArray(supportNetworks) && supportNetworks.length > 0) {
    return {
      isLimit: true,
      limits: supportNetworks,
    };
  }

  return {
    isLimit: false,
  };
};

export const getDepositSupportReceiveTokens = (): SupportDataResult => {
  const supportReceiveTokens = ETransferConfig.config.depositConfig?.supportReceiveTokens;
  if (supportReceiveTokens && Array.isArray(supportReceiveTokens) && supportReceiveTokens.length > 0) {
    return {
      isLimit: true,
      limits: supportReceiveTokens,
    };
  }
  return {
    isLimit: false,
  };
};

export const getDepositDefaultConfig = () => {
  // read and write ETransferConfig
  try {
    let chainId, network, depositToken, receiveToken;
    const depositConfig = ETransferConfig.getConfig('depositConfig') as ETransferDepositConfig | undefined;
    const networkType = getNetworkType();
    if (depositConfig?.defaultChainId) {
      chainId = depositConfig.defaultChainId;
    }
    if (depositConfig?.defaultDepositToken) {
      depositToken = depositConfig.defaultDepositToken;
    }
    if (depositConfig?.defaultNetwork) {
      network = depositConfig.defaultNetwork;
    }
    if (depositConfig?.defaultReceiveToken) {
      receiveToken = depositConfig.defaultReceiveToken;
    }

    const defaultNetworkType = networkType === 'TESTNET' ? CHAIN_ID.tDVW : CHAIN_ID.tDVV;
    const defaultDepositToken = depositConfig?.supportDepositTokens?.[0] || TokenType.USDT;
    const defaultReceiveToken = depositConfig?.supportReceiveTokens?.[0] || TokenType.USDT;

    return {
      chainId: chainId || defaultNetworkType,
      network,
      depositToken: depositToken || defaultDepositToken,
      receiveToken: receiveToken || defaultReceiveToken,
    };
  } catch (error) {
    throw new Error(handleErrorMessage(error));
  }
};

// withdraw
export const getWithdrawSupportChainIds = (): SupportDataResult => {
  const supportChainIds = ETransferConfig.config.withdrawConfig?.supportChainIds;
  if (supportChainIds && Array.isArray(supportChainIds) && supportChainIds.length > 0) {
    return {
      isLimit: true,
      limits: supportChainIds,
    };
  }
  return {
    isLimit: false,
  };
};

export const getWithdrawSupportTokens = (): SupportDataResult => {
  const supportTokens = ETransferConfig.config.withdrawConfig?.supportTokens;
  if (supportTokens && Array.isArray(supportTokens) && supportTokens.length > 0) {
    return {
      isLimit: true,
      limits: supportTokens,
    };
  }

  return {
    isLimit: false,
  };
};

export const getWithdrawSupportNetworks = (): SupportDataResult => {
  const supportNetworks = ETransferConfig.config.withdrawConfig?.supportNetworks;
  if (supportNetworks && Array.isArray(supportNetworks) && supportNetworks.length > 0) {
    return {
      isLimit: true,
      limits: supportNetworks,
    };
  }

  return {
    isLimit: false,
  };
};
export const getWithdrawDefaultConfig = () => {
  // read and write ETransferConfig
  try {
    let chainId, network, token;
    const withdrawConfig = ETransferConfig.getConfig('withdrawConfig') as ETransferWithdrawConfig | undefined;
    const networkType = getNetworkType();
    if (withdrawConfig?.defaultChainId) {
      chainId = withdrawConfig.defaultChainId;
    }
    if (withdrawConfig?.defaultToken) {
      token = withdrawConfig.defaultToken;
    }
    if (withdrawConfig?.defaultNetwork) {
      network = withdrawConfig.defaultNetwork;
    }

    const defaultNetworkType = networkType === 'TESTNET' ? CHAIN_ID.tDVW : CHAIN_ID.tDVV;
    const defaultToken = withdrawConfig?.supportTokens?.[0] || TokenType.USDT;

    return {
      chainId: chainId || defaultNetworkType,
      network,
      token: token || defaultToken,
    };
  } catch (error) {
    throw new Error(handleErrorMessage(error));
  }
};
