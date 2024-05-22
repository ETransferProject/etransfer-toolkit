import { Services, TGetAuthRequest } from '@etransfer/services';
import { TETransferCore, TETransferCoreInitParams, TETransferCoreOptions, TGetAuthParams } from './types';
import { etransferEvents } from '@etransfer/utils';
import { getETransferJWT, setETransferJWT } from '@etransfer/features';

export class ETransferCore implements TETransferCore {
  public services: Services;
  public baseHost?: string;
  public authHost?: string;

  constructor({ etransferHost, etransferAuthHost }: TETransferCoreOptions) {
    this.services = new Services();

    this.setBaseHost(etransferHost);
    this.setAuthHost(etransferAuthHost);
  }

  public init({ etransferHost, etransferAuthHost }: TETransferCoreInitParams) {
    this.setBaseHost(etransferHost);
    this.setAuthHost(etransferAuthHost);
  }

  public setBaseHost(host?: string) {
    if (!host) return;
    this.baseHost = host;
    this.services.setRequestConfig('baseURL', host);
  }

  public setAuthHost(host?: string) {
    if (!host) return;
    this.authHost = host;
  }

  async getAuth(params: TGetAuthParams) {
    const key = params.caHash + params.managerAddress;
    const data = getETransferJWT(key);
    // 1: local storage has JWT token
    if (data) {
      this.services.setRequestHeaders('Authorization', `${data.token_type} ${data.access_token}`);
      etransferEvents.AuthTokenSuccess.emit();
      return `${data.token_type} ${data.access_token}`;
    } else {
      // 2: local storage don not has JWT token
      return await this.getAuthApi({
        pubkey: params.pubkey,
        signature: params.signature,
        plain_text: params.plainText,
        ca_hash: params.caHash,
        chain_id: params.chainId,
        managerAddress: params.managerAddress,
        version: params.version,
      });
    }
  }

  async getAuthApi(params: TGetAuthRequest) {
    const res = await this.services.getAuthToken(params);
    const token_type = res.token_type;
    const access_token = res.access_token;

    this.services.setRequestHeaders('Authorization', `${token_type} ${access_token}`);
    etransferEvents.AuthTokenSuccess.emit();

    if (localStorage) {
      setETransferJWT(params.ca_hash + params.managerAddress, res);
    }

    return `${token_type} ${access_token}`;
  }

  async sendWithdrawOrder(params: any) {
    console.log('check allowance, approve, transfer, createOrder ... ', params);
    return { orderId: '' };
  }
}
