import './index.less';
import clsx from 'clsx';
import CommonSvg from '../../CommonSvg';
import { LOGIN } from '../../../constants';

export default function NotLoginTip({
  isShowIcon = true,
  isCard = true,
  onLogin,
}: {
  isShowIcon?: boolean;
  isCard?: boolean;
  onLogin: () => void;
}) {
  return (
    <div
      className={clsx(
        'etransfer-ui-flex-row-center',
        isCard ? 'etransfer-ui-deposit-not-login-tip-card' : 'etransfer-ui-deposit-not-login-tip-text',
      )}>
      {isShowIcon && <CommonSvg type="infoBrand" className="etransfer-ui-flex-shrink-0" />}
      <span className={'etransfer-ui-deposit-not-login-tip-content'}>
        <span>{`Please `}</span>
        <span className={'etransfer-ui-deposit-not-login-tip-action'} onClick={onLogin}>
          {LOGIN}
        </span>
        <span>{` to get the deposit address.`}</span>
      </span>
    </div>
  );
}
