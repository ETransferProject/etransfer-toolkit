import { Day, LocalStorageKey } from '../constants';
import { TETransferJWTData } from '../types';

export const getETransferJWT = (key: string) => {
  try {
    const jwtData = localStorage.getItem(LocalStorageKey.ETRANSFER_ACCESS_TOKEN);
    if (!jwtData) return;
    const data = JSON.parse(jwtData) as { [key: string]: TETransferJWTData };
    const cData = data[key];
    if (!cData || !cData?.expiresTime) return;
    if (Date.now() + 0.5 * Day > cData?.expiresTime) return;
    return cData;
  } catch (error) {
    return;
  }
};

export const resetETransferJWT = () => {
  return localStorage.removeItem(LocalStorageKey.ETRANSFER_ACCESS_TOKEN);
};

export const setETransferJWT = (key: string, data: TETransferJWTData) => {
  const jwtData: TETransferJWTData = {
    ...data,
    expiresTime: Date.now() + (data.expires_in - 10) * 1000,
  };
  return localStorage.setItem(LocalStorageKey.ETRANSFER_ACCESS_TOKEN, JSON.stringify({ [key]: jwtData }));
};
