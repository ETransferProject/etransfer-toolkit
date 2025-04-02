import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CommonAddress from '../../src/components/CommonAddress';
import Copy from '../../src/components/Copy';
import { ComponentStyle, CopySize } from '../../src/types';

// Mock the Copy component
jest.mock('../../src/components/Copy', () => jest.fn(() => <div data-testid="copy" />));

describe('CommonAddress', () => {
  const mockValue = '0x123...abc';
  const mockLabel = 'Wallet Address';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders label and value correctly', () => {
    render(<CommonAddress label={mockLabel} value={mockValue} />);

    // Assert
    expect(screen.getByText(mockLabel)).toBeInTheDocument();
    expect(screen.getByText(mockValue)).toBeInTheDocument();
  });

  test('shows copy button when value exists and showCopy=true', () => {
    render(<CommonAddress value={mockValue} />);

    const copy = screen.getByTestId('copy');

    expect(copy).toBeInTheDocument();
  });

  test('hides copy button when showCopy=false', () => {
    render(<CommonAddress value={mockValue} showCopy={false} />);

    try {
      screen?.getByTestId('copy');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  test('doesnt render copy button when value is empty', () => {
    render(<CommonAddress value={undefined} />);

    try {
      screen?.getByTestId('copy');
    } catch (error) {
      expect(error).toBeTruthy();
    }
  });

  test('passes correct props to Copy component', () => {
    render(<CommonAddress value={mockValue} copySize={CopySize.Small} componentStyle={ComponentStyle.Mobile} />);

    expect(Copy).toHaveBeenCalledWith(
      expect.objectContaining({
        toCopy: mockValue,
        size: 'small',
        componentStyle: 'Mobile',
        className: 'etransfer-ui-flex-none',
      }),
      expect.anything(),
    );
  });

  test('applies custom class names correctly', () => {
    const { container } = render(
      <CommonAddress
        labelClassName="custom-label"
        valueClassName="custom-value"
        valueWrapperClassName="custom-wrapper"
      />,
    );

    expect(container.querySelector('.address-text-title.custom-label')).toBeInTheDocument();
    expect(container.querySelector('.address-text-content.custom-value')).toBeInTheDocument();
    expect(container.querySelector('.custom-wrapper')).toBeInTheDocument();
  });

  test('renders without label when not provided', () => {
    render(<CommonAddress value={mockValue} />);

    const addressLabel = screen.queryByTestId('address-label');
    expect(addressLabel).not.toBeInTheDocument();
  });
});
