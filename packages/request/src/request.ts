import axios, { AxiosInstance, AxiosRequestConfig, CancelTokenSource } from 'axios';
import { TBaseConfig, TEtransferRequest, TRequestConfig } from './types';
import { getRequestConfig, spliceUrl } from './utils';
import { baseRequest } from './axios';
import { DEFAULT_METHOD } from './constants';

const cancelTokenSources: Map<string, CancelTokenSource> = new Map();

export class EtransferRequest implements TEtransferRequest {
  private _baseRequest: AxiosInstance;

  constructor() {
    this._baseRequest = baseRequest;
  }

  public async post(url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) {
    return await this._baseRequest.post(url, data, config);
  }

  public async get(url: string, config?: AxiosRequestConfig<any> | undefined) {
    return await this._baseRequest.get(url, config);
  }

  public async send(base: TBaseConfig, config: TRequestConfig) {
    const {
      method = DEFAULT_METHOD,
      query = '',
      url,
      cancelTokenSourceKey,
      ...axiosConfig
    } = getRequestConfig(base, config) || {};
    const source = axios.CancelToken.source();
    if (cancelTokenSourceKey) {
      if (cancelTokenSources.has(cancelTokenSourceKey)) {
        cancelTokenSources.get(cancelTokenSourceKey)?.cancel();
      }
      cancelTokenSources.set(cancelTokenSourceKey, source);
    }
    return await this._baseRequest({
      ...axiosConfig,
      url: url || spliceUrl(typeof base === 'string' ? base : base.target, query),
      method,
      cancelToken: source.token,
    });
  }

  public setHeaders(key: string, value: string) {
    this._baseRequest.defaults.headers.common[key] = value;
  }

  public setConfig(key: keyof TRequestConfig, value: TRequestConfig[keyof TRequestConfig]) {
    this._baseRequest.defaults[key] = value;
  }
}
