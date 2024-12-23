import { useRef } from 'react';
import './index.less';
import clsx from 'clsx';
import CommonTooltipSwitchModal, { ICommonTooltipSwitchModalRef } from '../CommonTooltipSwitchModal';
import CommonSvg from '../CommonSvg';
import { ComponentStyle } from '../../types';

export default function CommonTip({
  className,
  tip,
  title,
  modalTitle,
  icon,
  componentStyle = ComponentStyle.Web,
}: {
  className?: string;
  tip: React.ReactNode;
  title?: string;
  modalTitle?: string;
  icon?: React.ReactNode;
  componentStyle?: ComponentStyle;
}) {
  const tooltipSwitchModalsRef = useRef<ICommonTooltipSwitchModalRef | null>(null);

  return (
    <CommonTooltipSwitchModal
      ref={(ref) => {
        tooltipSwitchModalsRef.current = ref;
      }}
      modalProps={{ title: modalTitle || title, zIndex: 300 }}
      tip={tip}
      componentStyle={componentStyle}>
      <div className={clsx('common-tip-title', className)} onClick={() => tooltipSwitchModalsRef.current?.open()}>
        {icon ? icon : <CommonSvg type={'infoLine'} className={'common-tip-title-icon'} />}
        {title && <span className={'common-tip-title-text'}>{title}</span>}
      </div>
    </CommonTooltipSwitchModal>
  );
}
