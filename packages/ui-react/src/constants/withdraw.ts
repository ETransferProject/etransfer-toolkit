import { NetworkStatus, TWithdrawInfo } from '@etransfer/types';
import { DEFAULT_NULL_VALUE } from '.';
import { CHAIN_ID, CHAIN_MENU_DATA, TOKEN_INFO_USDT, TokenType } from './chain';
import { TArrivalTimeConfig, TWithdrawInfoSuccess } from '../types/withdraw';

export const DEFAULT_WITHDRAW_ERROR_MESSAGE = 'Failed to initiate the transaction. Please try again later.';

export const REMAINING_WITHDRAWAL_QUOTA_TOOLTIP = `Withdrawals are subject to a 24-hour limit, determined by the real-time USD value of the asset. You can withdraw assets up to the available withdrawal limit.`;

export const AMOUNT_GREATER_THAN_BALANCE_TIP =
  'The amount exceeds the remaining withdrawal quota. Please consider transferring a smaller amount.';

export const ETH_DELAY_WITHDRAWAL_TIP = `Due to Ethereum's high gas price, it's advisable to delay your withdrawal.`;

export const HOUR_LIMIT_24 = '24-Hour Limit';

export enum ERROR_NAME_TYPE {
  FAIL_MODAL_REASON = 'failModalReason',
}

export const INITIAL_WITHDRAW_STATE = {
  currentSymbol: TokenType.USDT,
  tokenList: [TOKEN_INFO_USDT],
  currentChainItem: CHAIN_MENU_DATA[CHAIN_ID.AELF],
};

export const INITIAL_WITHDRAW_INFO: TWithdrawInfo = {
  maxAmount: '',
  minAmount: '',
  limitCurrency: TokenType.USDT,
  totalLimit: '',
  remainingLimit: '',
  transactionFee: '',
  transactionUnit: TokenType.USDT,
  expiredTimestamp: 0,
  aelfTransactionFee: '',
  aelfTransactionUnit: 'ELF',
  receiveAmount: '',
  feeList: [],
  receiveAmountUsd: DEFAULT_NULL_VALUE,
  amountUsd: DEFAULT_NULL_VALUE,
  feeUsd: DEFAULT_NULL_VALUE,
};

export const INITIAL_NETWORK = {
  network: '',
  name: '',
  multiConfirm: '',
  multiConfirmTime: '',
  contractAddress: '',
  explorerUrl: '',
  status: NetworkStatus.Health,
};

export const INITIAL_WITHDRAW_SUCCESS_CHECK: TWithdrawInfoSuccess = {
  symbol: '',
  amount: '',
  receiveAmount: '',
  chainItem: CHAIN_MENU_DATA[CHAIN_ID.AELF],
  network: INITIAL_NETWORK,
  arriveTime: '',
  receiveAmountUsd: DEFAULT_NULL_VALUE,
  transactionId: '',
};

export const ARRIVAL_TIME_CONFIG: Record<string, TArrivalTimeConfig> = {
  USDT: {
    dividingQuota: '300',
    chainList: [CHAIN_ID.AELF, CHAIN_ID.tDVV, CHAIN_ID.tDVW],
  },
  ELF: {
    dividingQuota: '5000',
    chainList: [CHAIN_ID.AELF, CHAIN_ID.tDVV, CHAIN_ID.tDVW],
  },
};
