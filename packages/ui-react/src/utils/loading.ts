import { etransferEvents } from '@etransfer/utils';

export interface GlobalLoadingInfo {
  className?: string;
  width?: number;
  isHasText?: boolean;
  text?: string;
  isLoading?: boolean;
}

export const setLoading = (loading: boolean, loadingInfo?: GlobalLoadingInfo) =>
  etransferEvents.SetGlobalLoading.emit(loading, loadingInfo);
