import { Button, ButtonProps } from 'antd';
import clsx from 'clsx';
import './index.less';
import { CommonButtonSize, CommonButtonType } from '../../types/components';

export type CommonButtonProps = Omit<ButtonProps, 'size' | 'type'> & {
  size?: CommonButtonSize;
  type?: CommonButtonType;
  stretched?: boolean;
};

export default function CommonButton({
  size = CommonButtonSize.Middle,
  type = CommonButtonType.Primary,
  stretched = false,
  ...props
}: CommonButtonProps) {
  return (
    <Button
      {...props}
      className={clsx(
        'etransfer-ui-common-button',
        `etransfer-ui-common-button-${size}`,
        `etransfer-ui-common-button-${type}`,
        { ['etransfer-ui-common-button-stretched']: stretched },
        props.className,
      )}
    />
  );
}
