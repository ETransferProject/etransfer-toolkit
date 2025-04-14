import { afterEach, describe, expect, test, jest } from '@jest/globals';
import { render } from '@testing-library/react';
import CommonDrawer from '../../src/components/CommonDrawer';
import { Drawer } from 'antd';

// Mock Drawer component
jest.mock('antd', () => ({
  Drawer: jest.fn(() => null),
}));

// Mock CommonSvg component
jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: jest.fn(() => 'svg-close-icon'),
}));

describe('CommonDrawer Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  test('renders with default props', () => {
    render(<CommonDrawer open={true} />);

    // Assert that Drawer component is called with correct props
    expect(Drawer).toHaveBeenCalledWith(
      expect.objectContaining({
        className: 'etransfer-ui-common-drawer',
        open: true,
      }),
      expect.anything(),
    );
  });

  test('merges custom className', () => {
    render(<CommonDrawer open={true} className="custom-class" />);

    // Assert that Drawer component is called with correct props
    expect(Drawer).toHaveBeenCalledWith(
      expect.objectContaining({
        className: expect.stringContaining('etransfer-ui-common-drawer custom-class'),
      }),
      expect.anything(),
    );
  });

  test('accepts custom width/height', () => {
    render(<CommonDrawer open={true} width="500px" height="60%" zIndex={0} />);

    // Assert that Drawer component is called with correct props
    expect(Drawer).toHaveBeenCalledWith(
      expect.objectContaining({
        width: '500px',
        height: '60%',
      }),
      expect.anything(),
    );
  });

  test('uses custom zIndex when provided', () => {
    render(<CommonDrawer open={true} zIndex={500} />);

    // Assert that Drawer component is called with correct props
    expect(Drawer).toHaveBeenCalledWith(
      expect.objectContaining({
        zIndex: 500,
      }),
      expect.anything(),
    );
  });

  test('passes through other drawer props', () => {
    render(<CommonDrawer open={true} extra="test-content" />);

    // Assert that Drawer component is called with correct props
    expect(Drawer).toHaveBeenCalledWith(
      expect.objectContaining({
        extra: 'test-content',
      }),
      expect.anything(),
    );
  });
});
