import CommonModalTips from '../../CommonModalTips';
import './index.less';

export type TSynchronizingChainModal = {
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

const SynchronizingChainModalTitle = 'Data is synchronising on the blockchain. Please wait a minute and try again.';

export default function SynchronizingChainModal({ open = false, onOk, onCancel }: TSynchronizingChainModal) {
  return (
    <CommonModalTips
      className="etransfer-ui-synchronizing-chain-modal"
      footerClassName="etransfer-ui-synchronizing-chain-modal-footer"
      getContainer="body"
      open={open}
      closable={true}
      title="Tips"
      okText="OK"
      onOk={onOk}
      onCancel={onCancel}>
      <div className="etransfer-ui-synchronizing-chain-modal-body">{SynchronizingChainModalTitle}</div>
    </CommonModalTips>
  );
}
