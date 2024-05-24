import AElf from 'aelf-sdk';
import { WalletInfo, WalletType, CallContractParams, SignatureData, WebLoginInterface } from 'aelf-web-login';
import { TCallContractFunc, TWallet, TWalletProps, TCallSendMethod, TCallViewMethod } from './types';
import { TGetSignatureFunc, TSignatureParams } from '@etransfer/utils';
import { ChainId, SendOptions } from '@portkey/types';
import { SendOptions as SendOptionsV1 } from '@portkey-v1/types';
import { sleep } from '@portkey/utils';
import { AppName } from '@/constants/index';
import { getTxResult } from '@etransfer/utils';
import { SupportedChainId } from '@etransfer/types';

class Wallet implements TWallet {
  walletInfo: WalletInfo;
  walletType: WalletType;

  _getSignature: TGetSignatureFunc;
  _callContract: TCallContractFunc;

  private context: WebLoginInterface | null = null;
  private AELFSendMethod?: TCallSendMethod;
  private AELFViewMethod?: TCallViewMethod;
  private tDVVSendMethod?: TCallSendMethod;
  private tDVVViewMethod?: TCallViewMethod;
  private tDVWSendMethod?: TCallSendMethod;
  private tDVWViewMethod?: TCallViewMethod;

  constructor(props: TWalletProps) {
    this.walletInfo = props.walletInfo;
    this.walletType = props.walletType;
    this._callContract = props.callContract;
    this._getSignature = props.getSignature;
  }

  setCallContract(callContract: TCallContractFunc) {
    this._callContract = callContract;
  }
  setGetSignature(getSignature: TGetSignatureFunc) {
    this._getSignature = getSignature;
  }

  public async callContract<T, R>(endPoint: string, params: CallContractParams<T>): Promise<R> {
    const req: any = await this._callContract(params);

    console.log('callContract req', req);
    if (req.error) {
      console.log(req.error, '===req.error');
      throw {
        code: req.error.message?.Code || req.error,
        message: req.errorMessage?.message || req.error.message?.Message,
      };
    }

    const transactionId =
      req.result?.TransactionId || req.result?.transactionId || req.TransactionId || req.transactionId;

    await sleep(1000);
    // TODO login
    return getTxResult(transactionId, endPoint);
  }

  getSignature(params: TSignatureParams): Promise<SignatureData> {
    let signInfo: string = '';
    if (params?.signInfo) {
      if (this.walletInfo.walletType !== WalletType.portkey) {
        // nightElf or discover
        signInfo = AElf.utils.sha256(params?.signInfo);
      } else {
        // portkey sdk
        signInfo = Buffer.from(params?.signInfo).toString('hex');
      }
    }

    return this._getSignature({
      appName: AppName || '',
      address: this.walletInfo.address,
      ...params,
      signInfo,
    });
  }

  getWebLoginContext() {
    return this.context; // wallet, login, loginState
  }

  setWebLoginContext(context: WebLoginInterface) {
    this.context = context;
  }
  setMethod({
    chain,
    sendMethod,
    viewMethod,
  }: {
    chain: ChainId;
    sendMethod: TCallSendMethod;
    viewMethod: TCallViewMethod;
  }) {
    switch (chain) {
      case SupportedChainId.AELF: {
        this.AELFSendMethod = sendMethod;
        this.AELFViewMethod = viewMethod;
        break;
      }
      case SupportedChainId.tDVV: {
        this.tDVVSendMethod = sendMethod;
        this.tDVVViewMethod = viewMethod;
        break;
      }
      case SupportedChainId.tDVW: {
        this.tDVWSendMethod = sendMethod;
        this.tDVWViewMethod = viewMethod;
        break;
      }
    }
  }

  setContractMethod(
    contractMethod: {
      chain: ChainId;
      sendMethod: TCallSendMethod;
      viewMethod: TCallViewMethod;
    }[],
  ) {
    contractMethod.forEach(item => {
      this.setMethod(item);
    });
  }

  callSendMethod<T, R>(
    chain: ChainId,
    params: CallContractParams<T>,
    sendOptions?: SendOptions | SendOptionsV1,
  ): Promise<R> | undefined {
    switch (chain) {
      case SupportedChainId.AELF:
        return this.AELFSendMethod?.(params, sendOptions);
      case SupportedChainId.tDVV:
        return this.tDVVSendMethod?.(params, sendOptions);
      case SupportedChainId.tDVW:
        return this.tDVWSendMethod?.(params, sendOptions);
    }
    throw new Error('Error: Invalid chainId');
  }

  callViewMethod<T, R>(chain: ChainId, params: CallContractParams<T>): Promise<R> | undefined {
    switch (chain) {
      case SupportedChainId.AELF:
        return this.AELFViewMethod?.(params);
      case SupportedChainId.tDVV:
        return this.tDVVViewMethod?.(params);
      case SupportedChainId.tDVW:
        return this.tDVWViewMethod?.(params);
    }
    throw new Error('Error: Invalid chainId');
  }
}

export default Wallet;
