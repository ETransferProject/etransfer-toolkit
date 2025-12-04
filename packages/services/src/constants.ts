import { TBaseConfig } from '@etransfer/request';
import { PortkeyVersion, TAuthApiBaseParams, TOtherChainAuthApiBaseParams } from '@etransfer/types';

export const DEFAULT_METHOD = 'GET';

const AuthList: Record<string, TBaseConfig> = {
  token: {
    target: '/connect/token',
    baseConfig: { method: 'POST' },
  },
};

const CommonApiList: Record<string, TBaseConfig> = {
  getTokenList: '/api/etransfer/token/list',
  getTokenOption: '/api/etransfer/token/option',
  getNetworkList: '/api/etransfer/network/list',
  getTokenPrices: '/api/etransfer/token/price',
};

const DepositApiList: Record<string, TBaseConfig> = {
  getDepositInfo: '/api/etransfer/deposit/info',
  depositCalculator: '/api/etransfer/deposit/calculator',
};

const WithdrawApiList: Record<string, TBaseConfig> = {
  getWithdrawInfo: '/api/etransfer/withdraw/info',
  createWithdrawOrder: {
    target: '/api/etransfer/withdraw/order',
    baseConfig: { method: 'POST' },
  },
};

const TransferApiList: Record<string, TBaseConfig> = {
  getTokenNetworkRelation: '/api/etransfer/network/tokens',
  getTransferInfo: '/api/etransfer/transfer/info',
  createTransferOrder: {
    target: '/api/etransfer/transfer/order',
    baseConfig: { method: 'POST' },
  },
  updateTransferOrder: {
    target: '/api/etransfer/transfer',
    baseConfig: { method: 'PUT' },
  },
};

const HistoryApiList: Record<string, TBaseConfig> = {
  getRecordsList: '/api/etransfer/record/list',
  getRecordStatus: '/api/etransfer/record/status',
  getRecordDetail: '/api/etransfer/record',
};

const UserApiList: Record<string, TBaseConfig> = {
  checkEOARegistration: '/api/etransfer/user/check-eoa-registration',
  checkRegistration: '/api/etransfer/user/check-registration',
};

export const API_LIST: Record<string, Record<string, TBaseConfig>> = {
  auth: AuthList,
  common: CommonApiList,
  deposit: DepositApiList,
  withdraw: WithdrawApiList,
  transfer: TransferApiList,
  records: HistoryApiList,
  user: UserApiList,
};

export enum CANCEL_TOKEN_SOURCE_KEY {
  GET_DEPOSIT_INFO = 'GET_DEPOSIT_INFO',
  GET_WITHDRAW_INFO = 'GET_WITHDRAW_INFO',
  GET_NETWORK_LIST = 'GET_NETWORK_LIST',
  GET_TRANSFER_INFO = 'GET_TRANSFER_INFO',
}

export const AUTH_API_BASE_PARAMS: TAuthApiBaseParams = {
  grant_type: 'signature',
  scope: 'ETransferServer',
  client_id: 'ETransferServer_App',
};

export const OTHER_CHAIN_AUTH_API_BASE_PARAMS: TOtherChainAuthApiBaseParams = {
  grant_type: 'signature',
  scope: 'ETransferServer',
  client_id: 'ETransferServer_App',
  version: PortkeyVersion.v2,
  source: 'wallet',
};
