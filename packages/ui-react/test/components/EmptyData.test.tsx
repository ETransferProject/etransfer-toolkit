import { describe, expect, test, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import EmptyData from '../../src/components/EmptyData';

// Mock the CommonSvg component
jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: ({ type, ...props }: { type: string }) => <svg data-testid={`svg-${type}`} {...props} />,
}));

describe('EmptyData Component', () => {
  test('displays default text when no emptyText prop is provided', () => {
    render(<EmptyData />);
    // Assert
    expect(screen.getByText('No found')).toBeInTheDocument();
  });

  test('displays custom text when emptyText prop is provided', () => {
    render(<EmptyData emptyText="Custom empty message" />);

    // Assert
    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  test('renders the emptyBox SVG icon', () => {
    render(<EmptyData />);

    // Check if the emptyBox SVG icon is rendered
    expect(screen.getByTestId('svg-emptyBox')).toBeInTheDocument();
  });

  test('applies the correct container class', () => {
    const { container } = render(<EmptyData />);

    // Get the wrapper div
    const wrapperDiv = container.firstChild;

    // Assert
    expect(wrapperDiv).toHaveClass('etransfer-ui-empty-data');
  });
});
