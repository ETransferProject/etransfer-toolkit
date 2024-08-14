import { Select, DatePicker } from 'antd';
import { useState, useCallback, useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import type { Moment } from 'moment';
import moment from 'moment';
import SimpleTipModal from '../../Modal/SimpleTipModal';
import CommonDrawer from '../../CommonDrawer';
import CommonButton, { CommonButtonType } from '../../CommonButton';
import CommonSvg from '../../CommonSvg';
import { RecordsRequestStatus, RecordsRequestType } from '@etransfer/types';
import {
  BusinessTypeLabel,
  BusinessTypeOptions,
  DEFAULT_NULL_VALUE,
  END_TIME_FORMAT,
  HistoryStatusEnum,
  HistoryStatusOptions,
  START_TIME_FORMAT,
} from '../../../constants';
import { HistoryMobileFilterProps } from '../types';

const dateFormat = 'YYYY-MM-DD';

export default function HistoryMobileFilter({
  type,
  status,
  timestamp,
  onCloseItem,
  onReset,
  onApply,
}: HistoryMobileFilterProps) {
  const [isShowFilterDrawer, setIsShowFilterDrawer] = useState(false);
  const [filterType, setFilterType] = useState<RecordsRequestType>(type);
  const [filterStatus, setFilterStatus] = useState<RecordsRequestStatus>(status);
  const [filterTimestampStart, setFilterTimestampStart] = useState<Moment | null>(
    timestamp?.[0] ? moment(timestamp?.[0]) : null,
  );
  const [filterTimestampEnd, setFilterTimestampEnd] = useState<Moment | null>(
    timestamp?.[1] ? moment(timestamp?.[1]) : null,
  );

  const isShowReset = useMemo(() => {
    if (type !== 0 || status !== 0 || timestamp?.[0] || timestamp?.[1]) {
      return true;
    }
    return false;
  }, [type, status, timestamp]);

  const isShowTimestamp = useCallback(() => {
    let isShow = false;
    if (timestamp?.[0]?.valueOf()) {
      isShow = true;
    }
    if (timestamp?.[1]?.valueOf()) {
      isShow = true;
    }
    return isShow;
  }, [timestamp]);

  const [openTipModal, setOpenTipModal] = useState(false);

  const handleResetFilter = useCallback(() => {
    onReset();
    setIsShowFilterDrawer(false);
  }, [onReset]);

  const handleApplyFilter = useCallback(() => {
    const start = moment(filterTimestampStart).valueOf();
    const end = moment(filterTimestampEnd).valueOf();
    const timeIsNaN = isNaN(start) || isNaN(end);
    const oneTimeIsNaN = (isNaN(start) && !isNaN(end)) || (!isNaN(start) && isNaN(end));

    if (oneTimeIsNaN) {
      setOpenTipModal(true);
      return;
    }

    // format
    const startTimestampFormat = moment(moment(filterTimestampStart).format(START_TIME_FORMAT)).valueOf();
    const endTimestampFormat = moment(moment(filterTimestampEnd).format(END_TIME_FORMAT)).valueOf();

    onApply({
      type: filterType,
      status: filterStatus,
      timeArray: timeIsNaN ? null : [startTimestampFormat, endTimestampFormat],
    });

    setIsShowFilterDrawer(false);
  }, [filterTimestampStart, filterTimestampEnd, onApply, filterType, filterStatus]);

  const handleOpenFilterDrawer = useCallback(() => {
    setFilterType(type);
    setFilterStatus(status);
    setFilterTimestampStart(timestamp?.[0] ? moment(timestamp[0]) : null);
    setFilterTimestampEnd(timestamp?.[1] ? moment(timestamp?.[1]) : null);

    setIsShowFilterDrawer(true);
  }, [type, status, timestamp]);

  return (
    <div className={clsx('etransfer-ui-history-mobile-filter-wrapper')}>
      <div className="etransfer-ui-history-mobile-filter-item-wrapper">
        <CommonSvg type="filter" className="etransfer-ui-history-mobile-filter-icon" onClick={handleOpenFilterDrawer} />
        {type !== RecordsRequestType.All && (
          <div className="etransfer-ui-history-mobile-filter-item">
            {type === RecordsRequestType.Deposit && BusinessTypeLabel.Deposit}
            {type === RecordsRequestType.Withdraw && BusinessTypeLabel.Withdraw}
            <CommonSvg
              type="closeSmall"
              className="etransfer-ui-history-mobile-filter-close-icon"
              onClick={() => onCloseItem('type')}
            />
          </div>
        )}
        {status !== RecordsRequestStatus.All && (
          <div className="etransfer-ui-history-mobile-filter-item">
            {status === RecordsRequestStatus.Processing && HistoryStatusEnum.Processing}
            {status === RecordsRequestStatus.Succeed && HistoryStatusEnum.Succeed}
            {status === RecordsRequestStatus.Failed && HistoryStatusEnum.Failed}
            <CommonSvg
              type="closeSmall"
              className="etransfer-ui-history-mobile-filter-close-icon"
              onClick={() => onCloseItem('status')}
            />
          </div>
        )}
        {isShowTimestamp() && (
          <div className="etransfer-ui-history-mobile-filter-item">
            {(timestamp?.[0] && moment(timestamp[0]).format(dateFormat)) || `${DEFAULT_NULL_VALUE}`}
            {' - '}
            {(timestamp?.[1] && moment(timestamp[1]).format(dateFormat)) || `${DEFAULT_NULL_VALUE}`}
            <CommonSvg
              type="closeSmall"
              className="etransfer-ui-history-mobile-filter-close-icon"
              onClick={() => onCloseItem('timestamp')}
            />
          </div>
        )}
        {isShowReset && (
          <div className={clsx('etransfer-ui-history-mobile-filter-reset')} onClick={handleResetFilter}>
            Reset
          </div>
        )}
      </div>
      <CommonDrawer
        open={isShowFilterDrawer}
        height={'100%'}
        title={<div className="etransfer-ui-history-mobile-filter-title">Filters</div>}
        id="etransferHistoryMobileFilterDrawer"
        className="etransfer-ui-history-mobile-filter-drawer-wrapper"
        destroyOnClose
        placement={'right'}
        footer={
          <div className="etransfer-ui-history-mobile-drawer-button-wrapper">
            <CommonButton
              className="etransfer-ui-history-mobile-cancel-button"
              type={CommonButtonType.Secondary}
              onClick={handleResetFilter}>
              {'Reset'}
            </CommonButton>
            <CommonButton className="etransfer-ui-history-mobile-ok-button" onClick={() => handleApplyFilter()}>
              {'Apply'}
            </CommonButton>
          </div>
        }
        onClose={() => setIsShowFilterDrawer(!isShowFilterDrawer)}>
        <div className="etransfer-ui-history-mobile-filter-drawer-content">
          <div className="etransfer-ui-history-mobile-filter-drawer-label">Methods</div>
          <Select
            size={'large'}
            value={filterType}
            className={clsx(
              'etransfer-ui-history-mobile-records-select-type',
              'etransfer-ui-history-mobile-border-change',
            )}
            onChange={setFilterType}
            popupClassName="etransfer-ui-history-mobile-drop-wrap"
            options={BusinessTypeOptions}
          />
          <div className="etransfer-ui-history-mobile-filter-drawer-label">Status</div>
          <Select
            size={'large'}
            value={filterStatus}
            className={clsx(
              'etransfer-ui-history-mobile-records-select-status',
              'etransfer-ui-history-mobile-border-change',
            )}
            onChange={setFilterStatus}
            popupClassName="etransfer-ui-history-mobile-drop-wrap"
            options={HistoryStatusOptions}
          />
          <div className="etransfer-ui-history-mobile-filter-drawer-label">Start time</div>
          <DatePicker
            inputReadOnly={true}
            size={'large'}
            allowClear={false}
            value={filterTimestampStart}
            className={clsx('etransfer-ui-history-mobile-records-range-picker')}
            format={dateFormat}
            onChange={setFilterTimestampStart}
            showTime={false}
            placeholder={'please choose the start time'}
          />
          <div className="etransfer-ui-history-mobile-filter-drawer-label">End time</div>
          <DatePicker
            inputReadOnly={true}
            size={'large'}
            allowClear={false}
            value={filterTimestampEnd}
            className={clsx('etransfer-ui-history-mobile-records-range-picker')}
            format={dateFormat}
            onChange={setFilterTimestampEnd}
            showTime={false}
            placeholder={'please choose the end time'}
          />
        </div>
      </CommonDrawer>

      <SimpleTipModal
        open={openTipModal}
        getContainer="#etransferHistoryMobileFilterDrawer"
        content={'Please select another time!'}
        onOk={() => setOpenTipModal(false)}
      />
    </div>
  );
}
