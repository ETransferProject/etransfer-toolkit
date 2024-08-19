import MobileUserProfile from './MobileUserProfile';
import WebUserProfile from './WebUserProfile';
import { ComponentStyle } from '../../../types';
import { AccountAddressProps } from './AccountAddress';

export default function UserProfile({
  componentStyle = ComponentStyle.Web,
  accountList,
}: {
  componentStyle?: ComponentStyle;
  accountList: AccountAddressProps['accountList'];
}) {
  return componentStyle === ComponentStyle.Mobile ? (
    <MobileUserProfile accountList={accountList} />
  ) : (
    <WebUserProfile accountList={accountList} />
  );
}
