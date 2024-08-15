import { useEffect, useState } from 'react';
import clsx from 'clsx';
import './index.less';
import Address from '../Address';
import { TelegramPlatform } from '../../../../utils';
import CommonDrawer from '../../../CommonDrawer';
import CommonSvg from '../../../CommonSvg';

export default function MobileUserProfile() {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isShowAddress, setIsShowAddress] = useState<boolean>(true);

  const handleChangeAddress = () => {
    setIsShowAddress(!isShowAddress);
  };

  const [isTelegramPlatform, setIsTelegramPlatform] = useState(false);

  useEffect(() => {
    const res = TelegramPlatform.isTelegramPlatform();

    setIsTelegramPlatform(res);
  }, []);

  return (
    <>
      <div
        className={clsx('etransfer-ui-flex-none', 'etransfer-ui-flex-center', 'etransfer-ui-mobile-user-profile')}
        onClick={() => {
          setIsDrawerOpen(true);
        }}>
        <CommonSvg type="user" className={'etransfer-ui-flex-none'} />
      </div>
      <CommonDrawer
        className={clsx('etransfer-ui-mobile-user-profile-drawer', 'etransfer-ui-mobile-user-profile-drawer-weight')}
        title={
          <div className={'etransfer-ui-mobile-user-profile-drawer-title-wrapper'}>
            <span className={'etransfer-ui-mobile-user-profile-drawer-title'}>My</span>
          </div>
        }
        height={isTelegramPlatform ? '80%' : '100%'}
        zIndex={301}
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}>
        <div className={'etransfer-ui-mobile-user-profile-drawer-user-wrapper'}>
          <div className={'etransfer-ui-mobile-user-profile-drawer-top-wrapper'}>
            <div
              className={clsx(
                'etransfer-ui-mobile-user-profile-drawer-address-wrapper',
                isShowAddress && 'etransfer-ui-mobile-user-profile-drawer-address-show',
              )}
              onClick={() => handleChangeAddress()}>
              <span className={'etransfer-ui-mobile-user-profile-drawer-address'}>My Address</span>
              <CommonSvg
                type="down"
                className={
                  isShowAddress
                    ? 'etransfer-ui-mobile-user-profile-drawer-icon-up'
                    : 'etransfer-ui-mobile-user-profile-drawer-icon-right'
                }
              />
            </div>
            {isShowAddress && (
              <div
                className={clsx(
                  'etransfer-ui-mobile-user-profile-drawer-address-content',
                  !isTelegramPlatform && 'etransfer-ui-mobile-user-profile-drawer-address-content-border',
                )}>
                <Address hideBorder={true} />
              </div>
            )}
          </div>
        </div>
      </CommonDrawer>
    </>
  );
}
