import axios from 'axios';
import { etransferEvents } from '@etransfer/utils';
import { isDeniedRequest } from './utils';

const axiosInstance = axios.create({
  baseURL: '/',
  timeout: 20000,
});

axiosInstance.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  response => {
    const res = response.data;
    if (res?.code && res?.code?.substring(0, 1) !== '2') {
      return Promise.reject(res);
    }
    if (res?.code) {
      return res;
    } else {
      return { data: res };
    }
  },
  error => {
    if (isDeniedRequest(error)) {
      etransferEvents.DeniedRequest.emit();
    }
    return Promise.reject(error);
  },
);

export const baseRequest = axiosInstance;
