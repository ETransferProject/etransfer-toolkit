import {
  TApiUrlList,
  TGetNetworkListRequest,
  TGetNetworkListResult,
  TGetTokenListRequest,
  TGetTokenListResult,
  TServices,
} from './types';
import { formatApiError } from './utils';
import { API_LIST, CancelTokenSourceKey } from './constants';
import { etransferRequest } from '@etransfer/request';

export abstract class BaseService {
  protected readonly _request: TApiUrlList;

  public constructor() {
    Object.entries(API_LIST).forEach(([key, value]) => {
      etransferRequest.parseRouter(key, value);
    });

    this._request = Object.assign({}, etransferRequest.base, etransferRequest);
  }

  public setRequestHeaders(key: string, value: string) {
    etransferRequest.setHeaders(key, value);
  }
}

export class Services extends BaseService implements TServices {
  async getTokenList(params: TGetTokenListRequest): Promise<TGetTokenListResult> {
    try {
      const res = await this._request.common.getTokenList({ params });
      return res.data;
    } catch (error) {
      throw formatApiError(error, 'getTokenList error', false);
    }
  }

  async getNetworkList(params: TGetNetworkListRequest): Promise<TGetNetworkListResult> {
    try {
      const res = await this._request.common.getNetworkList({
        params,
        cancelTokenSourceKey: CancelTokenSourceKey.GET_NETWORK_LIST,
      });
      return res.data;
    } catch (error: any) {
      throw formatApiError(error, 'getNetworkList error', true);
    }
  }
}
