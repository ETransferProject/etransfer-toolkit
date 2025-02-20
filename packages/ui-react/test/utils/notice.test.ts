import { afterEach, beforeEach, describe, expect, it, jest } from '@jest/globals';
import { notification } from 'antd';
import {
  browserNotification,
  connectUserOrderRecord,
  handleDepositNoticeDataAndShow,
  handleNoticeDataAndShow,
  handleWithdrawNoticeDataAndShow,
  showNotice,
  TTxnNoticeStatus,
  unsubscribeUserOrderRecord,
} from '../../src/utils/notice';
import { globalInstance } from '../../src/utils/globalInstance';
import { etransferCore } from '../../src/utils/core';
import { ETRANSFER_LOGO } from '../../src/constants/misc';
import { BusinessType } from '@etransfer/types';
import { TOrderRecordsNoticeResponse } from '../../../socket/dist/types/types/notice';

jest.mock('../../src/utils/core');

jest.mock('../../src/utils/globalInstance', () => ({
  globalInstance: {
    showNoticeIds: [],
    processingIds: [],
    setProcessingIds: jest.fn(),
    setShowNoticeIds: jest.fn(),
  },
}));

jest.mock('antd', () => ({
  notification: {
    info: jest.fn(),
  },
}));

jest.mock('clsx', () => {
  return jest.fn((...args) => args.join(' ')); // Mock clsx to join class names with a space
});

describe('browserNotification', () => {
  const mockTitle = 'Test Title';
  const mockContent = 'Test Content';
  const mockNotification = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    delete (window as any).Notification;
  });

  it('should log message when Notification is not supported', () => {
    const result = browserNotification({ title: mockTitle, content: mockContent });

    expect(result).toBeUndefined();
  });

  it('should send notification when permission is granted', () => {
    (window as any).Notification = mockNotification;
    (window as any).Notification.permission = 'granted';

    browserNotification({ title: mockTitle, content: mockContent });

    expect(mockNotification).toHaveBeenCalledWith(mockTitle, {
      body: mockContent,
      icon: ETRANSFER_LOGO,
    });
  });

  it('should request permission when permission is not granted or denied', () => {
    (window as any).Notification = mockNotification;
    (window as any).Notification.permission = 'default';
    (window as any).Notification.requestPermission = jest.fn((callback: any) => callback('granted'));

    browserNotification({ title: mockTitle, content: mockContent });

    expect(window.Notification.requestPermission).toHaveBeenCalled();
    expect(mockNotification).toHaveBeenCalledWith(mockTitle, {
      body: mockContent,
      icon: ETRANSFER_LOGO,
    });
  });

  it('should not send notification when permission is denied', () => {
    (window as any).Notification = mockNotification;
    (window as any).Notification.permission = 'denied';

    browserNotification({ title: mockTitle, content: mockContent });

    expect(mockNotification).not.toHaveBeenCalled();
  });
});

describe('showNotice', () => {
  const noticeProps = { message: 'notice message' };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear previous mocks
  });

  it('should do nothing if required fields are missing', () => {
    showNotice({ status: undefined as any, type: 'WITHDRAWAL' as any, amount: '10', symbol: 'ETH' });

    // Ensure notification is not called
    expect(notification.info).not.toHaveBeenCalled();
  });

  it('should display a successful withdrawal notification', () => {
    const expectedMessage = 'Withdrawal Successful';
    const expectedContent = 'The withdrawal of 10 ETH has been received.';

    showNotice({
      status: TTxnNoticeStatus.Successful,
      type: BusinessType.Withdraw,
      amount: '10',
      symbol: 'ETH',
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a failed withdrawal notification', () => {
    const expectedMessage = 'Withdrawal Failed';
    const expectedContent =
      'The withdrawal of 10 ETH failed; please check the transaction and contact customer service.';

    showNotice({
      status: TTxnNoticeStatus.Failed,
      type: BusinessType.Withdraw,
      amount: '10',
      symbol: 'ETH',
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a successful deposit notification', () => {
    const expectedMessage = 'Deposit Successful';
    const expectedContent = 'The deposit has been processed successfully.';

    showNotice({
      status: TTxnNoticeStatus.Successful,
      type: BusinessType.Deposit,
      amount: '0',
      symbol: 'USDT',
      isShowBrowserNotice: true,
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a failed deposit notification', () => {
    const expectedMessage = 'Deposit Failed';
    const expectedContent = 'The deposit of 0 USDT failed; please check the transaction and contact customer service.';

    showNotice({
      status: TTxnNoticeStatus.Failed,
      type: BusinessType.Deposit,
      amount: '0',
      symbol: 'USDT',
      isShowBrowserNotice: true,
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a specific message when a swap fails with Failed status and 10 USDT', () => {
    const expectedMessage = 'Deposit Failed';
    const expectedContent = 'The deposit of 10 USDT failed; please check the transaction and contact customer service.';

    showNotice({
      status: TTxnNoticeStatus.Failed,
      type: BusinessType.Deposit,
      amount: '10',
      symbol: 'USDT',
      isSwapFail: true,
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a specific message when a swap fails with Successful status and 0 USDT', () => {
    const expectedMessage = 'Deposit Successful';
    const expectedContent = 'Swap USDT failed, the USDT deposit has been processed.';

    showNotice({
      status: TTxnNoticeStatus.Successful,
      type: BusinessType.Deposit,
      amount: '0',
      symbol: 'USDT',
      isSwapFail: true,
      noticeProps,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });

  it('should display a specific message when a swap fails with Successful status and 10 USDT', () => {
    const expectedMessage = 'Deposit Successful';
    const expectedContent = 'Swap failed, the deposit of 10 USDT has been received.';

    showNotice({
      status: TTxnNoticeStatus.Successful,
      type: BusinessType.Deposit,
      amount: '10',
      symbol: 'USDT',
      isSwapFail: true,
      noticeProps: undefined,
    });

    expect(notification.info).toHaveBeenCalledWith(
      expect.objectContaining({
        message: expectedMessage,
        description: expectedContent,
      }),
    );
  });
});

describe('handleDepositNoticeDataAndShow', () => {
  beforeEach(() => {
    // Reset the state of globalInstance
    globalInstance.processingIds = [];
    globalInstance.showNoticeIds = [];

    jest.clearAllMocks();
  });

  it('should process and show successful deposit notices', () => {
    const noticeData = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [{ id: '123', amount: '100', symbol: 'USDT', isSwap: true, isSwapFail: false }],
        withdraw: [],
        transfer: [],
      },
      succeed: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [{ id: '123', amount: '100', symbol: 'USDT', isSwap: true, isSwapFail: false }],
        withdraw: [],
        transfer: [],
      },
      failed: {
        depositCount: 0,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [],
        transfer: [],
      },
    };

    handleDepositNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toContain('123');

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toContain('123');
  });

  it('should process failed deposit notices', () => {
    const noticeData = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [{ id: '1234', amount: '100', symbol: 'USDT', isSwap: true, isSwapFail: false }],
        withdraw: [],
        transfer: [],
      },
      succeed: {
        depositCount: 0,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [],
        transfer: [],
      },
      failed: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [{ id: '1234', amount: '100', symbol: 'USDT', isSwap: true, isSwapFail: false }],
        withdraw: [],
        transfer: [],
      },
    };

    handleDepositNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toContain('1234');

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toContain('1234');
  });

  it('should not show notice if already shown', () => {
    const noticeData: any = {};

    handleDepositNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toHaveLength(0);

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toHaveLength(0);
  });
});

describe('handleWithdrawNoticeDataAndShow', () => {
  beforeEach(() => {
    // Reset the state of globalInstance
    globalInstance.processingIds = [];
    globalInstance.showNoticeIds = [];

    jest.clearAllMocks();
  });

  it('should process and show successful deposit notices', () => {
    const noticeData = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '123', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      succeed: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '123', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      failed: {
        depositCount: 0,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [],
        transfer: [],
      },
    };

    handleWithdrawNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toContain('123');

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toContain('123');
  });

  it('should process failed deposit notices', () => {
    const noticeData = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '1234', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      succeed: {
        depositCount: 0,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [],
        transfer: [],
      },
      failed: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '1234', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
    };

    handleWithdrawNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toContain('1234');

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toContain('1234');
  });

  it('should not show notice if already shown', () => {
    const noticeData: any = {};

    handleWithdrawNoticeDataAndShow(noticeData);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toHaveLength(0);

    // Ensure it was recorded as shown
    expect(globalInstance.showNoticeIds).toHaveLength(0);
  });
});

describe('handleNoticeDataAndShow', () => {
  beforeEach(() => {
    globalInstance.processingIds = [];
    globalInstance.showNoticeIds = [];

    jest.clearAllMocks();
  });

  it('should call successful', () => {
    const noNotice = { depositCount: 0, withdrawCount: 0, transferCount: 0, deposit: [], withdraw: [], transfer: [] };

    const noticeData = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [{ id: '123', amount: '100', symbol: 'USDT' }],
        withdraw: [{ id: '1234', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      succeed: noNotice,
      failed: noNotice,
    };

    handleNoticeDataAndShow(noticeData as never);

    // Ensure processing ID is stored
    expect(globalInstance.processingIds).toContain('123');
    expect(globalInstance.processingIds).toContain('1234');
  });
});

describe('connectUserOrderRecord', () => {
  const mockAddress = 'mockAddress';
  const mockReceiveCallback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should open notice socket and request user order record', async () => {
    const mockOpenResponse = 'mockOpenResponse' as never;
    (etransferCore.noticeSocket as any).doOpen = jest.fn().mockResolvedValue(mockOpenResponse);

    await connectUserOrderRecord(mockAddress, mockReceiveCallback);

    // Ensure doOpen is called
    expect(etransferCore.noticeSocket?.doOpen).toHaveBeenCalled();

    // Verify the RequestUserOrderRecord is called with correct address
    expect(etransferCore.noticeSocket?.RequestUserOrderRecord).toHaveBeenCalledWith({
      address: mockAddress,
    });
  });

  it('should handle the receive callback', async () => {
    const mockOpenResponse = 'mockOpenResponse' as never;
    (etransferCore.noticeSocket as any).doOpen = jest.fn().mockResolvedValue(mockOpenResponse);

    // Simulate receiving records
    const mockResponse: TOrderRecordsNoticeResponse = {
      processing: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '123', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      succeed: {
        depositCount: 1,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [{ id: '123', amount: '100', symbol: 'USDT' }],
        transfer: [],
      },
      failed: {
        depositCount: 0,
        withdrawCount: 0,
        transferCount: 0,
        deposit: [],
        withdraw: [],
        transfer: [],
      },
    };
    (etransferCore.noticeSocket as any).ReceiveUserOrderRecords = jest.fn().mockImplementation((_, callback: any) => {
      callback(mockResponse); // Simulate the callback with mock response
    });

    await connectUserOrderRecord(mockAddress, mockReceiveCallback);

    expect(mockReceiveCallback).toHaveBeenCalledWith(mockResponse); // Verify callback is called with the response
  });

  it('should handle reconnection', async () => {
    const mockOpenResponse = 'mockOpenResponse' as never;
    (etransferCore.noticeSocket as any).doOpen = jest.fn().mockResolvedValue(mockOpenResponse);

    const mockReconnectedId = 'mockId';
    (etransferCore.noticeSocket as any).signalr = {
      onreconnected: jest.fn().mockImplementation((callback: any) => {
        callback(mockReconnectedId); // Simulate onreconnected event
      }),
    };

    await connectUserOrderRecord(mockAddress, mockReceiveCallback);

    // Verify that RequestUserOrderRecord is called on reconnected
    expect(etransferCore.noticeSocket?.RequestUserOrderRecord).toHaveBeenCalledWith({
      address: mockAddress,
    });
  });

  it('should catch errors from doOpen', async () => {
    const mockError = new Error('Connection error');
    (etransferCore.noticeSocket as any).doOpen = jest.fn().mockRejectedValue(mockError as never);

    await expect(connectUserOrderRecord(mockAddress, mockReceiveCallback)).resolves.toBeUndefined(); // Ensure it handles the error and doesn't throw

    expect(mockReceiveCallback).not.toHaveBeenCalled(); // Verify callback is not called
  });
});

describe('unsubscribeUserOrderRecord', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call UnsubscribeUserOrderRecord and destroy methods', async () => {
    (etransferCore.noticeSocket as any).UnsubscribeUserOrderRecord = jest.fn();
    (etransferCore.noticeSocket as any).destroy = jest.fn();

    const address = 'mockAddress';

    await unsubscribeUserOrderRecord(address);

    expect(globalInstance.setProcessingIds).toHaveBeenCalled();
    expect(globalInstance.setShowNoticeIds).toHaveBeenCalled();
    expect(etransferCore.noticeSocket?.UnsubscribeUserOrderRecord).toHaveBeenCalledWith(address);
    expect(etransferCore.noticeSocket?.destroy).toHaveBeenCalled();
  });

  it('should handle case when noticeSocket is not available', async () => {
    // Setting noticeSocket to null for this test
    (etransferCore as any) = jest.fn().mockReturnValue(undefined);

    await unsubscribeUserOrderRecord('mockAddress');

    expect(globalInstance.setProcessingIds).toHaveBeenCalled();
    expect(globalInstance.setShowNoticeIds).toHaveBeenCalled();
  });
});
