import { TGetRecordDetailResult } from '@etransfer/types';
import MobileSecondPageHeader from '../../Header/MobileSecondPageHeader';
import TransferDetailMain from '../TransferDetailMain';
import { ComponentStyle } from '../../../types';
import { TRANSFER_DETAIL } from '../../../constants/transfer';
import clsx from 'clsx';

export default function MobileTransferDetail({
  className,
  data,
  isShowBackIcon,
  backIcon,
  onBack,
}: {
  className?: string;
  data: TGetRecordDetailResult;
  isShowBackIcon?: boolean;
  backIcon?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className={clsx('etransfer-ui-mobile-transfer-detail', className)}>
      <MobileSecondPageHeader
        title={TRANSFER_DETAIL}
        onBack={onBack}
        isShowBackIcon={isShowBackIcon}
        backIcon={backIcon}
      />
      {/* TODO className */}
      <div className="etransfer-ui-mobile-transfer-detail-main">
        <TransferDetailMain componentStyle={ComponentStyle.Mobile} data={data} />
      </div>
    </div>
  );
}
