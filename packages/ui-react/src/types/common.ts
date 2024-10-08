import svgList from '../assets/svgs';

export enum ComponentStyle {
  Web = 'Web',
  Mobile = 'Mobile',
}

// SideMenuKey must bind BusinessType
export enum SideMenuKey {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  History = 'History',
}

export enum PageKey {
  Deposit = 'Deposit',
  Withdraw = 'Withdraw',
  History = 'History',
  TransferDetail = 'TransferDetail',
}

export type TSvgListType = keyof typeof svgList;

export type TMenuItem = {
  iconType: TSvgListType;
  key: SideMenuKey;
  label: SideMenuKey;
};
