import { useState } from 'react';
import clsx from 'clsx';
import './index.less';
import { Collapse } from 'antd';
import { MENU_ITEMS } from '../../../constants';
import { SideMenuKey } from '../../../types';
import CommonDrawer from '../../CommonDrawer';
import LinkForBlank from '../../LinkForBlank';
import CommonSvg from '../../CommonSvg';
import { etransferEvents } from '@etransfer/utils';
import { FOOTER_CONFIG } from '../../../constants/footer';

export interface MobileSelectMenuProps {
  activeMenuKey: SideMenuKey;
  isUnreadHistory: boolean;
  isShowFooter?: boolean;
  onChange: (key: SideMenuKey) => void;
}

export default function MobileHeaderSelectMenu({
  activeMenuKey,
  isUnreadHistory,
  isShowFooter = true,
  onChange,
}: MobileSelectMenuProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [activePanel, setActivePanel] = useState<string | string[]>([]);

  return (
    <>
      <div
        className={clsx(
          'etransfer-ui-flex-none',
          'etransfer-ui-flex-row-center',
          'etransfer-ui-mobile-header-select-menu',
        )}
        onClick={() => {
          setIsDrawerOpen(true);
        }}>
        <CommonSvg type="menuOutline" />
      </div>
      <CommonDrawer
        zIndex={301}
        className={clsx('etransfer-ui-mobile-header-select-menu-drawer')}
        height="100%"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}>
        <div className={clsx('etransfer-ui-flex-column', 'etransfer-ui-mobile-header-select-menu-drawer-body')}>
          <div>
            {MENU_ITEMS.map((item) => {
              return (
                <div
                  key={item.key}
                  className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-mobile-header-select-menu-item', {
                    ['etransfer-ui-mobile-header-select-menu-item-active']: item.key === activeMenuKey,
                  })}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    if (item.key === SideMenuKey.History && isUnreadHistory) {
                      etransferEvents.RefreshHistoryData.emit();
                    }
                    onChange(item.key);
                  }}>
                  <CommonSvg type={item.iconType} className={'etransfer-ui-mobile-header-select-menu-item-icon'} />

                  <div className={'etransfer-ui-mobile-header-select-menu-item-label'}>
                    {item.label}
                    {isUnreadHistory && item.key === SideMenuKey.History && (
                      <span className={'etransfer-ui-mobile-header-select-menu-item-red-dot'} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isShowFooter && (
            <>
              <div className={'etransfer-ui-mobile-header-select-menu-divider'} />
              <div className={'etransfer-ui-mobile-header-select-menu-footer'}>
                <LinkForBlank
                  href={FOOTER_CONFIG.faq.link}
                  className={'etransfer-ui-mobile-header-select-menu-menu-second-item'}
                  ariaLabel="FAQ"
                  element={
                    <div
                      className={clsx(
                        'etransfer-ui-flex-row-center',
                        'etransfer-ui-mobile-header-select-menu-footer-item-faq',
                      )}>
                      <CommonSvg type={FOOTER_CONFIG.faq.iconType} />
                      <span className={'etransfer-ui-mobile-header-select-menu-footer-item-faq-name'}>
                        {FOOTER_CONFIG.faq.name}
                      </span>
                    </div>
                  }
                />

                <Collapse
                  ghost
                  expandIconPosition="end"
                  onChange={(res) => {
                    setActivePanel(res);
                  }}>
                  {FOOTER_CONFIG.menus.map((menu) => {
                    return (
                      <Collapse.Panel
                        key={'footerMenus' + menu.group}
                        className={'etransfer-ui-mobile-header-select-menu-footer-item'}
                        forceRender={true}
                        showArrow={false}
                        header={
                          <div className="etransfer-ui-flex-row-center-between">
                            <div>
                              <span
                                className={clsx(
                                  'etransfer-ui-flex-row-center',
                                  'etransfer-ui-mobile-header-select-menu-footer-item-group',
                                )}>
                                <CommonSvg type={menu.iconType} />
                                <span className={'etransfer-ui-mobile-header-select-menu-footer-item-group-name'}>
                                  {menu.group}
                                </span>
                              </span>
                            </div>
                            <CommonSvg
                              type="down"
                              className={
                                activePanel?.includes('footerMenus' + menu.group)
                                  ? 'etransfer-ui-mobile-header-select-menu-arrow-down'
                                  : ''
                              }
                            />
                          </div>
                        }>
                        {menu.items.map((secondMenu) => {
                          return (
                            <LinkForBlank
                              key={'footerSecondMenu' + secondMenu.name}
                              href={secondMenu.link}
                              className={'etransfer-ui-mobile-header-select-menu-footer-second-wrapper'}
                              ariaLabel={secondMenu.name}
                              element={
                                <div
                                  className={clsx(
                                    'etransfer-ui-flex-row-center-between',
                                    'etransfer-ui-mobile-header-select-menu-footer-second-item',
                                  )}>
                                  <div className="etransfer-ui-flex-row-center">
                                    {secondMenu.iconBigType && (
                                      <span
                                        className={clsx(
                                          'etransfer-ui-flex-row-center',
                                          'etransfer-ui-mobile-header-select-menu-second-item-icon',
                                        )}>
                                        <CommonSvg type={secondMenu.iconBigType} />
                                      </span>
                                    )}
                                    <span className={'etransfer-ui-mobile-header-select-menu-second-item-name'}>
                                      {secondMenu.name}
                                    </span>
                                  </div>
                                  <CommonSvg type="exploreLink" />
                                </div>
                              }
                            />
                          );
                        })}
                      </Collapse.Panel>
                    );
                  })}
                </Collapse>
              </div>
            </>
          )}
        </div>
      </CommonDrawer>
    </>
  );
}
