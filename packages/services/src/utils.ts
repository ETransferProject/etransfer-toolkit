import axios from 'axios';
import { CommonErrorNameType } from '@etransfer/request';
import { handleErrorMessage } from '@etransfer/utils';

export const formatApiError = (error: any, defaultMassage: string, isSetCancelName = false) => {
  const newError: any = new Error(handleErrorMessage(error, 'ETransfer services ' + defaultMassage));
  if (isSetCancelName && axios.isCancel(error)) {
    newError.name = CommonErrorNameType.CANCEL;
  }
  newError.code = error?.code;

  return newError;
};
