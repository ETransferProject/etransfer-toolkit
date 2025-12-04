import { TNetworkItem, TTokenItem, TWithdrawInfo } from '@etransfer/types';
import { ComponentStyle, IChainMenuItem } from '../../types';
import { FormInstance } from 'antd';

export interface WithdrawProps {
  className?: string;
  chainClassName?: string;
  fromClassName?: string;
  componentStyle?: ComponentStyle;
  isShowMobilePoweredBy?: boolean;
  isShowErrorTip?: boolean;
  isListenNoticeAuto?: boolean;
  depositProcessingCount?: number;
  isShowProcessingTip?: boolean;
  onClickProcessingTip?: () => void;
  onActionChange?: (data: TWithdrawActionData) => void;
  onLogin?: () => void;
}

export type TWithdrawActionData = {
  symbolSelected: string;
  chainSelected: IChainMenuItem['key'];
  addressInput?: string;
  networkSelected?: string;
  processingTransactionCount?: number;
};

export interface WithdrawFormProps {
  className?: string;
  form: FormInstance<TWithdrawFormValues>;
  formValidateData: TWithdrawFormValidateData;
  address?: string;
  minAmount?: string;
  amount?: string;
  receiveAmount?: string;
  balance?: string;
  withdrawInfo: TWithdrawInfo;
  isShowNetworkLoading?: boolean;
  isNetworkDisable?: boolean;
  isSubmitDisabled?: boolean;
  isBalanceLoading?: boolean;
  isTransactionFeeLoading?: boolean;
  componentStyle?: ComponentStyle;
  isShowMobilePoweredBy?: boolean;
  onTokenChange: (item: TTokenItem) => Promise<void>;
  onAddressChange?: (value: string | null) => void;
  onAddressBlur: () => Promise<void>;
  onNetworkChange: (item: TNetworkItem) => Promise<void>;
  onCommentChange?: (value: string | null) => void;
  onClickMax: () => void;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onAmountBlur: React.ChangeEventHandler<HTMLInputElement>;
  onClickFailedOk: () => void;
  onClickSuccessOk: () => void;
  onLogin?: () => void;
}

export type TWithdrawFormValidateData = {
  [key in WithdrawFormKeys]: { validateStatus: WithdrawValidateStatus; errorMessage: string };
};

export enum WithdrawValidateStatus {
  Error = 'error',
  Warning = 'warning',
  Normal = '',
}

export enum WithdrawFormKeys {
  TOKEN = 'token',
  ADDRESS = 'address',
  NETWORK = 'network',
  AMOUNT = 'amount',
  COMMENT = 'comment',
}

export type TWithdrawFormValues = {
  [WithdrawFormKeys.TOKEN]: string;
  [WithdrawFormKeys.ADDRESS]: string;
  [WithdrawFormKeys.NETWORK]: TNetworkItem;
  [WithdrawFormKeys.AMOUNT]: string;
};
