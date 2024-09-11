import { THistoryFeeInfo } from '../types';
import clsx from 'clsx';
import './index.less';
import { BusinessType, OrderStatusEnum } from '@etransfer/types';
import { ComponentStyle } from '../../../types';
import { DEFAULT_NULL_VALUE } from '../../../constants';
import { formatSymbolDisplay } from '../../../utils';

type TFeeInfoProps = {
  feeInfo: THistoryFeeInfo[];
  status: string;
  orderType: BusinessType;
  componentStyle?: ComponentStyle;
};

export default function FeeInfo({ feeInfo, status, orderType, componentStyle = ComponentStyle.Web }: TFeeInfoProps) {
  if (status === OrderStatusEnum.Failed) {
    return <div className="etransfer-ui-history-fee-info-wrapper">{DEFAULT_NULL_VALUE}</div>;
  }

  if (orderType === BusinessType.Deposit) {
    return <div className="etransfer-ui-history-fee-info-wrapper">Free</div>;
  }

  return (
    <div
      className={clsx(
        'etransfer-ui-history-fee-info-wrapper',
        componentStyle === ComponentStyle.Mobile
          ? 'etransfer-ui-history-mobile-fee-info-wrapper'
          : 'etransfer-ui-history-web-fee-info-wrapper',
      )}>
      {feeInfo?.map((item, index) => {
        return (
          <span className="etransfer-ui-history-fee-info-item-wrapper" key={item.symbol}>
            {index !== 0 && <span className="etransfer-ui-history-fee-info-item-add">+</span>}
            <span> {item.amount} </span>
            <span> {formatSymbolDisplay(item.symbol)} </span>
          </span>
        );
      })}
    </div>
  );
}
