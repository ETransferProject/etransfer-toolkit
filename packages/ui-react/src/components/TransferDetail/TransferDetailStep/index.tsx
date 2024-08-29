import './index.less';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { ComponentStyle } from '../../../types';
import clsx from 'clsx';
import { BusinessType, TransactionRecordStep } from '@etransfer/types';
import { formatSymbolDisplay } from '../../../utils';

export interface TransferDetailStepProps {
  className?: string;
  componentStyle: ComponentStyle;
  orderType: BusinessType;
  currentStep: TransactionRecordStep;
  fromTransfer: {
    confirmingThreshold: number;
    confirmedNum: number;
    amount: string;
    symbol: string;
    chainId: string;
  };
  toTransfer: {
    amount: string;
    symbol: string;
    chainId: string;
  };
}

export default function TransferDetailStep({
  className,
  componentStyle,
  orderType,
  currentStep,
  fromTransfer,
  toTransfer,
}: TransferDetailStepProps) {
  const isMobileStyle = useMemo(() => componentStyle === ComponentStyle.Mobile, [componentStyle]);
  const stepItems = useMemo(() => {
    const items = [
      {
        title: `${orderType} submitted`,
        description: `${fromTransfer.amount} ${formatSymbolDisplay(fromTransfer.symbol)}`,
      },
      {
        title: `${fromTransfer.chainId} Chain in progress(${fromTransfer.confirmedNum}/${fromTransfer.confirmingThreshold})`,
        description: `Requires ${fromTransfer.confirmedNum} confirmations`,
      },
      {
        title: `${toTransfer.chainId} Chain in progress`,
      },
      {
        title: orderType === BusinessType.Deposit ? 'Received' : 'Sent',
        description:
          fromTransfer.symbol !== toTransfer.symbol
            ? `You will receive ${toTransfer.symbol}`
            : `${toTransfer.amount} ${formatSymbolDisplay(toTransfer.symbol)}`,
      },
    ];
    items.forEach((item: any, index) => {
      if (index === currentStep) {
        item.icon = <LoadingOutlined />;
      }
    });
    return items;
  }, [
    currentStep,
    fromTransfer.amount,
    fromTransfer.chainId,
    fromTransfer.confirmedNum,
    fromTransfer.confirmingThreshold,
    fromTransfer.symbol,
    orderType,
    toTransfer.amount,
    toTransfer.chainId,
    toTransfer.symbol,
  ]);

  return (
    <div className={clsx('etransfer-ui-transfer-detail-step', className)}>
      <Steps
        className={
          isMobileStyle ? 'etransfer-ui-transfer-detail-step-vertical' : 'etransfer-ui-transfer-detail-step-horizontal'
        }
        direction={isMobileStyle ? 'vertical' : 'horizontal'}
        labelPlacement={isMobileStyle ? 'horizontal' : 'vertical'}
        items={stepItems}
        current={currentStep}
        size="small"
      />
    </div>
  );
}
