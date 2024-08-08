import clsx from 'clsx';
import './index.less';
import CommonModalAutoScreen, { CommonModalAutoScreenProps } from '../../CommonModalAutoScreen';
import CommonSvg from '../../CommonSvg';
import { ComponentStyle } from '../../../types';

interface FailModalProps {
  failReason: string;
  modalProps: CommonModalAutoScreenProps;
  componentStyle?: ComponentStyle;
}

export default function FailModal({ componentStyle, failReason, modalProps }: FailModalProps) {
  return (
    <CommonModalAutoScreen {...modalProps} componentStyle={componentStyle} hideCancelButton okText="Got it">
      <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-withdraw-fail-modal-container')}>
        <div className={clsx('etransfer-ui-flex-column-center', 'etransfer-ui-withdraw-fail-modal-title-wrapper')}>
          <div className={clsx('etransfer-ui-flex-center', 'etransfer-ui-withdraw-fail-modal-title-icon')}>
            <CommonSvg type="exclamationFilled" />
          </div>
          <div className={'etransfer-ui-withdraw-fail-modal-title'}>Transaction Failed</div>
        </div>
        <div className={'etransfer-ui-withdraw-fail-modal-fail-reason'}>{failReason}</div>
      </div>
    </CommonModalAutoScreen>
  );
}
