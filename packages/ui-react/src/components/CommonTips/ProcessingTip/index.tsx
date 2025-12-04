import CommonSpace from '../../CommonSpace';
import CommonWarningTip from '../CommonWarningTip';

export interface ProcessingTipProps {
  depositProcessingCount?: number;
  withdrawProcessingCount?: number;
  marginBottom?: number;
  borderRadius?: number;
  className?: string;
  onClick?: () => void;
}
export default function ProcessingTip({
  depositProcessingCount,
  withdrawProcessingCount,
  marginBottom = 16,
  borderRadius,
  className,
  onClick,
}: ProcessingTipProps) {
  if (!withdrawProcessingCount && !depositProcessingCount) return null;

  let text;
  if (withdrawProcessingCount) {
    if (depositProcessingCount) {
      text = `${withdrawProcessingCount} ${
        withdrawProcessingCount > 1 ? 'withdrawals' : 'withdrawal'
      } and ${depositProcessingCount} ${depositProcessingCount > 1 ? 'deposits' : 'deposit'} processing`;
    } else {
      text = `${withdrawProcessingCount} ${withdrawProcessingCount > 1 ? 'withdrawals' : 'withdrawal'} processing`;
    }
  } else if (depositProcessingCount) {
    text = `${depositProcessingCount} ${depositProcessingCount > 1 ? 'deposits' : 'deposit'} processing`;
  }

  if (!text) return null;

  return (
    <>
      <CommonWarningTip
        content={text}
        onClick={onClick}
        className={className}
        borderRadius={borderRadius}
        isShowSuffix={!!onClick}
      />
      <CommonSpace direction="vertical" size={marginBottom} />
    </>
  );
}
