import clsx from 'clsx';
import CommonModalTips from '../../CommonModalTips';
import './index.less';
import { GOT_IT } from '../../../constants';

export type TSynchronizingChainModal = {
  className?: string;
  open?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
};

const SynchronizingChainModalTitle = 'Data is synchronising on the blockchain. Please wait a minute and try again.';

export default function SynchronizingChainModal({ className, open = false, onOk, onCancel }: TSynchronizingChainModal) {
  return (
    <CommonModalTips
      className={clsx('etransfer-ui-synchronizing-chain-modal', className)}
      footerClassName="etransfer-ui-synchronizing-chain-modal-footer"
      getContainer="body"
      open={open}
      closable={true}
      title="Tips"
      okText={GOT_IT}
      onOk={onOk}
      onCancel={onCancel}>
      <div className="etransfer-ui-synchronizing-chain-modal-body">{SynchronizingChainModalTitle}</div>
    </CommonModalTips>
  );
}
