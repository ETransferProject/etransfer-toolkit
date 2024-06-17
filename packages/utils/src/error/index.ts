export const handleError = (error: any) => {
  return error?.error || error;
};

export function handleContractError(error?: any, req?: any) {
  if (typeof error === 'string') return { message: error };
  if (error?.message) return error;
  if (error?.Error) {
    return {
      message: error.Error.Details || error.Error.Message || error.Error,
      code: error.Error.Code,
    };
  }
  return {
    code: req?.error?.message?.Code || req?.error,
    message: req?.errorMessage?.message || req?.error?.message?.Message,
  };
}

export const handleContractErrorMessage = (error?: any) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.Error) {
    return error.Error.Details || error.Error.Message || error.Error;
  }
  return `Transaction: ${error?.Status || 'error'}`;
};

export const handleErrorMessage = (error: any, errorText?: string) => {
  if (error?.status === 500) {
    return errorText || 'Failed to fetch data';
  }
  error = handleError(error);
  error = handleContractError(error);
  if (typeof error.message === 'string') errorText = error.message;
  return errorText || '';
};

export const isHtmlError = (code: string | number, message: string) => {
  if (String(code)?.substring(0, 1) === '5' && message.includes('<!DOCTYPE HTML PUBLIC')) {
    return true;
  }
  return false;
};

export const isAuthTokenError = (error: any) => {
  const msg = handleErrorMessage(error);
  if (msg.includes('401')) {
    return true;
  }
  return false;
};
