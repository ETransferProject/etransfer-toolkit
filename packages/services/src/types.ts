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
  TGetRecordStatusRequest,
  TCheckRegistrationRequest,
  TCheckRegistrationResult,
  TCreateTransferOrderRequest,
  TCreateTransferOrderResult,
  TGetTokenNetworkRelationRequest,
  TGetTokenNetworkRelationResult,
  TGetTransferInfoRequest,
  TGetTransferInfoResult,
  TUpdateTransferOrderRequest,
  TUpdateTransferOrderResult,
} from '@etransfer/types';

export type TServices = {
  getAuthToken(params: TGetAuthRequest): Promise<TGetAuthResult>;
  getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult>;
  getTokenOption(params: TGetTokenOptionRequest): Promise<TGetTokenOptionResult>;
  getNetworkList(params: TGetNetworkListRequest, authToken?: string): Promise<TGetNetworkListResult>;
  getTokenPrices(params: TGetTokenPricesRequest): Promise<TGetTokenPricesResult>;

  // About Deposit
  getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult>;
  getDepositCalculate(params: TGetDepositCalculateRequest): Promise<TGetDepositCalculateResult>;

  // About Withdraw
  getWithdrawInfo(params: TGetWithdrawInfoRequest): Promise<TGetWithdrawInfoResult>;
  createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult>;

  // About History
  getRecordsList(params: TGetRecordsListRequest): Promise<TGetRecordsListResult>;
  getRecordStatus(params?: TGetRecordStatusRequest): Promise<TGetRecordStatusResult>;
  getRecordDetail(id: string): Promise<TGetRecordDetailResult>;

  // About Registration
  checkEOARegistration(params: TCheckEOARegistrationRequest): Promise<TCheckEOARegistrationResult>;
  checkRegistration(params: TCheckRegistrationRequest): Promise<TCheckRegistrationResult>;

  // About Transfer
  getTokenNetworkRelation(
    params: TGetTokenNetworkRelationRequest,
    authToken?: string,
  ): Promise<TGetTokenNetworkRelationResult>;
  getTransferInfo(params: TGetTransferInfoRequest): Promise<TGetTransferInfoResult>;
  createTransferOrder(params: TCreateTransferOrderRequest, authToken?: string): Promise<TCreateTransferOrderResult>;
  updateTransferOrder(
    params: TUpdateTransferOrderRequest,
    orderId: string,
    authToken?: string,
  ): Promise<TUpdateTransferOrderResult>;
};
