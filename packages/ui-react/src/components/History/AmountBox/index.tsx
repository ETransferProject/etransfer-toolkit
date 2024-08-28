import clsx from 'clsx';
import './index.less';
import { ComponentStyle } from '../../../types';
import { OrderStatusEnum } from '@etransfer/types';
import { DEFAULT_NULL_VALUE, SWAPPING } from '../../../constants';
import { formatSymbolDisplay } from '../../../utils';

type TAmountBoxProps = {
  amount: string;
  token: string;
  fromToken?: string;
  status?: string;
  componentStyle?: ComponentStyle;
};

export default function AmountBox({
  amount,
  token,
  fromToken,
  status,
  componentStyle = ComponentStyle.Web,
}: TAmountBoxProps) {
  return (
    <div
      className={clsx(
        'etransfer-ui-history-amount-box',
        componentStyle === ComponentStyle.Mobile
          ? 'etransfer-ui-history-mobile-amount-box'
          : 'etransfer-ui-history-web-amount-box',
      )}>
      {status !== OrderStatusEnum.Failed &&
        (fromToken && fromToken !== token && status === OrderStatusEnum.Processing ? (
          <span className="etransfer-ui-history-amount-second">{SWAPPING}</span>
        ) : (
          <span>{`${amount} ${formatSymbolDisplay(token)}`}</span>
        ))}
      {status === OrderStatusEnum.Failed && <span>{DEFAULT_NULL_VALUE}</span>}
    </div>
  );
}
