import { Services } from '@etransfer/services';
import {
  TCreateWithdrawOrderParams,
  TETransferCore,
  TETransferCoreOptions,
  TGetAuthParams,
  THandleApproveTokenParams,
  TSendWithdrawOrderParams,
} from './types';
import {
  checkTokenAllowanceAndApprove,
  createTransferTokenTransaction,
  etransferEvents,
  isDIDAddressSuffix,
  getBalance,
  removeDIDAddressSuffix,
  sleep,
  timesDecimals,
  getTokenContract,
  getETransferJWT,
  setETransferJWT,
} from '@etransfer/utils';
import {
  INSUFFICIENT_ALLOWANCE_MESSAGE,
  WITHDRAW_ERROR_MESSAGE,
  WITHDRAW_TRANSACTION_ERROR_CODE_LIST,
  ZERO,
} from './constants';
import { divDecimals } from '@etransfer/utils';
import { IStorageSuite } from '@etransfer/types';
import { AuthTokenSource, TGetAuthRequest } from '@etransfer/types';

export abstract class BaseETransferCore {
  protected _storage?: IStorageSuite;
  constructor(storage?: IStorageSuite) {
    this._storage = storage;
  }
  setStorage(storage: IStorageSuite) {
    this._storage = storage;
  }
}

export class ETransferCore extends BaseETransferCore implements TETransferCore {
  public services: Services;
  public baseUrl?: string;
  public authUrl?: string;

  constructor(options: TETransferCoreOptions) {
    super(options.storage);
    this.services = new Services();
    this.init(options);
  }

  public init({ etransferUrl, etransferAuthUrl, storage }: TETransferCoreOptions) {
    etransferUrl && this.setBaseUrl(etransferUrl);
    etransferAuthUrl && this.setAuthUrl(etransferAuthUrl);
    storage && this.setStorage(storage);
  }

  public setBaseUrl(url?: string) {
    if (!url) return;
    this.baseUrl = url;
    this.services.setRequestConfig('baseURL', url);
  }

  public setAuthUrl(url?: string) {
    if (!url) return;
    this.authUrl = url;
  }

  async getAuthToken(params: TGetAuthParams) {
    const key = params.caHash + params.managerAddress;
    if (!this._storage) throw new Error('Please set up the storage suite first');
    const data = await getETransferJWT(this._storage, key);
    // 1: local storage has JWT token
    if (data) {
      this.services.setRequestHeaders('Authorization', `${data.token_type} ${data.access_token}`);
      etransferEvents.AuthTokenSuccess.emit();
      return `${data.token_type} ${data.access_token}`;
    } else {
      // 2: local storage don not has JWT token
      return await this.getAuthTokenFromApi({
        pubkey: params.pubkey,
        signature: params.signature,
        plain_text: params.plainText,
        ca_hash: params.caHash,
        chain_id: params.chainId,
        managerAddress: params.managerAddress,
        version: params.version,
        source: params.source || AuthTokenSource.Portkey,
      });
    }
  }

  async getAuthTokenFromApi(params: TGetAuthRequest) {
    const res = await this.services.getAuthToken(params, { baseURL: this.authUrl || '' });
    const token_type = res.token_type;
    const access_token = res.access_token;

    this.services.setRequestHeaders('Authorization', `${token_type} ${access_token}`);
    etransferEvents.AuthTokenSuccess.emit();

    if (this._storage) {
      await setETransferJWT(this._storage, params.ca_hash + params.managerAddress, res);
    }

    return `${token_type} ${access_token}`;
  }

  async sendWithdrawOrder(params: TSendWithdrawOrderParams) {
    const {
      tokenContractCallSendMethod,
      tokenContractAddress,
      endPoint,
      caContractAddress,
      eTransferContractAddress,
      toAddress,
      caHash,
      symbol,
      decimals,
      network,
      amount,
      chainId,
      accountAddress,
      managerAddress,
      getSignature,
    } = params;
    console.log('check allowance, approve, transfer, createOrder ... ', params);

    const approveRes = await this.handleApproveToken({
      tokenContractCallSendMethod,
      tokenContractAddress,
      endPoint,
      symbol,
      decimals,
      amount,
      accountAddress,
      eTransferContractAddress,
    });
    if (!approveRes) throw new Error(INSUFFICIENT_ALLOWANCE_MESSAGE);
    console.log('>>>>>> sendTransferTokenTransaction approveRes', approveRes);

    if (approveRes) {
      return this.withdrawOrder({
        caContractAddress,
        eTransferContractAddress,
        caHash,
        symbol,
        amount,
        chainId,
        endPoint,
        managerAddress,
        decimals,
        getSignature,
        network,
        toAddress,
      });
    } else {
      throw new Error('Approve Failed');
    }
  }

  async withdrawOrder(
    params: Omit<TSendWithdrawOrderParams, 'tokenContractCallSendMethod' | 'tokenContractAddress' | 'accountAddress'>,
  ) {
    const {
      caContractAddress,
      eTransferContractAddress,
      caHash,
      symbol,
      amount,
      chainId,
      endPoint,
      managerAddress,
      decimals,
      getSignature,
      network,
      toAddress,
    } = params;
    const transaction = await createTransferTokenTransaction({
      caContractAddress,
      eTransferContractAddress,
      caHash,
      symbol,
      amount: timesDecimals(amount, decimals).toFixed(),
      chainId,
      endPoint,
      fromManagerAddress: managerAddress,
      getSignature,
    });
    console.log(transaction, '=====transaction');
    if (!transaction) throw new Error('Generate transaction raw failed.');

    try {
      const createOrderResult = await this.createWithdrawOrder({
        chainId,
        symbol,
        network,
        toAddress,
        amount,
        rawTransaction: transaction,
      });
      if (createOrderResult.orderId) {
        return createOrderResult;
      } else {
        throw new Error(WITHDRAW_ERROR_MESSAGE);
      }
    } catch (error: any) {
      if (WITHDRAW_TRANSACTION_ERROR_CODE_LIST.includes(error?.code)) {
        throw new Error(error?.message);
      } else {
        throw new Error(WITHDRAW_ERROR_MESSAGE);
      }
    }
  }

  async handleApproveToken({
    tokenContractCallSendMethod,
    tokenContractAddress,
    endPoint,
    symbol,
    decimals,
    amount,
    accountAddress,
    eTransferContractAddress,
  }: THandleApproveTokenParams): Promise<boolean> {
    const tokenContractOrigin = await getTokenContract(endPoint, tokenContractAddress);
    const maxBalance = await getBalance(tokenContractOrigin, symbol, accountAddress);
    const maxBalanceFormat = divDecimals(maxBalance, decimals).toFixed();
    console.log('>>>>>> maxBalance', maxBalanceFormat);
    if (ZERO.plus(maxBalanceFormat).isLessThan(ZERO.plus(amount))) {
      throw new Error(
        `Insufficient ${symbol} balance in your account. Please consider transferring a smaller amount or topping up before you try again.`,
      );
    }

    const checkRes = await checkTokenAllowanceAndApprove({
      tokenContractCallSendMethod,
      tokenContractAddress,
      endPoint,
      symbol,
      amount,
      owner: accountAddress,
      spender: eTransferContractAddress,
    });

    return checkRes;
  }

  async createWithdrawOrder({
    chainId,
    symbol,
    network,
    toAddress,
    amount,
    rawTransaction,
  }: TCreateWithdrawOrderParams) {
    try {
      const createWithdrawOrderRes = await this.services.createWithdrawOrder({
        network,
        symbol,
        amount,
        fromChainId: chainId,
        toAddress: isDIDAddressSuffix(toAddress) ? removeDIDAddressSuffix(toAddress) : toAddress,
        rawTransaction: rawTransaction,
      });
      console.log('>>>>>> handleCreateWithdrawOrder createWithdrawOrderRes', createWithdrawOrderRes);
      if (createWithdrawOrderRes.orderId) {
        return createWithdrawOrderRes;
      } else {
        throw new Error(WITHDRAW_ERROR_MESSAGE);
      }
    } catch (error: any) {
      if (WITHDRAW_TRANSACTION_ERROR_CODE_LIST.includes(error?.code)) {
        throw new Error(error?.message);
      } else {
        throw new Error(WITHDRAW_ERROR_MESSAGE);
      }
    } finally {
      await sleep(1000);
      etransferEvents.UpdateNewRecordStatus.emit();
    }
  }
}
