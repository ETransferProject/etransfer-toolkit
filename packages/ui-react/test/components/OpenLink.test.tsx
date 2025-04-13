import { beforeEach, describe, expect, test } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import OpenLink from '../../src/components/OpenLink';
import { openWithBlank } from '../../src/utils/common';

// Mock dependencies
jest.mock('../../src/utils/common', () => ({
  openWithBlank: jest.fn(),
}));

jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type }: { type: string }) => <div data-testid="svg" data-type={type} />,
}));

describe('OpenLink Component', () => {
  const mockHref = 'https://example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with required props', () => {
    render(<OpenLink href={mockHref} />);

    expect(screen.getByTestId('svg')).toHaveAttribute('data-type', 'openLink');
  });

  test('applies custom className', () => {
    const { container } = render(<OpenLink href={mockHref} className="custom-class" />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('calls openWithBlank with correct href on click', () => {
    const { container } = render(<OpenLink href={mockHref} />);

    const linkElement = container.firstChild;

    // const linkElement = screen.getByRole('button');
    if (linkElement) {
      fireEvent.click(linkElement);

      expect(openWithBlank).toHaveBeenCalledTimes(1);
      expect(openWithBlank).toHaveBeenCalledWith(mockHref);
    }
  });

  test('renders correct SVG component', () => {
    render(<OpenLink href={mockHref} />);

    const svg = screen.getByTestId('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('data-type', 'openLink');
  });
});
