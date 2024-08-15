import { useCallback, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import Address from '../Address';
import { Popover } from 'antd';
import CommonSvg from '../../../CommonSvg';

export default function WebUserProfile() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Popover
      overlayClassName={'etransfer-ui-web-user-profile'}
      placement="bottomRight"
      content={
        <>
          <Address hideBorder={false} />
        </>
      }
      trigger="click"
      open={isOpen}
      onOpenChange={handleClickChange}>
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-web-user-profile-main-content')}>
        <CommonSvg
          type="user"
          className={clsx('etransfer-ui-flex-none', 'etransfer-ui-web-user-profile-wallet-icon')}
        />
        <span className={'etransfer-ui-web-user-profile-wallet-text'}>My</span>
      </div>
    </Popover>
  );
}
