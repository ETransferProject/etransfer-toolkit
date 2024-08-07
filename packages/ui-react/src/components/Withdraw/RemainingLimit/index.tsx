import { Tooltip } from 'antd';
import BigNumber from 'bignumber.js';
import clsx from 'clsx';
import { useMemo } from 'react';
import CommonSvg from '../../CommonSvg';
import { DEFAULT_NULL_VALUE, HOUR_LIMIT_24, REMAINING_WITHDRAWAL_QUOTA_TOOLTIP } from '../../../constants';
import SimpleTipAutoScreen from '../../Modal/SimpleTipAutoScreen';
import { ComponentStyle } from '../../../types';

export interface RemainingLimitProps {
  limitCurrency: string;
  remainingLimit?: string;
  totalLimit?: string;
  componentStyle?: ComponentStyle;
}

export default function RemainingLimit({
  limitCurrency,
  remainingLimit,
  totalLimit,
  componentStyle = ComponentStyle.Web,
}: RemainingLimitProps) {
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);

  const label = useMemo(() => {
    return (
      <span className={'etransfer-ui-withdraw-remaining-limit-label'}>
        {isMobileStyle && `• ${HOUR_LIMIT_24}:`}
        {!isMobileStyle && (
          <Tooltip
            className={clsx('etransfer-ui-withdraw-question-label')}
            placement="top"
            title={REMAINING_WITHDRAWAL_QUOTA_TOOLTIP}>
            {HOUR_LIMIT_24} <CommonSvg type="questionMark" />
          </Tooltip>
        )}
      </span>
    );
  }, [isMobileStyle]);

  const value = useMemo(() => {
    return (
      <span className={'etransfer-ui-withdraw-remaining-limit-value'}>
        {remainingLimit && totalLimit ? (
          <>
            {`${new BigNumber(remainingLimit).toFormat()} /
             ${new BigNumber(totalLimit).toFormat()}`}
            <span className={'etransfer-ui-withdraw-remaining-limit-value-limit-currency'}>{limitCurrency}</span>
          </>
        ) : (
          DEFAULT_NULL_VALUE
        )}
        <SimpleTipAutoScreen
          title={HOUR_LIMIT_24}
          content={REMAINING_WITHDRAWAL_QUOTA_TOOLTIP}
          componentStyle={componentStyle}
        />
      </span>
    );
  }, [componentStyle, limitCurrency, remainingLimit, totalLimit]);

  return (
    <div
      className={clsx('flex', 'etransfer-ui-withdraw-remaining-limit', {
        ['etransfer-ui-withdraw-remaining-limit-error']:
          remainingLimit !== null &&
          remainingLimit !== undefined &&
          remainingLimit !== '' &&
          new BigNumber(remainingLimit).isEqualTo(0),
      })}>
      {isMobileStyle ? (
        <>
          {label}
          {value}
        </>
      ) : (
        <>
          {value}
          {label}
        </>
      )}
    </div>
  );
}