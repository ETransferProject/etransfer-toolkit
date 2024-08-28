import { BusinessType, OrderStatusEnum } from '@etransfer/types';
import { ChainId } from '@portkey/types';
import { THistoryFeeInfo } from '../History/types';

export type TTransferDetailBodyData = {
  id: string;
  orderType: BusinessType;
  status: OrderStatusEnum;
  createTime: number;
  fromNetwork: string;
  fromChainId: ChainId;
  fromSymbol: string;
  fromIcon?: string;
  fromAddress: string;
  fromAmount: string;
  fromAmountUsd: string;
  fromTxId: string;
  fromStatus: OrderStatusEnum;
  toNetwork: string;
  toChainId: ChainId;
  toSymbol: string;
  toIcon?: string;
  toAddress: string;
  toAmount: string;
  toAmountUsd: string;
  toTxId: string;
  toStatus: OrderStatusEnum;
  toFeeInfo: THistoryFeeInfo[];
};
