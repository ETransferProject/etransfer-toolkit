import { TGetAuthApiBaseConfig } from '../types';

export const getAuthApiBaseConfig: TGetAuthApiBaseConfig = {
  grant_type: 'signature',
  scope: 'ETransferServer',
  client_id: 'ETransferServer_App',
  source: 'portkey',
};
