import './index.less';
import clsx from 'clsx';
import { useCallback } from 'react';
import { openWithBlank } from '../../../../utils';
import CommonSvg from '../../../CommonSvg';

const ETransferSupportUrl = 'https://t.me/etransfer_support';

export default function SupportEntry({ className }: { className?: string }) {
  const handleCLick = useCallback(() => {
    openWithBlank(ETransferSupportUrl);
  }, []);

  return (
    <div className={clsx('etransfer-ui-row-center', 'etransfer-ui-support-entry', className)} onClick={handleCLick}>
      <CommonSvg type="support" />
      <span className={'etransfer-ui-support-entry-text'}>Support</span>
    </div>
  );
}
