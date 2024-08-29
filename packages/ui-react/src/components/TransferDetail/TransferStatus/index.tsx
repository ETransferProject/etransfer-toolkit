import { OrderStatusEnum } from '@etransfer/types';
import './index.less';
import { TransferStatusType } from '../../../constants/transfer';

export function TransferStatus({ status }: { status: OrderStatusEnum | TransferStatusType }) {
  if (status === OrderStatusEnum.Processing || status === TransferStatusType.Pending) {
    return <div className={'etransfer-ui-transfer-status-pending'}>{TransferStatusType.Pending}</div>;
  }

  if (status === OrderStatusEnum.Succeed || status === TransferStatusType.Success) {
    return <div className={'etransfer-ui-transfer-status-success'}>{TransferStatusType.Success}</div>;
  }

  if (status === OrderStatusEnum.Failed || status === TransferStatusType.Failed) {
    return <div className={'etransfer-ui-transfer-status-failed'}>{TransferStatusType.Failed}</div>;
  }

  return null;
}
