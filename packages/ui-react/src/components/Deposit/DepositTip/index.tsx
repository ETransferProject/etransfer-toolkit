import './index.less';
import clsx from 'clsx';
import { formatSymbolDisplay } from '../../../utils/format';
import CommonSvg from '../../CommonSvg';
import { useScreenSize } from '../../../hooks';

type TDepositTipProps = {
  className?: string;
  fromToken: string;
  toToken: string;
  isShowIcon?: boolean;
};

export default function DepositTip({ className, fromToken, toToken, isShowIcon = true }: TDepositTipProps) {
  const { isMobilePX } = useScreenSize();

  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-deposit-tip', className)}>
      {isShowIcon && <CommonSvg type="infoBrand" className="etransfer-ui-flex-shrink-0" />}
      <span className="text">
        <span>{`Your deposit address may change. Please use the latest address for deposits.`}</span>

        {!isMobilePX && (
          <>
            <br />
            <span>{`Deposit `}</span>
            <span className="token">{formatSymbolDisplay(fromToken)}</span>
            <span>{` to the address below to receive `}</span>
            <span className="token">{formatSymbolDisplay(toToken)}</span>
            <span>{` in your wallet.`}</span>
          </>
        )}
      </span>
    </div>
  );
}
