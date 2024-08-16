import { Input, InputProps } from 'antd';
import clsx from 'clsx';
import './index.less';
import { ComponentStyle } from '../../../types';
import { useMemo } from 'react';

interface FormInputProps extends InputProps {
  componentStyle?: ComponentStyle;
  unit?: string;
  maxButtonConfig?: {
    onClick: () => void;
  };
}

export default function FormAmountInput({
  componentStyle = ComponentStyle.Web,
  unit,
  maxButtonConfig,
  ...props
}: FormInputProps) {
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);

  return (
    <div
      id="etransferInputAmountWrapper"
      className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-from-amount-input-wrapper')}>
      <Input {...props} className={'etransfer-ui-from-amount-input'} bordered={false} />
      <div
        className={clsx(
          'etransfer-ui-flex-none',
          'etransfer-ui-flex-row-center',
          'etransfer-ui-from-amount-input-addon-after',
        )}>
        {maxButtonConfig && (
          <div
            className={clsx(
              'etransfer-ui-cursor-pointer',
              'etransfer-ui-from-amount-input-max',
              isMobileStyle && 'etransfer-ui-from-amount-input-max-mobile',
            )}
            onClick={maxButtonConfig.onClick}>
            Max
          </div>
        )}
        {maxButtonConfig && unit && <div className={'etransfer-ui-from-amount-input-dividing-line'}></div>}
        {unit && (
          <div
            className={clsx(
              'etransfer-ui-from-amount-input-unit',
              isMobileStyle && 'etransfer-ui-from-amount-input-unit-mobile',
            )}>
            {unit}
          </div>
        )}
      </div>
    </div>
  );
}
