import { useMemo } from 'react';
import clsx from 'clsx';
import './index.less';
import CommonSpace from '../../CommonSpace';
import { DEFAULT_NULL_VALUE } from '../../../constants';
import PartialLoading from '../../PartialLoading';

type TFeeInfo = {
  isTransactionFeeLoading?: boolean;
  isSuccessModalOpen?: boolean;
  transactionFee?: string;
  transactionUnit?: string;
  aelfTransactionFee?: string;
  aelfTransactionUnit?: string;
};

export default function FeeInfo({
  isTransactionFeeLoading = true,
  isSuccessModalOpen = false,
  transactionFee,
  transactionUnit,
  aelfTransactionFee,
  aelfTransactionUnit,
}: TFeeInfo) {
  const estimatedGasFeeElement = useMemo(() => {
    return (
      <span className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-fee-info-item')}>
        <span className={'etransfer-ui-withdraw-fee-info-label'}>Estimated Gas Fee:</span>
        {isTransactionFeeLoading && <PartialLoading />}
        {!isTransactionFeeLoading && (
          <>
            {aelfTransactionFee && aelfTransactionUnit ? (
              <>
                <span className={'etransfer-ui-withdraw-fee-info-value'}>
                  {`${(!isSuccessModalOpen && aelfTransactionFee) || DEFAULT_NULL_VALUE}`}
                </span>
                <span className={'etransfer-ui-withdraw-fee-info-unit'}>&nbsp;{`${aelfTransactionUnit}`}</span>
              </>
            ) : (
              <>
                <span className={'etransfer-ui-withdraw-fee-info-value'}>{DEFAULT_NULL_VALUE}</span>
              </>
            )}
          </>
        )}
      </span>
    );
  }, [aelfTransactionFee, aelfTransactionUnit, isSuccessModalOpen, isTransactionFeeLoading]);

  const transactionFeeElement = useMemo(() => {
    return (
      <span className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-withdraw-fee-info-item')}>
        <span className={'etransfer-ui-withdraw-fee-info-label'}>Transaction Fee:</span>
        {isTransactionFeeLoading && <PartialLoading />}
        {!isTransactionFeeLoading && (
          <>
            {transactionFee && transactionUnit ? (
              <>
                <span className={'etransfer-ui-withdraw-fee-info-value'}>{`${
                  (!isSuccessModalOpen && transactionFee) || DEFAULT_NULL_VALUE
                }`}</span>
                <span className={'etransfer-ui-withdraw-fee-info-unit'}>&nbsp;{`${transactionUnit}`}</span>
              </>
            ) : (
              <>
                <span className={'etransfer-ui-withdraw-fee-info-value'}>{DEFAULT_NULL_VALUE}</span>
              </>
            )}
          </>
        )}
      </span>
    );
  }, [isSuccessModalOpen, isTransactionFeeLoading, transactionFee, transactionUnit]);

  return (
    <div>
      {estimatedGasFeeElement}
      <CommonSpace direction={'vertical'} size={2} />
      {transactionFeeElement}
    </div>
  );
}
