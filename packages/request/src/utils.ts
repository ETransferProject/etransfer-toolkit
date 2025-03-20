import { TBaseConfig, TRequestConfig } from './types';

export const isDeniedRequest = (error: { message: string }) => {
  try {
    const message: string = error.message;
    if (message?.includes('401')) return true;
  } catch (error) {
    console.warn(error);
  }
  return false;
};

export function spliceUrl(baseUrl: string, extendArg?: string) {
  return extendArg ? baseUrl + '/' + extendArg : baseUrl;
}

export function getRequestConfig(base: TBaseConfig, config?: TRequestConfig) {
  if (typeof base === 'string') {
    return config;
  } else {
    const { baseConfig } = base || {};
    const { query, method, params, data } = config || {};
    return {
      ...config,
      ...baseConfig,
      query: (baseConfig?.query || '') + (query || ''),
      method: method ? method : baseConfig?.method,
      params: Object.assign({}, baseConfig?.params, params),
      data: Object.assign({}, baseConfig?.data, data),
    };
  }
}
