import { TNetworkItem, TTokenItem, TWithdrawInfo } from '@etransfer/types';
import { ComponentStyle } from '../../types';
import { FormInstance } from 'antd';

export interface WithdrawProps {
  className?: string;
  chainClassName?: string;
  fromClassName?: string;
  componentStyle?: ComponentStyle;
  isShowErrorTip?: boolean;
}

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
  onTokenChange: (item: TTokenItem) => Promise<void>;
  onAddressChange: (value: string | null) => void;
  onAddressBlur: () => Promise<void>;
  onNetworkChanged: (item: TNetworkItem) => Promise<void>;
  onClickMax: () => void;
  onAmountChange: React.ChangeEventHandler<HTMLInputElement>;
  onAmountBlur: React.ChangeEventHandler<HTMLInputElement>;
  onClickFailedOk: () => void;
  onClickSuccessOk: () => void;
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
}

export type TWithdrawFormValues = {
  [WithdrawFormKeys.TOKEN]: string;
  [WithdrawFormKeys.ADDRESS]: string;
  [WithdrawFormKeys.NETWORK]: TNetworkItem;
  [WithdrawFormKeys.AMOUNT]: string;
};