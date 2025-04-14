import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen, fireEvent } from '@testing-library/react';
import FormAmountInput from '../../../src/components/Form/FormAmountInput';
import { ComponentStyle } from '../../../src/types/common';

jest.mock('antd', () => ({
  Input: jest.fn(({ ...props }) => <input {...props} />),
}));

describe('FormAmountInput Component', () => {
  const mockMaxClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders basic input with web style', () => {
    render(<FormAmountInput unit="ETH" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('ETH')).toBeInTheDocument();
    expect(screen.queryByText('Max')).not.toBeInTheDocument();
  });

  test('displays max button and handles click', () => {
    render(<FormAmountInput maxButtonConfig={{ onClick: mockMaxClick }} />);

    const maxButton = screen.getByText('Max');
    expect(maxButton).toBeInTheDocument();

    fireEvent.click(maxButton);
    expect(mockMaxClick).toHaveBeenCalledTimes(1);
  });

  test('applies mobile style classes', () => {
    render(
      <FormAmountInput maxButtonConfig={{ onClick: mockMaxClick }} componentStyle={ComponentStyle.Mobile} unit="ETH" />,
    );

    const unitElement = screen.getByText('ETH');
    expect(unitElement).toHaveClass('etransfer-ui-from-amount-input-unit-mobile');

    const maxElement = screen.getByText('Max');
    expect(maxElement).toHaveClass('etransfer-ui-from-amount-input-max-mobile');
  });

  test('renders dividing line when both max button and unit exist', () => {
    const { container } = render(<FormAmountInput maxButtonConfig={{ onClick: mockMaxClick }} unit="ETH" />);

    expect(container.querySelector('.etransfer-ui-from-amount-input-dividing-line')).toBeInTheDocument();
  });

  test('passes input props correctly', () => {
    render(<FormAmountInput placeholder="Enter amount" disabled />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter amount');
    expect(input).toBeDisabled();
  });

  test('handles different component states', () => {
    // Test without unit
    const { rerender } = render(<FormAmountInput />);
    expect(screen.queryByTestId('unit')).not.toBeInTheDocument();

    // Test with max button only
    rerender(<FormAmountInput maxButtonConfig={{ onClick: mockMaxClick }} />);
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.queryByTestId('dividing-line')).not.toBeInTheDocument();
  });
});
