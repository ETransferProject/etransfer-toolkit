import { describe, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import LinkForBlank from '../../src/components/LinkForBlank';

describe('LinkForBlank Component', () => {
  test('renders with required href and security attributes', () => {
    render(<LinkForBlank href="https://example.com" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('applies custom className and aria-label', () => {
    render(<LinkForBlank href="#" className="custom-class" ariaLabel="External link" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
    expect(link).toHaveAttribute('aria-label', 'External link');
  });

  test('renders child element correctly', () => {
    render(<LinkForBlank href="#" element={<span data-testid="custom-element">Click me</span>} />);

    expect(screen.getByTestId('custom-element')).toBeInTheDocument();
  });

  test('handles element prop with ReactNode', () => {
    const testElement = <div data-testid="node-element">Test</div>;
    render(<LinkForBlank href="#" element={testElement} />);

    expect(screen.getByTestId('node-element')).toBeInTheDocument();
  });

  test('does not add aria-label when not provided', () => {
    render(<LinkForBlank href="#" />);

    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('aria-label');
  });
});
