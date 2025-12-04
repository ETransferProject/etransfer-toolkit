import { Modal, ModalProps } from 'antd';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';
import CommonButton from '../CommonButton';
import { CommonButtonType } from '../../types/components';

export type CommonModalProps = Omit<ModalProps, 'footer' | 'confirmLoading' | 'okButtonProps' | 'okType'> & {
  footerClassName?: string;
  cancelText?: string;
  okText?: string;
  hideCancelButton?: boolean;
  hideOkButton?: boolean;
  isOkButtonDisabled?: boolean;
  footerSlot?: React.ReactNode;
};

export default function CommonModal({
  className,
  footerClassName,
  cancelText,
  okText,
  hideCancelButton,
  hideOkButton,
  isOkButtonDisabled,
  ...props
}: CommonModalProps) {
  return (
    <Modal
      width={props.width || 480}
      centered
      zIndex={299}
      closeIcon={<CommonSvg type="close" />}
      {...props}
      className={clsx('etransfer-ui-common-modal', className)}
      // To keep the title height by default
      title={props.title || ' '}
      footer={null}>
      {props.children}
      {(!hideCancelButton || !hideOkButton) && (
        <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-footer', footerClassName)}>
          {!hideCancelButton && (
            <CommonButton
              className={clsx('etransfer-ui-flex-1', 'etransfer-ui-cancel-button')}
              type={CommonButtonType.Secondary}
              onClick={props.onCancel}>
              {cancelText || 'Cancel'}
            </CommonButton>
          )}
          {!hideOkButton && (
            <CommonButton
              className={clsx('etransfer-ui-flex-1', 'etransfer-ui-ok-button')}
              disabled={isOkButtonDisabled}
              onClick={props.onOk}>
              {okText || 'Confirm'}
            </CommonButton>
          )}
        </div>
      )}
      {props.footerSlot}
    </Modal>
  );
}
