import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';

export interface EmptyDataProps {
  emptyText?: string;
}

export default function EmptyData({ emptyText = 'No found' }: EmptyDataProps) {
  return (
    <div className={clsx('etransfer-ui-empty-data')}>
      <CommonSvg type="emptyBox" />
      {emptyText}
    </div>
  );
}
