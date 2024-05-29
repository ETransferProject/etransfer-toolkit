import { ChainId, SendOptions } from '@portkey/types';
import BigNumber from 'bignumber.js';

export type TTokenContract = {
  GetBalance: TContractGetBalance;
  GetAllowance: TContractGetAllowance;
  GetTokenInfo: TContractGetTokenInfo;
};

export type TCallSendMethod = {
  callSendMethod<T, R>(
    params: CallContractParams<T>,
    sendOptions?: SendOptions,
  ): Promise<R & { transactionId: string }>;
};

export type TApproveAllowanceParams = TCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  amount: BigNumber | number | string;
  spender: string;
};

export type TCheckTokenAllowanceAndApproveParams = TCallSendMethod & {
  tokenContractAddress: string;
  endPoint: string;
  symbol: string;
  amount: string;
  owner: string;
  spender: string;
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

export type TCreateHandleManagerForwardCall = {
  caContractAddress: string;
  contractAddress: string;
  endPoint: string;
  args: any;
  methodName: string;
  caHash: string;
  chainId: ChainId;
};
