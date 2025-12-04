import { Services } from '@etransfer/services';
import {
  TCreateWithdrawOrderParams,
  TETransferCore,
  TETransferCoreOptions,
  TGetAuthFromStorageParams,
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
  ZERO,
} from '@etransfer/utils';
import {
  API_VERSION,
  INSUFFICIENT_ALLOWANCE_MESSAGE,
  SOCKET_PREFIX,
  WITHDRAW_ERROR_MESSAGE,
  WITHDRAW_TRANSACTION_ERROR_CODE_LIST,
  WithdrawErrorNameType,
} from './constants';
import { divDecimals } from '@etransfer/utils';
import { IStorageSuite, TWalletType } from '@etransfer/types';
import { AuthTokenSource, TGetAuthRequest } from '@etransfer/types';
import { BaseSignalr, NOTICE_LISTEN_LIST, noticeSignalr, NoticeSignalr } from '@etransfer/socket';

export abstract class BaseETransferCore {
  public storage?: IStorageSuite;
  constructor(storage?: IStorageSuite) {
    this.storage = storage;
  }
  setStorage(storage: IStorageSuite) {
    this.storage = storage;
  }
}

export class ETransferCore extends BaseETransferCore implements TETransferCore {
  public services: Services;
  public noticeSocket?: BaseSignalr<typeof NOTICE_LISTEN_LIST> & NoticeSignalr;
  public baseUrl?: string;
  public authUrl?: string;
  public socketUrl?: string;
  public version?: string;

  constructor(options: TETransferCoreOptions) {
    super(options.storage);
    this.services = new Services();
    this.noticeSocket = noticeSignalr;
    this.init(options);
  }

  public init({ etransferUrl, etransferAuthUrl, etransferSocketUrl, storage, version }: TETransferCoreOptions) {
    etransferUrl && this.setBaseUrl(etransferUrl);
    etransferAuthUrl && this.setAuthUrl(etransferAuthUrl);
    this.setSocketUrl(etransferSocketUrl || '');

    // version
    const versionNew = version || API_VERSION;
    this.setVersion(versionNew);

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

  public setSocketUrl(url?: string) {
    this.socketUrl = url;
    this.noticeSocket?.setUrl(url + SOCKET_PREFIX);
  }

  public setVersion(version?: string) {
    if (!version) return;
    this.version = version;
    this.services.setRequestHeaders('Version', version);
  }

  async getAuthToken(params: TGetAuthParams) {
    // 1: local storage has JWT token
    const data = await this.getAuthTokenFromStorage({
      walletType: (params.source as unknown as TWalletType) || TWalletType.Portkey,
      caHash: params.caHash,
      managerAddress: params.managerAddress,
    });
    if (data) return data;

    // 2: local storage don not has JWT token
    return await this.getAuthTokenFromApi({
      pubkey: params.pubkey,
      signature: params.signature,
      plain_text: params.plainText,
      ca_hash: params.caHash || undefined,
      chain_id: params.chainId || undefined,
      managerAddress: params.managerAddress,
      version: params.version,
      source: params.source || AuthTokenSource.Portkey,
      recaptchaToken: params.recaptchaToken,
    });
  }

  async getAuthTokenFromStorage(params: TGetAuthFromStorageParams) {
    // Portkey key = caHash + managerAddress
    // NightElf key = AuthTokenSource.NightElf + managerAddress
    const frontPartKey = params.walletType === TWalletType.NightElf ? AuthTokenSource.NightElf : params.caHash;
    const key = frontPartKey + params.managerAddress;

    if (!this.storage) throw new Error('Please set up the storage suite first');

    const data = await getETransferJWT(this.storage, key);
    if (data) {
      this.services.setRequestHeaders('Authorization', `${data.token_type} ${data.access_token}`);
      etransferEvents.AuthTokenSuccess.emit();
      return `${data.token_type} ${data.access_token}`;
    }
    return undefined;
  }

  async getReCaptcha(walletAddress: string, reCaptchaUrl?: string): Promise<string | undefined> {
    const isRegistered = await this.services.checkEOARegistration({ address: walletAddress });
    return new Promise((resolve, reject) => {
      if (!isRegistered.result) {
        const openUrl = reCaptchaUrl || this.baseUrl || '';
        if (!openUrl) throw new Error('Please set reCaptchaUrl');
        window.open(openUrl + '/recaptcha');

        const handleData = function (event) {
          if (event.origin === openUrl) {
            if (event.data.type === 'GOOGLE_RECAPTCHA_RESULT') {
              window.removeEventListener('message', handleData, true);
              resolve(event.data.data);
            } else {
              window.removeEventListener('message', handleData, true);
              reject(event.data.data);
            }
          }
        };
        window.addEventListener('message', handleData, true);
      } else {
        resolve(undefined);
      }
    });
  }

  async getAuthTokenFromApi(params: TGetAuthRequest) {
    const res = await this.services.getAuthToken(params, { baseURL: this.authUrl || '' });
    const token_type = res.token_type;
    const access_token = res.access_token;

    this.services.setRequestHeaders('Authorization', `${token_type} ${access_token}`);
    etransferEvents.AuthTokenSuccess.emit();

    if (this.storage) {
      const frontPartKey = params.source === AuthTokenSource.NightElf ? AuthTokenSource.NightElf : params.ca_hash || '';
      const key = frontPartKey + params.managerAddress;
      await setETransferJWT(this.storage, key, res);
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
      memo,
      walletType,
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
      memo,
      eTransferContractAddress,
    });
    if (!approveRes) {
      const error = new Error(INSUFFICIENT_ALLOWANCE_MESSAGE);
      error.name = WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE;
      throw error;
    }
    console.log('>>>>>> sendTransferTokenTransaction approveRes', approveRes);

    return this.withdrawOrder({
      caContractAddress,
      eTransferContractAddress,
      caHash,
      symbol,
      amount,
      walletType,
      chainId,
      endPoint,
      managerAddress,
      decimals,
      network,
      toAddress,
      memo,
      getSignature,
    });
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
      walletType,
      chainId,
      endPoint,
      managerAddress,
      decimals,
      getSignature,
      network,
      toAddress,
      memo,
    } = params;
    const transaction = await createTransferTokenTransaction({
      caContractAddress,
      eTransferContractAddress,
      walletType,
      caHash,
      symbol,
      amount: timesDecimals(amount, decimals).toFixed(),
      chainId,
      endPoint,
      fromManagerAddress: managerAddress,
      memo,
      getSignature,
    });
    console.log(transaction, '=====transaction');
    if (!transaction) throw new Error('Generate transaction raw failed.');

    const createOrderResult = await this.createWithdrawOrder({
      chainId,
      symbol,
      network,
      toAddress,
      amount,
      memo,
      rawTransaction: transaction,
    });

    return createOrderResult;
  }

  async handleApproveToken({
    tokenContractCallSendMethod,
    tokenContractAddress,
    endPoint,
    symbol,
    decimals,
    amount,
    accountAddress,
    memo,
    eTransferContractAddress,
  }: THandleApproveTokenParams): Promise<boolean> {
    const tokenContractOrigin = await getTokenContract(endPoint, tokenContractAddress);
    const maxBalance = await getBalance(tokenContractOrigin, symbol, accountAddress);
    const maxBalanceFormat = divDecimals(maxBalance, decimals).toFixed();
    console.log('>>>>>> maxBalance', maxBalanceFormat);
    if (ZERO.plus(maxBalanceFormat).isLessThan(ZERO.plus(amount))) {
      const error = new Error(
        `Insufficient ${symbol} balance in your account. Please consider transferring a smaller amount or topping up before you try again.`,
      );
      error.name = WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE;
      throw error;
    }

    const checkRes = await checkTokenAllowanceAndApprove({
      tokenContractCallSendMethod,
      tokenContractAddress,
      endPoint,
      symbol,
      amount,
      owner: accountAddress,
      spender: eTransferContractAddress,
      memo,
    });

    return checkRes;
  }

  async createWithdrawOrder({
    chainId,
    symbol,
    network,
    toAddress,
    memo,
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
        memo,
        rawTransaction: rawTransaction,
      });
      console.log('>>>>>> handleCreateWithdrawOrder createWithdrawOrderRes', createWithdrawOrderRes);
      if (createWithdrawOrderRes.orderId) {
        return createWithdrawOrderRes;
      } else {
        const error = new Error(WITHDRAW_ERROR_MESSAGE);
        error.name = WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE;
        throw error;
      }
    } catch (error: any) {
      if (WITHDRAW_TRANSACTION_ERROR_CODE_LIST.includes(error?.code)) {
        error.name = WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE;
        throw error;
      } else {
        const error = new Error(WITHDRAW_ERROR_MESSAGE);
        error.name = WithdrawErrorNameType.CUSTOMIZED_ERROR_MESSAGE;
        throw error;
      }
    } finally {
      await sleep(1000);
      etransferEvents.UpdateNewRecordStatus.emit();
    }
  }
}
