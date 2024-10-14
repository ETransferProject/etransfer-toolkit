import './index.less';
import { Steps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { ComponentStyle } from '../../../types';
import clsx from 'clsx';
import { BusinessType, TransactionRecordStep } from '@etransfer/types';
import { formatSymbolDisplay } from '../../../utils';
import { BlockchainNetworkType } from '../../../constants';

export interface TransferDetailStepProps {
  className?: string;
  componentStyle?: ComponentStyle;
  orderType: BusinessType;
  currentStep: TransactionRecordStep;
  fromTransfer: {
    confirmingThreshold: number;
    confirmedNum: number;
    amount: string;
    symbol: string;
    network: string;
  };
  toTransfer: {
    amount: string;
    symbol: string;
    network: string;
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
        title: `${
          fromTransfer.network === BlockchainNetworkType.AELF ? 'aelf' : fromTransfer.network
        } Chain in progress(${fromTransfer.confirmedNum}/${fromTransfer.confirmingThreshold})`,
        description: `Requires ${fromTransfer.confirmedNum} confirmations`,
      },
      {
        title: `${toTransfer.network === BlockchainNetworkType.AELF ? 'aelf' : toTransfer.network} Chain in progress`,
      },
      {
        title: 'Received',
        description:
          fromTransfer.symbol !== toTransfer.symbol
            ? `You will receive ${formatSymbolDisplay(toTransfer.symbol)}`
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
    fromTransfer.confirmedNum,
    fromTransfer.confirmingThreshold,
    fromTransfer.network,
    fromTransfer.symbol,
    orderType,
    toTransfer.amount,
    toTransfer.network,
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
