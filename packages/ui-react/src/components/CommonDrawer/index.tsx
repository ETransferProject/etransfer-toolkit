import { Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';

export default function CommonDrawer({ className, width, height, zIndex, ...props }: DrawerProps) {
  return (
    <Drawer
      closable={true}
      closeIcon={<CommonSvg type="close" />}
      destroyOnClose
      placement="bottom"
      width={width || '100%'}
      height={height || '88%'}
      zIndex={zIndex || 300}
      {...props}
      className={clsx('etransfer-ui-common-drawer', className)}
    />
  );
}
