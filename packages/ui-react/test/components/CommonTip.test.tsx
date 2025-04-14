import React from 'react';
import { beforeEach, describe, expect, test, jest } from '@jest/globals';
import { fireEvent, render, screen } from '@testing-library/react';
import CommonTip from '../../src/components/CommonTip';
import { ComponentStyle } from '../../src/types/common';

// Mock CommonSvg component
jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: jest.fn(() => <svg data-testid="common-svg" />),
}));

// Mock CommonTooltipSwitchModal component
jest.mock('../../src/components/CommonTooltipSwitchModal', () => {
  return {
    __esModule: true,
    default: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    ICommonTooltipSwitchModalRef: {},
  };
});

describe('CommonTip Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockTipContent = <div>Test tip content</div>;

  test('renders basic elements', () => {
    render(<CommonTip tip={mockTipContent} title="Test Title" />);

    expect(screen.getByTestId('common-svg')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  test('uses custom icon when provided', () => {
    const customIcon = <span data-testid="custom-icon" />;
    render(<CommonTip tip={mockTipContent} icon={customIcon} />);

    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });

  test('handles click event to open modal', () => {
    const mockOpen = jest.fn();
    const { container } = render(<CommonTip tip={mockTipContent} />);

    // Mock the ref implementation
    const mockRef = { current: { open: mockOpen } };
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

    fireEvent.click(container.firstChild!.firstChild as Element);
  });

  test('handles click event to open modal', () => {
    const { container } = render(<CommonTip tip={mockTipContent} />);

    // Mock the ref implementation is undefined
    const mockRef = { current: undefined };
    jest.spyOn(React, 'useRef').mockReturnValue(mockRef);

    fireEvent.click(container.firstChild!.firstChild as Element);
  });

  test('applies componentStyle correctly', () => {
    const { container } = render(<CommonTip tip={mockTipContent} componentStyle={ComponentStyle.Mobile} />);

    expect(container.firstChild).toHaveAttribute('componentstyle');
  });

  test('combines className properly', () => {
    const { container } = render(<CommonTip tip={mockTipContent} className="custom-class" />);

    expect(container.firstChild?.firstChild).toHaveClass('common-tip-title', 'custom-class');
  });
});
