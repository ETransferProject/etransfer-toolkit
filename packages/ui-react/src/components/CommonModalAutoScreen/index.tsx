import clsx from 'clsx';
import './index.less';
import { ComponentStyle } from '../../types';
import CommonDrawer from '../CommonDrawer';
import CommonModal from '../CommonModal';
import CommonButton, { CommonButtonType } from '../CommonButton';

export interface CommonModalAutoScreenProps {
  title?: string;
  children?: React.ReactNode;
  drawerClassName?: string;
  modalClassName?: string;
  componentStyle?: ComponentStyle;
  hideCancelButton?: boolean;
  hideOkButton?: boolean;
  cancelText?: string;
  okText?: string;
  isOkButtonDisabled?: boolean;
  open?: boolean;
  onClose?: () => void;
  onOk?: () => void;
  footerSlot?: React.ReactNode;
}

export default function CommonModalAutoScreen({
  drawerClassName,
  modalClassName,
  componentStyle = ComponentStyle.Web,
  onClose,
  ...props
}: CommonModalAutoScreenProps) {
  return componentStyle === ComponentStyle.Mobile ? (
    <CommonDrawer
      {...props}
      className={'etransfer-ui-common-modal-auto-screen-drawer'}
      footer={
        <>
          {!props.hideCancelButton || !props.hideOkButton ? (
            <div className={clsx('etransfer-ui-common-modal-auto-screen-drawer-footer', drawerClassName)}>
              {!props.hideCancelButton && (
                <CommonButton
                  className={'etransfer-ui-common-modal-auto-screen-drawer-footer-cancel-button'}
                  type={CommonButtonType.Secondary}
                  onClick={onClose}>
                  {props.cancelText || 'Cancel'}
                </CommonButton>
              )}
              {!props.hideOkButton && (
                <CommonButton
                  className={'etransfer-ui-common-modal-auto-screen-drawer-footer-ok-button'}
                  disabled={props.isOkButtonDisabled}
                  onClick={props.onOk}>
                  {props.okText || 'Confirm'}
                </CommonButton>
              )}
            </div>
          ) : null}
          {props.footerSlot}
        </>
      }
      onClose={onClose}
    />
  ) : (
    <CommonModal {...props} className={modalClassName} onCancel={onClose} />
  );
}
