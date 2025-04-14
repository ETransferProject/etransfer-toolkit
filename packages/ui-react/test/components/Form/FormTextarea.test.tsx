import { describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import FormTextarea from '../../../src/components/Form/FormTextarea';

// Mock Ant Design TextArea
jest.mock('antd', () => ({
  Input: {
    TextArea: jest.fn(({ className, ...props }) => (
      <textarea data-testid="ant-textarea" className={className} {...props} />
    )),
  },
}));

describe('FormTextarea Component', () => {
  const mockOnChange = jest.fn();
  const mockOnBlur = jest.fn();

  const sampleProps = {
    autoSize: true,
    onChange: mockOnChange,
    onBlur: mockOnBlur,
    value: 'initial value',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders with basic props', () => {
    render(<FormTextarea {...sampleProps} />);

    const textarea = screen.getByTestId('ant-textarea');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('initial value');
    expect(textarea).toHaveAttribute('spellcheck', 'false');
  });

  test('handles text input changes', () => {
    render(<FormTextarea {...sampleProps} />);

    const textarea = screen.getByTestId('ant-textarea');
    fireEvent.change(textarea, { target: { value: 'new value' } });

    expect(mockOnChange).toHaveBeenCalledWith('new value');
  });

  test('handles call onChange callback when not provided', () => {
    render(<FormTextarea {...sampleProps} onChange={undefined} />);

    const textarea = screen.getByTestId('ant-textarea');
    fireEvent.change(textarea, { target: { value: 'new value' } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test('passes textareaProps correctly', () => {
    const customProps = {
      placeholder: 'Enter text',
      disabled: true,
    };

    render(<FormTextarea {...sampleProps} textareaProps={customProps} />);

    const textarea = screen.getByTestId('ant-textarea');
    expect(textarea).toHaveAttribute('placeholder', 'Enter text');
    expect(textarea).toBeDisabled();
  });

  test('triggers onBlur callback', () => {
    render(<FormTextarea {...sampleProps} />);

    const textarea = screen.getByTestId('ant-textarea');
    fireEvent.blur(textarea);

    expect(mockOnBlur).toHaveBeenCalledTimes(1);
  });

  test('applies correct styles and classes', () => {
    const { container } = render(<FormTextarea {...sampleProps} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('etransfer-ui-from-textarea-wrapper');
  });

  //   test('handles autoSize prop variations', () => {
  //     // Test boolean value
  //     const { rerender } = render(<FormTextarea {...sampleProps} autoSize={false} />);
  //     let textarea = screen.getByTestId('ant-textarea');
  //     expect(textarea).toHaveAttribute('autosize', 'false');

  //     // Test object value
  //     rerender(<FormTextarea {...sampleProps} autoSize={{ minRows: 2, maxRows: 6 }} />);
  //     textarea = screen.getByTestId('ant-textarea');
  //     expect(textarea).toHaveAttribute('autosize', '[object Object]');
  //   });

  //   test('clears value when null is passed', () => {
  //     render(<FormTextarea {...sampleProps} value={null} />);

  //     const textarea = screen.getByTestId('ant-textarea');
  //     expect(textarea).toHaveValue('');
  //   });
});
