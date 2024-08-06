import { TBaseConfig } from '@etransfer/request';
import { TAuthApiBaseParams } from '@etransfer/types';

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

const HistoryApiList: Record<string, TBaseConfig> = {
  getRecordsList: '/api/etransfer/record/list',
  getRecordStatus: '/api/etransfer/record/status',
};

const UserApiList: Record<string, TBaseConfig> = {
  checkEOARegistration: '/api/etransfer/user/check-eoa-registration',
};

export const API_LIST: Record<string, Record<string, TBaseConfig>> = {
  auth: AuthList,
  common: CommonApiList,
  deposit: DepositApiList,
  withdraw: WithdrawApiList,
  records: HistoryApiList,
  user: UserApiList,
};

export enum CANCEL_TOKEN_SOURCE_KEY {
  GET_DEPOSIT_INFO = 'GET_DEPOSIT_INFO',
  GET_WITHDRAW_INFO = 'GET_WITHDRAW_INFO',
  GET_NETWORK_LIST = 'GET_NETWORK_LIST',
  GET_TOKEN_PRICES = 'GET_TOKEN_PRICES',
}

export const AUTH_API_BASE_PARAMS: TAuthApiBaseParams = {
  grant_type: 'signature',
  scope: 'ETransferServer',
  client_id: 'ETransferServer_App',
};
