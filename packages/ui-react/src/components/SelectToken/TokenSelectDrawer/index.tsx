import { DrawerProps } from 'antd';
import { TokenSelectForMobile, TokenSelectProps } from '../TokenSelect';
import CommonDrawer from '../../CommonDrawer';

export default function TokenSelectDrawer({
  title,
  tokenList,
  selectedToken,
  isDisabled,
  isShowLoading,
  onSelect,
  ...props
}: TokenSelectProps & DrawerProps) {
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
        tokenList={tokenList}
        selectedToken={selectedToken}
        onSelect={onSelect}
        isDisabled={isDisabled}
        isShowLoading={isShowLoading}
        isShowImage={props.open}
      />
    </CommonDrawer>
  );
}
