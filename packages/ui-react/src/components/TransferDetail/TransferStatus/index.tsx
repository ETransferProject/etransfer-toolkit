import { OrderStatusEnum } from '@etransfer/types';
import './index.less';

export function TransferStatus({ status }: { status: OrderStatusEnum }) {
  if (status === OrderStatusEnum.Processing) {
    return <div className={'etransfer-ui-transfer-status-pending'}>{status}</div>;
  }

  if (status === OrderStatusEnum.Succeed) {
    return <div className={'etransfer-ui-transfer-status-success'}>{status}</div>;
  }

  if (status === OrderStatusEnum.Failed) {
    return <div className={'etransfer-ui-transfer-status-failed'}>{status}</div>;
  }

  return null;
}
