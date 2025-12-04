import { IChainMenuItem } from '../../types/chain';
import { ComponentStyle } from '../../types/common';
import { TDynamicArrowSize } from '../DynamicArrow';

type TSelectChainCommon = {
  menuItems: IChainMenuItem[];
  selectedItem?: IChainMenuItem;
  getContainer: string;
  className?: string;
  childrenClassName?: string;
  overlayClassName?: string;
  isBorder?: boolean;
  suffixArrowSize?: TDynamicArrowSize;
  hideDownArrow?: boolean;
};

export interface DeviceSelectChainProps extends TSelectChainCommon {
  onClick: (item: IChainMenuItem) => Promise<void> | void;
}

export interface SelectChainProps extends TSelectChainCommon {
  title: string;
  componentStyle?: ComponentStyle;
  clickCallback: (item: IChainMenuItem) => void;
}
