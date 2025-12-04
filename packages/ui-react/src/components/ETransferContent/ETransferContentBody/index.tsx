import { ComponentStyle, PageKey } from '../../../types';
import Deposit from '../../Deposit';
import TransferDetail from '../../TransferDetail';
import Withdraw from '../../Withdraw';
import History from '../../History';
import { useETransferDeposit } from '../../../context/ETransferDepositProvider';
import { useETransferWithdraw } from '../../../context/ETransferWithdrawProvider';
import { useNoticeSocket } from '../../../hooks/notice';
import './index.less';
import { TDepositActionData } from '../../Deposit/types';
import { TWithdrawActionData } from '../../Withdraw/types';
import { THistoryActionData } from '../../History/types';

export default function ETransferContentBody({
  activePageKey,
  componentStyle,
  transferDetailId,
  isUnreadHistory,
  isShowErrorTip,
  customDepositDescriptionNode,
  onClickProcessingTip,
  onClickHistoryItem,
  onTransferDetailBack,
  onDepositActionChange,
  onWithdrawActionChange,
  onHistoryActionChange,
  onLogin,
  renderDepositTip,
}: {
  activePageKey: PageKey;
  componentStyle?: ComponentStyle;
  isUnreadHistory: boolean;
  transferDetailId?: string;
  isShowErrorTip?: boolean;
  customDepositDescriptionNode?: React.ReactNode;
  renderDepositTip?: (fromToken: string, toToken: string) => React.ReactNode;
  onClickProcessingTip: () => void;
  onClickHistoryItem: (id: string) => void;
  onTransferDetailBack: () => void;
  onDepositActionChange?: (data: TDepositActionData) => void;
  onWithdrawActionChange?: (data: TWithdrawActionData) => void;
  onHistoryActionChange?: (data: THistoryActionData) => void;
  onLogin?: () => void;
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
          isListenNoticeAuto={false}
          isShowProcessingTip={true}
          withdrawProcessingCount={withdrawProcessingCount}
          customDescriptionNode={customDepositDescriptionNode}
          renderDepositTip={renderDepositTip}
          onClickProcessingTip={onClickProcessingTip}
          onActionChange={onDepositActionChange}
          onConnect={onLogin}
        />
      )}
      {activePageKey === PageKey.Withdraw && (
        <Withdraw
          componentStyle={componentStyle}
          isShowMobilePoweredBy={true}
          isShowErrorTip={isShowErrorTip}
          isListenNoticeAuto={false}
          isShowProcessingTip={true}
          depositProcessingCount={depositProcessingCount}
          onClickProcessingTip={onClickProcessingTip}
          onActionChange={onWithdrawActionChange}
          onLogin={onLogin}
        />
      )}
      {activePageKey === PageKey.History && (
        <History
          componentStyle={componentStyle}
          isUnreadHistory={isUnreadHistory}
          isShowMobilePoweredBy={true}
          onClickHistoryItem={onClickHistoryItem}
          onActionChange={onHistoryActionChange}
        />
      )}
      {activePageKey === PageKey.TransferDetail && (
        <TransferDetail
          componentStyle={componentStyle}
          isShowBackElement={true}
          isShowMobilePoweredBy={true}
          orderId={transferDetailId || ''}
          onBack={onTransferDetailBack}
        />
      )}
    </div>
  );
}
