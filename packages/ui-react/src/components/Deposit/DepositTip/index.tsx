import './index.less';
import clsx from 'clsx';
import { formatSymbolDisplay } from '../../../utils/format';
import CommonSvg from '../../CommonSvg';

type TDepositTipProps = {
  className?: string;
  fromToken: string;
  toToken: string;
  isShowIcon?: boolean;
};

export default function DepositTip({ className, fromToken, toToken, isShowIcon = true }: TDepositTipProps) {
  return (
    <div className={clsx('etransfer-ui-flex-row-center', 'etransfer-ui-deposit-tip', className)}>
      {isShowIcon && <CommonSvg type="infoBrand" className="etransfer-ui-flex-shrink-0" />}
      <span className="text">
        <span>{`Deposit `}</span>
        <span className="token">{formatSymbolDisplay(fromToken)}</span>
        <span>{` to the following address to receive `}</span>
        <span className="token">{formatSymbolDisplay(toToken)}</span>
        <span>{` in your connected wallet on aelf chain.`}</span>
      </span>
    </div>
  );
}
