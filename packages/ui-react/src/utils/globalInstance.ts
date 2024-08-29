class GlobalInstance {
  public showNoticeIds: string[]; // already show notice
  public processingIds: string[];

  constructor() {
    this.showNoticeIds = [];
    this.processingIds = [];
  }

  setShowNoticeIds(list: string[]) {
    this.showNoticeIds = list;
  }

  setProcessingIds(list: string[]) {
    this.processingIds = list;
  }
}

export const globalInstance = new GlobalInstance();
