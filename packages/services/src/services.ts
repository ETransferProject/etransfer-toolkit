import { AxiosRequestConfig } from 'axios';
import { stringify } from 'query-string';
import qs from 'qs';
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
  TGetRecordsListRequest,
  TGetRecordsListResult,
  TGetRecordStatusResult,
  TGetTokenPricesRequest,
  TGetTokenPricesResult,
  TGetRecordDetailResult,
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
  TGetRecordStatusRequest,
} from '@etransfer/types';
import { TServices } from './types';
import { formatApiError } from './utils';
import { API_LIST, AUTH_API_BASE_PARAMS, CANCEL_TOKEN_SOURCE_KEY } from './constants';
import { TRequestConfig, EtransferRequest } from '@etransfer/request';

export abstract class BaseService {
  protected readonly _request: EtransferRequest;

  public constructor() {
    this._request = new EtransferRequest();
  }

  public setRequestConfig(key: keyof TRequestConfig, value: TRequestConfig[keyof TRequestConfig]) {
    this._request.setConfig(key, value);
  }

  public setRequestHeaders(key: string, value: string) {
    this._request.setHeaders(key, value);
  }

  public getRequest() {
    return this._request;
  }
}

export class Services extends BaseService implements TServices {
  async getAuthToken(params: TGetAuthRequest, config?: AxiosRequestConfig<any>): Promise<TGetAuthResult> {
    try {
      const res = await this._request.post(`/connect/token`, stringify({ ...AUTH_API_BASE_PARAMS, ...params }), {
        ...config,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return res.data;
    } catch (error) {
      throw formatApiError(error, 'getAuthToken error', false);
    }
  }

  async getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult> {
    try {
      const res = await this._request.send(API_LIST.common.getTokenList, { params });
      return res.data;
    } catch (error) {
      throw formatApiError(error, 'getTokenList error', false);
    }
  }

  async getTokenOption(params: TGetTokenOptionRequest): Promise<TGetTokenOptionResult> {
    try {
      const res = await this._request.send(API_LIST.common.getTokenOption, { params });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getDepositCalculate error', false);
    }
  }

  async getNetworkList(params: TGetNetworkListRequest, authToken?: string): Promise<TGetNetworkListResult> {
    try {
      const _requestConfig: TRequestConfig = { params, cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_NETWORK_LIST };
      if (authToken) {
        _requestConfig.headers = { Authorization: authToken };
      }

      const res = await this._request.send(API_LIST.common.getNetworkList, _requestConfig);
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getNetworkList error', true);
    }
  }

  async getTokenPrices(params: TGetTokenPricesRequest): Promise<TGetTokenPricesResult> {
    try {
      const res = await this._request.send(API_LIST.common.getTokenPrices, {
        params,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getTokenPrices error', true);
    }
  }

  async getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult> {
    try {
      const res = await this._request.send(API_LIST.deposit.getDepositInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_DEPOSIT_INFO,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getDepositInfo error', true);
    }
  }

  async getDepositCalculate(params: TGetDepositCalculateRequest): Promise<TGetDepositCalculateResult> {
    try {
      const res = await this._request.send(API_LIST.deposit.depositCalculator, {
        params,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getDepositCalculate error', false);
    }
  }

  async getWithdrawInfo(params: TGetWithdrawInfoRequest): Promise<TGetWithdrawInfoResult> {
    try {
      const res = await this._request.send(API_LIST.withdraw.getWithdrawInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_WITHDRAW_INFO,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getWithdrawInfo error', true);
    }
  }

  async createWithdrawOrder(params: TCreateWithdrawOrderRequest): Promise<TCreateWithdrawOrderResult> {
    try {
      const res = await this._request.send(API_LIST.withdraw.createWithdrawOrder, {
        data: params,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'createWithdrawOrder error', false);
    }
  }

  // About History
  async getRecordsList(params: TGetRecordsListRequest): Promise<TGetRecordsListResult> {
    try {
      const res = await this._request.send(API_LIST.records.getRecordsList, { params });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getRecordsList error', false);
    }
  }

  async getRecordStatus(params?: TGetRecordStatusRequest): Promise<TGetRecordStatusResult> {
    try {
      const _requestConfig: TRequestConfig = {};
      if (params) {
        _requestConfig.params = params;
        _requestConfig.paramsSerializer = function (params) {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        };
      }
      const res = await this._request.send(API_LIST.records.getRecordStatus, _requestConfig);
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getRecordStatus error', false);
    }
  }

  async getRecordDetail(id: string): Promise<TGetRecordDetailResult> {
    try {
      const res = await this._request.send(API_LIST.records.getRecordDetail, { query: id });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getRecordDetail error', false);
    }
  }

  // About Registration
  async checkEOARegistration(params: TCheckEOARegistrationRequest): Promise<TCheckEOARegistrationResult> {
    try {
      const res = await this._request.send(API_LIST.user.checkEOARegistration, { params });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'checkEOARegistration error', false);
    }
  }

  async checkRegistration(params: TCheckRegistrationRequest): Promise<TCheckRegistrationResult> {
    try {
      const res = await this._request.send(API_LIST.user.checkRegistration, { params });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'checkRegistration error', false);
    }
  }

  // About Transfer
  async getTokenNetworkRelation(
    params: TGetTokenNetworkRelationRequest,
    authToken?: string,
  ): Promise<TGetTokenNetworkRelationResult> {
    try {
      const res = await this._request.send(API_LIST.transfer.getTokenNetworkRelation, {
        params,
        headers: {
          Authorization: authToken || '',
        },
      });

      return res.data;
    } catch (error) {
      throw formatApiError(error, 'getTokenNetworkRelation error', false);
    }
  }

  async getTransferInfo(params: TGetTransferInfoRequest): Promise<TGetTransferInfoResult> {
    try {
      const res = await this._request.send(API_LIST.transfer.getTransferInfo, {
        params,
        cancelTokenSourceKey: CANCEL_TOKEN_SOURCE_KEY.GET_TRANSFER_INFO,
        headers: {
          Authorization: '',
        },
      });

      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getTransferInfo error', true);
    }
  }

  async createTransferOrder(
    params: TCreateTransferOrderRequest,
    authToken?: string,
  ): Promise<TCreateTransferOrderResult> {
    try {
      const _requestConfig: TRequestConfig = { data: params };
      if (authToken) {
        _requestConfig.headers = { Authorization: authToken };
      }

      const res = await this._request.send(API_LIST.transfer.createTransferOrder, _requestConfig);

      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'createTransferOrder error', false);
    }
  }

  async updateTransferOrder(
    params: TUpdateTransferOrderRequest,
    orderId: string,
    authToken?: string,
  ): Promise<TUpdateTransferOrderResult> {
    try {
      const _requestConfig: TRequestConfig = { data: params, query: orderId };
      if (authToken) {
        _requestConfig.headers = { Authorization: authToken };
      }

      const res = await this._request.send(API_LIST.transfer.updateTransferOrder, _requestConfig);

      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'updateTransferOrder error', false);
    }
  }
}
