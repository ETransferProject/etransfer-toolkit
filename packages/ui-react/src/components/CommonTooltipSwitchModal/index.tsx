import { useMemo, useState, useImperativeHandle, forwardRef, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import { TooltipProps } from 'antd';
import './index.less';
import CommonModal, { CommonModalProps } from '../CommonModal';
import CommonTooltip from '../CommonTooltip';
import { GOT_IT } from '../../constants/misc';
import { ComponentStyle } from '../../types';
import CommonSvg from '../CommonSvg';

export interface ICommonTooltipSwitchModalRef {
  open: () => void;
}

interface ICommonTooltipSwitchModalProps {
  tooltipProps?: Pick<TooltipProps, 'className'>;
  modalProps?: Pick<CommonModalProps, 'className' | 'title' | 'zIndex'>;
  modalWidth?: number;
  tip: React.ReactNode;
  children: React.ReactNode;
  modalFooterClassName?: string;
  componentStyle?: ComponentStyle;
}

const CommonTooltipSwitchModal = forwardRef<ICommonTooltipSwitchModalRef, ICommonTooltipSwitchModalProps>(
  (
    {
      tooltipProps,
      modalProps,
      modalWidth = 335,
      tip,
      children,
      modalFooterClassName,
      componentStyle = ComponentStyle.Web,
    },
    ref,
  ) => {
    const isMobileStyle = componentStyle === ComponentStyle.Mobile;

    const isTooltip = useMemo(() => !isMobileStyle, [isMobileStyle]);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = useCallback(() => {
      if (!isTooltip) {
        setIsModalOpen(true);
      }
    }, [isTooltip]);

    const handleModalClose = useCallback(() => {
      setIsModalOpen(false);
    }, []);

    useImperativeHandle(ref, () => ({
      open: handleModalOpen,
    }));

    useEffect(() => {
      if (!isMobileStyle) {
        handleModalClose();
      }
    }, [handleModalClose, isMobileStyle]);

    return (
      <>
        <CommonTooltip {...tooltipProps} placement="top" title={isTooltip && tip}>
          {children}
        </CommonTooltip>
        <CommonModal
          {...modalProps}
          className={clsx('common-tooltip-switch-modal', modalProps?.className)}
          footerClassName={clsx('common-tooltip-switch-modal-footer', modalFooterClassName)}
          width={modalWidth}
          closeIcon={<CommonSvg type="closeMedium" />}
          hideCancelButton
          okText={GOT_IT}
          open={isModalOpen}
          onOk={handleModalClose}
          onCancel={handleModalClose}>
          <div>{tip}</div>
        </CommonModal>
      </>
    );
  },
);

CommonTooltipSwitchModal.displayName = 'CommonTooltipSwitchModal';

export default CommonTooltipSwitchModal;
