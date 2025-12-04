import { Input } from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import './index.less';
import clsx from 'clsx';
import { FocusEventHandler } from 'react';

const { TextArea } = Input;

interface FormTextareaProps {
  textareaProps?: Omit<TextAreaProps, 'value' | 'onChange'>;
  value?: string;
  autoSize: boolean | object;
  onChange?: (value: string | null) => void;
  onBlur?: FocusEventHandler<HTMLTextAreaElement>;
}

export default function FormTextarea({ textareaProps, value, autoSize, onChange, onBlur }: FormTextareaProps) {
  return (
    <div className={clsx('etransfer-ui-flex-row-start', 'etransfer-ui-from-textarea-wrapper')}>
      <TextArea
        spellCheck={false}
        autoSize={autoSize}
        {...textareaProps}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        bordered={false}
        onBlur={onBlur}
      />
    </div>
  );
}
