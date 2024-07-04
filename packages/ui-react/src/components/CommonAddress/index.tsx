import clsx from 'clsx';
import './index.less';
import Copy, { CopySize } from '../Copy';

interface CommonAddressProps {
  labelClassName?: string;
  valueClassName?: string;
  valueWrapperClassName?: string;
  label?: string;
  value?: string;
  showCopy?: boolean;
  copySize?: CopySize;
}

export default function CommonAddress({
  labelClassName,
  valueClassName,
  valueWrapperClassName,
  label,
  value,
  showCopy = true,
  copySize,
}: CommonAddressProps) {
  return (
    <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-address-wrapper')}>
      <div className={clsx('address-text-title', labelClassName)}>{label}</div>
      <div className={clsx('etransfer-ui-flex-row-center', valueWrapperClassName)}>
        <div className={clsx('etransfer-ui-flex-1', 'address-text-content', valueClassName)}>{value}</div>
        {showCopy && !!value && <Copy className={'etransfer-ui-flex-none'} toCopy={value || ''} size={copySize} />}
      </div>
    </div>
  );
}