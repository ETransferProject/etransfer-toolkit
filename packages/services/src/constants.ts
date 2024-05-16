export const DEFAULT_METHOD = 'GET';

const AuthList = {
  token: {
    target: '/connect/token',
    baseConfig: { method: 'POST' },
  },
};

const CommonApiList = {
  getTokenList: '/api/etransfer/token/list',
  getDepositTokenList: '/api/etransfer/token/option',
  getNetworkList: '/api/etransfer/network/list',
  getDepositInfo: '/api/etransfer/deposit/info',
  depositCalculator: '/api/etransfer/deposit/calculator',
  getWithdrawInfo: '/api/etransfer/withdraw/info',
  createWithdrawOrder: {
    target: '/api/etransfer/withdraw/order',
    baseConfig: { method: 'POST' },
  },
};

const HistoryApiList = {
  getRecordsList: '/api/etransfer/record/list',
  getRecordStatus: '/api/etransfer/record/status',
  postRecordRead: '/api/etransfer/record/read',
};

export const API_LIST = { auth: AuthList, common: CommonApiList, records: HistoryApiList };

export enum CancelTokenSourceKey {
  GET_DEPOSIT_INFO = 'GET_DEPOSIT_INFO',
  GET_WITHDRAW_INFO = 'GET_WITHDRAW_INFO',
  GET_NETWORK_LIST = 'GET_NETWORK_LIST',
}
