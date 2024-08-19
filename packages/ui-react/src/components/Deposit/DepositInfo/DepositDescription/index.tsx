import clsx from 'clsx';
import './index.less';

export default function DepositDescription({ className, list }: { className?: string; list: string[] }) {
  return (
    <div className={clsx('etransfer-ui-description-wrapper', className)}>
      {Array.isArray(list) &&
        list?.map((item, idx) => {
          return (
            <p key={`DepositDescription${idx}`} className={'description-item'}>
              {`• ${item}`}
            </p>
          );
        })}
    </div>
  );
}
