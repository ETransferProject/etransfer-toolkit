import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type TEtransferRequest = {
  post: (url: string, data?: any, config?: AxiosRequestConfig<any> | undefined) => Promise<AxiosResponse<any, any>>;
  get: (url: string, config?: AxiosRequestConfig<any> | undefined) => Promise<AxiosResponse<any, any>>;
  send: (base: TBaseConfig, config: TRequestConfig) => void;
  setHeaders: (key: string, value: string) => void;
  setConfig: (key: keyof TRequestConfig, value: TRequestConfig[keyof TRequestConfig]) => void;
};

export enum CommonErrorNameType {
  CANCEL = 'cancel',
}

export type TRequestConfig = {
  query?: string; //this for url parameter； example: test/:id
  cancelTokenSourceKey?: string;
} & AxiosRequestConfig;

export type TBaseRequest = {
  url: string;
} & TRequestConfig;

export type TBaseConfig = string | { target: string; baseConfig: TRequestConfig };
