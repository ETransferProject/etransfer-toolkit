import './index.less';
import { Select, DatePicker, Button } from 'antd';
import { useCallback, useMemo } from 'react';
import moment from 'moment';
import { RecordsRequestStatus, RecordsRequestType } from '@etransfer/types';
import { HistoryFilterProps, TRangeValue } from '../types';
import { START_TIME_FORMAT, END_TIME_FORMAT, BusinessTypeOptions, HistoryStatusOptions } from '../../../constants';
import CommonSvg from '../../CommonSvg';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';

export default function HistoryWebFilter({ type, status, timestamp, onReset }: HistoryFilterProps) {
  const handleTypeChange = useCallback((type: RecordsRequestType) => {
    // TODO
    // setMethodFilter(type);
    // dispatch(setSkipCount(1));
    // requestRecordsList();
  }, []);

  const handleStatusChange = useCallback((status: RecordsRequestStatus) => {
    // TODO
    // setStatusFilter(status);
    // dispatch(setSkipCount(1));
    // requestRecordsList();
  }, []);

  const handleDateRangeChange = useCallback((timestamp: TRangeValue) => {
    if (timestamp && timestamp[0] && timestamp[1]) {
      const startTimestampFormat = moment(timestamp[0]).format(START_TIME_FORMAT);
      const endTimestampFormat = moment(timestamp[1]).format(END_TIME_FORMAT);
      // TODO
      // setTimestampFilter([moment(startTimestampFormat).valueOf(), moment(endTimestampFormat).valueOf()]);
      // dispatch(setSkipCount(1));
      // requestRecordsList();
    }
  }, []);

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
    <div className="etransfer-ui-history-web-filter">
      <div className="etransfer-ui-history-web-filter-title">History</div>
      <div className="etransfer-ui-history-web-filter-search-wrapper">
        <Select
          size={'large'}
          value={type}
          className="etransfer-ui-history-web-filter-select-type"
          onChange={handleTypeChange}
          popupClassName={'etransfer-ui-history-web-filter-drop-wrap'}
          options={BusinessTypeOptions}
        />
        <Select
          size={'large'}
          value={status}
          className="etransfer-ui-history-web-filter-select-status"
          onChange={handleStatusChange}
          popupClassName={'etransfer-ui-history-web-filter-drop-wrap'}
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
