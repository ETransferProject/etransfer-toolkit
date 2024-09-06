import TransferDetailMain from '../TransferDetailMain';
import { Breadcrumb } from 'antd';
import './index.less';
import { TGetRecordDetailResult } from '@etransfer/types';
import { ComponentStyle } from '../../../types';
import clsx from 'clsx';
import { TRANSFER_DETAIL } from '../../../constants/transfer';

export default function WebTransferDetail({
  data,
  onBack,
  backName = 'History',
  className,
  isShowBackElement,
}: {
  className?: string;
  data: TGetRecordDetailResult;
  backName?: string;
  isShowBackElement?: boolean;
  onBack?: () => void;
}) {
  return (
    <div className={clsx('etransfer-ui-web-transfer-detail', className)}>
      {isShowBackElement && (
        <Breadcrumb className={'etransfer-ui-web-transfer-detail-breadcrumb'}>
          <Breadcrumb.Item className={'etransfer-ui-web-transfer-detail-breadcrumb-first'} onClick={onBack}>
            {backName}
          </Breadcrumb.Item>
          <Breadcrumb.Item className={'etransfer-ui-web-transfer-detail-breadcrumb-second'}>
            {TRANSFER_DETAIL}
          </Breadcrumb.Item>
        </Breadcrumb>
      )}

      <div className={'etransfer-ui-web-transfer-detail-title'}>{TRANSFER_DETAIL}</div>
      <TransferDetailMain componentStyle={ComponentStyle.Web} data={data} />
    </div>
  );
}
