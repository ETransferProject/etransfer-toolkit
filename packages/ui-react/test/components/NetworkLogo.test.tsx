import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { NetworkLogo } from '../../src/components/NetworkLogo';
import { BlockchainNetworkType } from '../../src/constants/network';

// Mock CommonSvg component
jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type }: { type: string }) => <div data-testid="svg" data-type={type} />,
}));

describe('NetworkLogo Component', () => {
  test('renders correct SVG for known networks', () => {
    const { rerender } = render(<NetworkLogo network={BlockchainNetworkType.Ethereum} size="big" />);

    // Test Ethereum
    expect(screen.getByTestId('svg')).toHaveAttribute('data-type', 'ethereumBig');

    // Test Binance
    rerender(<NetworkLogo network={BlockchainNetworkType.Binance} size="normal" />);
    expect(screen.getByTestId('svg')).toHaveAttribute('data-type', 'binanceMedium');

    // Test Solana small
    rerender(<NetworkLogo network={BlockchainNetworkType.Solana} size="small" />);
    expect(screen.getByTestId('svg')).toHaveAttribute('data-type', 'solana');
  });

  test('renders fallback text for unknown networks', () => {
    render(<NetworkLogo network="UnknownNetwork" />);

    expect(screen.queryByTestId('svg')).not.toBeInTheDocument();
    expect(screen.getByText('U')).toBeInTheDocument();
  });

  test('applies correct classes and attributes', () => {
    const { container } = render(
      <NetworkLogo id="test-logo" network={BlockchainNetworkType.AELF} className="custom-class" size="small" />,
    );

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('etransfer-ui-network-logo-small');
    expect(wrapper).toHaveClass('custom-class');
    expect(wrapper).toHaveAttribute('id', 'test-logo');
  });

  test('handles empty network name gracefully', () => {
    const { container } = render(<NetworkLogo network={undefined as any} />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('etransfer-ui-network-logo', 'etransfer-ui-network-logo-big');
  });

  test('renders different sizes correctly', () => {
    const { container } = render(<NetworkLogo network={BlockchainNetworkType.Polygon} size="normal" />);

    expect(container.firstChild).toHaveClass('etransfer-ui-network-logo-normal');
  });
});
