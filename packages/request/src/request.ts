import axios, { CancelTokenSource } from 'axios';
import { TBaseConfig, TRequestConfig, TSupportUrl } from './types';
import { getRequestConfig, spliceUrl } from './utils';
import { baseRequest } from './axios';
import { DEFAULT_METHOD } from './constants';

const request = new Function();

const cancelTokenSources: Map<string, CancelTokenSource> = new Map();

/**
 * @method parseRouter
 * @param  {string} name
 * @param  {TSupportUrl} urlObj
 */
request.prototype.parseRouter = function (name: string, urlObj: TSupportUrl) {
  const obj: any = (this[name] = {});
  Object.keys(urlObj).forEach(key => {
    obj[key] = this.send.bind(this, urlObj[key]);
  });
};

request.prototype.send = function (base: TBaseConfig, config: TRequestConfig) {
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
  return baseRequest({
    ...axiosConfig,
    url: url || spliceUrl(typeof base === 'string' ? base : base.target, query),
    method,
    cancelToken: source.token,
  });
};

request.prototype.setHeaders = function (key: string, value: string) {
  baseRequest.defaults.headers.common[key] = value;
};

export const etransferRequest = request.prototype;
