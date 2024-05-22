import { AxiosRequestConfig } from 'axios';

export type TEtransferRequest = {
  parseRouter: (name: string, urlObj: TSupportUrl) => void;
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

export type TSupportUrl = { [key: string]: TBaseConfig };
