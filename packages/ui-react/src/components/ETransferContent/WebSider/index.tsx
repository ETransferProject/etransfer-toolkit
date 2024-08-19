import { Space } from 'antd';
import clsx from 'clsx';
import './index.less';
import { SideMenuKey } from '../../../types';
import { etransferEvents } from '@etransfer/utils';
import { MENU_ITEMS } from '../../../constants';
import CommonSvg from '../../CommonSvg';

export interface WebSiderProps {
  activeMenuKey: SideMenuKey;
  isUnreadHistory: boolean;
  onChange: (key: SideMenuKey) => void;
}

export default function WebSider({ activeMenuKey, isUnreadHistory, onChange }: WebSiderProps) {
  return (
    <div className={clsx('etransfer-ui-flex-column-between', 'etransfer-ui-web-sider')}>
      <Space className={'etransfer-ui-web-sider-menu'} direction="vertical">
        {MENU_ITEMS.map((item) => {
          return (
            <div
              key={item.key}
              className={clsx(
                'etransfer-ui-cursor-pointer',
                'etransfer-ui-flex-row-center',
                'etransfer-ui-web-sider-menu-item',
                {
                  ['etransfer-ui-web-sider-menu-item-active']: item.key === activeMenuKey,
                },
              )}
              onClick={() => {
                if (item.key === SideMenuKey.History && isUnreadHistory) {
                  etransferEvents.RefreshHistoryData.emit();
                }
                onChange(item.key);
              }}>
              <CommonSvg
                type={item.iconType}
                className={clsx('etransfer-ui-flex-none', 'etransfer-ui-web-sider-menu-item-icon')}
              />
              <span className={'etransfer-ui-web-sider-menu-item-label'}>{item.label}</span>
              {isUnreadHistory && item.key === SideMenuKey.History && (
                <span className={'etransfer-ui-web-sider-menu-item-red-dot'} />
              )}
            </div>
          );
        })}
      </Space>
    </div>
  );
}
