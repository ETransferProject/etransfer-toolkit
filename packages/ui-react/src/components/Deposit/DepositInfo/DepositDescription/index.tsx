import './index.less';

export default function DepositDescription({ list }: { list: string[] }) {
  return (
    <div className="etransfer-ui-description-wrapper">
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
