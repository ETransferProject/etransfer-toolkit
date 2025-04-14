import { describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import ViewContractAddressModal from '../../../src/components/Modal/ViewContractAddressModal';
import { ComponentStyle } from '../../../src/types/common';

// Mock dependencies
jest.mock('../../../src/components/CommonTips/CommonModalTip', () => ({
  __esModule: true,
  default: ({ open, children }: any) => (open ? <div data-testid="modal">{children}</div> : null),
}));

jest.mock('../../../src/components/Copy', () => ({
  __esModule: true,
  default: ({ toCopy }: any) => <button data-testid="copy-button">{toCopy}</button>,
}));

jest.mock('../../../src/components/OpenLink', () => ({
  __esModule: true,
  default: ({ href }: any) => <a data-testid="open-link" href={href} />,
}));

describe('ViewContractAddressModal Component', () => {
  const mockProps = {
    network: 'Ethereum',
    value: '0x123...abc',
    link: 'https://etherscan.io',
    componentStyle: ComponentStyle.Web,
    open: true,
  };

  test('renders modal with contract information', () => {
    render(<ViewContractAddressModal {...mockProps} />);

    // Check if modal is displayed
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByText(/Contract Address on Ethereum/)).toBeInTheDocument();
    expect(screen.getAllByText('0x123...abc')).toHaveLength(2);
  });

  test('displays copy and link buttons when data exists', () => {
    render(<ViewContractAddressModal {...mockProps} />);

    // Check if Copy component is called with correct props
    expect(screen.getByTestId('copy-button')).toBeInTheDocument();
    expect(screen.getByTestId('open-link')).toHaveAttribute('href', 'https://etherscan.io');
  });

  test('hides copy button when value is empty', () => {
    render(<ViewContractAddressModal {...mockProps} value="" />);

    // Check if Copy component is called with correct props
    expect(screen.queryByTestId('copy-button')).not.toBeInTheDocument();
  });

  test('hides open link when link is not provided', () => {
    render(<ViewContractAddressModal {...mockProps} link={undefined} />);

    // Check if OpenLink component is called with correct props
    expect(screen.queryByTestId('open-link')).not.toBeInTheDocument();
  });

  test('handle default state when open is false', () => {
    render(
      <ViewContractAddressModal
        network={'Ethereum'}
        value={'0x123...abc'}
        link={'https://etherscan.io'}
        className="custom-class"
      />,
    );

    // Check if modal is not displayed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('passes correct props to Copy component', () => {
    render(<ViewContractAddressModal {...mockProps} />);

    // Check if Copy component is called with correct props
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toHaveTextContent('0x123...abc');
  });

  test('handles different component styles', () => {
    render(<ViewContractAddressModal {...mockProps} componentStyle={ComponentStyle.Mobile} />);

    // Add specific style assertions based on your implementation
    const copyButton = screen.getByTestId('copy-button');
    expect(copyButton).toBeInTheDocument();
  });
});
