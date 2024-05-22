import axios, { AxiosInstance, CancelTokenSource } from 'axios';
import { TBaseConfig, TEtransferRequest, TRequestConfig, TSupportUrl } from './types';
import { getRequestConfig, spliceUrl } from './utils';
import { baseRequest } from './axios';
import { DEFAULT_METHOD } from './constants';

const cancelTokenSources: Map<string, CancelTokenSource> = new Map();

export class EtransferRequest implements TEtransferRequest {
  private _baseRequest: AxiosInstance;

  constructor() {
    this._baseRequest = baseRequest;
  }

  public send(base: TBaseConfig, config: TRequestConfig) {
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
    return this._baseRequest({
      ...axiosConfig,
      url: url || spliceUrl(typeof base === 'string' ? base : base.target, query),
      method,
      cancelToken: source.token,
    });
  }

  /**
   * @param  {string} name
   * @param  {TSupportUrl} urlObj
   */
  public parseRouter(name: string, urlObj: TSupportUrl) {
    const obj: any = (this[name] = {});
    Object.keys(urlObj).forEach(key => {
      obj[key] = this.send.bind(this, urlObj[key]);
    });
  }

  public setHeaders(key: string, value: string) {
    this._baseRequest.defaults.headers.common[key] = value;
  }

  public setConfig(key: keyof TRequestConfig, value: TRequestConfig[keyof TRequestConfig]) {
    this._baseRequest.defaults[key] = value;
  }
}
