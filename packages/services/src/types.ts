import {
  TGetAuthRequest,
  TGetAuthResult,
  TGetTokenListRequest,
  TGetTokenListResult,
  TGetTokenOptionRequest,
  TGetTokenOptionResult,
  TGetNetworkListRequest,
  TGetNetworkListResult,
  TGetDepositInfoRequest,
  TGetDepositInfoResult,
  TGetDepositCalculateRequest,
  TGetDepositCalculateResult,
  TGetWithdrawInfoRequest,
  TGetWithdrawInfoResult,
  TCreateWithdrawOrderRequest,
  TCreateWithdrawOrderResult,
  TGetRecordStatusResult,
} from '@etransfer/types';

export type TServices = {
  getAuthToken(params: TGetAuthRequest): Promise<TGetAuthResult>;
  getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult>;
  getTokenOption(params: TGetTokenOptionRequest): Promise<TGetTokenOptionResult>;
  getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult>;
  getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult>;
  getDepositCalculate(params: TGetDepositCalculateRequest): Promise<TGetDepositCalculateResult>;
  getWithdrawInfo(params: TGetWithdrawInfoRequest): Promise<TGetWithdrawInfoResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;
  getRecordStatus(): Promise<TGetRecordStatusResult>;
};
