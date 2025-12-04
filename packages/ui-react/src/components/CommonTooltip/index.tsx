import { Tooltip, TooltipProps } from 'antd';
import clsx from 'clsx';
import './index.less';

export default function CommonTooltip({ overlayClassName, ...props }: TooltipProps) {
  return <Tooltip {...props} overlayClassName={clsx('etransfer-ui-common-tooltip-overlay', overlayClassName)} />;
}
