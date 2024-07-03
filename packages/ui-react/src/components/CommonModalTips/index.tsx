import CommonModal, { CommonModalProps } from '../CommonModal';
import './index.less';
import clsx from 'clsx';

export default function CommonModalTips({ open = false, getContainer = 'body', ...props }: CommonModalProps) {
  return (
    <CommonModal
      {...props}
      getContainer={getContainer}
      className={clsx('etransfer-ui-common-modal-tips', props?.className)}
      footerClassName={clsx('etransfer-ui-common-modal-tips-footer', props?.footerClassName)}
      open={open}
      hideCancelButton={true}>
      {props.children}
    </CommonModal>
  );
}
