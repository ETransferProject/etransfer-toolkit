import { ChainId } from '@portkey/types';
import { PortkeyVersion } from './portkey';

export enum BusinessType {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  Transfer = 'Transfer',
}

export enum AuthTokenSource {
  Portkey = 'portkey',
  NightElf = 'nightElf',
  EVM = 'EVM',
  Solana = 'Solana',
  TRON = 'TRX',
  TON = 'Ton',
}

export enum TWalletType {
  Portkey = 'portkey',
  NightElf = 'nightElf',
}

export type TAuthApiBaseParams = {
  grant_type: string;
  scope: string;
  client_id: string;
};

export type TOtherChainAuthApiBaseParams = {
  grant_type: string;
  scope: string;
  client_id: string;
  version: PortkeyVersion.v2;
  source: string;
};

export type TGetAuthRequest = {
  pubkey: string;
  signature: string;
  plain_text: string;
  ca_hash?: string; // for Portkey
  chain_id?: string; // for Portkey
  managerAddress?: string; // for Portkey
  version: PortkeyVersion;
  source: AuthTokenSource;
  recaptchaToken?: string; // for NightElf
};

export type TGetOtherChainAuthRequest = {
  signature: string;
  plain_text: string;
  pubkey: string; // wallet address
  sourceType: AuthTokenSource;
  recaptchaToken?: string; // for NightElf
};

export type TGetAuthResult = {
  token_type: string;
  access_token: string;
  expires_in: number;
};

export type TGetTokenListRequest = {
  type: BusinessType;
  chainId?: ChainId; // When type = BusinessType.Deposit or BusinessType.Withdraw, chainId is required
};

export type TGetTokenListResult = {
  tokenList: TTokenItem[];
};

export type TTokenItem = {
  name: string;
  symbol: string;
  icon: string;
  contractAddress: string;
  decimals: number;
};

export type TGetNetworkListRequest = {
  type: BusinessType;
  chainId?: ChainId; // When type = BusinessType.Deposit or BusinessType.Withdraw, chainId is required
  symbol?: string;
  address?: string;
};

export type TGetNetworkListResult = {
  networkList: TNetworkItem[];
};

export type TNetworkItem = {
  network: string;
  name: string;
  multiConfirm: string;
  multiConfirmTime: string;
  contractAddress: string;
  explorerUrl: string;
  status: NetworkStatus;
  withdrawFee?: string;
  withdrawFeeUnit?: string;
  specialWithdrawFee?: string;
  specialWithdrawFeeDisplay?: boolean;
};

export enum NetworkStatus {
  Health = 'Health',
  Congesting = 'Congesting',
  Offline = 'Offline',
}

export type TGetTokenOptionRequest = {
  type: BusinessType;
};

export type TGetTokenOptionResult = {
  tokenList: TTokenOptionItem[];
};

export type TTokenOptionItem = TTokenItem & {
  toTokenList?: TToTokenItem[];
};

export type TToTokenItem = TTokenItem & {
  chainIdList?: ChainId[];
};

export type TGetTokenPricesRequest = {
  symbols: string;
};

export type TGetTokenPricesResult = {
  items: TTokenPriceItem[];
};

export type TTokenPriceItem = {
  symbol: string;
  priceUsd: number;
};

export type TGetDepositInfoRequest = {
  chainId: ChainId;
  network: string;
  symbol?: string;
  toSymbol?: string;
};

export type TGetDepositInfoResult = {
  depositInfo: TDepositInfo;
};

export type TDepositInfo = {
  depositAddress: string;
  minAmount: string;
  extraNotes?: string[];
  minAmountUsd: string;
  serviceFee?: string;
  serviceFeeUsd?: string;
  currentThreshold?: string;
  extraInfo?: TDepositExtraInfo;
};

export type TDepositExtraInfo = {
  slippage: string;
};

export type TGetDepositCalculateRequest = {
  toChainId: ChainId;
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
};

export type TGetDepositCalculateResult = {
  conversionRate: TConversionRate;
};

export type TConversionRate = {
  fromSymbol: string;
  toSymbol: string;
  fromAmount: string;
  toAmount: string;
  minimumReceiveAmount: string;
};

export type TGetWithdrawInfoRequest = {
  chainId: ChainId;
  network?: string;
  symbol?: string;
  amount?: string;
  address?: string;
  memo?: string;
  version?: PortkeyVersion;
};

export type TGetWithdrawInfoResult = {
  withdrawInfo: TWithdrawInfo;
};

export type TWithdrawInfo = {
  maxAmount: string;
  minAmount: string;
  limitCurrency: string;
  totalLimit: string;
  remainingLimit: string;
  transactionFee: string;
  transactionUnit: string;
  expiredTimestamp: number;
  aelfTransactionFee: string;
  aelfTransactionUnit: string;
  receiveAmount: string;
  feeList: TFeeItem[];
  receiveAmountUsd: string;
  amountUsd: string;
  feeUsd: string;
};

export type TFeeItem = {
  name: string;
  currency: string;
  amount: string;
};

export type TFeeInfoItem = {
  amount: string;
  unit: string;
};

export type TCreateWithdrawOrderRequest = {
  network: string;
  symbol: string;
  amount: string;
  fromChainId: ChainId;
  toAddress: string;
  memo?: string;
  rawTransaction: string;
};

export type TCreateWithdrawOrderResult = {
  orderId: string;
  transactionId: string;
};

export type TGetRecordsListRequest = {
  type: RecordsRequestType;
  status: RecordsRequestStatus;
  startTimestamp?: number | null;
  endTimestamp?: number | null;
  skipCount: number;
  maxResultCount: number;
  search?: string | undefined;
  addressList?: string[];
  sorting?: string; // eg: sorting = 'createTime desc'
};

export enum RecordsRequestType {
  All = 0,
  Deposit = 1,
  Withdraw = 2, // Transfer and Withdraw
}

export enum RecordsRequestStatus {
  All = 0,
  Processing = 1,
  Succeed = 2,
  Failed = 3,
}

export enum OrderStatusEnum {
  Processing = 'Processing',
  Succeed = 'Succeed',
  Failed = 'Failed',
}

export type TGetRecordsListResult = {
  totalCount: number;
  items: TRecordsListItem[];
};

export type TRecordsListItem = {
  id: string;
  orderType: BusinessType;
  secondOrderType: BusinessType;
  status: OrderStatusEnum;
  arrivalTime: number;
  createTime: number;
  fromTransfer: TFromTransfer;
  toTransfer: TToTransfer;
};

export type TFromTransfer = {
  network: string;
  chainId?: ChainId;
  fromAddress: string;
  toAddress: string;
  amount: string;
  amountUsd?: string;
  symbol: string;
  icon?: string;
  txId: string;
  status: OrderStatusEnum;
  feeInfo?: TToTransferFeeInfo[];
};

export type TToTransfer = TFromTransfer;

export type TToTransferFeeInfo = {
  symbol: string;
  amount: string;
};

export type TGetRecordStatusRequest = {
  addressList?: string[]; // When Authorization is not set in the header, addressList is required
};

export type TGetRecordStatusResult = {
  status: boolean;
};

export type TCheckEOARegistrationRequest = {
  address: string;
};

export type TCheckEOARegistrationResult = {
  result: boolean;
};

export enum WalletSourceType {
  EVM = 'EVM',
  Solana = 'Solana',
  TRX = 'TRX',
  Ton = 'Ton',
  Portkey = 'Portkey', // Portkey and NightElf
}

export type TCheckRegistrationRequest = {
  address: string;
  sourceType: WalletSourceType;
};

export type TCheckRegistrationResult = {
  result: boolean;
};

export type TGetRecordDetailResult = TRecordsListItem & {
  step: TRecordDetailStep;
};

export type TRecordDetailStep = {
  currentStep: TransactionRecordStep;
  fromTransfer: {
    confirmingThreshold: number; // total
    confirmedNum: number; // already
  };
};

export enum TransactionRecordStep {
  Submitted,
  FromTransfer,
  ToTransfer,
  ReceivedOrSent,
}

export type TGetTokenNetworkRelationRequest = {
  networkList?: string[];
  tokenList?: string[];
  address?: string;
  sourceType?: WalletSourceType;
};

export type TGetTokenNetworkRelationResult = Record<string, Record<string, TGetTokenNetworkRelationItem[]>>;

export type TGetTokenNetworkRelationItem = {
  network: string;
  name: string;
};

export type TGetTransferInfoRequest = {
  fromNetwork: string;
  toNetwork?: string;
  symbol: string;
  amount?: string;
  toAddress?: string;
  memo?: string;
  version?: PortkeyVersion;
  fromAddress?: string;
  sourceType?: WalletSourceType;
};

export type TGetTransferInfoResult = {
  transferInfo: TCrossChainTransferInfo;
};

export type TCrossChainTransferInfo = {
  contractAddress?: string;
  maxAmount: string;
  minAmount: string;
  limitCurrency: string;
  totalLimit: string;
  remainingLimit: string;
  transactionFee?: string;
  transactionUnit?: string;
  aelfTransactionFee?: string;
  aelfTransactionUnit?: string;
  receiveAmount: string;
  expiredTimestamp: number;
  amountUsd: string;
  receiveAmountUsd: string;
  feeUsd: string;
};

export type TCreateTransferOrderRequest = {
  amount: string;
  fromNetwork: string;
  toNetwork: string;
  fromSymbol: string;
  toSymbol: string;
  fromAddress: string;
  toAddress: string;
  memo?: string;
  rawTransaction?: string;
};

export type TCreateTransferOrderResult = {
  orderId: string;
  address?: string;
  transactionId?: string;
};

export enum UpdateTransferOrderStatus {
  Rejected = 'Rejected',
}

export type TUpdateTransferOrderRequest = {
  amount: string;
  fromNetwork: string;
  toNetwork: string;
  fromSymbol: string;
  toSymbol: string;
  fromAddress: string;
  toAddress: string;
  address: string; // token pool address
  memo?: string;
  txId: string;
  status?: UpdateTransferOrderStatus;
};

export type TUpdateTransferOrderResult = boolean;
