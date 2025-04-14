import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import CommonLink from '../../src/components/CommonLink';
import { devices } from '@portkey/utils';

// Mock the devices module
jest.mock('@portkey/utils', () => ({
  devices: {
    isMobileDevices: jest.fn(),
  },
}));

describe('CommonLink Component', () => {
  const mockHref = 'https://example.com';
  const mockText = 'Test Link';

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with basic props', () => {
    render(
      <CommonLink href={mockHref} className="custom-class">
        {mockText}
      </CommonLink>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', mockHref);
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveTextContent(mockText);
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  test('sets target to _blank on desktop', () => {
    (devices.isMobileDevices as jest.Mock).mockReturnValue(false);
    render(<CommonLink href={mockHref}>{mockText}</CommonLink>);

    expect(screen.getByRole('link')).toHaveAttribute('target', '_blank');
  });

  test('sets target to _self on mobile', () => {
    (devices.isMobileDevices as jest.Mock).mockReturnValue(true);
    render(<CommonLink href={mockHref}>{mockText}</CommonLink>);

    expect(screen.getByRole('link')).toHaveAttribute('target', '_self');
  });

  test('always includes noreferrer in rel attribute', () => {
    render(<CommonLink href={mockHref}>{mockText}</CommonLink>);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
