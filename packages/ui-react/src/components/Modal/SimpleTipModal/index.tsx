import clsx from 'clsx';
import { CommonModalProps } from '../../CommonModal';
import CommonModalTip from '../../CommonTips/CommonModalTip';
import './index.less';
import { GOT_IT } from '../../../constants';

export type TSimpleTipModalProps = {
  className?: string;
  open?: boolean;
  content: string;
  getContainer?: CommonModalProps['getContainer'];
  onOk?: () => void;
};

export default function SimpleTipModal({ className, open = false, content, getContainer, onOk }: TSimpleTipModalProps) {
  return (
    <CommonModalTip
      className={clsx('etransfer-ui-simple-modal', className)}
      footerClassName="etransfer-ui-simple-modal-footer"
      getContainer={getContainer}
      open={open}
      closable={false}
      okText={GOT_IT}
      onOk={onOk}>
      <div className="etransfer-ui-flex-center etransfer-ui-simple-modal-body">{content}</div>
    </CommonModalTip>
  );
}
