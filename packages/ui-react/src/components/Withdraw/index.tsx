import { Form } from 'antd';
import { ComponentStyle, IChainMenuItem } from '../../types';
import { TWithdrawFormValues, WithdrawFormKeys, WithdrawProps, WithdrawValidateStatus } from './types';
import { WithdrawForm } from './WithdrawForm';
import { useCallback, useState } from 'react';
import WithdrawSelectChain from '../SelectChain/WithdrawSelectChain';
import { useETransferWithdraw } from '../../context/ETransferWithdrawProvider';
import { TNetworkItem, TTokenItem, TWithdrawInfo } from '@etransfer/types';
import { INITIAL_WITHDRAW_INFO } from '../../constants';

export default function Withdraw({
  className,
  chainClassName,
  fromClassName,
  componentStyle = ComponentStyle.Web,
  isShowErrorTip = true,
}: WithdrawProps) {
  const [form] = Form.useForm<TWithdrawFormValues>();
  const [formValidateData, setFormValidateData] = useState<{
    [key in WithdrawFormKeys]: { validateStatus: WithdrawValidateStatus; errorMessage: string };
  }>({
    [WithdrawFormKeys.TOKEN]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
    [WithdrawFormKeys.ADDRESS]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
    [WithdrawFormKeys.NETWORK]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
    [WithdrawFormKeys.AMOUNT]: { validateStatus: WithdrawValidateStatus.Normal, errorMessage: '' },
  });

  const [{ tokenSymbol, tokenList, chainItem, chainList }, { dispatch }] = useETransferWithdraw();
  const [withdrawInfo, setWithdrawInfo] = useState<TWithdrawInfo>(INITIAL_WITHDRAW_INFO);
  const [amount, setAmount] = useState('0');
  const [balance, setBalance] = useState('');

  const handleChainChanged = useCallback(() => {
    console.log('');
  }, []);

  const handleTokenChange = useCallback(async (item: TTokenItem) => {
    console.log(item);
  }, []);

  const handleAddressChange = useCallback(() => {
    console.log('');
  }, []);

  const handleAddressBlur = useCallback(async () => {
    console.log('');
  }, []);

  const handleNetworkChanged = useCallback(async (item: TNetworkItem) => {
    console.log(item);
  }, []);
  const handleClickMax = useCallback(async () => {
    console.log('');
  }, []);
  const handleAmountChange = useCallback(async (event: any) => {
    console.log(event);
  }, []);
  const handleAmountBlur = useCallback(async (event: any) => {
    console.log(event);
  }, []);
  const handleClickFailedOk = useCallback(async () => {
    console.log('');
  }, []);
  const handleClickSuccessOk = useCallback(async () => {
    console.log('');
  }, []);

  return (
    <div className={className}>
      <WithdrawSelectChain
        className={chainClassName}
        mobileTitle="Withdraw from"
        mobileLabel="from"
        webLabel={'Withdraw Assets from'}
        menuItems={chainList || []}
        componentStyle={componentStyle}
        chainChanged={handleChainChanged}
      />
      <WithdrawForm
        form={form}
        className={fromClassName}
        formValidateData={formValidateData}
        componentStyle={componentStyle}
        balance={balance}
        onTokenChange={handleTokenChange}
        onAddressChange={handleAddressChange}
        onAddressBlur={handleAddressBlur}
        withdrawInfo={withdrawInfo}
        onNetworkChanged={handleNetworkChanged}
        onClickMax={handleClickMax}
        onAmountChange={handleAmountChange}
        onAmountBlur={handleAmountBlur}
        onClickFailedOk={handleClickFailedOk}
        onClickSuccessOk={handleClickSuccessOk}
      />
    </div>
  );
}
