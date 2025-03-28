import { ChainId, SendOptions } from '@portkey/types';
import BigNumber from 'bignumber.js';

export type TTokenContract = {
  GetBalance: TContractGetBalance;
  GetAllowance: TContractGetAllowance;
  GetTokenInfo: TContractGetTokenInfo;
};

export type TTokenContractCallSendMethod = {
  tokenContractCallSendMethod: <T, R>(
    params: CallContractParams<T>,
    sendOptions?: SendOptions,
  ) => Promise<R & { transactionId: string }> | undefined;
};

export type TApproveAllowanceParams = TTokenContractCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  amount: BigNumber | number | string;
  spender: string;
  memo?: string;
};

export type TCheckTokenAllowanceAndApproveParams = TTokenContractCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  amount: string;
  owner: string;
  spender: string;
  memo?: string;
};

export type TCheckIsEnoughAllowanceParams = {
  endPoint: string;
  tokenContractAddress: string;
  symbol: string;
  owner: string;
  spender: string;
  amount: string;
};

export type TContractGetBalance = {
  call: (params: TContractGetBalanceParams) => Promise<TContractGetBalanceResult>;
};

export type TContractGetBalanceParams = { symbol: string; owner: string };

export type TContractGetBalanceResult = TContractGetBalanceParams & { balance: string };

export type TContractGetAllowance = {
  call: (params: TContractGetAllowanceParams) => Promise<TContractGetAllowanceResult>;
};

export type TContractGetAllowanceParams = { symbol: string; owner: string; spender: string };

export type TContractGetAllowanceResult = TContractGetAllowanceParams & { allowance: string };

export type TContractGetTokenInfo = {
  call: (params: TContractGetTokenInfoParams) => Promise<TContractGetTokenInfoResult>;
};

export type TContractGetTokenInfoParams = { symbol: string };

export type TContractGetTokenInfoResult = TContractGetAllowanceParams & {
  tokenName: string;
  supply: string;
  totalSupply: string;
  decimals: number;
  issuer: string;
  isBurnable: boolean;
  issueChainId: number;
  issued: number;
  externalInfo: any;
  owner?: string;
};

/**
 * callContract
 */
export interface CallContractParams<T> {
  contractAddress: string;
  methodName: string;
  args: T;
}

export interface ICallContractParamsV2<T> {
  contractAddress: string;
  methodName: string;
  args: T;
  chainId?: ChainId;
  sendOptions?: SendOptions;
}

export type TCreateHandleManagerForwardCall = {
  caContractAddress: string;
  contractAddress: string;
  endPoint: string;
  args: any;
  methodName: string;
  caHash: string;
  chainId: ChainId;
};

export type TCreateTransferToken = {
  contractAddress: string;
  endPoint: string;
  chainId: ChainId;
  args: any;
};
