import { AxiosRequestConfig } from 'axios';

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
