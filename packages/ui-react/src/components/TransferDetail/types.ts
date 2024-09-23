import { BusinessType, OrderStatusEnum } from '@etransfer/types';
import { ChainId } from '@portkey/types';
import { THistoryFeeInfo } from '../History/types';
import { TransferStatusType } from '../../constants/transfer';

export type TTransferDetailBodyData = {
  id: string;
  orderType: BusinessType;
  status: OrderStatusEnum;
  createTime: number;
  fromNetwork: string;
  fromChainId?: ChainId;
  fromSymbol: string;
  fromIcon?: string;
  fromAddress: string;
  fromToAddress: string;
  fromAmount: string;
  fromAmountUsd: string;
  fromTxId: string;
  fromStatus: OrderStatusEnum | TransferStatusType;
  toNetwork: string;
  toChainId?: ChainId;
  toSymbol: string;
  toIcon?: string;
  toAddress: string;
  toFromAddress: string;
  toAmount: string;
  toAmountUsd: string;
  toTxId: string;
  toStatus: OrderStatusEnum | TransferStatusType;
  toFeeInfo?: THistoryFeeInfo[];
};

export type TTransferDetailActionData = {
  orderId: string;
};
