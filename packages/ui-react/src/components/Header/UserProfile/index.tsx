import MobileUserProfile from './MobileUserProfile';
import WebUserProfile from './WebUserProfile';
import { ComponentStyle } from '../../../types';

export default function ProfileEntry({ componentStyle }: { componentStyle: ComponentStyle }) {
  return componentStyle === ComponentStyle.Mobile ? <MobileUserProfile /> : <WebUserProfile />;
}
