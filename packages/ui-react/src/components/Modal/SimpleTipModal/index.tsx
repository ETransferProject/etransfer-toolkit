import { CommonModalProps } from '../../CommonModal';
import CommonModalTips from '../../CommonModalTips';
import './index.less';

export type TSimpleTipModalProps = {
  open?: boolean;
  content: string;
  getContainer: CommonModalProps['getContainer'];
  onOk?: () => void;
};

export default function SimpleTipModal({ open = false, content, getContainer, onOk }: TSimpleTipModalProps) {
  return (
    <CommonModalTips
      className="etransfer-ui-simple-modal"
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
