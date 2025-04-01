import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook } from '@testing-library/react';
import { etransferEvents } from '@etransfer/utils';
import { useDepositNoticeSocket, useNoticeSocket, useWithdrawNoticeSocket } from '../../src/hooks/notice';
import {
  connectUserOrderRecord,
  handleDepositNoticeDataAndShow,
  handleNoticeDataAndShow,
  handleWithdrawNoticeDataAndShow,
} from '../../src/utils/notice';
import { getAccountAddress } from '../../src/utils/login';
import { useETransferDeposit } from '../../src/context/ETransferDepositProvider';
import { useETransferWithdraw } from '../../src/context/ETransferWithdrawProvider';

// Mock dependencies
jest.mock('@etransfer/socket');

jest.mock('@etransfer/utils', () => ({
  etransferEvents: {
    ETransferConfigUpdated: {
      emit: jest.fn(),
      addListener: jest.fn().mockImplementation((fn: any) => {
        fn();
        return {
          remove: jest.fn(),
        };
      }),
    },
    GlobalTxnNotice: {
      emit: jest.fn(),
      addListener: jest.fn().mockImplementation((fn: any) => {
        fn();
        return {
          remove: jest.fn(),
        };
      }),
    },
  },
  removeAddressSuffix: jest.fn((addr) => addr),
}));

jest.mock('../../src/utils/core', () => {
  const originalModule: any = jest.requireActual('../../src/utils/core');

  return {
    __esModule: true,
    ...originalModule,
    etransferCore: {
      setStorage: jest.fn(),
      services: {
        checkEOARegistration: jest.fn().mockResolvedValue({ result: false } as never),
      },
      noticeSocket: {
        signalr: { connectionId: '' },
      },
    },
  };
});

jest.mock('../../src/utils/login', () => ({
  getAccountAddress: jest.fn(),
}));

jest.mock('../../src/utils/notice', () => ({
  connectUserOrderRecord: jest.fn().mockImplementation((address, fn: any) => {
    fn({
      address,
      processing: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      succeed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      failed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
    });
  }),
  handleDepositNoticeDataAndShow: jest.fn(),
  handleWithdrawNoticeDataAndShow: jest.fn(),
  handleNoticeDataAndShow: jest.fn(),
}));

jest.mock('../../src/context/ETransferDepositProvider', () => ({
  useETransferDeposit: jest.fn(),
}));

jest.mock('../../src/context/ETransferDepositProvider/actions', () => ({
  etransferDepositAction: {
    setDepositProcessingCount: {
      actions: jest.fn(),
    },
  },
}));

jest.mock('../../src/context/ETransferWithdrawProvider', () => ({
  useETransferWithdraw: jest.fn(),
}));

jest.mock('../../src/context/ETransferWithdrawProvider/actions', () => ({
  etransferWithdrawAction: {
    setWithdrawProcessingCount: {
      actions: jest.fn(),
    },
  },
}));

const correctAelfAddress = 'ELF_Py2TJpjTtt29zAtqLWyLEU1DEzBFPz1LJU594hy6evPF8Cvft_AELF';

describe('useDepositNoticeSocket', () => {
  const mockAddListener = etransferEvents.ETransferConfigUpdated.addListener as jest.Mock;
  const mockConnect = connectUserOrderRecord as jest.Mock;
  const mockDispatch = () => {
    return {
      type: 'setDepositProcessingCount',
      payload: {
        depositProcessingCount: 1,
      },
    };
  };

  beforeEach(() => {
    (useETransferDeposit as jest.Mock).mockReturnValue([{}, { dispatch: mockDispatch }]);
    mockAddListener.mockClear();
    mockConnect.mockClear();

    jest.clearAllMocks();
  });

  it('should setup event listener on mount', () => {
    const { unmount } = renderHook(() => useDepositNoticeSocket(true));

    expect(mockAddListener).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockAddListener.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  it('should connect when conditions are met', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);

    const { unmount } = renderHook(() => useDepositNoticeSocket(true));
    unmount();

    expect(mockConnect).toHaveBeenCalledWith(correctAelfAddress, expect.any(Function));
  });

  it('should handle notice updates', async () => {
    renderHook(() => useDepositNoticeSocket(true));

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
    expect(handleDepositNoticeDataAndShow).toHaveBeenCalled();
  });

  it('should reset count when no depositCount', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);
    (connectUserOrderRecord as jest.Mock).mockImplementation((address, fn: any) => {
      fn({
        address,
        processing: { depositCount: 0, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        succeed: { depositCount: 1, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        failed: { depositCount: 1, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      });
    });

    renderHook(() => useDepositNoticeSocket(true));

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
  });

  it('should not connect when no address', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => '');

    renderHook(() => useDepositNoticeSocket(true));

    expect(mockConnect).not.toHaveBeenCalled();
  });
});

describe('useWithdrawNoticeSocket', () => {
  const mockAddListener = etransferEvents.ETransferConfigUpdated.addListener as jest.Mock;
  const mockConnect = connectUserOrderRecord as jest.Mock;
  const mockDispatch = () => {
    return {
      type: 'setWithdrawProcessingCount',
      payload: {
        withdrawProcessingCount: 1,
      },
    };
  };

  beforeEach(() => {
    (connectUserOrderRecord as jest.Mock).mockImplementation((address, fn: any) => {
      fn({
        address,
        processing: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        succeed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        failed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      });
    });
    (useETransferWithdraw as jest.Mock).mockReturnValue([{}, { dispatch: mockDispatch }]);
    mockAddListener.mockClear();
    mockConnect.mockClear();

    jest.clearAllMocks();
  });

  it('should setup event listener on mount', () => {
    const { unmount } = renderHook(() => useWithdrawNoticeSocket(true));

    expect(mockAddListener).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockAddListener.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  it('should connect when conditions are met', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);

    const { unmount } = renderHook(() => useWithdrawNoticeSocket(true));
    unmount();

    expect(mockConnect).toHaveBeenCalledWith(correctAelfAddress, expect.any(Function));
  });

  it('should handle notice updates', async () => {
    renderHook(() => useWithdrawNoticeSocket(true));

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
    expect(handleWithdrawNoticeDataAndShow).toHaveBeenCalled();
  });

  it('should reset count when no withdrawCount', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);
    (connectUserOrderRecord as jest.Mock).mockImplementation((address, fn: any) => {
      fn({
        address,
        processing: { depositCount: 0, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        succeed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        failed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      });
    });

    renderHook(() => useWithdrawNoticeSocket(true));

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
  });

  it('should not connect when no address', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => '');

    renderHook(() => useWithdrawNoticeSocket(true));

    expect(mockConnect).not.toHaveBeenCalled();
  });
});

describe('useNoticeSocket', () => {
  const mockAddListener = etransferEvents.ETransferConfigUpdated.addListener as jest.Mock;
  const mockConnect = connectUserOrderRecord as jest.Mock;
  const mockDepositDispatch = () => {
    return {
      type: 'setDepositProcessingCount',
      payload: {
        depositProcessingCount: 1,
      },
    };
  };

  const mockWithdrawDispatch = () => {
    return {
      type: 'setWithdrawProcessingCount',
      payload: {
        withdrawProcessingCount: 1,
      },
    };
  };

  beforeEach(() => {
    (connectUserOrderRecord as jest.Mock).mockImplementation((address, fn: any) => {
      fn({
        address,
        processing: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        succeed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        failed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      });
    });
    (useETransferDeposit as jest.Mock).mockReturnValue([{}, { dispatch: mockDepositDispatch }]);
    (useETransferWithdraw as jest.Mock).mockReturnValue([{}, { dispatch: mockWithdrawDispatch }]);

    mockAddListener.mockClear();
    mockConnect.mockClear();

    jest.clearAllMocks();
  });

  it('should setup event listener on mount', () => {
    const { unmount } = renderHook(() => useNoticeSocket());

    expect(mockAddListener).toHaveBeenCalledTimes(1);

    unmount();
    expect(mockAddListener.mock.calls[0][0]).toBeInstanceOf(Function);
  });

  it('should connect when conditions are met', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);

    const { unmount } = renderHook(() => useNoticeSocket());
    unmount();

    expect(mockConnect).toHaveBeenCalledWith(correctAelfAddress, expect.any(Function));
  });

  it('should handle notice updates', async () => {
    renderHook(() => useNoticeSocket());

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
    expect(handleNoticeDataAndShow).toHaveBeenCalled();
  });

  it('should reset count when no withdrawCount', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => correctAelfAddress);
    (connectUserOrderRecord as jest.Mock).mockImplementation((address, fn: any) => {
      fn({
        address,
        processing: { depositCount: 0, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        succeed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
        failed: { depositCount: 1, withdrawCount: 1, transferCount: 0, deposit: [], withdraw: [], transfer: [] },
      });
    });

    renderHook(() => useNoticeSocket());

    expect(etransferEvents.GlobalTxnNotice.emit).toHaveBeenCalled();
  });

  it('should not connect when no address', () => {
    (getAccountAddress as jest.Mock).mockImplementation(() => '');

    renderHook(() => useNoticeSocket());

    expect(mockConnect).not.toHaveBeenCalled();
  });
});
