import './index.less';
import { Select, DatePicker, Button } from 'antd';
import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { HistoryWebFilterProps, TRangeValue } from '../types';
import { START_TIME_FORMAT, END_TIME_FORMAT, BusinessTypeOptions, HistoryStatusOptions } from '../../../constants';
import CommonSvg from '../../CommonSvg';
import clsx from 'clsx';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default function HistoryWebFilter({
  className,
  type,
  status,
  timestamp,
  onTypeChange,
  onStatusChange,
  onTimeStampChange,
  onReset,
}: HistoryWebFilterProps) {
  const handleDateRangeChange = useCallback(
    (timestamp: TRangeValue) => {
      if (timestamp && timestamp[0] && timestamp[1]) {
        const startTimestampFormat = moment(timestamp[0]).format(START_TIME_FORMAT);
        const endTimestampFormat = moment(timestamp[1]).format(END_TIME_FORMAT);
        onTimeStampChange([moment(startTimestampFormat).valueOf(), moment(endTimestampFormat).valueOf()]);
      }
    },
    [onTimeStampChange],
  );

  const isShowReset = useCallback(() => {
    let isShow = false;
    if (type !== 0 || status !== 0 || timestamp) {
      isShow = true;
    }
    return isShow;
  }, [type, status, timestamp]);

  const valueDate: TRangeValue = useMemo(
    () => [timestamp?.[0] ? moment(timestamp?.[0]) : null, timestamp?.[1] ? moment(timestamp?.[1]) : null],
    [timestamp],
  );

  return (
    <div className={clsx('etransfer-ui-history-web-filter', className)}>
      <div className="etransfer-ui-history-web-filter-title">History</div>
      <div className="etransfer-ui-history-web-filter-search-wrapper">
        <Select
          size={'large'}
          value={type}
          className="etransfer-ui-history-web-filter-select-type"
          onChange={onTypeChange}
          popupClassName="etransfer-ui-drop-wrap"
          options={BusinessTypeOptions}
        />
        <Select
          size={'large'}
          value={status}
          className="etransfer-ui-history-web-filter-select-status"
          onChange={onStatusChange}
          popupClassName="etransfer-ui-drop-wrap"
          options={HistoryStatusOptions}
        />
        <RangePicker
          size={'large'}
          allowClear={false}
          value={valueDate}
          className="etransfer-ui-history-web-filter-range-picker"
          format={dateFormat}
          allowEmpty={[true, true]}
          separator={timestamp ? <CommonSvg type="swapRightSelected" /> : <CommonSvg type="swapRightDefault" />}
          onCalendarChange={(dates) => handleDateRangeChange(dates)}
        />
        {isShowReset() && (
          <Button className="etransfer-ui-history-web-filter-reset-button" size={'large'} onClick={onReset}>
            <CommonSvg type="reset" className={'etransfer-ui-history-web-filter-reset-icon'} />
            <span className="etransfer-ui-history-web-filter-reset-word">Reset</span>
          </Button>
        )}
      </div>
    </div>
  );
}
