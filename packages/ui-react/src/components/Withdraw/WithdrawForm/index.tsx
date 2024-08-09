import { Form } from 'antd';
import { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import { WithdrawFormKeys, WithdrawFormProps } from '../types';
import { MEMO_REG, sleep } from '@etransfer/utils';
import { devices } from '@portkey/utils';
import {
  formatSymbolDisplay,
  formatWithCommas,
  getAccountAddress,
  getNetworkType,
  parseWithStringCommas,
} from '../../../utils';
import WithdrawFooter from '../WithdrawFooter';
import WithdrawSelectToken from '../../SelectToken/WithdrawSelectToken';
import { useETransferWithdraw } from '../../../context/ETransferWithdrawProvider';
import { BlockchainNetworkType, CONTRACT_ADDRESS, INITIAL_WITHDRAW_STATE } from '../../../constants';
import FormTextarea from '../../Form/FormTextarea';
import WithdrawSelectNetwork from '../../SelectNetwork/WithdrawSelectNetwork';
import { ComponentStyle } from '../../../types';
import { TelegramPlatform } from '../../../utils/telegram/TelegramPlatform';
import { ContractAddressForMobile, ContractAddressForWeb } from '../ContractAddress';
import RemainingLimit from '../RemainingLimit';
import FormAmountInput from '../../Form/FormAmountInput';
import PartialLoading from '../../PartialLoading';
import CommentFormItemLabel from '../CommentFormItemLabel';

export default function WithdrawForm({
  className,
  form,
  formValidateData,
  address,
  minAmount,
  receiveAmount,
  amount,
  balance,
  withdrawInfo,
  isShowNetworkLoading = false,
  isNetworkDisable = false,
  isSubmitDisabled = false,
  isTransactionFeeLoading = false,
  isBalanceLoading = false,
  componentStyle = ComponentStyle.Web,
  onTokenChange,
  onAddressChange,
  onAddressBlur,
  onNetworkChange,
  onCommentChange,
  onClickMax,
  onAmountChange,
  onAmountBlur,
  onClickFailedOk,
  onClickSuccessOk,
}: WithdrawFormProps) {
  const isAndroid = devices.isMobile().android;
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);
  const [{ tokenSymbol, tokenList, chainItem, networkList, networkItem }] = useETransferWithdraw();

  const currentToken = useMemo(() => {
    const item = tokenList?.find((item) => item.symbol === tokenSymbol);
    return item?.symbol ? item : INITIAL_WITHDRAW_STATE.tokenList[0];
  }, [tokenList, tokenSymbol]);

  const currentTokenDecimal = useMemo(() => currentToken.decimals, [currentToken.decimals]);

  const renderBalance = useMemo(() => {
    return (
      <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-form-balance-wrapper')}>
        <div className={'etransfer-ui-withdraw-form-info-label'}>Balance</div>
        <div className={'etransfer-ui-withdraw-form-info-value'}>
          {!balance || isBalanceLoading ? <PartialLoading /> : `${balance} ${formatSymbolDisplay(tokenSymbol)}`}
        </div>
      </div>
    );
  }, [balance, isBalanceLoading, tokenSymbol]);

  const getCommentInput = useCallback(() => {
    return form.getFieldValue(WithdrawFormKeys.COMMENT)?.trim();
  }, [form]);

  return (
    <Form className={clsx('etransfer-ui-withdraw-form', className)} layout="vertical" requiredMark={false} form={form}>
      <div className={'etransfer-ui-withdraw-form-item-wrapper'}>
        <Form.Item
          className={'etransfer-ui-withdraw-form-item'}
          label="Withdrawal Token"
          name={WithdrawFormKeys.TOKEN}
          validateStatus={formValidateData[WithdrawFormKeys.TOKEN].validateStatus}
          help={formValidateData[WithdrawFormKeys.TOKEN].errorMessage}>
          <WithdrawSelectToken
            componentStyle={componentStyle}
            selected={currentToken}
            selectCallback={onTokenChange}
            tokenList={tokenList || []}
            chainItem={chainItem}
            networkType={getNetworkType()}
            accountAddress={getAccountAddress(chainItem.key)}
          />
        </Form.Item>
      </div>
      <div className={'etransfer-ui-withdraw-form-item-wrapper'}>
        <Form.Item
          className={'etransfer-ui-withdraw-form-item'}
          label="Withdrawal Address"
          name={WithdrawFormKeys.ADDRESS}
          validateStatus={formValidateData[WithdrawFormKeys.ADDRESS].validateStatus}
          help={formValidateData[WithdrawFormKeys.ADDRESS].errorMessage}>
          <FormTextarea
            onChange={onAddressChange}
            onBlur={onAddressBlur}
            textareaProps={{
              placeholder: 'Enter an address',
            }}
            autoSize={{ maxRows: 2 }}
          />
        </Form.Item>
      </div>
      <div className={'etransfer-ui-withdraw-form-item-wrapper'}>
        <Form.Item
          className={'etransfer-ui-withdraw-form-item'}
          label="Withdrawal Network"
          name={WithdrawFormKeys.NETWORK}
          validateStatus={formValidateData[WithdrawFormKeys.NETWORK].validateStatus}
          help={formValidateData[WithdrawFormKeys.NETWORK].errorMessage}>
          <WithdrawSelectNetwork
            componentStyle={componentStyle}
            networkList={networkList || []}
            selected={networkItem}
            isDisabled={isNetworkDisable}
            isShowLoading={isShowNetworkLoading}
            selectCallback={onNetworkChange}
          />
        </Form.Item>
        {!isMobileStyle && !!networkItem?.contractAddress && (
          <ContractAddressForWeb
            label={CONTRACT_ADDRESS}
            address={networkItem.contractAddress}
            explorerUrl={networkItem?.explorerUrl}
          />
        )}
      </div>

      {networkItem?.network === BlockchainNetworkType.TON && (
        <div className={'etransfer-ui-withdraw-form-item-wrapper'}>
          <Form.Item
            className={'etransfer-ui-withdraw-form-item'}
            label={<CommentFormItemLabel componentStyle={componentStyle} />}
            name={WithdrawFormKeys.COMMENT}
            validateStatus={formValidateData[WithdrawFormKeys.COMMENT].validateStatus}
            help={formValidateData[WithdrawFormKeys.COMMENT].errorMessage}>
            <FormAmountInput
              placeholder="Enter comment"
              autoComplete="off"
              onChange={(e) => onCommentChange?.(e.target.value)}
              onInput={(event: any) => {
                const value = event.target?.value?.trim();
                const oldValue = form.getFieldValue(WithdrawFormKeys.COMMENT);

                // CHECK1: not empty
                if (!value) return (event.target.value = '');

                // CHECK2: memo reg
                const CheckMemoReg = new RegExp(MEMO_REG);
                if (!CheckMemoReg.exec(value)) {
                  event.target.value = oldValue;
                  return;
                } else {
                  event.target.value = value;
                  return;
                }
              }}
            />
          </Form.Item>
        </div>
      )}

      <div
        className={clsx('etransfer-ui-withdraw-form-item-wrapper', 'etransfer-ui-withdraw-form-amount-item-wrapper')}>
        <Form.Item
          className={'etransfer-ui-withdraw-form-item'}
          label={
            <div className={clsx('etransfer-ui-flex-row-between', 'etransfer-ui-withdraw-form-label-wrapper')}>
              <span className={'etransfer-ui-withdraw-form-label'}>Withdrawal Amount</span>
              {!isMobileStyle && (
                <RemainingLimit
                  limitCurrency={withdrawInfo.limitCurrency}
                  remainingLimit={withdrawInfo.remainingLimit}
                  totalLimit={withdrawInfo.totalLimit}
                  componentStyle={ComponentStyle.Web}
                />
              )}
            </div>
          }
          name={WithdrawFormKeys.AMOUNT}
          validateStatus={formValidateData[WithdrawFormKeys.AMOUNT].validateStatus}
          help={formValidateData[WithdrawFormKeys.AMOUNT].errorMessage}>
          <FormAmountInput
            componentStyle={componentStyle}
            unit={withdrawInfo.transactionUnit}
            maxButtonConfig={{
              onClick: onClickMax,
            }}
            autoComplete="off"
            placeholder={`Minimum: ${minAmount}`}
            onInput={(event: any) => {
              const value = event.target?.value?.trim();
              const oldValue = form.getFieldValue(WithdrawFormKeys.AMOUNT);

              // CHECK1: not empty
              if (!value) return (event.target.value = '');

              // CHECK2: comma count
              const commaCount = value.match(/\./gim)?.length;
              if (commaCount > 1) {
                return (event.target.value = oldValue);
              }

              // CHECK3: input number and decimal count
              const lastNumber = value.charAt(value.length - 1);
              const valueNotComma = parseWithStringCommas(value);
              const stringReg = `^[0-9]{1,9}((\\.\\d)|(\\.\\d{0,${currentTokenDecimal}}))?$`;
              const CheckNumberReg = new RegExp(stringReg);

              if (!CheckNumberReg.exec(valueNotComma)) {
                if (lastNumber !== '.') {
                  return (event.target.value = oldValue);
                }
              } else {
                const beforePoint = formatWithCommas({ amount: valueNotComma });
                const afterPoint = lastNumber === '.' ? '.' : '';
                event.target.value = beforePoint + afterPoint;
              }
            }}
            onFocus={async () => {
              if (!TelegramPlatform.isTelegramPlatform() && isAndroid) {
                // The keyboard does not block the input box
                await sleep(200);
                document.getElementById('etransferInputAmountWrapper')?.scrollIntoView({
                  block: 'center',
                  behavior: 'smooth',
                });
              }
            }}
            onChange={onAmountChange}
            onBlur={onAmountBlur}
          />
        </Form.Item>
      </div>

      {renderBalance}

      {isMobileStyle && (
        <RemainingLimit
          limitCurrency={withdrawInfo.limitCurrency}
          remainingLimit={withdrawInfo.remainingLimit}
          totalLimit={withdrawInfo.totalLimit}
          componentStyle={ComponentStyle.Mobile}
        />
      )}
      {isMobileStyle && networkItem?.contractAddress && (
        <ContractAddressForMobile
          label={CONTRACT_ADDRESS}
          networkName={networkItem.name || ''}
          address={networkItem.contractAddress}
          explorerUrl={networkItem?.explorerUrl}
        />
      )}
      <WithdrawFooter
        isTransactionFeeLoading={isTransactionFeeLoading}
        isSubmitDisabled={isSubmitDisabled}
        currentNetwork={networkItem}
        receiveAmount={receiveAmount || ''}
        address={address || ''}
        memo={getCommentInput()}
        amount={amount || ''}
        withdrawInfo={withdrawInfo}
        clickFailedOk={onClickFailedOk}
        clickSuccessOk={onClickSuccessOk}
        componentStyle={componentStyle}
      />
    </Form>
  );
}
