import { TTokenOptionItem, TNetworkItem, TDepositInfo } from '@etransfer/types';
import { IChainMenuItem } from '../../types/chain';
import { ComponentStyle } from '../../types/common';

export interface DepositSelectGroupProps {
  depositTokenList: TTokenOptionItem[];
  depositTokenSelected: TTokenOptionItem;
  depositTokenSelectCallback: (item: TTokenOptionItem) => void;
  networkList: TNetworkItem[];
  networkSelected: TNetworkItem;
  isShowNetworkLoading: boolean;
  networkSelectCallback: (item: TNetworkItem) => Promise<void>;
  chainList: IChainMenuItem[];
  chainSelected: IChainMenuItem;
  chainChanged: (item: IChainMenuItem) => void;
  receiveTokenList: TTokenOptionItem[];
  receiveTokenSelected: TTokenOptionItem;
  receiveTokenSelectCallback: (item: TTokenOptionItem) => void;
}

export interface DepositProps {
  componentStyle?: ComponentStyle;
}

export interface DepositDetailProps {
  chainItem: IChainMenuItem;
  depositTokenSymbol: string;
  depositTokenDecimals: number;
  receiveTokenSymbol: string;
  depositInfo: TDepositInfo;
  contractAddress: string;
  contractAddressLink: string;
  qrCodeValue: string;
  tokenLogoUrl?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export interface DepositDetailForMobileProps extends DepositDetailProps {
  networkItem: TNetworkItem;
  onNext: () => Promise<void>;
}

export type TDepositForMobileProps = DepositSelectGroupProps &
  Omit<
    DepositDetailForMobileProps,
    'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol' | 'networkItem'
  >;

export type TDepositForWebProps = DepositSelectGroupProps &
  Omit<DepositDetailProps, 'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol'>;
