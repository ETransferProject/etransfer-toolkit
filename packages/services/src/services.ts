import { AxiosRequestConfig } from 'axios';
import { stringify } from 'query-string';
import {
  TCreateWithdrawOrderRequest,
  TCreateWithdrawOrderResult,
  TGetAuthRequest,
  TGetAuthResult,
  TGetDepositCalculateRequest,
  TGetDepositCalculateResult,
  TGetDepositInfoRequest,
  TGetDepositInfoResult,
  TGetNetworkListRequest,
  TGetNetworkListResult,
  TGetRecordStatusResult,
  TGetRecordsListRequest,
  TGetRecordsListResult,
  TGetTokenListRequest,
  TGetTokenListResult,
  TGetTokenOptionRequest,
  TGetTokenOptionResult,
  TGetWithdrawInfoRequest,
  TGetWithdrawInfoResult,
  TServices,
} from './types';
import { formatApiError } from './utils';
import { API_LIST, AUTH_API_BASE_PARAMS, CancelTokenSourceKey } from './constants';
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

  async getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult> {
    try {
      const res = await this._request.send(API_LIST.common.getNetworkList, {
        params,
        cancelTokenSourceKey: CancelTokenSourceKey.GET_NETWORK_LIST,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getNetworkList error', true);
    }
  }

  async getDepositInfo(params: TGetDepositInfoRequest): Promise<TGetDepositInfoResult> {
    try {
      const res = await this._request.send(API_LIST.deposit.getDepositInfo, {
        params,
        cancelTokenSourceKey: CancelTokenSourceKey.GET_DEPOSIT_INFO,
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
        cancelTokenSourceKey: CancelTokenSourceKey.GET_WITHDRAW_INFO,
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

  async getRecordsList(params: TGetRecordsListRequest): Promise<TGetRecordsListResult> {
    try {
      const res = await this._request.send(API_LIST.records.getRecordsList, { params });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getRecordsList error', false);
    }
  }

  async getRecordStatus(): Promise<TGetRecordStatusResult> {
    try {
      const res = await this._request.send(API_LIST.records.getRecordStatus, {});
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getRecordStatus error', false);
    }
  }
}
