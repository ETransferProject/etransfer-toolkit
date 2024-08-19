import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import moment from 'moment';
import { ComponentStyle } from '../../../types';
import { OrderStatusEnum } from '@etransfer/types';
import { DEFAULT_NULL_VALUE } from '../../../constants';

type TArrivalTimeBoxProps = {
  arrivalTime: number;
  status: string;
  componentStyle?: ComponentStyle;
};

export default function ArrivalTimeBox({
  arrivalTime,
  status,
  componentStyle = ComponentStyle.Web,
}: TArrivalTimeBoxProps) {
  const content = useMemo(() => {
    const yearMonthDay = moment(arrivalTime).format('YYYY-MM-DD');
    const hourMinuteSecond = moment(arrivalTime).format('HH:mm:ss');
    const now = moment();
    const targetTime = moment(arrivalTime);
    const minutes = targetTime.diff(now, 'minutes');
    switch (status) {
      case OrderStatusEnum.Processing:
        return (
          <>{minutes > 0 ? <span>{`~ in ${minutes} ${minutes === 1 ? 'min' : 'mins'}`}</span> : 'Arriving soon'}</>
        );
      case OrderStatusEnum.Failed:
        return DEFAULT_NULL_VALUE;
      case OrderStatusEnum.Succeed:
        return (
          <div className="etransfer-ui-history-arrival-time-year-hour-wrapper">
            <span className="etransfer-ui-history-arrival-time-year">{yearMonthDay}</span>
            &nbsp;
            <span className="etransfer-ui-history-arrival-time-hour">{hourMinuteSecond}</span>
          </div>
        );
      default:
        return null;
    }
  }, [arrivalTime, status]);

  return (
    <div
      className={clsx(
        'etransfer-ui-history-arrival-time-box',
        componentStyle === ComponentStyle.Mobile
          ? 'etransfer-ui-history-mobile-arrival-time-box'
          : 'etransfer-ui-history-web-arrival-time-box',
      )}>
      {content}
    </div>
  );
}
