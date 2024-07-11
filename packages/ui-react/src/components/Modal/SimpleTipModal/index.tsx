import clsx from 'clsx';
import { CommonModalProps } from '../../CommonModal';
import CommonModalTips from '../../CommonModalTips';
import './index.less';

export type TSimpleTipModalProps = {
  className?: string;
  open?: boolean;
  content: string;
  getContainer: CommonModalProps['getContainer'];
  onOk?: () => void;
};

export default function SimpleTipModal({ className, open = false, content, getContainer, onOk }: TSimpleTipModalProps) {
  return (
    <CommonModalTips
      className={clsx('etransfer-ui-simple-modal', className)}
      footerClassName="etransfer-ui-simple-modal-footer"
      getContainer={getContainer}
      open={open}
      closable={false}
      okText="OK"
      onOk={onOk}>
      <div className="etransfer-ui-simple-modal-body">{content}</div>
    </CommonModalTips>
  );
}
