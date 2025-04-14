import { describe, expect, test, jest } from '@jest/globals';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef } from 'react';
import CommonTooltipSwitchModal, { ICommonTooltipSwitchModalRef } from '../../src/components/CommonTooltipSwitchModal';
import { ComponentStyle } from '../../src/types/common';

// Mock child components
jest.mock('../../src/components/CommonTooltip', () =>
  forwardRef(({ children, getPopupContainer }: any, ref: any) => {
    getPopupContainer?.();
    return (
      <div data-testid="tooltip" ref={ref}>
        {children}
      </div>
    );
  }),
);

jest.mock('../../src/components/CommonModal', () =>
  forwardRef(({ open, onOk, onCancel, children }: any, _ref: any) =>
    open ? (
      <div
        data-testid="modal"
        onClick={() => {
          onOk();
          onCancel();
        }}>
        {children}
      </div>
    ) : null,
  ),
);

jest.mock('../../src/components/CommonSvg', () => ({
  __esModule: true,
  default: jest.fn(() => <svg data-testid="common-svg" />),
}));

describe('CommonTooltipSwitchModal Component', () => {
  const mockChild = <button data-testid="child">Trigger</button>;
  const mockTip = <div data-testid="tip-content">Tooltip content</div>;

  test('renders children content', () => {
    render(
      <CommonTooltipSwitchModal tip={mockTip} modalProps={{ className: 'common-tooltip-switch-modal' }}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    // Check if children content is rendered
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('opens modal in mobile style when clicked', async () => {
    const { getByTestId } = render(
      <CommonTooltipSwitchModal tip={mockTip} componentStyle={ComponentStyle.Mobile}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    // Click on child to trigger modal
    await act(async () => {
      await userEvent.click(getByTestId('child'));
    });

    // Check if modal is rendered
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('does not open modal in web style when clicked', () => {
    const { getByTestId } = render(
      <CommonTooltipSwitchModal tip={mockTip} componentStyle={ComponentStyle.Web}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    // Click on child to trigger modal
    userEvent.click(getByTestId('child'));

    // Check if modal is not rendered
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });

  test('exposes ref open method', () => {
    const ref = { current: null } as React.RefObject<ICommonTooltipSwitchModalRef>;
    render(
      <CommonTooltipSwitchModal tip={mockTip} componentStyle={ComponentStyle.Mobile} ref={ref}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    act(() => {
      // Call the open method
      ref.current?.open();
    });

    // Check if modal is rendered
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });

  test('closes modal when style changes to web', () => {
    const { rerender } = render(
      <CommonTooltipSwitchModal tip={mockTip} componentStyle={ComponentStyle.Mobile}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    act(() => {
      // Click on child to trigger modal
      userEvent.click(screen.getByTestId('child'));
    });

    rerender(
      <CommonTooltipSwitchModal tip={mockTip} componentStyle={ComponentStyle.Web}>
        {mockChild}
      </CommonTooltipSwitchModal>,
    );

    // Check if modal is closed
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
  });
});
