import { Services, TGetAuthRequest } from '@etransfer/services';
import {
  TETransferCore,
  TETransferCoreInitParams,
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
} from '@etransfer/utils';
import { getETransferJWT, setETransferJWT } from './utils';
import {
  INSUFFICIENT_ALLOWANCE_MESSAGE,
  WITHDRAW_ERROR_MESSAGE,
  WITHDRAW_TRANSACTION_ERROR_CODE_LIST,
  ZERO,
} from './constants';
import { ChainId, IStorageSuite } from '@portkey/types';
import { divDecimals } from '@etransfer/utils';

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
  public baseHost?: string;
  public authHost?: string;

  constructor(options: TETransferCoreOptions) {
    super(options.storage);
    this.services = new Services();
    this.init(options);
  }

  public init({ etransferHost, etransferAuthHost, storage }: TETransferCoreOptions) {
    etransferHost && this.setBaseHost(etransferHost);
    etransferAuthHost && this.setAuthHost(etransferAuthHost);
    storage && this.setStorage(storage);
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
      });
    }
  }

  async getAuthTokenFromApi(params: TGetAuthRequest) {
    const res = await this.services.getAuthToken(params);
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
      tokenContract,
      tokenContractAddress,
      endPoint,
      address,
      caContractAddress,
      eTransferContractAddress,
      caHash,
      symbol,
      decimals,
      network,
      amount,
      chainId,
      userAccountAddress,
      userManagerAddress,
      getSignature,
    } = params;
    console.log('check allowance, approve, transfer, createOrder ... ', params);

    const approveRes = await this.handleApproveToken({
      tokenContract,
      tokenContractAddress,
      endPoint,
      symbol,
      decimals,
      amount,
      userAccountAddress,
      eTransferContractAddress,
    });
    if (!approveRes) throw new Error(INSUFFICIENT_ALLOWANCE_MESSAGE);
    console.log('>>>>>> sendTransferTokenTransaction approveRes', approveRes);

    if (approveRes) {
      const transaction = await createTransferTokenTransaction({
        caContractAddress,
        eTransferContractAddress,
        caHash,
        symbol,
        amount: timesDecimals(amount, decimals).toFixed(),
        chainId,
        endPoint,
        fromManagerAddress: userManagerAddress,
        getSignature,
      });
      console.log(transaction, '=====transaction');

      try {
        const createOrderResult = await this.handleCreateWithdrawOrder({
          chainId,
          symbol,
          network,
          address,
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
    } else {
      throw new Error('Approve Failed');
    }
  }

  async handleApproveToken({
    tokenContract,
    tokenContractAddress,
    endPoint,
    symbol,
    decimals,
    amount,
    userAccountAddress,
    eTransferContractAddress,
  }: THandleApproveTokenParams) {
    const maxBalance = await getBalance(tokenContract, symbol, userAccountAddress);
    const maxBalanceFormat = divDecimals(maxBalance, decimals).toFixed();
    console.log('>>>>>> maxBalance', maxBalanceFormat);
    if (ZERO.plus(maxBalanceFormat).isLessThan(ZERO.plus(amount))) {
      throw new Error(
        `Insufficient ${symbol} balance in your account. Please consider transferring a smaller amount or topping up before you try again.`,
      );
    }

    const checkRes = await checkTokenAllowanceAndApprove({
      tokenContract,
      tokenContractAddress,
      endPoint,
      symbol,
      amount,
      owner: userAccountAddress,
      spender: eTransferContractAddress,
    });

    return checkRes;
  }

  async handleCreateWithdrawOrder({
    chainId,
    symbol,
    network,
    address,
    amount,
    rawTransaction,
  }: {
    chainId: ChainId;
    symbol: string;
    network: string;
    address: string;
    amount: string;
    rawTransaction: string;
  }) {
    try {
      const createWithdrawOrderRes = await this.services.createWithdrawOrder({
        network,
        symbol,
        amount,
        fromChainId: chainId,
        toAddress: isDIDAddressSuffix(address) ? removeDIDAddressSuffix(address) : address,
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