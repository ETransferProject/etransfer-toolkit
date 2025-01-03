import clsx from 'clsx';
import './index.less';

export default function DepositDescription({
  className,
  list,
  customContent,
}: {
  className?: string;
  list: string[];
  customContent?: React.ReactNode;
}) {
  return (
    <div className={clsx('etransfer-ui-description-wrapper', className)}>
      {customContent ||
        (Array.isArray(list) &&
          list?.map((item, idx) => {
            return (
              <p key={`DepositDescription${idx}`} className={'description-item'}>
                {`• ${item}`}
              </p>
            );
          }))}
    </div>
  );
}
