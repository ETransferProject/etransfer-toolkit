import axios from 'axios';
import { stringify } from 'query-string';
import { TGetAuthApiRequest, TJwtData } from '../types';
import { getAuthApiBaseConfig } from '../constants';
import { baseRequest } from '@etransfer/request';
import { etransferEvents } from '@etransfer/utils';
import { setETransferJWT } from '../utils/storage';

/**
 * Get ETransfer service token
 * @param authHost etransfer server domain name
 * @param config api parameters
 * @returns token
 */
export const getAuthApi = async (authHost: string, config: TGetAuthApiRequest) => {
  const data = { ...getAuthApiBaseConfig, ...config };
  const res = await axios.post<TJwtData>(`${authHost}/connect/token`, stringify(data), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const token_type = res.data.token_type;
  const access_token = res.data.access_token;

  baseRequest.defaults.headers.common['Authorization'] = `${token_type} ${access_token}`;
  etransferEvents.AuthTokenSuccess.emit();

  if (localStorage) {
    setETransferJWT(config.ca_hash + config.managerAddress, res.data);
  }

  return `${token_type} ${access_token}`;
};
