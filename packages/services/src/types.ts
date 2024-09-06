import {
  TCheckEOARegistrationRequest,
  TCheckEOARegistrationResult,
  TCreateWithdrawOrderRequest,
  TCreateWithdrawOrderResult,
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
  TGetRecordStatusResult,
  TGetRecordsListRequest,
  TGetRecordsListResult,
  TGetTokenPricesRequest,
  TGetTokenPricesResult,
  TGetRecordDetailResult,
} from '@etransfer/types';

export type TServices = {
  getAuthToken(params: TGetAuthRequest): Promise<TGetAuthResult>;
  getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult>;
  getTokenOption(params: TGetTokenOptionRequest): Promise<TGetTokenOptionResult>;
  getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult>;
  getTokenPrices(params: TGetTokenPricesRequest): Promise<TGetTokenPricesResult>;
  getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult>;
  getDepositCalculate(params: TGetDepositCalculateRequest): Promise<TGetDepositCalculateResult>;
  getWithdrawInfo(params: TGetWithdrawInfoRequest): Promise<TGetWithdrawInfoResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;
  getRecordsList(params: TGetRecordsListRequest): Promise<TGetRecordsListResult>;
  getRecordStatus(): Promise<TGetRecordStatusResult>;
  getRecordDetail(id: string): Promise<TGetRecordDetailResult>;
  checkEOARegistration(params: TCheckEOARegistrationRequest): Promise<TCheckEOARegistrationResult>;
};
