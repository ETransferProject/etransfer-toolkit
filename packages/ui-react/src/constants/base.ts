import { SideMenuKey, TMenuItem } from '../types';

export const ETRANSFER_WEBSITE_URL = 'https://etransfer.exchange';
export const ETRANSFER_WEB_PAGE = 'https://app.etransfer.exchange';
export const ETRANSFER_WEB_PAGE_TESTNET = 'https://test-app.etransfer.exchange';
export const ETRANSFER_ROOT_ID = 'etransfer-ui-root';
export const ETRANSFER_PREFIX_CLS = 'etransfer-ant';
export const ETRANSFER_PREFIX_CLS_MESSAGE = 'etransfer-ant-message';
export const ETRANSFER_ICON_PREFIX_CLS = 'etransfer-ant-icon';

export const DEFAULT_NULL_VALUE = '--';

export const PAD_PX = 1024;
export const MOBILE_PX = 768;

export const MENU_ITEMS: TMenuItem[] = [
  {
    iconType: 'deposit',
    key: SideMenuKey.Deposit,
    label: SideMenuKey.Deposit,
  },
  {
    iconType: 'withdraw',
    key: SideMenuKey.Withdraw,
    label: SideMenuKey.Withdraw,
  },
  {
    iconType: 'history',
    key: SideMenuKey.History,
    label: SideMenuKey.History,
  },
];
