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
  onConnect?: () => void;
}

export interface DepositProps {
  containerClassName?: string;
  className?: string;
  componentStyle?: ComponentStyle;
  isShowErrorTip?: boolean;
  isShowMobilePoweredBy?: boolean;
  isListenNoticeAuto?: boolean;
  isShowProcessingTip?: boolean;
  withdrawProcessingCount?: number;
  customDescriptionNode?: React.ReactNode;
  renderDepositTip?: (fromToken: string, toToken: string) => React.ReactNode;
  onClickProcessingTip?: () => void;
  onActionChange?: (data: TDepositActionData) => void;
  onConnect?: () => void;
}

export type TDepositActionData = {
  depositSymbolSelected: string;
  receiveSymbolSelected: string;
  chainSelected: IChainMenuItem['key'];
  networkSelected?: string;
  processingTransactionCount?: number;
};

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
  isCheckTxnLoading?: boolean;
  isShowNotLoginTip?: boolean;
  customDescriptionNode?: React.ReactNode;
  renderDepositTip?: (fromToken: string, toToken: string) => React.ReactNode;
  onRetry?: () => void;
  onCheckTxnClick?: () => void;
  onLogin?: () => void;
}

export interface DepositDetailForMobileProps extends DepositDetailProps {
  networkItem?: Partial<TNetworkItem>;
}

export type TDepositForMobileProps = DepositSelectGroupProps & {
  isShowPoweredBy?: boolean;
  isShowProcessingTip?: boolean;
  depositProcessingCount?: number;
  withdrawProcessingCount?: number;
  onClickProcessingTip?: () => void;
} & Omit<
    DepositDetailForMobileProps,
    'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol' | 'networkItem'
  >;

export type TDepositForWebProps = DepositSelectGroupProps & {
  isShowProcessingTip?: boolean;
  depositProcessingCount?: number;
  withdrawProcessingCount?: number;
  onClickProcessingTip?: () => void;
} & Omit<DepositDetailProps, 'chainItem' | 'depositTokenSymbol' | 'depositTokenDecimals' | 'receiveTokenSymbol'>;

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
