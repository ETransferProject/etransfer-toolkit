import { useMemo, useState, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';
import CommonTooltip from '../CommonTooltip';
import { ComponentStyle } from '../../types/common';
import { CopySize } from '../../types/components';

export default function Copy({
  toCopy,
  children,
  className,
  size = CopySize.Normal,
  componentStyle = ComponentStyle.Web,
}: {
  toCopy: string;
  children?: React.ReactNode;
  className?: string;
  size?: CopySize;
  componentStyle?: ComponentStyle;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCopyValue] = useCopyToClipboard();
  const [isShowCopyIcon, setIsShowCopyIcon] = useState(false);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const isMobileStyle = componentStyle === ComponentStyle.Mobile;

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const CopyIcon = useMemo(
    () => <CommonSvg type={size === CopySize.Small ? 'copySmall' : size === CopySize.Big ? 'copyBig' : 'copy'} />,
    [size],
  );
  const CheckIcon = useMemo(
    () => <CommonSvg type={size === CopySize.Small ? 'checkSmall' : size === CopySize.Big ? 'checkBig' : 'check'} />,
    [size],
  );

  const tooltipTitle = useMemo(() => {
    if (isShowCopyIcon || isMobileStyle) {
      return 'Copied';
    } else if (!isMobileStyle) {
      return 'Copy';
    }
    return '';
  }, [isMobileStyle, isShowCopyIcon]);

  return (
    <CommonTooltip
      title={tooltipTitle}
      trigger={isMobileStyle ? '' : 'hover'}
      open={isMobileStyle ? isTooltipOpen : undefined}>
      <span
        className={clsx(
          'etransfer-ui-flex-center',
          'etransfer-ui-cursor-pointer',
          'etransfer-ui-copy-icon-wrapper',
          'etransfer-ui-copy-icon-wrapper-background-color',
          `etransfer-ui-copy-icon-wrapper-${size}`,
          className,
        )}
        onClick={() => {
          if (isShowCopyIcon) {
            return;
          }
          setCopyValue(toCopy);
          setIsShowCopyIcon(true);
          if (isMobileStyle) {
            setIsTooltipOpen(true);
          }
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            if (isMobileStyle) {
              setIsTooltipOpen(false);
            }
            setIsShowCopyIcon(false);
          }, 2000);
        }}>
        {isShowCopyIcon ? CheckIcon : CopyIcon}
        {children}
      </span>
    </CommonTooltip>
  );
}
