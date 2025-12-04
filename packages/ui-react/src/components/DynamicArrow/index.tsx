import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';

export type TDynamicArrowSize = 'Big' | 'Normal' | 'Small';

type TDynamicArrow = {
  className?: string;
  iconClassName?: string;
  isExpand?: boolean;
  size?: TDynamicArrowSize;
};

export default function DynamicArrow({ className, iconClassName, isExpand = false, size = 'Normal' }: TDynamicArrow) {
  return (
    <span
      className={clsx(
        'etransfer-ui-flex-center',
        'etransfer-ui-dynamic-arrow',
        {
          ['etransfer-ui-dynamic-arrow-big']: size === 'Big',
          ['etransfer-ui-dynamic-arrow-small']: size === 'Small',
        },
        className,
      )}>
      {size === 'Big' && (
        <CommonSvg
          type="downBig"
          className={clsx(
            'etransfer-ui-dynamic-arrow-icon',
            isExpand && 'etransfer-ui-dynamic-arrow-icon-rotate',
            iconClassName,
          )}
        />
      )}
      {size === 'Small' && (
        <CommonSvg
          type="downSmall"
          className={clsx(
            'etransfer-ui-dynamic-arrow-icon',
            isExpand && 'etransfer-ui-dynamic-arrow-icon-rotate',
            iconClassName,
          )}
        />
      )}
      {size === 'Normal' && (
        <CommonSvg
          type="down"
          className={clsx(
            'etransfer-ui-dynamic-arrow-icon',
            isExpand && 'etransfer-ui-dynamic-arrow-icon-rotate',
            iconClassName,
          )}
        />
      )}
    </span>
  );
}
