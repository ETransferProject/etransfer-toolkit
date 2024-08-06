import { DrawerProps } from 'antd';
import { TokenSelectForMobile, TokenSelectProps } from '../TokenSelect';
import CommonDrawer from '../../CommonDrawer';

export default function TokenSelectDrawer({
  listClassName,
  itemClassName,
  title,
  tokenList,
  selectedToken,
  isDisabled,
  isShowBalance,
  chainId,
  networkType,
  accountAddress,
  onSelect,
  ...props
}: TokenSelectProps & DrawerProps & { listClassName?: string; itemClassName?: string }) {
  return (
    <CommonDrawer
      destroyOnClose
      placement="bottom"
      title={title} //{type === SideMenuKey.Withdraw ? 'Withdraw Assets' : 'Deposit Assets'}
      closable={true}
      height="88%"
      {...props}
      bodyStyle={{
        padding: 0,
      }}>
      <TokenSelectForMobile
        className={listClassName}
        itemClassName={itemClassName}
        open={props.open}
        tokenList={tokenList}
        selectedToken={selectedToken}
        onSelect={onSelect}
        isDisabled={isDisabled}
        isShowImage={props.open}
        isShowBalance={isShowBalance}
        chainId={chainId}
        networkType={networkType}
        accountAddress={accountAddress}
      />
    </CommonDrawer>
  );
}
