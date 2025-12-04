import CommonSpace from '../../CommonSpace';
import AddressBox, { TAddressBoxProps } from '../AddressBox';
import TxHashBox, { TTxHashBoxProps } from '../TxHashBox';

export default function FromAndToBox({
  type,
  fromAddress,
  toAddress,
  network,
  fromChainId,
  toChainId,
  orderStatus,
  orderType,
  txHashLabel,
  txHash,
  accounts,
  componentStyle,
  isCoboHash,
}: Omit<TAddressBoxProps & TTxHashBoxProps, 'chainId'>) {
  return (
    <div>
      <AddressBox
        type={type}
        fromAddress={fromAddress}
        toAddress={toAddress}
        network={network}
        fromChainId={fromChainId}
        toChainId={toChainId}
        accounts={accounts}
        componentStyle={componentStyle}
      />
      <CommonSpace direction={'vertical'} size={2} />
      <TxHashBox
        txHashLabel={txHashLabel}
        txHash={txHash}
        type={type}
        orderType={orderType}
        orderStatus={orderStatus}
        chainId={type === 'From' ? fromChainId : toChainId}
        network={network}
        componentStyle={componentStyle}
        isCoboHash={isCoboHash}
      />
    </div>
  );
}
