import { TGetRecordDetailResult } from '@etransfer/types';
import MobileSecondPageHeader from '../../Header/MobileSecondPageHeader';
import TransferDetailMain from '../TransferDetailMain';
import { ComponentStyle } from '../../../types';
import { TRANSFER_DETAIL } from '../../../constants/transfer';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../../CommonSvg';

export default function MobileTransferDetail({
  className,
  data,
  isShowPoweredBy = false,
  isShowBackIcon,
  backIcon,
  onBack,
}: {
  className?: string;
  data: TGetRecordDetailResult;
  isShowPoweredBy?: boolean;
  isShowBackIcon?: boolean;
  backIcon?: React.ReactNode;
  onBack?: () => void;
}) {
  return (
    <div className={clsx('etransfer-ui-flex-column-between etransfer-ui-mobile-transfer-detail', className)}>
      <div>
        <MobileSecondPageHeader
          title={TRANSFER_DETAIL}
          onBack={onBack}
          isShowBackIcon={isShowBackIcon}
          backIcon={backIcon}
        />
        <div className="etransfer-ui-mobile-transfer-detail-main">
          <TransferDetailMain componentStyle={ComponentStyle.Mobile} data={data} />
        </div>
      </div>
      {isShowPoweredBy && (
        <CommonSvg type="poweredBy" className="etransfer-ui-flex-center etransfer-ui-mobile-bottom-powered-by" />
      )}
    </div>
  );
}
