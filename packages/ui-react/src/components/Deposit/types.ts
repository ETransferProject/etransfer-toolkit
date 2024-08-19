import { TTokenOptionItem, TNetworkItem, TDepositInfo, TToTokenItem } from '@etransfer/types';
import { IChainMenuItem } from '../../types/chain';
import { ComponentStyle } from '../../types/common';
import { ChainId } from '@portkey/types';

export interface DepositSelectGroupProps {
  className?: string;
  depositTokenList: TTokenOptionItem[];
  depositTokenSelected?: TTokenOptionItem;
  depositTokenSelectCallback: (item: TTokenOptionItem) => void;
  networkList: TNetworkItem[];
  networkSelected?: Partial<TNetworkItem>;
  isShowNetworkLoading: boolean;
  networkSelectCallback: (item: TNetworkItem) => Promise<void>;
  chainList: IChainMenuItem[];
  chainSelected?: IChainMenuItem;
  chainChanged: (item: IChainMenuItem) => void;
  receiveTokenList: TTokenOptionItem[];
  receiveTokenSelected?: TTokenOptionItem;
  receiveTokenSelectCallback: (item: TTokenOptionItem) => void;
}

export interface DepositProps {
  containerClassName?: string;
  className?: string;
  componentStyle?: ComponentStyle;
  isShowErrorTip?: boolean;
}

export interface DepositDetailProps {
  className?: string;
  componentStyle?: ComponentStyle;
  isShowErrorTip?: boolean;
  chainItem?: IChainMenuItem;
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
  networkItem?: Partial<TNetworkItem>;
}

export type TDepositForMobileProps = DepositSelectGroupProps &
  Omit<
    DepositDetailForMobileProps,
    'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol' | 'networkItem'
  >;

export type TDepositForWebProps = DepositSelectGroupProps &
  Omit<DepositDetailProps, 'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol'>;

export type TGetNetworkData = {
  chainId: ChainId;
  symbol?: string;
  toSymbol?: string;
};

export interface DepositTokenOptionItem extends TTokenOptionItem {
  toTokenList?: Array<DepositReceiveTokenItem>;
}

export interface DepositReceiveTokenItem extends TToTokenItem {
  chainList?: IChainMenuItem[];
}
