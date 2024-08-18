import { useCallback, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import AccountAddress, { AccountAddressProps } from '../AccountAddress';
import { Popover } from 'antd';
import CommonSvg from '../../../CommonSvg';

export interface WebUserProfileProps {
  accountList: AccountAddressProps['accountList'];
}

export default function WebUserProfile({ accountList }: WebUserProfileProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickChange = useCallback((open: boolean) => {
    setIsOpen(open);
  }, []);

  return (
    <Popover
      overlayClassName={'etransfer-ui-web-user-profile'}
      placement="bottomRight"
      content={<AccountAddress hideBorder={false} accountList={accountList} />}
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
