import { Drawer, DrawerProps } from 'antd';
import clsx from 'clsx';
import './index.less';
import CommonSvg from '../CommonSvg';

export default function CommonDrawer({ className, width, height, ...props }: DrawerProps) {
  return (
    <Drawer
      closable={true}
      closeIcon={<CommonSvg type="close" />}
      destroyOnClose
      placement="bottom"
      width={width || '100%'}
      height={height || '88%'}
      zIndex={props?.zIndex || 300}
      {...props}
      className={clsx('etransfer-ui-common-drawer', className)}
    />
  );
}
