import { ComponentStyle, PageKey } from '../../../types';
import Deposit from '../../Deposit';
import TransferDetail from '../../TransferDetail';
import Withdraw from '../../Withdraw';
import History from '../../History';
import { useETransferDeposit } from '../../../context/ETransferDepositProvider';
import { useETransferWithdraw } from '../../../context/ETransferWithdrawProvider';
import { useNoticeSocket } from '../../../hooks/notice';
import './index.less';

export default function ETransferContentBody({
  activePageKey,
  componentStyle,
  transferDetailId,
  isUnreadHistory,
  isShowErrorTip,
  onClickProcessingTip,
  onClickHistoryItem,
  onTransferDetailBack,
}: {
  activePageKey: PageKey;
  componentStyle?: ComponentStyle;
  isUnreadHistory: boolean;
  transferDetailId?: string;
  isShowErrorTip?: boolean;
  onClickProcessingTip: () => void;
  onClickHistoryItem: (id: string) => void;
  onTransferDetailBack: () => void;
}) {
  const [{ depositProcessingCount }] = useETransferDeposit();
  const [{ withdrawProcessingCount }] = useETransferWithdraw();
  useNoticeSocket();

  return (
    <div className="etransfer-ui-etransfer-content-body">
      {activePageKey === PageKey.Deposit && (
        <Deposit
          componentStyle={componentStyle}
          isShowErrorTip={isShowErrorTip}
          isShowMobilePoweredBy={true}
          isShowProcessingTip={true}
          withdrawProcessingCount={withdrawProcessingCount}
          onClickProcessingTip={onClickProcessingTip}
        />
      )}
      {activePageKey === PageKey.Withdraw && (
        <Withdraw
          componentStyle={componentStyle}
          isShowMobilePoweredBy={true}
          isShowErrorTip={isShowErrorTip}
          isShowProcessingTip={true}
          depositProcessingCount={depositProcessingCount}
          onClickProcessingTip={onClickProcessingTip}
        />
      )}
      {activePageKey === PageKey.History && (
        <History
          componentStyle={componentStyle}
          isUnreadHistory={isUnreadHistory}
          isShowMobilePoweredBy={true}
          onClickHistoryItem={onClickHistoryItem}
        />
      )}
      {activePageKey === PageKey.TransferDetail && (
        <TransferDetail
          componentStyle={componentStyle}
          isShowBackElement={true}
          orderId={transferDetailId || ''}
          onBack={onTransferDetailBack}
        />
      )}
    </div>
  );
}
