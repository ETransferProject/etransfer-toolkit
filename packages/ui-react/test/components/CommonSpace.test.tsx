import { describe, expect, test } from '@jest/globals';
import { render } from '@testing-library/react';
import CommonSpace from '../../src/components/CommonSpace';

describe('CommonSpace Component', () => {
  test('renders vertical space by default', () => {
    const { container } = render(<CommonSpace size={20} />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveStyle({
      height: '20px',
      width: '0px',
    });
  });

  test('renders horizontal space when specified', () => {
    const { container } = render(<CommonSpace direction="horizontal" size={30} />);
    const div = container.firstChild as HTMLElement;

    expect(div).toHaveStyle({
      width: '30px',
      height: '0px',
    });
  });

  test('handles different size values', () => {
    const { rerender, container } = render(<CommonSpace size={0} />);
    expect(container.firstChild).toHaveStyle({ height: '0px' });

    rerender(<CommonSpace size={50} direction="horizontal" />);
    expect(container.firstChild).toHaveStyle({ width: '50px' });
  });
});
